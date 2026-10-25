// Canonical native producer -> typed Go DTOs, options and resource methods.
import {execFileSync} from 'node:child_process';
import {operations, resolve, pascal} from './common.mjs';
const exported = value => pascal(value).replace(/Id(?=$|[A-Z])/g,'ID').replace(/Url(?=$|[A-Z])/g,'URL').replace(/Http(?=$|[A-Z])/g,'HTTP').replace(/Sha256/g,'SHA256').replace(/Mcp/g,'MCP').replace(/Pty/g,'Pty');
export function generateNativeGo(spec) {
  const names = {}; const used = new Set();
  for (const key of Object.keys(spec.components.schemas)) {
    let name = /^\d/.test(key) ? 'Schema' + key : key === 'Error' ? 'NativeErrorEnvelope' : exported(key);
    if (used.has(name)) name = 'Owner' + name;
    names[key] = name; used.add(name);
  }
  const definitions = []; let counter = 0;
  const refName = s => names[s.$ref.split('/').pop()];
  const deref = s => s?.$ref ? deref(resolve(spec,s)) : s;
  function unionBranches(s) { return s.oneOf ?? s.anyOf; }
  function goType(s, hint = 'Inline') {
    if (s?.$ref) return refName(s);
    if (!s || s === true || s === false) return 'json.RawMessage';
    if (Array.isArray(s.type)) return goType({...s,type:undefined,anyOf:s.type.map(type=>({...s,type}))},hint);
    const branches = unionBranches(s);
    if (branches) {
      const nonnull = branches.filter(b=>deref(b).type!=='null');
      if (nonnull.length === 1 && branches.length !== nonnull.length) return '*' + goType(nonnull[0],hint);
      const name = hint + 'Union' + (++counter); emit(name,s); return name;
    }
    const type = s.type ?? (s.const === undefined ? s.enum?.length ? typeof s.enum[0] : undefined : typeof s.const);
    if (type === 'string') return 'string';
    if (type === 'integer') return 'int64';
    if (type === 'number') return 'float64';
    if (type === 'boolean') return 'bool';
    if (type === 'null') return 'json.RawMessage';
    if (type === 'array') return '[]' + goType(s.items,hint+'Item');
    if (s.properties || s.allOf || type === 'object') {
      const object = flatten(s);
      if (!Object.keys(object.properties).length && object.additionalProperties) return 'map[string]' + goType(object.additionalProperties === true ? {} : object.additionalProperties,hint+'Value');
      return structType(object,hint);
    }
    return 'json.RawMessage';
  }
  function flatten(s) {
    const base = {...s,properties:{...(s.properties??{})},required:[...(s.required??[])]};
    for(const branch of s.allOf??[]) {
      const resolved = deref(branch);
      if (!resolved.properties && !resolved.allOf) continue;
      const extension = flatten(resolved);
      Object.assign(base.properties,extension.properties);
      base.required = [...new Set([...base.required,...extension.required])];
    }
    return base;
  }
  function structType(s,hint) {
    const fields = Object.entries(s.properties??{}).map(([key,value])=>{
      const required = (s.required??[]).includes(key);
      let type = goType(value,hint+exported(key));
      // Optional nullable values need omitted/null/value, represented by *Nullable[T].
      if (!required) type = type.startsWith('*') ? '*Nullable['+type.slice(1)+']' : '*'+type;
      return '\t'+exported(key)+' '+type+' `json:"'+key+(required?'':',omitempty')+'"`';
    });
    return 'struct {\n'+fields.join('\n')+'\n}';
  }
  function emit(name,s) {
    if (s.$ref) {definitions.push('type '+name+' = '+refName(s));return;}
    const branches = unionBranches(s);
    if (branches && branches.filter(b=>deref(b).type!=='null').length>1) {
      const types = branches.map((b,i)=>{
        if (b.$ref) return {name:refName(b),type:refName(b),schema:deref(b)};
        const variant = name+'Variant'+(i+1);emit(variant,b);return {name:variant,type:variant,schema:b};
      });
      const fieldNames=new Set(); for (const type of types) {if(fieldNames.has(type.name))type.name+='Variant'+(++counter);fieldNames.add(type.name);}
      definitions.push('type '+name+' struct {\n'+types.map(t=>'\t'+t.name+' *'+t.type+' `json:"-"`').join('\n')+'\n}\n'+
        'func (value '+name+') MarshalJSON() ([]byte,error) {\n var selected any; count:=0\n'+types.map(t=>' if value.'+t.name+' != nil { selected=value.'+t.name+'; count++ }').join('\n')+'\n if count != 1 { return nil,fmt.Errorf("'+name+' requires exactly one variant") }; return json.Marshal(selected)\n}\n'+
        'func (value *'+name+') UnmarshalJSON(data []byte) error {\n *value='+name+'{}\n'+types.map(t=>{
          const sc=t.schema;const props=sc.properties??{};const required=sc.required??[];const constants=Object.fromEntries(Object.entries(props).filter(([,p])=>'const'in p).map(([k,p])=>[k,p.const]));
          const allowed=sc.additionalProperties===false?Object.keys(props):null;
          return ' if matchesNativeVariant(data, '+JSON.stringify(sc.type??(sc.properties?'object':undefined)??'')+', '+goStringList(required)+', '+goStringList(allowed)+', '+JSON.stringify(JSON.stringify(constants))+') { var candidate '+t.type+'; if err:=json.Unmarshal(data,&candidate); err==nil { value.'+t.name+'=&candidate; return nil } }';
        }).join('\n')+'\n return fmt.Errorf("invalid '+name+' variant")\n}');return;
    }
    if (s.properties && !s.allOf && s.additionalProperties !== undefined && s.additionalProperties !== false) {
      // Open object (e.g. ErrorDetails.runtime_code): keep undeclared keys instead of dropping them.
      const keys = Object.keys(s.properties);
      definitions.push('type '+name+' '+structType(flatten(s),name).replace(/\n}$/,'\n\tAdditional map[string]json.RawMessage `json:"-"`\n}')+'\n'+
        'func (value '+name+') MarshalJSON() ([]byte, error) {\n type plain '+name+'\n declared, err := json.Marshal(plain(value))\n if err != nil || len(value.Additional) == 0 { return declared, err }\n merged := map[string]json.RawMessage{}\n if err := json.Unmarshal(declared, &merged); err != nil { return nil, err }\n for key, raw := range value.Additional { if _, ok := merged[key]; !ok { merged[key] = raw } }\n return json.Marshal(merged)\n}\n'+
        'func (value *'+name+') UnmarshalJSON(data []byte) error {\n type plain '+name+'\n var declared plain\n if err := json.Unmarshal(data, &declared); err != nil { return err }\n var all map[string]json.RawMessage\n if err := json.Unmarshal(data, &all); err != nil { return err }\n for _, key := range '+goStringList(keys)+' { delete(all, key) }\n declared.Additional = nil\n if len(all) > 0 { declared.Additional = all }\n *value = '+name+'(declared)\n return nil\n}');
      return;
    }
    definitions.push('type '+name+' '+goType(s,name));
  }
  for(const [key,s]of Object.entries(spec.components.schemas))emit(names[key],s);
  const ops=operations(spec);const resources=[...new Set([...ops.map(op=>op['x-sdk-resource']),'sandboxes.pty','sandboxes.desktop'])];
  const rootNames=[...new Set(resources.map(r=>r.split('.')[0]))];
  let client = runtime.replace('/*RESOURCES*/',rootNames.map(r=>exported(r)+' *'+exported(r)+'Service').join('\n')).replace('/*INITIALIZE*/',rootNames.map(r=>'client.'+exported(r)+'=new'+exported(r)+'Service(client)').join('\n'));
  const table=[];const services=[];const options=[];
  for(const resource of resources) {
    const name=exported(resource)+'Service';const children=resources.filter(r=>r.startsWith(resource+'.')&&r.split('.').length===resource.split('.').length+1);
    services.push('type '+name+' struct {client *Client\n'+children.map(r=>exported(r.split('.').pop())+' *'+exported(r)+'Service').join('\n')+'\n}\nfunc new'+name+'(client *Client) *'+name+' { service:=&'+name+'{client:client}\n'+children.map(r=>'service.'+exported(r.split('.').pop())+'=new'+exported(r)+'Service(client)').join('\n')+'\nreturn service\n}');
    for(const op of ops.filter(o=>o['x-sdk-resource']===resource)) {
      const id=op.operationId;const optName=op['x-sdk-options-type']??exported(id)+'Options';
      const params=op.parameters.filter(p=>p.in!=='path'&&p.name!=='Idempotency-Key');
      options.push('type '+optName+' struct { RequestOptions\n'+params.map(p=>exported(p.name)+' '+(p.required?'':p.schema.type==='array'?'':'*')+goType(p.schema,optName+exported(p.name))).join('\n')+'\n}');
      const body=Object.entries(resolve(spec,op.requestBody)?.content??{})[0];
      const success=resolve(spec,Object.entries(op.responses).find(([code])=>code.startsWith('2'))[1]);
      const [media='',resp={}] = Object.entries(success.content??{})[0]??[];
      const stream=media==='text/event-stream';
      const type=stream ? id==='streamSandboxCommandEvents'?'CommandEvent':'NativeResponseEvent' : media==='application/octet-stream'?'io.ReadCloser':resp.schema?goType(resp.schema):'struct{}';
      const paths=op.parameters.filter(p=>p.in==='path');
      const pathArgs=paths.map(p=>p.name.replace(/_([a-z])/g,(_,v)=>v.toUpperCase())+' string');
      const args=['ctx context.Context',...pathArgs,...(body?['body '+(body[0]==='application/octet-stream'?'io.Reader':goType(body[1].schema))]:[]),'options '+optName];
      const query='map[string]any{'+params.map(p=>JSON.stringify(p.name)+':options.'+exported(p.name)).join(',')+'}';
      const path='map[string]string{'+paths.map(p=>JSON.stringify(p.name)+':'+p.name.replace(/_([a-z])/g,(_,v)=>v.toUpperCase())).join(',')+'}';
      services.push('func(service *'+name+') '+(op['x-sdk-go-method']??exported(op['x-sdk-method']))+'('+args.join(', ')+') ('+(stream?'*EventStream['+type+']':'BeeOSHTTPResponse['+type+']')+', error) { return '+(stream?'openEventStream['+type+']':'callNative['+type+']')+'(ctx, service.client, nativeOperations['+JSON.stringify(id)+'], '+path+', '+(stream?'':(body?'body':'nil')+', ')+query+', options.RequestOptions) }');
      table.push(JSON.stringify(id)+': {ID:'+JSON.stringify(id)+',Method:'+JSON.stringify(op.method)+',Path:'+JSON.stringify(op.path)+',ContentType:'+JSON.stringify(body?.[0]??'')+',ResponseType:'+JSON.stringify(stream?'sse':media==='application/octet-stream'?'bytes':media?'json':'void')+',Wait:'+Boolean(op['x-sdk-wait-default'])+',Keyed:'+op.parameters.some(p=>p.name==='Idempotency-Key')+',Parameters:[]nativeParameter{'+op.parameters.filter(p=>p.in!=='path'&&p.name!=='Idempotency-Key').map(p=>'{Name:'+JSON.stringify(p.name)+',In:'+JSON.stringify(p.in)+',Required:'+Boolean(p.required)+'}').join(',')+'}}');
    }
    if(resource==='responses')services.push('func(service *'+name+') CreateStream(ctx context.Context, body NativeResponseCreate, options CreateNativeResponseOptions) (ResponseStream,error) { response,err:=service.Create(ctx,body,options); result:=ResponseStream{Response:response,ResponseID:string(response.Body.Data.ID)};if err!=nil{return result,err};events,err:=service.Events(ctx,result.ResponseID,StreamNativeResponseEventsOptions{RequestOptions:options.RequestOptions});result.Events=events;return result,err }');
    if(resource==='sandboxes.pty'||resource==='sandboxes.desktop')services.push('func(service *'+name+') Connect(ctx context.Context, sandboxID string, body AccessTicketCreate, options ConnectOptions) (*SocketConnection,error) { body.Purpose='+JSON.stringify(resource.split('.').pop()==='pty'?'pty':'desktop')+'; return connectNativeSocket(ctx,service.client,sandboxID,body,options) }');
  }
  const output = {'go/native/models.go':'// Code generated from spec/native.openapi.json. DO NOT EDIT.\npackage native\nimport("encoding/json";"fmt")\n'+definitions.join('\n\n')+'\n',
    'go/native/client.go':'// Code generated from spec/native.openapi.json and maintained native runtime. DO NOT EDIT.\npackage native\n'+client+'\n'+options.join('\n')+'\nvar nativeOperations = map[string]nativeOperation{\n'+table.join(',\n')+',\n}\n'+services.join('\n\n')+'\n',
    'go/native/streams.go':'// Code generated from generator/native-go.mjs. DO NOT EDIT.\npackage native\n'+streamRuntime.replace('/*NATIVE_EVENT_TYPES*/', nativeEventTypes(spec).map(value=>JSON.stringify(value)+':true').join(',')),
    'go/native/connections.go':'// Code generated from generator/native-go.mjs. DO NOT EDIT.\npackage native\n'+connectionRuntime};
  return Object.fromEntries(Object.entries(output).map(([path, source])=>[path,execFileSync('gofmt',{encoding:'utf8',input:source})]));
}
const goStringList=values=>values===null?'nil':'[]string{'+values.map(v=>JSON.stringify(v)).join(',')+'}';
// Modeled NativeResponseEvent type set from the contract. A newer producer may
// emit a type this SDK does not know yet; that event is skipped, never fatal.
function nativeEventTypes(spec) {
  const types = [];
  for (const variant of spec.components.schemas.NativeResponseEvent.oneOf ?? []) {
    const type = variant.properties?.type;
    if (typeof type?.const === 'string') types.push(type.const);
    for (const value of type?.enum ?? []) types.push(value);
  }
  return [...new Set(types)];
}

