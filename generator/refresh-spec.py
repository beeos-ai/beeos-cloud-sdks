#!/usr/bin/env python3
"""Refresh the ONE Server OpenAPI input from pinned producer contracts.
Requires PyYAML 6.0.3 (spec/requirements-refresh.txt).
No API calls, credentials, publishing, or producer writes.
"""
import argparse, hashlib, subprocess
parser=argparse.ArgumentParser()
parser.add_argument('--producer-root',required=True)
parser.add_argument('--producer-ref',default='984c28f37862eea66ad154f3f8ebd108d48e5065')
parser.add_argument('--app-sdk-root',required=True,help='App backend third_party/beeos-cloud-sdk-go directory')
parser.add_argument('--output',default=str(__import__('pathlib').Path(__file__).resolve().parents[1]/'spec/server.openapi.json'))
args=parser.parse_args()
inputs={}
def read(path):
 if path.is_relative_to(B):
  relative=str(path.relative_to(B))
  value=subprocess.check_output(['git','-C',str(B),'show',args.producer_ref+':'+relative],text=True)
  inputs['producer/'+relative]=hashlib.sha256(value.encode()).hexdigest()
 else:
  value=path.read_text()
  if path.is_relative_to(V):inputs['app-sdk/'+str(path.relative_to(V))]=hashlib.sha256(value.encode()).hexdigest()
 return value
import json,yaml,re,copy
from pathlib import Path
B=Path(args.producer_root).resolve(); V=Path(args.app_sdk_root).resolve(); OUT=Path(args.output).resolve()
spec={'openapi':'3.1.0','info':{'title':'BeeOS Cloud Server API','version':'1.1.0'},'servers':[{'url':'https://api.cloud.beeos.ai/v1'}],'security':[{'ServerAPIKey':[]}],'paths':{},'components':{'schemas':{},'parameters':{},'responses':{},'securitySchemes':{'ServerAPIKey':{'type':'http','scheme':'bearer','description':'BeeOS Server API key (bsk_).'}}},'x-producer-repository':'beeos-ai/beeos-cloud-backend','x-producer-revision':args.producer_ref}
S=spec['components']['schemas']
def load(p): return yaml.safe_load(read(p))
def ref(n):return {'$ref':'#/components/schemas/'+n}
def obj(p,required=None):return {'type':'object','properties':p,'required':list(p) if required is None else required,'additionalProperties':False}
strs={'type':'string'}; ints={'type':'integer'}
def arr(x):return {'type':'array','items':x}
def resolve(x,p,prefix=''):
 if isinstance(x,list):return [resolve(i,p,prefix) for i in x]
 if not isinstance(x,dict):return x
 if '$ref' in x:
  r=x['$ref']
  if not r.startswith('#'):
   f,_,frag=r.partition('#'); q=(p.parent/f).resolve(); d=load(q)
   for part in frag.split('/')[1:]:d=d[part]
   return resolve(d,q,prefix)
  if prefix and r.startswith('#/components/schemas/'):return {'$ref':r.replace('#/components/schemas/','#/components/schemas/'+prefix),**{k:resolve(v,p,prefix) for k,v in x.items() if k!='$ref'}}
 return {k:resolve(v,p,prefix) for k,v in x.items()}
def merge(p,prefix='',paths=True):
 d=load(p)
 for sect in ['schemas','parameters','responses']:
  for n,v in d.get('components',{}).get(sect,{}).items():spec['components'][sect][prefix+n if sect=='schemas' else n]=resolve(v,p,prefix)
 if paths:
  for path,ops in d.get('paths',{}).items():
   path=path.replace('/api/v1','').replace('{convId}','{conversationId}')
   for m,o in ops.items():
    if m not in ['get','post','put','patch','delete']:continue
    spec['paths'].setdefault(path,{})[m]=resolve(o,p,prefix)
    spec['paths'][path][m]['x-sdk-provenance']=str(p.relative_to(B)) if p.is_relative_to(B) else 'App vendored/'+p.name
merge(B/'openapi/beeos-cloud/rest/server-openapi.yaml')
merge(B/'openapi/beeos-cloud/fragments/C01/server.openapi.json')
merge(V/'t06-server.openapi.json');merge(V/'t07-server.openapi.json');merge(B/'openapi/beeos-cloud/t04/server-openapi.json')
# Shared user API schemas are only used where producer server forwards the same wire contract.
p=B/'openapi/beeos-platform-v1.yaml';d=load(p)
for n,v in d['components']['schemas'].items():S.setdefault(n,resolve(v,p))
for path,ops in d['paths'].items():
 if any(s in path for s in ['/webhooks','/runtime-capabilities','/methods','/operations','/terminal-sessions','/canvas-sessions']):
  for m,o in ops.items():
   if m in ['get','post','put','patch','delete']:
    spec['paths'].setdefault(path.replace('/api/v1',''),{})[m]=resolve(o,p)
# UHP only routes actually mounted, not all upstream optional operations.
p=B/'openapi/uhp/uhp-2026-10-04.openapi.yaml';d=load(p);merge(p,'UHP',False)
u_paths=['/v1/uhp','/v1/harnesses','/v1/harnesses/{harness_id}','/v1/models','/v1/harnesses/{harness_id}/models','/v1/responses','/v1/responses/{response_id}','/v1/responses/{response_id}/input_items','/v1/responses/{response_id}/events','/v1/responses/{response_id}/cancel']
for path,ops in d['paths'].items():
 if path in u_paths:
  for m,o in ops.items():
   if m in ['get','post','delete']:
    o=resolve(o,p,'UHP');o['x-sdk-base-path']='/uhp/v1';o['x-sdk-provenance']='openapi/uhp/uhp-2026-10-04.openapi.yaml';spec['paths'].setdefault('/uhp'+path,{})[m]=o
