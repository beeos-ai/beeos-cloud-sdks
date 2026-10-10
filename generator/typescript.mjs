import fs from 'node:fs/promises';
import ts from 'typescript';
import openapiTS, { astToString } from 'openapi-typescript';
import { operations, resolve, pascal } from './common.mjs';

const quote = JSON.stringify;
export async function generateTypeScript(spec) {
  if (spec.components.schemas.UHPCreateResponseRequest) {
    for (const [name, stream] of [['UHPCreateResponseJSONRequest', false], ['UHPCreateResponseStreamRequest', true]]) {
      const request = structuredClone(spec.components.schemas.UHPCreateResponseRequest);
      request.properties.stream = { type: 'boolean', const: stream };
      spec.components.schemas[name] = request;
    }
    for (const operation of operations(spec)) if (operation.operationId === 'createResponse') {
      operation.requestBody.content['application/json'].schema = { $ref: '#/components/schemas/UHPCreateResponseJSONRequest' };
    }
  }
  const ast = await openapiTS(spec, { defaultNonNullable: false, transform(schema) {
    if (schema.$ref?.endsWith('/JSONValue')) return ts.factory.createTypeReferenceNode('JSONValue');
    if (schema.format === 'binary') return ts.factory.createTypeReferenceNode('Blob');
    if (schema === true || Object.keys(schema).every(key => ['description','title','examples','default','deprecated'].includes(key))) return ts.factory.createTypeReferenceNode('JSONValue');
  }, inject: 'export type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };' });
  const typedAst = ast.map(node => ts.transform(node, [context => root => {
    const visit = current => {
      if (ts.isIndexSignatureDeclaration(current) && current.type?.kind === ts.SyntaxKind.UnknownKeyword) {
        return ts.factory.updateIndexSignature(current, current.modifiers, current.parameters,
          ts.factory.createUnionTypeNode([ts.factory.createTypeReferenceNode('JSONValue'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)]));
      }
      if (current.kind === ts.SyntaxKind.UnknownKeyword) return ts.factory.createTypeReferenceNode('JSONValue');
      return ts.visitEachChild(current, visit, context);
    };
    return ts.visitNode(root, visit);
  }]).transformed[0]);
  const models = astToString(typedAst).replace(/components\["schemas"\]\["JSONValue"\]/g, 'JSONValue');
  const ops = operations(spec);
  const aliases = ops.flatMap(op => {
    const name = pascal(op.operationId);
    const request = resolve(spec, op.requestBody);
    const response = Object.entries(op.responses).find(([code]) => /^2\d\d$/.test(code));
    const success = response && resolve(spec,response[1]);
    const media = success?.content && (success.content['application/json'] ? 'application/json' : Object.keys(success.content)[0]);
    const eventSchema = media === 'text/event-stream' && (success.content[media].schema?.['x-event-data-schema'] ?? success.content[media].schema);
    const output = media === 'text/event-stream' ? `AsyncIterable<${eventSchema?.$ref ? `components[\"schemas\"][${quote(eventSchema.$ref.split('/').pop())}]` : 'JSONValue'}>` : media && media !== 'application/json' ? 'Uint8Array' : success?.content ? `operations[${quote(op.operationId)}][\"responses\"][${response[0]}][\"content\"][${quote(media)}]` : 'void';
    return [
      `export type ${name}Response = ${output};`,
      ...(request ? [`export type ${name}Input = NonNullable<operations[${quote(op.operationId)}]["requestBody"]>["content"][${quote(Object.keys(request.content)[0])}];`] : []),
      ...(op.parameters.some(p => p.in === 'query') ? [`export type ${name}Query = NonNullable<operations[${quote(op.operationId)}]["parameters"]["query"]>;`] : []),
    ];
  });
  const aliasNames = new Set(aliases.map(a => a.match(/^export type (\w+)/)[1]));
  const errorBodies = [...new Set(ops.flatMap(op=>Object.entries(op.responses).filter(([code])=>code==='default'||/^[45]/.test(code)).map(([,r])=>resolve(spec,r).content?.['application/json']?.schema?.$ref?.split('/').pop()).filter(Boolean)))];
  const schemaAliases = Object.keys(spec.components.schemas).filter(n => !aliasNames.has(n) && /^[A-Za-z_$][\w$]*$/.test(n) && n !== 'JSONValue').map(n => `export type ${n} = components["schemas"][${quote(n)}];`);
  let source = await fs.readFile(new URL('./templates/typescript.ts', import.meta.url), 'utf8');
  source = source.replace('export type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };', 'export type { JSONValue } from "./models.js";\nexport * from "./models.js";\nimport type * as Models from "./models.js";\nimport type { JSONValue } from "./models.js";');
  source = source.replace('async request(method:', 'async request<T = JSONValue>(method:').replace('json?: unknown', 'json?: JSONValue').replace('): Promise<unknown> {', '): Promise<T> {');
  source = source.replace('if (response.status === 204) return undefined;', 'if (response.status === 204) return undefined as T;').replace('return response.json();', 'if (init.responseType === \"sse\") return readEvents(response) as T;\n    if (init.responseType === \"bytes\") return new Uint8Array(await response.arrayBuffer()) as T;\n    return await response.json() as T;');
  source = source.replace('path: string, init:', 'path: string, init:').replace('headers?: Record<string, string> } = {}', 'headers?: Record<string, string>; basePath?: string; responseType?: "sse" | "bytes"; form?: FormData; errorCodeField?: "error" } = {}');
  source = source.replace('const url = new URL(path.replace', 'const baseURL = init.basePath ? new URL(init.basePath.replace(/\\/$/, "") + "/", this.options.baseURL).href : this.options.baseURL;\n    const url = new URL(path.replace').replace('this.options.baseURL.endsWith("/") ? this.options.baseURL : this.options.baseURL + "/"', 'baseURL.endsWith("/") ? baseURL : baseURL + "/"');
  source = source.replace('Accept: \"application/json\"', 'Accept: init.responseType === \"sse\" ? \"text/event-stream\" : \"application/json\"');
  source = source.replace('let body: string | undefined;', 'let body: string | FormData | undefined = init.form;');
  const parsed = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits = [];
  const present = new Set();
  for (const klass of parsed.statements.filter(ts.isClassDeclaration)) {
    const resource = klass.name?.text.replace(/Module$/, '');
    for (const member of klass.members.filter(ts.isMethodDeclaration)) {
      const method = member.name.getText(parsed);
      const op = ops.find(o => pascal(o['x-sdk-resource']) === resource && o['x-sdk-method'] === method);
      if (!op) continue;
      present.add(op.operationId);
      let text = member.getText(parsed);
      const name = pascal(op.operationId);
      text = text.replace(/\b(input|patch): unknown/g, `$1: Models.${name}Input`);
      if (op.parameters.some(p=>p.in==='query')) text = text.replace(/query(\?)?: Query/g, `query$1: Models.${name}Query`);
      text = text.replace('input: { name: string }', `input: Models.${name}Input`).replace('json: { name: input.name }', 'json: input');
      const bodyStart = text.indexOf('{', text.indexOf(')'));
      text = text.slice(0,bodyStart).trimEnd() + `: Promise<Models.${name}Response> ` + text.slice(bodyStart);
      text = text.replace(/this.client.request\(/g, `this.client.request<Models.${name}Response>(`);
      edits.push({ start: member.getStart(parsed), end: member.end, text });
    }
  }
  for (const edit of edits.sort((a,b) => b.start-a.start)) source = source.slice(0,edit.start)+edit.text+source.slice(edit.end);
  const resourceMethods = new Map();
  for (const op of ops.filter(o=>!present.has(o.operationId))) {
    const resource = op['x-sdk-resource'];
    const name = pascal(op.operationId);
    const args = op.parameters.filter(p=>p.in==='path').map(p=>`${p.name}: string`);
    const body = resolve(spec,op.requestBody);
    if(body) args.push(`input${body.required ? '' : '?'}: Models.${name}Input`);
    const headerParams = op.parameters.filter(p=>p.in==='header' && p.name !== 'X-BeeOS-External-User-ID');
    for(const p of headerParams) args.push(`${p.name==='Idempotency-Key'?'idempotencyKey':p.name==='If-Match'?'version':p.name.replace(/[^a-zA-Z0-9]/g,'')}${p.required?'':'?'}: ${p.name==='If-Match'?'number':'string'}`);
    if(op.parameters.some(p=>p.in==='query')) args.push(`query?: Models.${name}Query`);
    const path = op.path.replace(/^\//,'').replace(/\{([^}]+)\}/g,(_,n)=>'${encodeURIComponent('+n+')}');
    const bodyMedia = body && Object.keys(body.content)[0];
    const success = resolve(spec, Object.entries(op.responses).find(([code]) => /^2/.test(code))?.[1]);
    const responseMedia = success?.content && (success.content['application/json'] ? 'application/json' : Object.keys(success.content)[0]);
    const init = [op['x-sdk-error-code-field'] && `errorCodeField: ${quote(op['x-sdk-error-code-field'])}`, body && (bodyMedia === 'multipart/form-data' ? 'form: createForm(input)' : 'json: input'), headerParams.some(p=>p.name==='Idempotency-Key') && 'idempotencyKey', headerParams.some(p=>p.name!=='Idempotency-Key') && `headers: { ${headerParams.filter(p=>p.name!=='Idempotency-Key').map(p=>`${p.required ? `${quote(p.name)}: ${p.name==='If-Match'?'`\"${version}\"`':p.name.replace(/[^a-zA-Z0-9]/g,'')}` : `...(${p.name.replace(/[^a-zA-Z0-9]/g,'')} === undefined ? {} : { ${quote(p.name)}: ${p.name.replace(/[^a-zA-Z0-9]/g,'')} })`}`).join(', ')} }`, op.parameters.some(p=>p.in==='query') && 'query', responseMedia === 'text/event-stream' && `responseType: 'sse'`, responseMedia && !['application/json','text/event-stream'].includes(responseMedia) && `responseType: 'bytes'`, op.servers?.[0] && `basePath: ${quote(new URL(op.servers[0].url).pathname)}`].filter(Boolean).join(', ');
    const method = `  ${op['x-sdk-method']}(${args.join(', ')}): Promise<Models.${name}Response> {\n    return this.client.request<Models.${name}Response>(${quote(op.method)}, \`${path}\`, { ${init} });\n  }`;
    resourceMethods.set(resource,[...(resourceMethods.get(resource)??[]),method]);
  }
  for(const [resource,methods] of resourceMethods) {
    const className = pascal(resource)+'Module';
    if(source.includes(`class ${className} {`)) source=source.replace(`class ${className} {`, `class ${className} {\n${methods.join('\n')}\n`);
    else {
      source += `\nclass ${className} {\n  constructor(private readonly client: BeeOSClient) {}\n${methods.join('\n')}\n}\n`;
      source=source.replace('  readonly identity:', `  readonly ${resource}: ${className};\n  readonly identity:`).replace('    this.identity =', `    this.${resource} = new ${className}(this);\n    this.identity =`);
    }
  }
  source=source.replace('upload(input: unknown', 'upload(input: Models.PresignFileUploadInput');
  source=source.replace(/\bunknown\b/g,'JSONValue');
  source += await fs.readFile(new URL('./templates/typescript-stream.ts', import.meta.url),'utf8');
  const responseOp = ops.find(op => op.operationId === 'createResponse');
  if(responseOp) {
    const streamPath = responseOp.path.replace(/^\//, "");
    const streamBasePath = new URL(responseOp.servers[0].url).pathname;
    source=source.replace('class ResponsesModule {', `class ResponsesModule {\n  createStream(input: Models.UHPCreateResponseStreamRequest, idempotencyKey?: string): Promise<AsyncIterable<Models.UHPEvent>> {\n    return this.client.request<AsyncIterable<Models.UHPEvent>>(${quote(responseOp.method)}, ${quote(streamPath)}, { json: { ...input, stream: true }, idempotencyKey, basePath: ${quote(streamBasePath)}, responseType: \"sse\" });\n  }\n`);
  }
  const nonStreaming = aliases;
  return {'src/models.ts': models+'\n'+schemaAliases.join('\n')+'\n'+nonStreaming.join('\n')+'\nexport type APIErrorBody = '+errorBodies.map(n=>`components[\"schemas\"][${quote(n)}]`).join(' | ')+';\n', 'src/index.ts':'// Generated by npm run generate from spec/server.openapi.json.\n'+source};
}