const runtime = String.raw`import (
 "bytes"
 "context"
 "crypto/rand"
 "encoding/hex"
 "encoding/json"
 "errors"
 "fmt"
 "io"
 "net/http"
 "net/url"
 "reflect"
 "strconv"
 "strings"
 "time"
)

type Nullable[T any] struct { Value *T }
func(value Nullable[T]) MarshalJSON() ([]byte,error) {return json.Marshal(value.Value)}
func(value *Nullable[T]) UnmarshalJSON(data []byte) error {return json.Unmarshal(data,&value.Value)}
func Pointer[T any](value T) *T { return &value }

type HTTPHeaders struct { RequestID, ETag, Location, RetryAfter string; ShouldRetry *bool; Raw http.Header }
type Acceptance struct { Status *int; ResourceID *string; ETag, RequestID, IdempotencyKey string }
type BeeOSHTTPResponse[T any] struct { Status int; Body T; Headers HTTPHeaders; Acceptance *Acceptance }
type BeeOSAPIError struct {
 HTTPStatus int; Code, Message, Reason, RequestID, RetryAfter string; ShouldRetry *bool
 RawEnvelope json.RawMessage; Headers HTTPHeaders; Acceptance *Acceptance
}
func(err *BeeOSAPIError) Error() string { return fmt.Sprintf("BeeOS HTTP %d %s: %s",err.HTTPStatus,err.Code,err.Message) }
type SDKWaitTimeout struct { Message string; Acceptance *Acceptance; LastResponse *BeeOSHTTPResponse[json.RawMessage]; Cause error }
func(err *SDKWaitTimeout) Error() string {return err.Message}
func(err *SDKWaitTimeout) Unwrap() error {return err.Cause}
type SDKRequestTimeout struct { *SDKWaitTimeout }
type SDKCancelled struct { *SDKWaitTimeout }
type SDKPublicationSuperseded struct { *SDKWaitTimeout }
type SDKOperationFailed struct { *SDKWaitTimeout }
type SDKTransportError struct { *SDKWaitTimeout }
type RequestOptions struct {
 IdempotencyKey string
 Wait *bool
 RequestTimeoutSeconds, WaitTimeoutSeconds, PollIntervalSeconds float64
 OnProgress func(BeeOSHTTPResponse[json.RawMessage])
}
type ClientOptions struct { BaseURL, APIKey string; APIKeyProvider func() string; HTTPClient *http.Client; WebSocketDialer WebSocketDialer }
type Client struct {
 options ClientOptions
 origin *url.URL
 /*RESOURCES*/
}
func NewClient(options ClientOptions) (*Client,error) {
 origin,err:=url.Parse(options.BaseURL);if err!=nil{return nil,err}
 if (origin.Scheme!="https" && origin.Scheme!="http") || origin.Host=="" || (options.APIKey==""&&options.APIKeyProvider==nil) {return nil,fmt.Errorf("base URL and server API key required")}
 origin.Path="";origin.RawPath="";origin.RawQuery="";origin.Fragment=""
 if options.HTTPClient==nil {options.HTTPClient=&http.Client{}}
 client:=&Client{options:options,origin:origin}
 /*INITIALIZE*/
 return client,nil
}
func NewIdempotencyKey() (string,error) {var buffer [16]byte;if _,err:=rand.Read(buffer[:]);err!=nil{return "",err};return hex.EncodeToString(buffer[:]),nil}
type nativeParameter struct { Name, In string; Required bool }
type nativeOperation struct { ID, Method, Path, ContentType, ResponseType string; Wait, Keyed bool; Parameters []nativeParameter }
type operationContext struct { acceptance *Acceptance; last *BeeOSHTTPResponse[json.RawMessage]; caller context.Context; ctx context.Context; cancel context.CancelFunc }
func newOperationContext(ctx context.Context,op nativeOperation,options RequestOptions) (*operationContext,error) {
 result:=&operationContext{caller:ctx,ctx:ctx,cancel:func(){}}
 if options.RequestTimeoutSeconds<0||options.WaitTimeoutSeconds<0||options.PollIntervalSeconds<0{return nil,fmt.Errorf("local deadlines and poll interval must be positive")}
 if op.Keyed {key:=options.IdempotencyKey;if key=="" {var err error;key,err=NewIdempotencyKey();if err!=nil{return nil,err}};if len(key)>256{return nil,fmt.Errorf("Idempotency-Key exceeds 256 bytes")};result.acceptance=&Acceptance{IdempotencyKey:key}}
 if op.Wait && (options.Wait==nil||*options.Wait) {seconds:=options.WaitTimeoutSeconds;if seconds==0{seconds=300};result.ctx,result.cancel=context.WithTimeout(ctx,time.Duration(seconds*float64(time.Second)))}
 return result,nil
}
func localError(ctx *operationContext,cause error,request bool) error {
 base:=&SDKWaitTimeout{Message:"Local wait deadline exceeded",Acceptance:ctx.acceptance,LastResponse:ctx.last,Cause:cause}
 if ctx.caller.Err()!=nil {base.Message="Local operation cancelled";return &SDKCancelled{base}}
 if ctx.ctx.Err()!=nil{return base}
 if request {base.Message="HTTP request deadline exceeded";return &SDKRequestTimeout{base}}
 return cause
}
func readHeaders(raw http.Header) HTTPHeaders {
 result:=HTTPHeaders{RequestID:raw.Get("X-Request-ID"),ETag:raw.Get("ETag"),Location:raw.Get("Location"),RetryAfter:raw.Get("Retry-After"),Raw:raw.Clone()}
 value:=raw.Get("Should-Retry");if value=="" {value=raw.Get("X-Should-Retry")};if value!="" {flag:=value=="true";result.ShouldRetry=&flag};return result
}
func wireValue(value any) (reflect.Value,bool) {
 if value==nil{return reflect.Value{},false};result:=reflect.ValueOf(value)
 for result.Kind()==reflect.Pointer || result.Kind()==reflect.Interface {if result.IsNil(){return reflect.Value{},false};result=result.Elem()}
 return result,true
}
func makeRequest(ctx context.Context,client *Client,op nativeOperation,path map[string]string,body any,wire map[string]any,options RequestOptions,operation *operationContext) (*http.Response,context.CancelFunc,error) {
 target:=op.Path;for key,value:=range path {if value=="" {return nil,nil,fmt.Errorf("empty path parameter %s",key)};target=strings.ReplaceAll(target,"{"+key+"}",url.PathEscape(value))}
 requestURL,err:=url.Parse(client.origin.String()+target);if err!=nil{return nil,nil,err};query:=requestURL.Query()
 headers:=http.Header{};key:=client.options.APIKey;if client.options.APIKeyProvider!=nil {key=client.options.APIKeyProvider()};headers.Set("Authorization","Bearer "+key)
 accept:="application/json";if op.ResponseType=="sse"{accept="text/event-stream"};if op.ResponseType=="bytes"{accept="application/octet-stream"};headers.Set("Accept",accept)
 if op.ContentType!="" {headers.Set("Content-Type",op.ContentType)}
 if op.Keyed {headers.Set("Idempotency-Key",operation.acceptance.IdempotencyKey)}
 for _,param:=range op.Parameters {
  value,ok:=wireValue(wire[param.Name]);if !ok {if param.Required{return nil,nil,fmt.Errorf("missing required option %s",param.Name)};continue}
  if !param.Required && value.IsZero(){continue}
  text:=fmt.Sprint(value.Interface())
  if param.Name=="If-Match" && (len(text)<3||!strings.HasPrefix(text,"\"")||!strings.HasSuffix(text,"\"")||strings.ContainsAny(text[1:len(text)-1],"\"\r\n")){return nil,nil,fmt.Errorf("If-Match must be a strong quoted ETag")}
  if param.In=="header" {headers.Set(param.Name,text)} else if value.Kind()==reflect.Slice {for i:=0;i<value.Len();i++ {query.Add(param.Name,fmt.Sprint(value.Index(i).Interface()))}} else {query.Add(param.Name,text)}
 }
 requestURL.RawQuery=query.Encode()
 var reader io.Reader
 if body!=nil {if op.ContentType=="application/octet-stream" {var ok bool;reader,ok=body.(io.Reader);if !ok{return nil,nil,fmt.Errorf("binary body must implement io.Reader")}} else {encoded,err:=json.Marshal(body);if err!=nil{return nil,nil,err};reader=bytes.NewReader(encoded)}}
 seconds:=options.RequestTimeoutSeconds;if seconds==0{seconds=30}
 var requestCtx context.Context;var cancel context.CancelFunc;var admissionTimer *time.Timer
 if op.ResponseType=="sse" {requestCtx,cancel=context.WithCancel(ctx);admissionTimer=time.AfterFunc(time.Duration(seconds*float64(time.Second)),cancel)} else {requestCtx,cancel=context.WithTimeout(ctx,time.Duration(seconds*float64(time.Second)))}
 request,err:=http.NewRequestWithContext(requestCtx,op.Method,requestURL.String(),reader);if err!=nil{cancel();return nil,nil,err};request.Header=headers
 if value:=headers.Get("Content-Length");value!="" {length,parseErr:=strconv.ParseInt(value,10,64);if parseErr!=nil{cancel();return nil,nil,parseErr};request.ContentLength=length;request.Header.Del("Content-Length")}
 response,err:=client.options.HTTPClient.Do(request)
 if admissionTimer!=nil{admissionTimer.Stop()}
 if err!=nil {cancel();if requestCtx.Err()!=nil{return nil,nil,localError(operation,err,true)};return nil,nil,&SDKTransportError{&SDKWaitTimeout{Message:"HTTP transport failed",Acceptance:operation.acceptance,LastResponse:operation.last,Cause:err}}}
 if response.StatusCode<200 || response.StatusCode>=300 {
  defer response.Body.Close();defer cancel();raw,readErr:=io.ReadAll(response.Body);if readErr!=nil {return nil,nil,readErr}
  var envelope struct {Code,Message,Reason string;RequestID string \`json:"request_id"\`;RetryAfter json.RawMessage \`json:"retry_after"\`;ShouldRetry *bool \`json:"should_retry"\`;Details struct {Reason string \`json:"reason"\`};Error json.RawMessage}
  _=json.Unmarshal(raw,&envelope)
  if len(envelope.Error)>0&&envelope.Error[0]=='{' {_=json.Unmarshal(envelope.Error,&envelope)}
  info:=readHeaders(response.Header);if envelope.Code=="" {envelope.Code="invalid_response"};if envelope.Message=="" {envelope.Message=response.Status};if envelope.Reason==""{envelope.Reason=envelope.Details.Reason};if info.RequestID==""{info.RequestID=envelope.RequestID};if info.ShouldRetry==nil{info.ShouldRetry=envelope.ShouldRetry};if info.RetryAfter=="" && len(envelope.RetryAfter)>0 {info.RetryAfter=strings.Trim(string(envelope.RetryAfter),"\"")}
  return nil,nil,&BeeOSAPIError{HTTPStatus:response.StatusCode,Code:envelope.Code,Message:envelope.Message,Reason:envelope.Reason,RequestID:info.RequestID,RetryAfter:info.RetryAfter,ShouldRetry:info.ShouldRetry,RawEnvelope:raw,Headers:info,Acceptance:operation.acceptance}
 }
 return response,cancel,nil
}
type cancellingReader struct {io.ReadCloser;cancel context.CancelFunc}
func(reader *cancellingReader) Close() error {err:=reader.ReadCloser.Close();reader.cancel();return err}
func requestNative[T any](client *Client,op nativeOperation,path map[string]string,body any,wire map[string]any,options RequestOptions,operation *operationContext) (BeeOSHTTPResponse[T],error) {
 result:=BeeOSHTTPResponse[T]{}
 response,cancel,err:=makeRequest(operation.ctx,client,op,path,body,wire,options,operation);if err!=nil{return result,err}
 result.Status=response.StatusCode;result.Headers=readHeaders(response.Header);result.Acceptance=operation.acceptance
 if op.ResponseType=="bytes" {
  value,ok:=any(&cancellingReader{ReadCloser:response.Body,cancel:cancel}).(T);if !ok{response.Body.Close();cancel();return result,fmt.Errorf("invalid binary response type")};result.Body=value;return result,nil
 }
 defer cancel();defer response.Body.Close()
 var encoded []byte
 if response.StatusCode!=204 {encoded,err=io.ReadAll(response.Body);if err!=nil{if response.Request.Context().Err()!=nil{return result,localError(operation,err,true)};return result,err};if err=json.Unmarshal(encoded,&result.Body);err!=nil{return result,err}}
 if operation.acceptance!=nil&&operation.acceptance.Status==nil {
  var resource struct {Data struct {ID string \`json:"id"\`;Receipt struct {ReceiptID string \`json:"receipt_id"\`} \`json:"receipt"\`} \`json:"data"\`};_ = json.Unmarshal(encoded,&resource)
  operation.acceptance.Status=Pointer(result.Status);if resource.Data.ID!=""{operation.acceptance.ResourceID=Pointer(resource.Data.ID)}else if resource.Data.Receipt.ReceiptID!=""{operation.acceptance.ResourceID=Pointer(resource.Data.Receipt.ReceiptID)}
  operation.acceptance.ETag=result.Headers.ETag;operation.acceptance.RequestID=result.Headers.RequestID
 }
 operation.last=&BeeOSHTTPResponse[json.RawMessage]{Status:result.Status,Body:encoded,Headers:result.Headers,Acceptance:operation.acceptance}
 return result,nil
}
func retryDuration(value string,fallback float64) time.Duration {
 if seconds,err:=strconv.ParseFloat(value,64);err==nil&&seconds>=0{return time.Duration(seconds*float64(time.Second))}
 if at,err:=http.ParseTime(value);err==nil {duration:=time.Until(at);if duration<0{return 0};return duration}
 if fallback==0{fallback=.25};return time.Duration(fallback*float64(time.Second))
}
func waitNative(operation *operationContext,duration time.Duration) error {
 timer:=time.NewTimer(duration);defer timer.Stop();select {case <-timer.C:return nil;case <-operation.ctx.Done():return localError(operation,operation.ctx.Err(),false)}
}
func callNative[T any](ctx context.Context,client *Client,op nativeOperation,path map[string]string,body any,wire map[string]any,options RequestOptions) (BeeOSHTTPResponse[T],error) {
 operation,err:=newOperationContext(ctx,op,options);if err!=nil{return BeeOSHTTPResponse[T]{},err};defer operation.cancel()
 result,err:=requestNative[T](client,op,path,body,wire,options,operation);if err!=nil{return result,err}
 if !op.Wait || (options.Wait!=nil&&!*options.Wait){return result,nil}
 var expectedRevision string;var expectedTarget string;var previous string
 if agent,ok:=any(result.Body).(NativeAgentResult);ok {expectedRevision=string(agent.Data.Publication.AcceptedConfigRevision);if ref:=agent.Data.Configuration.Sandbox.BeeosAgentSandboxReference;ref!=nil {expectedTarget=string(ref.ID)}}
 for {
  if operation.ctx.Err()!=nil{return result,localError(operation,operation.ctx.Err(),false)}
  observation:=fmt.Sprint(result.Status)+result.Headers.ETag+string(operation.last.Body)
  if previous!=observation {previous=observation;if options.OnProgress!=nil{options.OnProgress(*operation.last)}}
  var poll nativeOperation;var args map[string]string;done:=false
  switch value:=any(result.Body).(type) {
  case SandboxResult:
   if value.Data.Status=="running"{done=true}else if value.Data.Status=="error"||value.Data.Status=="unknown"{return result,&SDKOperationFailed{&SDKWaitTimeout{Message:"Sandbox preparation requires inspection",Acceptance:operation.acceptance,LastResponse:operation.last}}}
   poll=nativeOperations["getSandbox"];args=map[string]string{"sandbox_id":string(value.Data.ID)}
  case NativeAgentResult:
   publication:=value.Data.Publication
   if string(value.Data.DesiredConfigRevision)!=expectedRevision||string(publication.AcceptedConfigRevision)!=expectedRevision||publication.State=="superseded" {return result,&SDKPublicationSuperseded{&SDKWaitTimeout{Message:"Agent publication was superseded",Acceptance:operation.acceptance,LastResponse:operation.last}}}
   if publication.State=="deferred"||value.Data.Configuration.Sandbox.BeeosAgentSandboxTemplate!=nil||len(publication.ChangedComponents)==0 {done=true}
   if publication.State=="failed"||publication.State=="partial"||publication.State=="unknown" {return result,&SDKOperationFailed{&SDKWaitTimeout{Message:"Agent publication requires inspection",Acceptance:operation.acceptance,LastResponse:operation.last}}}
   // publication.ready is the producer's current target/control/fence/credential-receipt verdict.
   // An unchanged valid credential injection may retain an older activation revision.
   if publication.State=="ready"&&value.Data.Binding!=nil&&value.Data.Binding.PreparedConfigRevision!=nil&&string(*value.Data.Binding.PreparedConfigRevision)==expectedRevision&&expectedTarget!=""&&string(value.Data.Binding.SandboxID)==expectedTarget {done=true}
   poll=nativeOperations["getNativeAgent"];args=map[string]string{"agent_id":string(value.Data.ID)}
  case CommandResultEnvelope:
   done=value.Data.State=="completed"||value.Data.State=="unknown"
   poll=nativeOperations["getSandboxCommand"];args=map[string]string{"sandbox_id":path["sandbox_id"],"command_id":string(value.Data.ID)}
  case NativeMemoryReceiptResult:
   receipt:=value.Data.Receipt
   done=(value.Data.Completion=="durable"||value.Data.Completion=="recallable")&&(receipt.Disposition=="committed"||receipt.Disposition=="duplicate")&&receipt.CommittedAt!=nil&&receipt.ReadWatermark!=nil
   if value.Data.Completion=="failed"||value.Data.Completion=="blocked"||value.Data.Completion=="unknown" {return result,&SDKOperationFailed{&SDKWaitTimeout{Message:"Memory durability requires inspection",Acceptance:operation.acceptance,LastResponse:operation.last}}}
   poll=nativeOperations["getNativeMemoryReceipt"];args=map[string]string{"agent_id":path["agent_id"],"receipt_id":string(receipt.ReceiptID)}
  default:return result,fmt.Errorf("unsupported native wait response %T",result.Body)
  }
  if done{return result,nil}
  if err=waitNative(operation,retryDuration(result.Headers.RetryAfter,options.PollIntervalSeconds));err!=nil{return result,err}
  for {
   result,err=requestNative[T](client,poll,args,nil,nil,options,operation)
   if err==nil{break};var apiError *BeeOSAPIError
   if !errors.As(err,&apiError)||apiError.ShouldRetry==nil||!*apiError.ShouldRetry||apiError.HTTPStatus==401||apiError.HTTPStatus==403||apiError.HTTPStatus==409||apiError.HTTPStatus==412 {return result,err}
   if err=waitNative(operation,retryDuration(apiError.RetryAfter,options.PollIntervalSeconds));err!=nil{return result,err}
  }
 }
}
func matchesNativeVariant(data []byte,kind string,required,allowed []string,constants string) bool {
 trimmed:=bytes.TrimSpace(data);if len(trimmed)==0{return false}
 switch kind {case "object":if trimmed[0]!='{'{return false};case "array":return trimmed[0]=='[';case "string":return trimmed[0]=='"';case "null":return string(trimmed)=="null";case "boolean":return string(trimmed)=="true"||string(trimmed)=="false"}
 var object map[string]json.RawMessage;if err:=json.Unmarshal(data,&object);err!=nil{return false}
 for _,field:=range required {if _,ok:=object[field];!ok{return false}}
 if allowed!=nil {for field:=range object {found:=false;for _,name:=range allowed{if name==field{found=true;break}};if !found{return false}}}
 var expected map[string]json.RawMessage;_ = json.Unmarshal([]byte(constants),&expected)
 for field,value:=range expected {if actual,present:=object[field];present&&!bytes.Equal(bytes.TrimSpace(actual),value){return false}}
 return true
}
`.replaceAll(String.fromCharCode(92,96),String.fromCharCode(96));