# Extract exact JSON-tagged producer structs. Open JSON is explicit and recursive.
S['JSONValue']={'description':'A genuinely open JSON value (provider/plugin parameters or arbitrary metadata).','oneOf':[{'type':'null'},{'type':'boolean'},{'type':'number'},{'type':'string'},arr(ref('JSONValue')),{'type':'object','additionalProperties':ref('JSONValue')}]}
models={}
for folder,prefix in [(B/'pkg/beeoscloudruntime','Runtime'),(B/'pkg/beeoscloudfiles','File'),(B/'pkg/beeoscloudagent','Agent'),(B/'pkg/a2a','A2A'),(B/'services/openapi-gateway/internal/beeoscloud',''),(V,'')]:
 for p in folder.glob('*.go'):
  if p.name.endswith('_test.go') or p.name.endswith('.gen.go'):continue
  t=read(p)
  for m in re.finditer(r'type (\w+) struct \{',t):
   start=m.end();depth=1;i=start
   while i<len(t) and depth:
    depth+=(t[i]=='{')-(t[i]=='}');i+=1
   body=t[start:i-1]; fields=[]
   for line in body.splitlines():
    f=re.match(r'\s*(\w+)\s+(.+?)\s+`json:"([^\"]+)"`',line)
    if f and f[3]!='-':fields.append((f[1],f[2],f[3]))
   if fields:models[prefix+m[1]]=(fields,prefix,body)
def go_type(t,prefix):
 t=t.strip()
 if t.startswith('*'):return {'anyOf':[go_type(t[1:],prefix),{'type':'null'}]}
 if t=='[]byte':return {'type':'string','contentEncoding':'base64'}
 if t.startswith('[]'):return arr(go_type(t[2:],prefix))
 if t.startswith('map[string]'):return {'type':'object','additionalProperties':go_type(t[11:],prefix)}
 if t in ['string','time.Time']:return {'type':'string',**({'format':'date-time'} if t=='time.Time' else {})}
 if t=='bool':return {'type':'boolean'}
 if t.startswith(('int','uint')):return ints
 if t.startswith('float'):return {'type':'number'}
 if t in ['any','interface{}','json.RawMessage']:return ref('JSONValue')
 if t.startswith('a2a.'):return ref('A2A'+t.split('.')[-1]) if 'A2A'+t.split('.')[-1] in models else ref('JSONValue')
 key=prefix+t if prefix+t in models else t
 if key in models:return ref(key)
 return ref('JSONValue')
for n,(fields,prefix,body) in models.items():
 props={}; req=[]
 for _,typ,tag in fields:
  k=tag.split(',')[0];props[k]=go_type(typ,prefix)
  if 'omitempty' not in tag:req.append(k)
 S[n]=obj(props,req)
# Embedded File request base (untagged embed is flattened on JSON wire).
S['FilePrepareUploadInput']['properties'].update(S['FilePrepareInput']['properties']);S['FilePrepareUploadInput']['required']+=S['FilePrepareInput']['required']
S['MCPServerResolution']['properties'].update(S['MCPServer']['properties']);S['MCPServerResolution']['required']+=S['MCPServer']['required']
S['CreateServerInstanceInput']=obj({'name':strs,'variant_id':strs,'agent_framework':{'type':'string','enum':['openclaw']},'llm':{'anyOf':[ref('RuntimeLLM'),{'type':'null'}]}},['name'])
S['RuntimeInstanceSummary']['properties']['capabilities']=obj({'computer':{'type':'boolean'},'mobile':{'type':'boolean'},'device':{'type':'boolean'},'terminal':{'type':'boolean'}},[])
S['RuntimeLLMProvider']['properties']['api_key']['writeOnly']=True
S['RuntimeLLMProvider']['properties']['protocol']={'type':'string','enum':['openai','anthropic']}
S['ServerUsageSummary']=obj({'total_bc':strs,'total_records':ints,'by_category':{'type':'object','additionalProperties':strs},'by_app':{'type':'object','additionalProperties':strs},'category_counts':{'type':'object','additionalProperties':ints}},['total_bc','total_records','by_category','category_counts'])
def param(n,where='query',typ=None,required=False):return {'name':n,'in':where,'required':required,'schema':typ or strs}
idem=param('Idempotency-Key','header',required=True); version=param('If-Match','header',required=True)
def op(path,method,oid,resource,name,response,request=None,query=None,headers=None,status='200',activation='live'):
 o={'operationId':oid,'x-sdk-resource':resource,'x-sdk-method':name,'x-sdk-activation':activation,'x-sdk-provenance':'services/openapi-gateway/internal/beeoscloud','parameters':[param(n,'path',required=True) for n in re.findall(r'{(.*?)}',path)]+(query or [])+(headers or []),'responses':{status:{'description':'Success',**({'content':{'application/json':{'schema':ref(response) if isinstance(response,str) else response}}} if response else {})},'default':{'$ref':'#/components/responses/Error'}}}
 if request:o['requestBody']={'required':True,'content':{'application/json':{'schema':ref(request) if isinstance(request,str) else request}}}
 spec['paths'].setdefault(path,{})[method]=o
# Overwrite stale lifecycle schemas with producer results and accepted fields.
op('/instances','post','instanceCreate','instances','create','RuntimeInstanceResult','CreateServerInstanceInput',headers=[idem],status='202')
op('/instances/{instanceId}','get','getInstance','instances','get','RuntimeInstanceResult')
S['RuntimeInstanceStatusResult']=obj({'data':obj({k:strs for k in ['id','name','status','desired_status','connectivity']}),'operation':ref('RuntimeOperationSummary')})
op('/instances/{instanceId}/status','get','getInstanceStatus','instances','getStatus','RuntimeInstanceStatusResult')
for name in ['start','stop','delete']:
 op('/instances/{instanceId}'+('/'+name if name!='delete' else ''),'delete' if name=='delete' else 'post',name+'Instance','instances',name,'RuntimeInstanceResult',headers=[idem,version],status='202')
