import { execFileSync } from 'node:child_process';
import { resolve } from './common.mjs';
const pascal = value => value.replace(/(^|[^a-zA-Z0-9])([a-z])/g, (_, a, b) => b.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
const operationBasePath = operation => operation.servers?.[0] ? new URL(operation.servers[0].url).pathname : '';
const refName = value => value.split('/').pop();
const fieldName = value => pascal(value).replace(/Id$/, 'ID').replace(/Url$/, 'URL').replace(/Llm$/, 'LLM').replace(/Api/g, 'API').replace(/Json/g, 'JSON').replace(/Http/g, 'HTTP');

export function generateGo(spec) {
  const schemas = { ...spec.components?.schemas };
  for (const [name, schema] of Object.entries(schemas)) {
    if (schema.allOf) {
      const merged = { ...schema, type: 'object', properties: { ...schema.properties }, required: [...(schema.required || [])] };
      delete merged.allOf;
      for (const part of schema.allOf.map(p => resolve(spec, p))) {
        Object.assign(merged.properties, part.properties || {});
        merged.required.push(...(part.required || []));
      }
      schemas[name] = merged;
    }
  }
  if (schemas.UHPCreateResponseRequest) {
    const properties = { ...schemas.UHPCreateResponseRequest.properties };
    delete properties.stream;
    schemas.UHPCreateResponseJSONRequest = { ...schemas.UHPCreateResponseRequest, properties };
  }
  const definitions = [];
  const operations = [];
  function resolved(s) { return s?.$ref ? schemas[refName(s.$ref)] : s; }
  function type(schema, name) {
    if (!schema || !['$ref','type','enum','const','anyOf','oneOf','allOf','properties','additionalProperties'].some(k => k in schema)) return 'json.RawMessage';
    if (schema.$ref) return refName(schema.$ref);
    if (schema.allOf) {
      const merged = { type: 'object', properties: {}, required: [] };
      for (const part of schema.allOf.map(resolved)) {
        Object.assign(merged.properties, part.properties || {});
        merged.required.push(...(part.required || []));
      }
      return type(merged, name);
    }
    const union = schema.anyOf || schema.oneOf;
    if (union) {
      const values = union.filter(s => s.type !== 'null');
      if (values.length === 1) return '*' + type(values[0], name);
      if (!schemas[name]) schemas[name] = schema;
      return name;
    }
    if (Array.isArray(schema.type)) return type({ anyOf: schema.type.map(t => ({ ...schema, type: t })) }, name);
    if (schema.type === 'null') return '*struct{}';
    if (schema.enum || schema.const !== undefined) {
      if (!schemas[name]) schemas[name] = schema;
      return name;
    }
    if (schema.type === 'string') return schema.format === 'binary' ? '[]byte' : 'string';
    if (schema.type === 'integer') return 'int64';
    if (schema.type === 'number') return 'float64';
    if (schema.type === 'boolean') return 'bool';
    if (schema.type === 'array') return `[]${type(schema.items, `${name}Item`)}`;
    if (schema.properties) {
      if (!schemas[name]) schemas[name] = schema;
      return name;
    }
    if (schema.type === 'object' || schema.additionalProperties) return `map[string]${type(typeof schema.additionalProperties === 'object' ? schema.additionalProperties : {}, `${name}Value`)}`;
    throw new Error(`Unsupported Go schema ${name}: ${JSON.stringify(schema)}`);
  }
  for (const [path, item] of Object.entries(spec.paths)) for (const [verb, op] of Object.entries(item)) {
    if (!op.operationId) continue;
    const params = [...(item.parameters || []), ...(op.parameters || [])].map(p => resolve(spec, p));
    const name = pascal(op.operationId);
    const optionalBody = !!op.requestBody && resolve(spec, op.requestBody)?.required !== true;
    const body = resolve(spec, op.requestBody)?.content;
    const media = body && Object.keys(body)[0];
    const input = op.operationId === 'createResponse' ? 'UHPCreateResponseJSONRequest' : body && type(body[media].schema, `${name}Request`);
    const success = Object.entries(op.responses).find(([status]) => /^2/.test(status))?.[1];
    const content = resolve(spec, success)?.content;
    const responseMedia = content && (content['application/json'] ? 'application/json' : Object.keys(content)[0]);
    const eventSchema = op['x-sdk-event-schema'] || content?.['text/event-stream']?.schema?.['x-event-data-schema'] || content?.['text/event-stream']?.schema;
    const output = responseMedia === 'text/event-stream' ? `*EventStream[${type(eventSchema, `${name}Event`)}]` : content ? responseMedia === 'application/json' ? type(content[responseMedia].schema, `${name}Response`) : '[]byte' : '';
    const options = params.filter(p => p.in !== 'path' && !p['x-sdk-client-option']);
    const optionsName = `${name}Options`;
    if (options.length) schemas[optionsName] = { type: 'object', properties: Object.fromEntries(options.map(p => [p.name, p.schema])), required: options.filter(p => p.required).map(p => p.name) };
    operations.push({ path, verb, op, params, input, optionalBody, media, output, responseMedia, optionsName, options });
  }
  const emitted = new Set();
  while (emitted.size < Object.keys(schemas).length) for (const [name, schema] of Object.entries(schemas)) {
    if (emitted.has(name)) continue;
    emitted.add(name);
    if (name === 'JSONValue') { definitions.push('type JSONValue = json.RawMessage'); continue; }
    const union = schema.anyOf || schema.oneOf;
    if (union && union.filter(s => s.type !== 'null').length > 1) {
      const variants = union.map((s, i) => ({ schema: s, name: `Variant${i + 1}`, type: type(s, `${name}Variant${i + 1}`) }));
      const objectVariants = variants.filter(v => resolved(v.schema)?.properties);
      const decoderVariants = variants.map(v => ({ ...v, selector: (resolved(v.schema)?.required || []).find(key => objectVariants.every(other => other === v || !(key in resolved(other.schema).properties))) })).sort((a, b) => Number(!a.selector) - Number(!b.selector));
      definitions.push(`// ${name} represents the documented alternatives. Set one variant when encoding.\ntype ${name} struct {\n${variants.map(v => `\t${v.name} *${v.type}`).join('\n')}\n}\n\nfunc (v ${name}) MarshalJSON() ([]byte, error) {\n${variants.map(v => `\tif v.${v.name} != nil { return json.Marshal(v.${v.name}) }`).join('\n')}\n\treturn nil, fmt.Errorf("${name}: no variant set")\n}\n\nfunc (v *${name}) UnmarshalJSON(data []byte) error {\n${objectVariants.length ? '\tvar fields map[string]json.RawMessage\n\tif err := json.Unmarshal(data, &fields); err != nil { return err }\n' : ''}${decoderVariants.map(v => {
        const s = resolved(v.schema);
        const condition = s?.type === 'object' || s?.properties ? `${v.selector ? `if fields[${JSON.stringify(v.selector)}] != nil {\n` : ''}\t\tvar decoded ${v.type}\n\t\tif err := json.Unmarshal(data, &decoded); err != nil { return err }\n\t\tv.${v.name} = &decoded\n\t\treturn nil\n${v.selector ? '\t\t}' : ''}` : `var decoded ${v.type}\n\t\tif err := json.Unmarshal(data, &decoded); err == nil { v.${v.name} = &decoded; return nil }`;
        return `\t{\n\t\t${condition}\n\t}`;
      }).join('\n')}\n${resolved(decoderVariants.at(-1).schema)?.properties && !decoderVariants.at(-1).selector ? '' : `\treturn fmt.Errorf("${name}: response matches no documented variant")\n`}}`);
    } else if (schema.properties) {
      const required = new Set(schema.required || []);
      const fieldCounts = new Map();
      const goFields = new Map(Object.keys(schema.properties).map(key => {
        const base = fieldName(key);
        const count = (fieldCounts.get(base) || 0) + 1;
        fieldCounts.set(base, count);
        return [key, base + (count === 1 ? '' : count)];
      }));
      const extraType = schema.additionalProperties && schema.additionalProperties !== false ? type(typeof schema.additionalProperties === 'object' ? schema.additionalProperties : {}, `${name}AdditionalValue`) : null;
      definitions.push(`type ${name} struct {\n${Object.entries(schema.properties).map(([key,value]) => {
        let t = type(value, `${name}${goFields.get(key)}`);
        const optional = !required.has(key);
        if (optional && !t.startsWith('*') && !t.startsWith('[]') && !t.startsWith('map[') && t !== 'json.RawMessage') t = '*' + t;
        return `\t${goFields.get(key)} ${t} \`json:"${key}${optional ? ',omitempty' : ''}"\``;
      }).join('\n')}${extraType ? `\n\tAdditionalProperties map[string]${extraType} \`json:"-"\`` : ''}\n}`);
      if (extraType) definitions.push(`func (v ${name}) MarshalJSON() ([]byte, error) {\n type plain ${name}\n encoded, err := json.Marshal(plain(v))\n if err != nil { return nil, err }\n values := map[string]json.RawMessage{}\n for key, value := range v.AdditionalProperties {\n  raw, err := json.Marshal(value)\n  if err != nil { return nil, err }\n  values[key] = raw\n }\n var known map[string]json.RawMessage\n if err := json.Unmarshal(encoded, &known); err != nil { return nil, err }\n for key, value := range known { values[key] = value }\n return json.Marshal(values)\n}\nfunc (v *${name}) UnmarshalJSON(data []byte) error {\n type plain ${name}\n var decoded plain\n if err := json.Unmarshal(data, &decoded); err != nil { return err }\n var fields map[string]json.RawMessage\n if err := json.Unmarshal(data, &fields); err != nil { return err }\n ${Object.keys(schema.properties).map(key => `delete(fields, ${JSON.stringify(key)})`).join('; ')}\n decoded.AdditionalProperties = map[string]${extraType}{}\n for key, raw := range fields {\n  var value ${extraType}\n  if err := json.Unmarshal(raw, &value); err != nil { return err }\n  decoded.AdditionalProperties[key] = value\n }\n *v = ${name}(decoded)\n return nil\n}`);
    } else if (schema.enum || schema.const !== undefined) {
      const sample = schema.const ?? schema.enum?.find(value => value !== null);
      const underlying = schema.type === 'integer' || Number.isInteger(sample) ? 'int64' : schema.type === 'number' || typeof sample === 'number' ? 'float64' : schema.type === 'boolean' || typeof sample === 'boolean' ? 'bool' : 'string';
      const values = schema.enum || [schema.const];
      definitions.push(`type ${name} ${underlying}\n\nconst (\n${values.filter(v => v !== null).map((v,i) => `\t${name}${pascal(String(v)) || `Value${i}`} ${name} = ${JSON.stringify(v)}`).join('\n')}\n)`);
    } else {
      const t = type(schema, name);
      definitions.push(`type ${name} ${t}`);
    }
  }
  const errorSchemas = [...new Set(operations.flatMap(({op}) => Object.entries(op.responses).filter(([code]) => code === 'default' || /^[45]/.test(code)).flatMap(([,response]) => resolve(spec, response).content?.['application/json']?.schema?.$ref ? [refName(resolve(spec, response).content['application/json'].schema.$ref)] : [])))];
  const errorType = 'APIErrorBody';
  const errorGroups = new Map();
  for (const { op } of operations) {
    const entries = Object.entries(op.responses).filter(([code]) => code === 'default' || /^[45]/.test(code)).map(([code, response]) => [code, resolve(spec, response)?.content?.['application/json']?.schema?.$ref]).filter(([, ref]) => ref).map(([code,ref]) => [code, refName(ref)]);
    const key = JSON.stringify(entries);
    if (!errorGroups.has(key)) errorGroups.set(key, []);
    errorGroups.get(key).push(op.operationId);
  }
  const errorDecoder = `type APIErrorBody interface { isAPIErrorBody() }\ntype InvalidResponseBody struct { Code string; ContentType string; Body string; RawBody []byte; Reason string }\nfunc (InvalidResponseBody) isAPIErrorBody() {}\n${errorSchemas.map(name => `func (${name}) isAPIErrorBody() {}`).join('\n')}\nfunc jsonString(value json.RawMessage) bool { value = bytes.TrimSpace(value); return len(value) > 0 && value[0] == '\"' }\nfunc nonemptyJSONString(value json.RawMessage) bool { var decoded string; return json.Unmarshal(value, &decoded) == nil && decoded != "" }\nfunc matchesErrorBody(schema string, payload []byte) bool {\n var fields map[string]json.RawMessage\n if json.Unmarshal(payload, &fields) != nil { return false }\n switch schema {\n case "UHPErrorEnvelope":\n  var nested map[string]json.RawMessage\n  if json.Unmarshal(fields["error"], &nested) != nil { return false }\n  return nonemptyJSONString(nested["code"]) && jsonString(nested["message"])\n case "DeviceBindingErrorResponse":\n  return nonemptyJSONString(fields["error"]) && jsonString(fields["message"])\n default:\n  return nonemptyJSONString(fields["code"]) && jsonString(fields["message"])\n }\n}\nfunc decodeErrorBody[T APIErrorBody](schema string, payload []byte) (APIErrorBody, error) {\n if !matchesErrorBody(schema, payload) { return nil, fmt.Errorf("invalid error envelope") }\n var body T\n err := json.Unmarshal(payload, &body)\n return body, err\n}\nfunc decodeAPIError(operation string, status int, payload []byte) (APIErrorBody, error) {\n switch operation {\n${[...errorGroups].map(([key, ids]) => {
   const entries = JSON.parse(key);
   const fallback = entries.find(([code]) => code === 'default' || /X/.test(code));
   const exact = entries.filter(([code]) => code !== 'default' && !/X/.test(code));
   return `case ${ids.map(id => JSON.stringify(id)).join(', ')}:\n${exact.map(([code, name]) => ` if status == ${code} { return decodeErrorBody[${name}](${JSON.stringify(name)}, payload) }`).join('\n')}\n${fallback ? ` return decodeErrorBody[${fallback[1]}](${JSON.stringify(fallback[1])}, payload)` : ' break'}`;
 }).join('\n')}\n }\n return nil, fmt.Errorf("BeeOS API %s HTTP %d: undocumented error response", operation, status)\n}\n`;
  const groups = new Map();
  for (const operation of operations) {
    const resource = operation.op['x-sdk-resource'] || 'api';
    if (!groups.has(resource)) groups.set(resource, []);
    groups.get(resource).push(operation);
  }
  const resources = [];
  for (const [resource, ops] of groups) {
    const resourceName = `${pascal(resource)}Resource`;
    let source = `type ${resourceName} struct { client *BeeOSClient }\n`;
    for (const {path, verb, op, params, input, optionalBody, media, output, responseMedia, optionsName, options} of ops) {
      const args = ['ctx context.Context', ...params.filter(p => p.in === 'path').map(p => `${p.name.replace(/[^a-zA-Z0-9]/g,'')} ${type(p.schema, pascal(p.name))}`)];
      if (input) args.push(`input ${optionalBody ? "*" : ""}${input}`);
      if (options.length) args.push(`options ${optionsName}`);
      let route = JSON.stringify(path);
      for (const p of params.filter(p => p.in === 'path')) route = route.replace(`{${p.name}}`, `" + url.PathEscape(fmt.Sprint(${p.name.replace(/[^a-zA-Z0-9]/g,'')})) + "`);
      source += `\nfunc (r *${resourceName}) ${pascal(op['x-sdk-method'] || op.operationId)}(${args.join(', ')}) ${output ? `(${output}, error)` : 'error'} {\n`;
      source += `\tpath := ${route}\n\tquery := url.Values{}\n\theaders := http.Header{}\n`;
      if (output) source += `\tvar output ${output}\n`;
      for (const p of options) {
        let expr = `options.${fieldName(p.name)}`;
        const t = type(p.schema, optionsName + fieldName(p.name));
        const required = p.required;
        if (!required && !t.startsWith('[]') && !t.startsWith('map[')) source += `\tif ${expr} != nil {\n`;
        if (!required && !t.startsWith('[]') && !t.startsWith('map[')) expr = '*' + expr;
        source += `\t${p.in === 'header' ? 'headers' : 'query'}.Set(${JSON.stringify(p.name)}, fmt.Sprint(${expr}))\n`;
        if (!required && !t.startsWith('[]') && !t.startsWith('map[')) source += '\t}\n';
      }
      source += '\tvar body []byte\n';
      if (input) {
        if (media === 'application/json' && optionalBody) source += `\tif input != nil {\n\tencoded, err := json.Marshal(input)\n\tif err != nil { ${output ? 'return output, err' : 'return err'} }\n\tbody = encoded\n\t}\n`;
        else if (media === 'application/json') source += `\tencoded, err := json.Marshal(input)\n\tif err != nil { ${output ? 'return output, err' : 'return err'} }\n\tbody = encoded\n`;
        else if (media === 'multipart/form-data') source += `\tencoded, contentType, err := encodeFileMultipart(input.File)\n\tif err != nil { ${output ? 'return output, err' : 'return err'} }\n\tbody = encoded\n`;
        else source += '\tbody = input\n';
      }
      if (responseMedia === 'text/event-stream') {
        source += `\tresponse, err := r.client.send(ctx, ${JSON.stringify(op.operationId)}, ${JSON.stringify(verb.toUpperCase())}, path, ${JSON.stringify(operationBasePath(op))}, query, headers, body, ${JSON.stringify(media || '')})\n\tif err != nil { return nil, err }\n\treturn &${output.slice(1)}{body: response.Body, reader: bufio.NewReader(response.Body)}, nil\n}\n`;
        source = source.replace(`\tvar output ${output}\n`, '');
        continue;
      }
      source += `\t${output ? "payload" : "_"}, err := r.client.request(ctx, ${JSON.stringify(op.operationId)}, ${JSON.stringify(verb.toUpperCase())}, path, ${JSON.stringify(operationBasePath(op))}, query, headers, body, ${media === 'multipart/form-data' ? 'contentType' : JSON.stringify(media || '')})\n`;
      if (!output) source += '\treturn err\n}\n';
      else source += `\tif err != nil { return output, err }\n${responseMedia !== 'application/json' ? '\treturn payload, nil' : '\terr = json.Unmarshal(payload, &output)\n\treturn output, err'}\n}\n`;
    }
    if (resource === 'responses' && schemas.UHPEvent) {
      source += `\nfunc (r *ResponsesResource) CreateStream(ctx context.Context, input UHPCreateResponseJSONRequest, options CreateResponseOptions) (*UHPEventStream, error) {\n encoded, err := json.Marshal(input)\n if err != nil { return nil, err }\n var body map[string]json.RawMessage\n if err := json.Unmarshal(encoded, &body); err != nil { return nil, err }\n body["stream"] = json.RawMessage("true")\n encoded, err = json.Marshal(body)\n if err != nil { return nil, err }\n headers := http.Header{}\n if options.IdempotencyKey != nil { headers.Set("Idempotency-Key", *options.IdempotencyKey) }\n if options.UHPVersion != nil { headers.Set("UHP-Version", *options.UHPVersion) }\n response, err := r.client.send(ctx, "createResponse", "POST", "/responses", ${JSON.stringify(operationBasePath(ops.find(({op}) => op.operationId === "createResponse").op))}, url.Values{}, headers, encoded, "application/json")\n if err != nil { return nil, err }\n return &UHPEventStream{body: response.Body, reader: bufio.NewReader(response.Body)}, nil\n}\n`;
    }
    resources.push(source);
  }
  return {
    'go/go.mod': 'module github.com/beeos-ai/beeos-cloud-sdks/go/v3\n\ngo 1.23\n',
    'go/client.go': execFileSync('gofmt', { encoding: 'utf8', input: `// Code generated from spec/server.openapi.json; DO NOT EDIT.\npackage beeoscloudsdk\n\nimport (\n "bufio"\n "bytes"\n "context"\n "encoding/json"\n "fmt"\n "io"\n "mime/multipart"\n "net/http"\n "net/url"\n "strings"\n)\n\n${definitions.join('\n\n')}\n\n${errorDecoder}\n\ntype APIError struct { Status int; Body ${errorType} }\nfunc (e *APIError) Error() string { return fmt.Sprintf("BeeOS API returned HTTP %d", e.Status) }\n\ntype BeeOSClient struct {\n baseURL string\n apiKey func() string\n transport *http.Client\n externalUserID string\n${[...groups.keys()].map(r=>` ${pascal(r)} *${pascal(r)}Resource`).join('\n')}\n}\n\nfunc NewBeeOSClient(baseURL string, keyProvider func() string, transport *http.Client) (*BeeOSClient, error) {\n if transport == nil { transport = http.DefaultClient }\n c := &BeeOSClient{baseURL: strings.TrimRight(baseURL, "/"), apiKey: keyProvider, transport: transport}\n c.initResources()\n return c, nil\n}\nfunc (c *BeeOSClient) initResources() {\n${[...groups.keys()].map(r=>` c.${pascal(r)} = &${pascal(r)}Resource{client: c}`).join('\n')}\n}\nfunc (c *BeeOSClient) WithExternalUser(externalUserID string) *BeeOSClient {\n copy := *c\n copy.externalUserID = externalUserID\n copy.initResources()\n return &copy\n}\n\nfunc (c *BeeOSClient) send(ctx context.Context, operation, method, path, basePath string, query url.Values, headers http.Header, body []byte, contentType string) (*http.Response, error) {\n base := c.baseURL\n if basePath != "" {\n  parsed, err := url.Parse(base)\n  if err != nil { return nil, err }\n  parsed.Path, parsed.RawPath, parsed.RawQuery, parsed.Fragment = basePath, "", "", ""\n  base = parsed.String()\n }\n target := base + path\n if len(query) > 0 { target += "?" + query.Encode() }\n request, err := http.NewRequestWithContext(ctx, method, target, bytes.NewReader(body))\n if err != nil { return nil, err }\n request.Header = headers\n request.Header.Set("Authorization", "Bearer " + c.apiKey())\n if c.externalUserID != "" { request.Header.Set("X-BeeOS-External-User-ID", c.externalUserID) }\n if contentType != "" { request.Header.Set("Content-Type", contentType) }\n response, err := c.transport.Do(request)\n if err != nil { return nil, err }\n if response.StatusCode >= 400 {\n  defer response.Body.Close()\n  payload, err := io.ReadAll(response.Body)\n  if err != nil { return nil, err }\n  contentType := response.Header.Get("Content-Type")\n  mediaType := strings.ToLower(strings.TrimSpace(strings.Split(contentType, ";")[0]))\n  invalid := InvalidResponseBody{Code: "invalid_response", ContentType: contentType, Body: string(payload), RawBody: payload, Reason: "non_json_error"}\n  if mediaType != "application/json" && !strings.HasSuffix(mediaType, "+json") { return nil, &APIError{Status: response.StatusCode, Body: invalid} }\n  body, err := decodeAPIError(operation, response.StatusCode, payload)\n  if err != nil {\n   invalid.Reason = "invalid_error_shape"\n   if !json.Valid(payload) { invalid.Reason = "invalid_json_error" }\n   return nil, &APIError{Status: response.StatusCode, Body: invalid}\n  }\n  return nil, &APIError{Status: response.StatusCode, Body: body}\n }\n return response, nil\n}\n\nfunc (c *BeeOSClient) request(ctx context.Context, operation, method, path, basePath string, query url.Values, headers http.Header, body []byte, contentType string) ([]byte, error) {\n response, err := c.send(ctx, operation, method, path, basePath, query, headers, body, contentType)\n if err != nil { return nil, err }\n defer response.Body.Close()\n return io.ReadAll(response.Body)\n}\n\nfunc encodeFileMultipart(file []byte) ([]byte, string, error) {\n var body bytes.Buffer\n writer := multipart.NewWriter(&body)\n part, err := writer.CreateFormFile("file", "audio")\n if err != nil { return nil, "", err }\n if _, err := part.Write(file); err != nil { return nil, "", err }\n if err := writer.Close(); err != nil { return nil, "", err }\n return body.Bytes(), writer.FormDataContentType(), nil\n}\n\ntype StreamEvent interface { ${[...new Set(['UHPEvent', ...operations.filter(op => op.responseMedia === 'text/event-stream').map(op => op.output.slice('*EventStream['.length, -1))])].join(' | ')} }\ntype EventStream[T StreamEvent] struct { body io.ReadCloser; reader *bufio.Reader }\ntype UHPEventStream = EventStream[UHPEvent]\nfunc (s *EventStream[T]) Close() error { return s.body.Close() }\nfunc (s *EventStream[T]) Next() (*T, error) {\n var data []string\n for {\n  line, err := s.reader.ReadString('\\n')\n  line = strings.TrimRight(line, "\\r\\n")\n  if strings.HasPrefix(line, "data:") { data = append(data, strings.TrimPrefix(strings.TrimPrefix(line, "data:"), " ")) }\n  if (line == "" || err == io.EOF) && len(data) > 0 {\n   var event T\n   if decodeErr := json.Unmarshal([]byte(strings.Join(data, "\\n")), &event); decodeErr != nil { return nil, decodeErr }\n   return &event, nil\n  }\n  if err != nil { return nil, err }\n }\n}\n\n${resources.join('\n\n')}\n` }),
  };
}