const streamRuntime = String.raw`import (
 "bufio"
 "context"
 "encoding/json"
 "fmt"
 "io"
 "strings"
 "sync"
)
// nativeEventTypes is the modeled NativeResponseEvent type set. A newer producer
// may emit another type; consumers skip it and the stream stays open.
var nativeEventTypes=map[string]bool{/*NATIVE_EVENT_TYPES*/}
type EventStream[T any] struct {
 Status int
 Headers HTTPHeaders
 LastEventID string
 reader io.ReadCloser
 scanner *bufio.Scanner
 cancel context.CancelFunc
 closeOnce sync.Once
}
func splitSSELines(data []byte,atEOF bool) (int,[]byte,error) {
 for index,value:=range data {
  if value=='\n' {return index+1,data[:index],nil}
  if value=='\r' {if index+1==len(data)&&!atEOF{return 0,nil,nil};advance:=index+1;if advance<len(data)&&data[advance]=='\n'{advance++};return advance,data[:index],nil}
 }
 if atEOF&&len(data)>0{return len(data),data,nil};return 0,nil,nil
}
func openEventStream[T any](ctx context.Context,client *Client,op nativeOperation,path map[string]string,wire map[string]any,options RequestOptions) (*EventStream[T],error) {
 operation,err:=newOperationContext(ctx,op,options);if err!=nil{return nil,err}
 // Request timeout bounds the HTTP admission; the caller context owns the established stream.
 streamCtx,cancel:=context.WithCancel(ctx)
 streamOptions:=options
 response,stopRequest,err:=makeRequest(streamCtx,client,op,path,nil,wire,streamOptions,operation)
 if err!=nil{cancel();operation.cancel();return nil,err}
 if !strings.HasPrefix(strings.ToLower(response.Header.Get("Content-Type")),"text/event-stream") {response.Body.Close();stopRequest();cancel();return nil,fmt.Errorf("expected text/event-stream response")}
 stream:=&EventStream[T]{Status:response.StatusCode,Headers:readHeaders(response.Header),reader:response.Body,cancel:func(){stopRequest();cancel();operation.cancel()}}
 if value,ok:=wireValue(wire["Last-Event-ID"]);ok{stream.LastEventID=fmt.Sprint(value.Interface())}
 stream.scanner=bufio.NewScanner(response.Body);stream.scanner.Split(splitSSELines);stream.scanner.Buffer(make([]byte,4096),1024*1024+1)
 return stream,nil
}
func(stream *EventStream[T]) Close() error {
 var result error
 stream.closeOnce.Do(func(){result=stream.reader.Close();stream.cancel()})
 return result
}
func(stream *EventStream[T]) Receive(ctx context.Context) (T,error) {
 var zero T
 stop:=context.AfterFunc(ctx,func(){_ = stream.Close()});defer stop()
 var data []string;size:=0;first:=true;pendingID:=stream.LastEventID
 for stream.scanner.Scan() {
  if ctx.Err()!=nil{return zero,ctx.Err()}
  line:=stream.scanner.Text();if first {line=strings.TrimPrefix(line,"\uFEFF");first=false}
  if line=="" {
   if len(data)==0{stream.LastEventID=pendingID;size=0;continue}
   raw:=strings.Join(data,"\n");var value T
   var header struct{Type string \`json:"type"\`}
   if err:=json.Unmarshal([]byte(raw),&header);err!=nil{_ = stream.Close();return zero,fmt.Errorf("invalid SSE JSON: %w",err)}
   stream.LastEventID=pendingID;data=nil;size=0
   if _,ok:=any(zero).(NativeResponseEvent);ok&&!nativeEventTypes[header.Type]{continue}
   if err:=json.Unmarshal([]byte(raw),&value);err!=nil{_ = stream.Close();return zero,fmt.Errorf("invalid SSE JSON: %w",err)}
   return value,nil
  }
  size+=len(line)+1;if size>1024*1024{_ = stream.Close();return zero,fmt.Errorf("SSE event exceeds 1 MiB")}
  if line[0]==':'{continue}
  field,value,found:=strings.Cut(line,":");if found{value=strings.TrimPrefix(value," ")}
  switch field {case "data":data=append(data,value);case "id":if !strings.ContainsRune(value,0){pendingID=value}}
 }
 _ = stream.Close()
 if ctx.Err()!=nil{return zero,ctx.Err()}
 if err:=stream.scanner.Err();err!=nil{return zero,err}
 return zero,io.EOF
}
type ResponseStream struct {ResponseID string;Response BeeOSHTTPResponse[NativeResponseResult];Events *EventStream[NativeResponseEvent]}
`.replaceAll(String.fromCharCode(92,96),String.fromCharCode(96));