op('/instances/{instanceId}/exec','post','execInstance','instances','exec','RuntimeExecResult',obj({'argv':arr(strs),'timeout_seconds':ints},['argv']))
op('/usage/summary','get','getUsageSummary','usage','getSummary','ServerUsageSummary',query=[param('period',typ={'type':'string','enum':['day','week','month']}),param('external_user_id'),param('category')])
# Files are not enveloped: exact service projections.
for path,method,oid,name,res,body,query,headers,status in [('/files/presign-upload','post','presignFileUpload','prepareUpload','FileTransferDescriptor','FilePrepareUploadInput',None,[idem],'201'),('/files/{fileId}/confirm','post','confirmFileUpload','confirmUpload','FileFile','FileConfirmInput',None,[idem],'200'),('/files','get','listFiles','list','FilePage',None,[param(n) for n in ['content_type','since','status','file_type','category','source','q','instance_id','agent_id','sort','sort_dir']]+[param(n,typ=ints) for n in ['limit','offset']],None,'200'),('/files/{fileId}','get','getFile','get','FileResolution',None,None,None,'200'),('/files/{fileId}','patch','renameFile','rename','FileFile',obj({'title':strs}),None,None,'200'),('/files/{fileId}','delete','deleteFile','delete',None,None,None,[idem],'204')]:op(path,method,oid,'files',name,res,body,query,headers,status)
# Retained previously documented but currently unmounted methods.
op('/events/session','post','createEventSession','eventSessions','create','ServerEventConnectionDescriptor','ServerEventSessionInput',headers=[idem],activation='not-routed')
# Common catalog resources.
for path,method,oid,resource,name,res,req in [('/mcp/servers','get','listMCPServers','mcp','list','MCPServer',None),('/mcp/servers/{serverId}','get','getMCPServer','mcp','get','MCPServer',None),('/mcp/servers/{serverId}/resolve','post','resolveMCPServer','mcp','resolve','MCPServerResolution',None),('/skills','get','listSkills','skills','list','SkillPage',None),('/skills/search','get','searchSkills','skills','search','SkillPage',None),('/skills/{id}','get','getSkill','skills','get','Skill',None),('/skills/by-slug/{slug}','get','getSkillBySlug','skills','getBySlug','Skill',None),('/skills/categories','get','listSkillCategories','skills','categories','SkillCategory',None),('/featured','get','getFeaturedSkills','skills','featured','Skill',None)]:
 response=ref(res) if res=='SkillPage' else obj({'data':arr(ref(res)), 'total':ints}) if path in ['/mcp/servers','/featured'] else obj({'data':arr(ref(res))}) if path=='/skills/categories' else obj({'data':ref(res)})
 op(path,method,oid,resource,name,response)
# Existing resource mapping.
mapping={'createClientSession':('identity','createClientSession'),'refreshClientSession':('identity','refreshClientSession'),'revokeClientSession':('identity','revokeClientSession'),'deleteExternalUser':('identity','deleteExternalUser'),'getExternalUserDeletion':('identity','getExternalUserDeletion'),'listProviders':('catalog','listProviders'),'listRegions':('catalog','listRegions'),'listDeployRegions':('catalog','listRegions'),'listModels':('catalog','listModels'),'listDeployModels':('catalog','listModels'),'listInstanceTemplates':('catalog','listInstanceTemplates'),'getInstanceTemplate':('catalog','getInstanceTemplate'),'listAgentTemplates':('catalog','listAgentTemplates'),'getAgentTemplate':('catalog','getAgentTemplate'),'listInstances':('instances','list'),'updateInstanceMetadata':('instances','update'),'listAgents':('agents','list'),'getAgent':('agents','get'),'updateAgent':('agents','update'),'createConversation':('conversations','create'),'listConversations':('conversations','list'),'getConversation':('conversations','get'),'updateConversation':('conversations','update'),'renameConversation':('conversations','update'),'deleteConversation':('conversations','delete'),'cancelConversation':('conversations','cancel'),'clearConversation':('conversations','clear'),'setConversationModel':('conversations','setModel'),'sendMessage':('messages','send'),'sendConversationMessage':('messages','send'),'listMessages':('messages','list'),'listConversationMessages':('messages','list'),'getMessage':('messages','get'),'createTask':('tasks','create'),'listTasks':('tasks','list'),'listAgentTasks':('tasks','list'),'getTask':('tasks','get'),'listTaskMessages':('tasks','listMessages'),'cancelTask':('tasks','cancel'),'continueTask':('tasks','continueTask'),'registerTaskWebhook':('taskWebhooks','create'),'listTaskWebhooks':('taskWebhooks','list'),'deleteTaskWebhook':('taskWebhooks','delete'),'listWebhookDeliveries':('taskWebhooks','listDeliveries'),'redeliverWebhook':('taskWebhooks','redeliver'),'getRuntimeCapabilities':('methods','getCapabilities'),'invokeRuntimeMethod':('methods','invoke'),'getUsageHistory':('usage','getHistory'),'getUsageLimits':('usage','getLimits'),'getDiscovery':('catalog','getDiscovery'),'listHarnesses':('harnesses','list'),'getHarness':('harnesses','get'),'listHarnessModels':('harnesses','listModels'),'createResponse':('responses','create'),'getResponse':('responses','get'),'listResponseInputItems':('responses','getInputItems'),'getResponseInputItems':('responses','getInputItems'),'cancelResponse':('responses','cancel'),'deleteResponse':('responses','delete'),'streamResponseEvents':('responses','getEvents')}
# Classify exact producer routes.
live=set()
for p in (B/'services/openapi-gateway/internal/beeoscloud').glob('*.go'):
 if p.name.endswith('_test.go'):continue
 for method,path in re.findall(r'(?:mux|surface)\.HandleFunc\("(GET|POST|PUT|PATCH|DELETE) (/v1/[^\"]+)"',read(p)):
  if p.name.startswith('uhp'):path='/uhp'+path
  else:path=path[3:]
  live.add((method.lower(),re.sub(r'{[^}]+}','{}',path)))
for path,ops in spec['paths'].items():
 for method,o in ops.items():
  oid=o['operationId']
  if path.startswith('/uhp') and oid=='listModels': resource,name='harnesses','listAllModels'
  else:resource,name=mapping.get(oid,(o.get('x-sdk-resource','runtime'),o.get('x-sdk-method',oid)))
  o['x-sdk-resource']=resource;o['x-sdk-method']=name
  o.setdefault('x-sdk-activation','live' if (method,re.sub(r'{[^}]+}','{}',path)) in live else 'not-routed')
  # External user header comes from client.withExternalUser, not a method argument.
  params=o.get('parameters',[]);resolved=[]
  for a in params:
   if '$ref' in a and a['$ref'].startswith('#/components/parameters/'):
    a=copy.deepcopy(spec['components']['parameters'][a['$ref'].split('/')[-1]])
   if a.get('name')=='X-BeeOS-External-User-ID':a['x-sdk-client-option']='externalUserId'
   resolved.append(a)
  o['parameters']=resolved
# Normalize JSON Schema nullable/const and explicit open additionalProperties.
def normalize(x):
 if isinstance(x,list):return [normalize(v) for v in x]
 if not isinstance(x,dict):return x
 x={k:normalize(v) for k,v in x.items()}
 if x.pop('nullable',False):return {'anyOf':[x,{'type':'null'}]}
 if 'const' in x:x['enum']=[x.pop('const')]
 if x.get('type')=='object' and not x.get('properties') and x.get('additionalProperties') in [None,True]:x['additionalProperties']=ref('JSONValue')
 elif x.get('additionalProperties') is True:x['additionalProperties']=ref('JSONValue')
 return x
# Complete imported components, including shared errors/header contracts.
for source in [B/'openapi/beeos-platform-v1.yaml',B/'openapi/beeos-cloud/t04/schemas.json']:
 d=load(source)
 for sect,vals in d.get('components',{}).items():
  if sect=='securitySchemes':continue
  spec['components'].setdefault(sect,{})
  for n,v in vals.items():spec['components'][sect].setdefault(n,resolve(v,source))
d=load(B/'openapi/uhp/uhp-2026-10-04.openapi.yaml')
spec['components']['headers']={n:resolve(v,B/'openapi/uhp/uhp-2026-10-04.openapi.yaml','UHP') for n,v in d['components'].get('headers',{}).items()}
S['ErrorResponse']=obj({'code':strs,'message':strs,'request_id':strs},['code','message','request_id'])
spec['components']['responses']['Error']={'description':'Cloud Server error envelope. UHP operations use the protocol envelope.','content':{'application/json':{'schema':ref('ErrorResponse')}}}
# Remove optional upstream Harness CRUD absent in BeeOS producer (not legacy methods).
spec['paths']['/uhp/v1/harnesses'].pop('post',None);spec['paths']['/uhp/v1/harnesses/{harness_id}'].pop('delete',None)
# Retained legacy resources have no defined producer wire schema. Do not fabricate it.
for path,method,oid,resource,name,req,headers in [('/images','get','listImages','images','list',None,[]),('/images','post','createImage','images','create','JSONValue',[idem]),('/images/{imageId}','get','getImage','images','get',None,[]),('/images/{imageId}','put','updateImage','images','update','JSONValue',[version]),('/images/{imageId}','delete','deleteImage','images','delete',None,[idem]),('/images/{imageId}/versions','get','listImageVersions','images','listVersions',None,[]),('/images/{imageId}/versions','post','createImageVersion','images','createVersion','JSONValue',[idem]),('/image-versions/{versionId}','get','getImageVersion','imageVersions','get',None,[]),('/image-versions/{versionId}','put','updateImageVersion','imageVersions','update','JSONValue',[version]),('/image-versions/{versionId}','delete','deleteImageVersion','imageVersions','delete',None,[idem])]:
 op(path,method,oid,resource,name,'JSONValue',req,headers=headers,activation='legacy-undocumented')
# Correct legacy operation resource names from the vendored profile.
extra_mapping={'createAgentConversation':('conversations','create'),'listAgentConversations':('conversations','list'),'getConversationMessage':('messages','get'),'createAgentTask':('tasks','create'),'getAgentTask':('tasks','get'),'listAgentTaskMessages':('tasks','listMessages'),'cancelAgentTask':('tasks','cancel'),'continueAgentTask':('tasks','continueTask'),'listRuntimeOperations':('operations','list'),'getRuntimeOperation':('operations','get'),'cancelRuntimeOperation':('operations','cancel'),'streamRuntimeOperationEvents':('operations','getEvents'),'createTerminalSession':('instances','createTerminalSession'),'createCanvasSession':('instances','createCanvasSession')}
for path,ops in spec['paths'].items():
 for m,o in ops.items():
  if o['operationId'] in extra_mapping:o['x-sdk-resource'],o['x-sdk-method']=extra_mapping[o['operationId']]
# Upgrade and live metadata LLM write use producer fields rather than broad stale profile.
op('/instances/{instanceId}/upgrade','post','upgradeInstance','instances','upgrade','RuntimeUpgradeJob',obj({k:strs for k in ['image_id','image_ref','target_version']},[]),headers=[idem],status='202')
op('/instances/{instanceId}/upgrades/{jobId}','get','getInstanceUpgrade','instances','getUpgrade','RuntimeUpgradeJob')
S['UpdateServerInstanceInput']=obj({'name':strs,'llm':ref('RuntimeLLM')},[])
op('/instances/{instanceId}','patch','updateInstanceMetadata','instances','update',obj({'data':ref('RuntimeInstanceSummary')}),'UpdateServerInstanceInput',headers=[version])
# Catalog views differ from older template profile.
op('/agent-templates','get','listAgentTemplates','catalog','listAgentTemplates',obj({'data':arr(ref('agentTemplateCatalogView')),'total':ints}),query=[param('category'),param('search'),param('page',typ=ints),param('page_size',typ=ints)])
op('/agent-templates/{id}','get','getAgentTemplate','catalog','getAgentTemplate','agentTemplateCatalogView')
for path,name,res in [('/skillhub/skill-sets','list','skillSetListView'),('/skillhub/skill-sets/{slug}','get','skillSetDetailView')]:
 op(path,'get','listSkillSets' if name=='list' else 'getSkillSet','skillSets',name,obj({'data':arr(ref(res)),'total':ints}) if name=='list' else ref(res),query=[param('category'),param('page',typ=ints),param('page_size',typ=ints)] if name=='list' else None)
op('/skills','post','createSkill','skills','create',obj({'data':ref('Skill')}),obj({**{k:strs for k in ['slug','name','description','category','license','version','changelog']},'tags':arr(strs),'files':arr(obj({'path':strs,'content':{'type':'string','contentEncoding':'base64'}}))},['slug','name','version','files']),status='201')
for path in ['/skills','/skills/search']:
 spec['paths'][path]['get']['parameters']=[param(n) for n in ['ids','category','cursor','q','order_by']]+[param('limit',typ=ints),param('offset',typ=ints)]