const connectionRuntime = String.raw`import (
 "context"
 "encoding/base64"
 "encoding/json"
 "fmt"
 "net/url"
 "strconv"
 "strings"
 "sync"
 "time"

 "github.com/gorilla/websocket"
)
// WebSocketTransport allows a caller's transport while the default uses gorilla/websocket.
type WebSocketTransport interface {
 ReadMessage() (int,[]byte,error)
 WriteMessage(int,[]byte) error
 SetReadLimit(int64)
 SetReadDeadline(time.Time) error
 SetWriteDeadline(time.Time) error
 Subprotocol() string
 Close() error
}
type WebSocketDialer func(context.Context,string,string) (WebSocketTransport,error)
func defaultWebSocketDialer(ctx context.Context,endpoint,profile string) (WebSocketTransport,error) {
 dialer:=websocket.Dialer{Subprotocols:[]string{profile},HandshakeTimeout:5*time.Second}
 connection,response,err:=dialer.DialContext(ctx,endpoint,nil)
 if response!=nil&&response.Body!=nil{response.Body.Close()}
 return connection,err
}
type ConnectOptions struct {
 RequestOptions
 LastServerSequence string
 Command, Cwd string
 Args []string
 Env map[string]string
}
type SocketFrame struct {
 Type string \`json:"type"\`
 ProtocolVersion int \`json:"protocolVersion,omitempty"\`
 ClientID string \`json:"clientId,omitempty"\`
 TerminalID string \`json:"terminalId,omitempty"\`
 Sequence string \`json:"sequence,omitempty"\`
 Resumed bool \`json:"resumed,omitempty"\`
 Data string \`json:"data,omitempty"\`
 Encoding string \`json:"encoding,omitempty"\`
 Truncated bool \`json:"truncated,omitempty"\`
 ExitCode *int \`json:"exitCode,omitempty"\`
 Columns int \`json:"columns,omitempty"\`
 Rows int \`json:"rows,omitempty"\`
 Code string \`json:"code,omitempty"\`
 Message string \`json:"message,omitempty"\`
 TransportGeneration int \`json:"transport_generation,omitempty"\`
 ProtocolVersionDesktop int \`json:"protocol_version,omitempty"\`
 ConnectionID string \`json:"connection_id,omitempty"\`
 ICETransportPolicy string \`json:"ice_transport_policy,omitempty"\`
 ICEServers []ICEServer \`json:"ice_servers,omitempty"\`
 RFBProfile string \`json:"rfb_profile,omitempty"\`
 SDP string \`json:"sdp,omitempty"\`
 Candidate string \`json:"candidate,omitempty"\`
 SDPMid *string \`json:"sdp_mid,omitempty"\`
 SDPMlineIndex *int \`json:"sdp_mline_index,omitempty"\`
 Binary []byte \`json:"-"\`
}
type ICEServer struct {URLs []string \`json:"urls"\`;Username string \`json:"username"\`;Credential string \`json:"credential"\`}
type SocketConnection struct {
 transport WebSocketTransport
 // Metadata omits the one-use ticket secret.
 Ticket AccessTicket
 mu sync.Mutex
 sequence uint64
 LastServerSequence string
 desktopGeneration int
 closeOnce sync.Once
 stopContext func() bool
}
type ConnectionError struct {Ticket AccessTicket;Acceptance *Acceptance;Cause error}
func(err *ConnectionError) Error() string {return "Connection admission failed"}
func(err *ConnectionError) Unwrap() error {return err.Cause}
type TerminalConnection = SocketConnection
type DesktopSignalingConnection = SocketConnection
func connectNativeSocket(ctx context.Context,client *Client,sandboxID string,body AccessTicketCreate,options ConnectOptions) (result *SocketConnection,returnedErr error) {
 accepted,err:=client.AccessTickets.Create(ctx,sandboxID,body,CreateSandboxAccessTicketOptions{RequestOptions:options.RequestOptions});if err!=nil{return nil,err}
 ticket:=accepted.Body.Data
 defer func(){if returnedErr!=nil {metadata:=ticket;metadata.Ticket="";returnedErr=&ConnectionError{Ticket:metadata,Acceptance:accepted.Acceptance,Cause:returnedErr}}}()
 endpoint,err:=url.Parse(string(ticket.ConnectURL));if err!=nil{return nil,err}
 if endpoint.Scheme!="wss"||endpoint.RawQuery!=""||endpoint.User!=nil||endpoint.Fragment!=""{return nil,fmt.Errorf("access ticket must contain exact WSS URL without query credentials")}
 purpose:=string(body.Purpose);profile:="beeos-terminal-v2";if purpose=="desktop"{profile="beeos-desktop-v1"}
 if string(ticket.Profile)!=profile||string(ticket.Purpose)!=purpose||string(ticket.SandboxID)!=sandboxID{return nil,fmt.Errorf("access ticket target/profile mismatch")}
 dial:=client.options.WebSocketDialer;if dial==nil{dial=defaultWebSocketDialer}
 admissionCtx,cancel:=context.WithTimeout(ctx,5*time.Second);defer cancel()
 transport,err:=dial(admissionCtx,endpoint.String(),profile);if err!=nil{return nil,err}
 connection:=&SocketConnection{transport:transport,Ticket:ticket,desktopGeneration:1,LastServerSequence:options.LastServerSequence}
 if connection.LastServerSequence==""{connection.LastServerSequence="0"}
 connection.Ticket.Ticket=""
 connection.stopContext=context.AfterFunc(ctx,func(){_ = connection.Disconnect()})
 failed:=true;defer func(){if failed{connection.Disconnect()}}()
 if transport.Subprotocol()!=profile{return nil,fmt.Errorf("WebSocket subprotocol mismatch")}
 transport.SetReadLimit(1024*1024)
 deadline,_:=admissionCtx.Deadline();if err=transport.SetReadDeadline(deadline);err!=nil{return nil,err};if err=transport.SetWriteDeadline(deadline);err!=nil{return nil,err}
 if err=connection.sendJSON(map[string]any{"type":"authenticate","profile":profile,"ticket":ticket.Ticket});err!=nil{return nil,err}
 _,raw,err:=transport.ReadMessage();if err!=nil{return nil,err}
 var authenticated struct {Type,Profile string;ClientID string \`json:"client_id"\`;SandboxID string \`json:"sandbox_id"\`;TerminalID string \`json:"terminal_id"\`}
 if err=json.Unmarshal(raw,&authenticated);err!=nil{return nil,err}
 if authenticated.Type!="authenticated"||authenticated.Profile!=profile||authenticated.ClientID!=string(ticket.ClientID)||authenticated.SandboxID!=sandboxID||(purpose=="pty"&&(ticket.PtyID==nil||authenticated.TerminalID!=*ticket.PtyID)){return nil,fmt.Errorf("WebSocket authenticated identity mismatch")}
 if purpose=="pty" {
  fields:=map[string]any{};kind:="terminal.open"
  if body.PtyID!=nil {kind="terminal.resume";cursor:=options.LastServerSequence;if cursor==""{cursor="0"};if _,err=strconv.ParseUint(cursor,10,64);err!=nil{return nil,fmt.Errorf("invalid output cursor: %w",err)};fields["lastServerSequence"]=cursor} else {
   if body.Cols!=nil{fields["columns"]=*body.Cols};if body.Rows!=nil{fields["rows"]=*body.Rows};if options.Command!=""{fields["command"]=options.Command};if options.Cwd!=""{fields["cwd"]=options.Cwd};if options.Args!=nil{fields["args"]=options.Args};if options.Env!=nil{fields["env"]=options.Env}
  }
  if err=connection.sendTerminal(kind,fields);err!=nil{return nil,err}
  frame,err:=connection.Receive(admissionCtx);if err!=nil{return nil,err}
  if frame.Type!="terminal.opened"||frame.ClientID!=string(ticket.ClientID)||frame.TerminalID!=*ticket.PtyID||frame.Resumed!=(body.PtyID!=nil){return nil,fmt.Errorf("PTY did not open/resume requested terminal")}
 }
 if err=transport.SetReadDeadline(time.Time{});err!=nil{return nil,err};if err=transport.SetWriteDeadline(time.Time{});err!=nil{return nil,err}
 failed=false;return connection,nil
}
func(connection *SocketConnection) sendJSON(value any) error {
 encoded,err:=json.Marshal(value);if err!=nil{return err};if len(encoded)>1024*1024{return fmt.Errorf("WebSocket frame exceeds 1 MiB")}
 return connection.transport.WriteMessage(websocket.TextMessage,encoded)
}
func(connection *SocketConnection) sendTerminal(kind string,fields map[string]any) error {
 connection.mu.Lock();defer connection.mu.Unlock()
 if connection.Ticket.Purpose!="pty"||connection.Ticket.PtyID==nil{return fmt.Errorf("connection is not a PTY")}
 if connection.sequence==^uint64(0){return fmt.Errorf("terminal client sequence exhausted")};connection.sequence++
 frame:=map[string]any{"type":kind,"protocolVersion":1,"clientId":connection.Ticket.ClientID,"terminalId":*connection.Ticket.PtyID,"clientSequence":strconv.FormatUint(connection.sequence,10)}
 for key,value:=range fields{frame[key]=value};return connection.sendJSON(frame)
}
// WriteInput confirms only local socket send. Unknown input is never replayed.
func(connection *SocketConnection) WriteInput(data,encoding string) error {
 if encoding==""{encoding="utf8"};decoded:=[]byte(data)
 if encoding=="base64"{var err error;decoded,err=base64.StdEncoding.DecodeString(data);if err!=nil{return err}}else if encoding!="utf8"{return fmt.Errorf("invalid terminal encoding")}
 if len(decoded)>16384{return fmt.Errorf("terminal input exceeds 16 KiB")}
 return connection.sendTerminal("terminal.input",map[string]any{"data":data,"encoding":encoding})
}
func(connection *SocketConnection) Resize(columns,rows int) error {if columns<1||columns>1000||rows<1||rows>1000{return fmt.Errorf("terminal dimensions must be 1–1000")};return connection.sendTerminal("terminal.resize",map[string]any{"columns":columns,"rows":rows})}
func(connection *SocketConnection) Ping() error {return connection.sendTerminal("terminal.ping",nil)}
func(connection *SocketConnection) CloseTerminal() error {return connection.sendTerminal("terminal.close",nil)}
func(connection *SocketConnection) desktop(value any) error {connection.mu.Lock();defer connection.mu.Unlock();if connection.Ticket.Purpose!="desktop"{return fmt.Errorf("connection is not desktop")};return connection.sendJSON(value)}
func(connection *SocketConnection) Offer(sdp string) error {return connection.desktop(map[string]any{"type":"offer","protocol_version":1,"sdp":sdp,"transport_generation":1})}
func(connection *SocketConnection) ICE(candidate string,mid *string,index *int) error {return connection.desktop(map[string]any{"type":"ice_candidate","candidate":candidate,"sdp_mid":mid,"sdp_mline_index":index,"transport_generation":1})}
func(connection *SocketConnection) StartDesktop() error {return connection.desktop(map[string]any{"type":"desktop_start","transport":"webrtc","transport_generation":1})}
// StartDesktopStream sends start after the negotiated WebRTC DataChannel is open.
func(connection *SocketConnection) StartDesktopStream() error {return connection.desktop(map[string]any{"type":"start","transport_generation":1})}
func(connection *SocketConnection) Fallback() error {return connection.desktop(map[string]any{"type":"fallback","transport":"websocket","protocol":"rfb-3.8","transport_generation":2})}
func(connection *SocketConnection) SendDesktopBytes(data []byte) error {connection.mu.Lock();defer connection.mu.Unlock();if connection.Ticket.Purpose!="desktop"||connection.desktopGeneration!=2{return fmt.Errorf("WSS desktop fallback is not admitted")};if len(data)>1024*1024{return fmt.Errorf("WebSocket frame exceeds 1 MiB")};return connection.transport.WriteMessage(websocket.BinaryMessage,data)}
func(connection *SocketConnection) Receive(ctx context.Context) (SocketFrame,error) {
 var frame SocketFrame
 stop:=context.AfterFunc(ctx,func(){_ = connection.Disconnect()});defer stop()
 for {
 kind,raw,err:=connection.transport.ReadMessage();if err!=nil {if ctx.Err()!=nil{return frame,ctx.Err()};return frame,err}
 if kind==websocket.BinaryMessage {connection.mu.Lock();generation:=connection.desktopGeneration;connection.mu.Unlock();if connection.Ticket.Purpose!="desktop"||generation!=2{return frame,fmt.Errorf("unexpected binary WebSocket frame")};frame.Binary=raw;return frame,nil}
 if kind!=websocket.TextMessage{return frame,fmt.Errorf("unexpected WebSocket message type")}
 if err=json.Unmarshal(raw,&frame);err!=nil{return frame,err}
 if connection.Ticket.Purpose=="pty" {
  sequence,parseErr:=strconv.ParseUint(frame.Sequence,10,64)
  if frame.ClientID!=string(connection.Ticket.ClientID)||connection.Ticket.PtyID==nil||frame.TerminalID!=*connection.Ticket.PtyID||frame.ProtocolVersion!=1||!strings.HasPrefix(frame.Type,"terminal.")||parseErr!=nil||sequence==0||strconv.FormatUint(sequence,10)!=frame.Sequence{return frame,fmt.Errorf("terminal frame identity or sequence mismatch")}
  connection.mu.Lock();previous,_:=strconv.ParseUint(connection.LastServerSequence,10,64);duplicate:=frame.Type=="terminal.output"&&sequence<=previous;if sequence>previous{connection.LastServerSequence=frame.Sequence};connection.mu.Unlock();if duplicate{continue}
 } else if frame.Type=="fallback_ready"&&frame.TransportGeneration==2 {connection.mu.Lock();connection.desktopGeneration=2;connection.mu.Unlock()}
 return frame,nil
 }
}
// Disconnect releases the network only; use CloseTerminal for an explicit remote stop request.
func(connection *SocketConnection) Disconnect() error {var err error;connection.closeOnce.Do(func(){if connection.stopContext!=nil{connection.stopContext()};err=connection.transport.Close()});return err}
`.replaceAll(String.fromCharCode(92,96),String.fromCharCode(96));