spec['paths']['/featured']['get']['parameters']=[param('scope'),param('scope_value'),param('limit',typ=ints)]
# Sharing projections.
S['FileShareResponse']=obj({'file_id':strs,'slug':strs,'created_at':{'type':'string','format':'date-time'},'filename':strs,'content_type':strs,'size_bytes':ints})
for method,name in [('post','createShare'),('get','getShare'),('delete','revokeShare')]:op('/files/{fileId}/share',method,name+'FileShare','files',name,'FileShareResponse' if method!='delete' else None,headers=[idem] if method=='post' else [],status='204' if method=='delete' else '200')
op('/file-shares/{slug}','get','resolveFileShare','files','resolveShare',obj({'file_id':strs,'slug':strs,'filename':strs,'content_type':strs,'size_bytes':ints,'download':ref('FileTransferDescriptor')}))
S['FileSummary']=obj({'total_files':ints,'total_bytes':ints,'by_type':{'type':'object','additionalProperties':ints}})
op('/files/summary','get','getFilesSummary','files','getSummary','FileSummary')
S['FileSummary']=S['FileSummary'] if False else S['FileSummary']
S['FileSummary']=S['FileSummary'] # replaced below
share='/agents/{agentId}/conversations/{conversationId}/messages/{messageId}/share'
for method,name in [('post','createShare'),('get','getShare'),('delete','revokeShare')]:op(share,method,name+'Reply','messages',name,obj({'data':obj({'slug':strs,'created_at':strs})}) if method!='delete' else None,status='204' if method=='delete' else '200')
S['ReplyShareResponse']=obj({'data':obj({'slug':strs,'created_at':strs,'agent':obj({'name':strs,'avatar_url':strs,'framework':strs}),'reply':obj({'parts':arr(obj({'type':strs,'text':strs})),'created_at':strs}),'sources':arr(obj({'url':strs,'title':strs},[])),'files':arr(obj({'file_id':strs,'filename':strs,'content_type':strs,'size_bytes':ints},[]))})})
op('/reply-shares/{slug}','get','resolveReplyShare','messages','resolveShare','ReplyShareResponse')
# Live viewer only defined dynamic device provider payload remains explicit open JSON.
S['ConnectURLResponse']=obj({'data':obj({'url':strs,'mode':strs,'token':strs,'service':strs,'connectivity':strs,'stream_session_id':strs,'browser':obj({'grant_id':strs,'generation':strs,'expires_at':strs,'role':strs})},['url','mode','token','service','connectivity','stream_session_id'])})
op('/instances/{instanceId}/connect-url','get','getInstanceConnectURL','instances','getConnectURL','ConnectURLResponse',query=[param(n) for n in ['service','client_id','role','generation']])
op('/instances/{instanceId}/stream-url','get','getInstanceStreamURL','instances','getStreamURL',obj({'data':ref('JSONValue')}),query=[param('viewportWidth',typ=ints),param('viewportHeight',typ=ints),param('dpr',typ={'type':'number'})])
op('/agents/{agentId}/conversations/{conversationId}/resume','post','resumeConversation','conversations','resume',obj({'data':obj({'request_id':strs,'status':strs})}),headers=[idem])
# ProtoJSON contracts. lowerCamel names and string-encoded int64 are required by protojson.
proto={}; enums={}
for p in (B/'proto/beeos/v1').glob('*.proto'):
 t=re.sub(r'//[^\n]*','',p.read_text())
 for m in re.finditer(r'(message|enum) (\w+)\s*\{',t):
  i=m.end();start=i;depth=1
  while i<len(t) and depth:depth+=(t[i]=='{')-(t[i]=='}');i+=1
  if m[1]=='message':proto[m[2]]=t[start:i-1]
  else:enums[m[2]]=re.findall(r'(\w+)\s*=\s*\d+',t[start:i-1])
def camel(n):return re.sub(r'_([a-z])',lambda m:m[1].upper(),n)
def pt(typ):
 if typ in ['string','bytes']:return strs
 if typ in ['int64','uint64','sint64','fixed64','sfixed64']:return strs
 if typ in ['int32','uint32','sint32','fixed32','sfixed32']:return ints
 if typ in ['float','double']:return {'type':'number'}
 if typ=='bool':return {'type':'boolean'}
 if typ.endswith('Timestamp'):return {'type':'string','format':'date-time'}
 if typ in ['google.protobuf.Struct','google.protobuf.Value','google.protobuf.Any']:return ref('JSONValue')
 if typ in enums:return {'type':'string','enum':enums[typ]}
 if typ in proto:
  key='Proto'+typ
  if key not in S:
   S[key]={};props={}
   for repeated,tt,nn in re.findall(r'\b(repeated\s+)?([\w.]+)\s+(\w+)\s*=\s*\d+',proto[typ]):props[camel(nn)]=arr(pt(tt)) if repeated else pt(tt)
   S[key]=obj(props,[])
  return ref(key)
 return ref('JSONValue')
for path,method,oid,name,res,req in [('/automations','post','createAutomation','create','AutomationRule','AutomationInput'),('/automations','get','listAutomations','list','ListAutomationsResponse',None),('/automations/{automationId}','get','getAutomation','get','Automation',None),('/automations/{automationId}','patch','updateAutomation','update','AutomationRule','AutomationPatch'),('/automations/{automationId}','delete','deleteAutomation','delete',None,None),('/automations/{automationId}/pause','post','pauseAutomation','pause','Automation',None),('/automations/{automationId}/resume','post','resumeAutomation','resume','Automation',None),('/automations/{automationId}/runs','post','createAutomationRun','createRun','AutomationRun','AutomationRunInput'),('/automations/{automationId}/runs','get','listAutomationRuns','listRuns','ListAutomationRunsResponse',None),('/automations/{automationId}/runs/{runId}','get','getAutomationRun','getRun','AutomationRun',None),('/automations/webhooks','post','createWebhookAutomation','createWebhook','AutomationRule','AutomationWebhookInput')]:
 op(path,method,oid,'automations',name,obj({'success':{'type':'boolean'},'data':pt(res)}) if res else None,pt(req) if req else None,query=[param('status'),param('cursor'),param('limit',typ=ints)] if name in ['list','listRuns'] else None,headers=[idem] if name=='createRun' else None,status='204' if method=='delete' else '202' if name=='createRun' else '201' if name in ['create','createWebhook'] else '200')
# Concrete connector operations instead of polymorphic path operation.
t=read(B/'services/openapi-gateway/internal/beeoscloud/connectors.go')
for m in re.finditer(r'case "([^\"]+)":\s*req := new\(pb\.(\w+)\)',t):
 block=t[m.end():t.find('\n\tcase ',m.end()) if t.find('\n\tcase ',m.end())!=-1 else t.find('\n\tdefault:',m.end())];call=re.search(r'm\.client\.(\w+)\(',block)
 if not call:continue
 req=m[2]; rpc=call[1]; res=rpc+'Response'
 # Some RPCs map Put/Delete to request names but use same verb response.
 op('/connectors/'+m[1],'post',rpc+'Connector','connectors',camel(m[1].replace('-','_')),obj({'data':pt(res)}),pt(req))
# UHP events is an SSE stream.
S['UHPStreamEvent']=obj({'event':strs,'data':ref('JSONValue'),'id':strs},['event','data'])
op('/uhp/v1/responses/{response_id}/events','get','getResponseEvents','responses','getEvents',None,headers=[param('Last-Event-ID','header'),param('UHP-Version','header')])
o=spec['paths']['/uhp/v1/responses/{response_id}/events']['get'];o['x-sdk-base-path']='/uhp/v1';o['x-sdk-stream']=True;o['responses']['200']={'description':'Server-sent protocol events','content':{'text/event-stream':{'schema':ref('UHPStreamEvent')}}}
# Multipart transcribe response is typed; generators must send multipart.
op('/audio/transcribe','post','transcribeAudio','audio','transcribe',obj({'text':strs}),obj({'file':{'type':'string','format':'binary'}}))
o=spec['paths']['/audio/transcribe']['post'];o['requestBody']['content']['multipart/form-data']=o['requestBody']['content'].pop('application/json')
# Exact JSON-RPC envelope (runtime extension params/result remain open JSON).
S['RuntimeMethodResponse']=obj({'jsonrpc':{'type':'string','enum':['2.0']},'id':{'anyOf':[strs,ints,{'type':'null'}]},'result':ref('JSONValue'),'error':obj({'code':ints,'message':strs,'data':ref('JSONValue')},['code','message'])},['jsonrpc','id'])
spec['paths']['/instances/{instanceId}/methods']['post']['responses']={'200':{'description':'JSON-RPC success','content':{'application/json':{'schema':ref('RuntimeMethodResponse')}}},'202':{'description':'Operation accepted','content':{'application/json':{'schema':ref('RuntimeMethodResponse')}}},'default':{'$ref':'#/components/responses/Error'}}
S['FileShareResponse']=obj({'file_id':strs,'slug':strs,'filename':strs,'content_type':strs,'size_bytes':ints,'revoked':{'type':'boolean'}})
S['FileSummary']=obj({'file_count':ints,'storage_file_count':ints,'used_bytes':ints,'image_count':ints,'video_count':ints,'document_count':ints,'instances':arr(obj({**S['FileOrigin']['properties'],'count':ints},['source','count']))})
spec['paths']['/audio/transcribe']['post']['responses']['200']['content']['application/json']['schema']=obj({'success':{'type':'boolean'},'data':obj({'text':strs,'duration_seconds':{'type':'number'}})})
# Resolve UHP common component refs and alias preserved TS fields.
for path,ops in spec['paths'].items():
 for m,o in ops.items():
  if o['operationId']=='createResponse':o['x-sdk-response-stream']='stream=true returns text/event-stream; stream=false returns UHPResponse'
spec['paths'].pop('/agent-templates/{templateId}',None)
# Additional Server-authenticated public surfaces, including persisted Canvas proxy operations.
op('/agents/{agentId}/invoke','post','invokeAgent','agents','invoke','AgentInvokeResult','AgentInvokeInput',headers=[idem])
canvas_headers=[param('X-BeeOS-Conversation-ID','header',required=True),param('X-BeeOS-Platform-Agent-ID','header',required=True)]
S['CanvasShare']=obj({'id':strs,'canvasId':strs,'slug':strs,'mode':strs,'allowInteraction':{'type':'boolean'},'expiresAt':strs,'createdAt':strs},['id','canvasId','slug','mode','allowInteraction','createdAt'])
S['CanvasSnapshot']=obj({'id':strs,'canvasId':strs,'componentsSnapshot':{'type':'string','contentEncoding':'base64'},'actorType':strs,'actorId':strs,'description':strs,'version':ints,'createdAt':strs},['id','canvasId','actorType','actorId','version','createdAt'])
for method,name in [('get','getShare'),('post','createShare'),('delete','deleteShare')]:
 op('/instances/{instanceId}/canvases/{canvasId}/share',method,name+'Canvas','canvases',name,obj({'success':{'type':'boolean'},'data':{'anyOf':[ref('CanvasShare'),{'type':'null'}]}}) if method!='delete' else None,obj({'mode':strs,'password':strs,'allowInteraction':{'type':'boolean'}},['mode']) if method=='post' else None,headers=canvas_headers,status='204' if method=='delete' else '200')
op('/instances/{instanceId}/canvases/{canvasId}/snapshots','get','listCanvasSnapshots','canvases','listSnapshots',obj({'success':{'type':'boolean'},'data':arr(ref('CanvasSnapshot'))}),headers=canvas_headers)
op('/instances/{instanceId}/canvases/{canvasId}/snapshots/{snapshotId}/restore','post','restoreCanvasSnapshot','canvases','restoreSnapshot',obj({'success':{'type':'boolean'},'data':obj({'snapshotId':strs,'canvasId':strs,'restored':{'type':'boolean'},'version':ints})}),headers=canvas_headers)
op('/instances/{instanceId}/canvas-sessions/{conversationId}','get','getCanvasSession','canvases','getSession',obj({'success':{'type':'boolean'},'data':{'anyOf':[obj({'canvasId':strs,'sessionId':strs,'instanceId':strs,'linkedAt':strs,'role':strs}),{'type':'null'}]}}),headers=canvas_headers)
# DeviceBind operations here authenticate bsk via authorizeOwner; CLI claims/polling use different credentials and belong to the Harness surface.
for path,method,oid,name,response,request in [('/agent/bind/{id}/details','get','getAgentBindDetails','getDetails','agentBindDetailsWire',None),('/agent/bind/{id}/confirm','post','confirmAgentBind','confirm','agentBindWire',obj({'name':strs,'modelPrimary':strs,'model_primary':strs},[])),('/agent/portal/bind-sessions','post','createPortalBind','createPortal','portalBindWire',obj({'name':strs},[])),('/agent/portal/bind-sessions/{id}','get','getPortalBind','getPortal','portalBindWire',None),('/agent/portal/bind-sessions/{id}/revoke','post','revokePortalBind','revokePortal','portalBindWire',None),('/agent/portal/bind-sessions/{id}/resolve','post','resolvePortalBind','resolvePortal','portalBindWire',obj({'decision':{'type':'string','enum':['recover','create']},'instance_id':strs},['decision']))]:
 op(path,method,oid,'deviceBindings',name,obj({'success':{'type':'boolean'},'data':ref(response)}),request)
# A2A facade uses Server key identity and the canonical structured A2A contracts.
S['A2AAgentCard']=obj({'name':strs,'description':strs,'url':strs,'version':strs,'protocolVersion':strs,'defaultInputModes':arr(strs),'defaultOutputModes':arr(strs),'supportedInterfaces':arr(obj({'url':strs,'protocolBinding':strs,'protocolVersion':strs}))},['name','description','version','defaultInputModes','defaultOutputModes'])
S['A2AOutputPart']={'oneOf':[ref('A2ATextPartOut'),ref('A2AFilePartOut'),ref('A2ADataPartOut')]}
for name in ['A2AMessage','A2AArtifact']:
 if name in S and 'parts' in S[name]['properties']:S[name]['properties']['parts']=arr(ref('A2AOutputPart'))
op('/a2a/{agentId}','post','invokeA2A','a2a','invoke','RuntimeMethodResponse',obj({'jsonrpc':{'type':'string','enum':['2.0']},'id':strs,'method':strs,'params':ref('JSONValue')},['jsonrpc','method']))
op('/a2a/{agentId}/.well-known/agent-card.json','get','getA2AAgentCard','a2a','getAgentCard','A2AAgentCard')
op('/a2a/{agentId}/.well-known/agent.json','get','getA2AAgentCardLegacy','a2a','getAgentCardLegacy','A2AAgentCard')
op('/a2a/{agentId}/tasks','get','listA2ATasks','a2a','listTasks',obj({'tasks':arr(ref('a2aTaskView')),'total':ints,'next_cursor':strs,'has_more':{'type':'boolean'}}),query=[param(n) for n in ['direction','agent_id','cursor']]+[param('limit',typ=ints)])
op('/a2a/{agentId}/tasks/{taskId}','get','getA2ATask','a2a','getTask','a2aTaskView',query=[param('history_length',typ=ints)])
op('/a2a/{agentId}/tasks/{taskId}/cancel','post','cancelA2ATask','a2a','cancelTask','a2aTaskView')
# Parameters placed on Path Item by producer are also required on generated methods.
for path,ops in spec['paths'].items():
 for method,o in ops.items():
  params=o.setdefault('parameters',[])
  known={a.get('name') for a in params if a.get('in')=='path'}
  for n in re.findall(r'{(.*?)}',path):
   if n not in known:params.insert(0,param(n,'path',required=True))
  if path.startswith('/uhp'):o.setdefault('x-sdk-base-path','/uhp/v1')
S['UHPEvent']=resolve(d['components']['schemas']['Event'],B/'openapi/uhp/uhp-2026-10-04.openapi.yaml','UHP') if 'components' in d and 'Event' in d['components'].get('schemas',{}) else resolve(load(B/'openapi/uhp/uhp-2026-10-04.openapi.yaml')['components']['schemas']['Event'],B/'openapi/uhp/uhp-2026-10-04.openapi.yaml','UHP')
spec['paths']['/uhp/v1/responses']['post']['x-sdk-event-schema']=ref('UHPEvent')
spec['paths']['/uhp/v1/responses/{response_id}/events']['get']['responses']['200']['content']['text/event-stream']['schema']=ref('UHPEvent')
# Correct the Server runtime facade's concrete request/response projections.
rpc=spec['paths']['/instances/{instanceId}/methods']['post']
rpc['requestBody']['content']['application/json']['schema']['properties']['id']=strs
rpc['requestBody']['content']['application/json']['schema']['properties']['params']=ref('JSONValue')
for a in rpc['parameters']:
 if a['name']=='Idempotency-Key':a['required']=True
S['RuntimeMethodAvailability']=obj({'enabled':{'type':'boolean'},'minimumRuntimeRpcProtocolVersion':ints,'minimumRuntimeContractRevision':strs},['enabled','minimumRuntimeRpcProtocolVersion'])
S['RuntimeCapabilitySupport']=obj({'service':{'type':'boolean'},'minimumRuntimeRpcProtocolVersion':ints},['service'])
S['RuntimeCapabilityDocument']=obj({'manifestId':strs,'contractRevision':strs,'runtimeRpcProtocolVersion':ints,'runtimeEpoch':strs,'serviceMethods':arr(strs),'conversationMethods':arr(strs),'methodAvailability':{'type':'object','additionalProperties':ref('RuntimeMethodAvailability')},'conversationMethodAvailability':{'type':'object','additionalProperties':ref('RuntimeMethodAvailability')},'capabilities':{'type':'object','additionalProperties':ref('RuntimeCapabilitySupport')},'generatedAt':strs,'expiresAt':strs,'terminalTransport':strs,'canvasTransport':strs},['manifestId','contractRevision','runtimeRpcProtocolVersion','runtimeEpoch','serviceMethods','conversationMethods','methodAvailability','conversationMethodAvailability','capabilities','generatedAt','expiresAt'])
spec['paths']['/instances/{instanceId}/runtime-capabilities']['get']['responses']['200']['content']['application/json']['schema']=ref('RuntimeCapabilityDocument')
S['RealtimeTicketHeader']=obj({'alg':strs,'typ':strs,'kid':strs})
S['TerminalTicketClaims']=obj({**{k:strs for k in ['iss','aud','sub','jti','instance_id','platform_agent_id','client_id','conversation_id','resume_terminal_id']},'iat':ints,'exp':ints},['iss','aud','sub','jti','iat','exp','instance_id','platform_agent_id','client_id'])
S['CanvasTicketClaims']=obj({**{k:strs for k in ['iss','sub','jti','purpose','instance_id','platform_agent_id','client_id','conversation_id','canvas_id','role','session_id']},'aud':arr(strs),'iat':ints,'exp':ints})
S['TerminalSessionDocument']=obj({'transport':strs,'protocolVersion':ints,'header':ref('RealtimeTicketHeader'),'websocketUrl':strs,'ticket':strs,'issuedAt':{'type':'string','format':'date-time'},'expiresAt':{'type':'string','format':'date-time'},'claims':ref('TerminalTicketClaims')})
S['CanvasSessionDocument']=obj({'transport':strs,'protocolVersion':ints,'header':ref('RealtimeTicketHeader'),'relayUrl':strs,'ticket':strs,'issuedAt':{'type':'string','format':'date-time'},'expiresAt':{'type':'string','format':'date-time'},'claims':ref('CanvasTicketClaims')})
spec['paths']['/instances/{instanceId}/terminal-sessions']['post']['responses']['201']['content']['application/json']['schema']=ref('TerminalSessionDocument')
spec['paths']['/instances/{instanceId}/canvas-sessions']['post']['responses']['201']['content']['application/json']['schema']=ref('CanvasSessionDocument')
spec['paths']['/instances/{instanceId}/operations']['get']['responses']['200']['content']['application/json']['schema']=ref('CloudSkillOperationPage')
spec['paths']['/instances/{instanceId}/operations/{operationId}']['get']['responses']['200']['content']['application/json']['schema']=ref('CloudSkillOperationDetail')
operation_list=spec['paths']['/instances/{instanceId}/operations']['get']
for a in operation_list['parameters']:
 if a['name']=='status':a['required']=False
operation_list['parameters'].append(param('method'))
cancel=spec['paths']['/instances/{instanceId}/operations/{operationId}/cancel']['post']
cancel.pop('requestBody',None)
cancel['responses']={'202':{'description':'Cancellation requested','content':{'application/json':{'schema':obj({'status':strs,'operationId':strs})}}},'default':{'$ref':'#/components/responses/Error'}}
for a in cancel['parameters']:
 if a['name']=='Idempotency-Key':a['required']=True
# Live bsk facade errors use its public envelope, rather than the user/JWT platform envelope.
S['DeviceBindingErrorResponse']=obj({'error':strs,'message':strs})
for path,ops in spec['paths'].items():
 for method,o in ops.items():
  if o['x-sdk-activation']!='live' or path.startswith('/uhp'):continue
  response={'description':'Cloud Server error','content':{'application/json':{'schema':ref('DeviceBindingErrorResponse' if o['x-sdk-resource']=='deviceBindings' else 'ErrorResponse')}}}
  for status in list(o['responses']):
   if status=='default' or status.startswith(('4','5')):o['responses'][status]=response
  o['responses'].setdefault('default',response)
  if o['x-sdk-resource']=='deviceBindings':o['x-sdk-error-code-field']='error'
# Keep only reachable schemas: excludes internal-only producer structs and unused upstream APIs.
roots=[]
def collect(x):
 if isinstance(x,list):
  for i in x:collect(i)
 elif isinstance(x,dict):
  if '$ref' in x and x['$ref'].startswith('#/components/schemas/'):roots.append(x['$ref'].split('/')[-1])
  for v in x.values():collect(v)
collect(spec['paths']);collect(spec['components'].get('responses',{}));collect(spec['components'].get('parameters',{}));collect(spec['components'].get('headers',{}));roots+=['ErrorResponse','JSONValue']
seen=set()
while roots:
 name=roots.pop()
 if name in seen:continue
 seen.add(name)
 if name not in S:raise Exception('missing schema '+name)
 collect(S[name])
spec['components']['schemas']={n:v for n,v in S.items() if n in seen}
spec=normalize(spec)
OUT.write_text(json.dumps(spec,indent=2)+'\n')
print('paths',len(spec['paths']),'operations',sum(len(v) for v in spec['paths'].values()),'schemas',len(spec['components']['schemas']))

manifest={
 'spec':'server.openapi.json',
 'producer':{'repository':'beeos-ai/beeos-cloud-backend','revision':args.producer_ref,'read_method':'git show <revision>:<path> (producer checkout never modified)'},
 'app_sdk':{'repository':'beeos-ai/beeos-app-backend','revision':subprocess.check_output(['git','-C',str(V),'rev-parse','HEAD'],text=True).strip(),'directory':'services/beeos-app-service/third_party/beeos-cloud-sdk-go','role':'documented legacy Server wire types, retained with activation metadata; producer implementations override live shapes'},
 'canvas':{'repository':'beeos-ai/beeos-cloud-canvas','revision':'55a9822c96958bb1b70b04751cef3c39e1abb6ce','files':['pkg/infrastructure/server/http/handler.go','pkg/domain/canvas.go','pkg/domain/share.go'],'role':'persisted Canvas public response projections forwarded verbatim by backend runtime_canvas_rest.go'},
 'refresh':{'command':'python3 generator/refresh-spec.py --producer-root /path/to/beeos-cloud-backend --app-sdk-root /path/to/beeos-app-backend/services/beeos-app-service/third_party/beeos-cloud-sdk-go','dependency':'PyYAML==6.0.3','procedure':'Fetch the split producer remote, review changes in public route registrations and schema producers, update --producer-ref to the reviewed full commit SHA; refresh; npm run generate; run all language strict checks and tests. Manual projection sections in refresh-spec.py deliberately mirror active producer HTTP handlers and must be reviewed with route changes.'},
 'activation':{'live':'Registered Server-key producer route','not-routed':'Previously documented Server operation, currently absent from Server composition','legacy-undocumented':'Published 1.0.0 method without a producer wire schema; genuinely unconstrained JSON is preserved'},
 'input_sha256':dict(sorted(inputs.items()))}
OUT.with_name('sources.json').write_text(json.dumps(manifest,indent=2)+'\n')
