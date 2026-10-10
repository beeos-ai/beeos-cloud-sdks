import { resolve } from './common.mjs';
const snake = name => name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
const pascal = name => name.replace(/(^|[^a-zA-Z0-9])([a-z])/g, (_, a, b) => b.toUpperCase());
const operationBasePath = operation => operation.servers?.[0] ? new URL(operation.servers[0].url).pathname : '';
const refName = ref => ref.split('/').pop();
const literal = value => JSON.stringify(value).replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None');

export function generatePython(spec) {
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
  if (schemas.UHPCreateResponseRequest) schemas.UHPCreateResponseJSONRequest = { ...schemas.UHPCreateResponseRequest, properties: { ...schemas.UHPCreateResponseRequest.properties, stream: { type: 'boolean', enum: [false] } } };
  const definitions = [];
  const openDefinitions = new Map();
  const operations = [];
  const inputSchemas = new Set();
  function type(schema, name) {
    if (!schema || !['$ref','type','enum','const','anyOf','oneOf','allOf','properties','additionalProperties'].some(k => k in schema)) return 'JSONValue';
    if (schema.$ref) return refName(schema.$ref);
    if (schema.enum) return `Literal[${schema.enum.map(literal).join(', ')}]`;
    if (schema.const !== undefined) return `Literal[${literal(schema.const)}]`;
    if (schema.anyOf || schema.oneOf) return (schema.anyOf || schema.oneOf).map((s, i) => type(s, `${name}Variant${i + 1}`)).join(' | ');
    if (schema.allOf) {
      const combined = { type: 'object', properties: {}, required: [] };
      for (let part of schema.allOf) {
        if (part.$ref) part = schemas[refName(part.$ref)];
        Object.assign(combined.properties, part.properties || {});
        combined.required.push(...(part.required || []));
      }
      return type(combined, name);
    }
    if (Array.isArray(schema.type)) return schema.type.map(t => type({ ...schema, type: t }, name)).join(' | ');
    if (schema.type === 'null') return 'None';
    if (schema.type === 'string') return schema.format === 'binary' ? 'bytes' : 'str';
    if (schema.type === 'integer') return 'int';
    if (schema.type === 'number') return 'float';
    if (schema.type === 'boolean') return 'bool';
    if (schema.type === 'array') return `list[${type(schema.items, `${name}Item`)}]`;
    if (schema.properties) {
      if (!schemas[name]) schemas[name] = schema;
      return name;
    }
    if (schema.type === 'object' || schema.additionalProperties) return `dict[str, ${type(typeof schema.additionalProperties === 'object' ? schema.additionalProperties : {}, `${name}Value`)}]`;
    throw new Error(`Unsupported Python schema ${name}: ${JSON.stringify(schema)}`);
  }
  for (const [path, item] of Object.entries(spec.paths)) for (const [verb, op] of Object.entries(item)) {
    if (!op.operationId) continue;
    const params = [...(item.parameters || []), ...(op.parameters || [])].map(p => resolve(spec, p));
    const name = pascal(op.operationId);
    const optionalBody = !!op.requestBody && resolve(spec, op.requestBody)?.required !== true;
    const body = resolve(spec, op.requestBody)?.content;
    const media = body && Object.keys(body)[0];
    const input = op.operationId === 'createResponse' ? 'UHPCreateResponseJSONRequest' : body && type(body[media].schema, `${name}Request`);
    if (input && schemas[input]) inputSchemas.add(input);
    const success = Object.entries(op.responses).find(([status]) => /^2/.test(status))?.[1];
    const content = resolve(spec, success)?.content;
    const responseMedia = content && (content['application/json'] ? 'application/json' : Object.keys(content)[0]);
    const eventSchema = op['x-sdk-event-schema'] || content?.['text/event-stream']?.schema?.['x-event-data-schema'] || content?.['text/event-stream']?.schema;
    const output = responseMedia === 'text/event-stream' ? `Iterator[${type(eventSchema, `${name}Event`)}]` : content ? responseMedia === 'application/json' ? type(content[responseMedia].schema, `${name}Response`) : 'bytes' : 'None';
    const optional = params.filter(p => p.in !== 'path' && !p['x-sdk-client-option']);
    const optionsName = `${name}Options`;
    if (optional.length) schemas[optionsName] = { type: 'object', properties: Object.fromEntries(optional.map(p => [p.name, p.schema])), required: optional.filter(p => p.required).map(p => p.name) };
    operations.push({ path, verb, op, params, input, optionalBody, media, output, responseMedia, optionsName, optional });
  }
  const emitted = new Set();
  while (emitted.size < Object.keys(schemas).length) {
    for (const [name, schema] of Object.entries(schemas)) {
      if (emitted.has(name)) continue;
      emitted.add(name);
      if (name === 'JSONValue') continue;
      if (schema.properties) {
        const required = new Set(schema.required || []);
        const fields = Object.entries(schema.properties).map(([key, value]) => {
          const model = resolve(spec, value);
          const knownType = type(value, `${name}${pascal(key)}`);
          let fieldType = knownType;
          if (inputSchemas.has(name) && model.properties && model.additionalProperties && model.additionalProperties !== false) {
            const openName = knownType + 'Open';
            const arguments_ = Object.entries(model.properties).map(([field, fieldSchema]) => {
              const t = type(fieldSchema, `${knownType}${pascal(field)}`);
              return `${snake(field)}: ${t}${(model.required || []).includes(field) ? '' : ' | None = None'}`;
            });
            const assignments = Object.keys(model.properties).map(field => (model.required || []).includes(field) ? `        self[${JSON.stringify(field)}] = ${snake(field)}` : `        if ${snake(field)} is not None:\n            self[${JSON.stringify(field)}] = ${snake(field)}`);
            openDefinitions.set(openName, `class ${openName}(dict[str, JSONValue]):\n    def __init__(self, *, ${arguments_.join(', ')}, **extensions: JSONValue) -> None:\n        super().__init__(extensions)\n${assignments.join('\n')}\n`);
            fieldType = `${knownType} | ${openName}`;
          }
          return `    ${JSON.stringify(key)}: ${JSON.stringify(`${required.has(key) ? 'Required' : 'NotRequired'}[${fieldType}]`)},`;
        });
        definitions.push(`${name} = TypedDict(${JSON.stringify(name)}, {\n${fields.join('\n')}\n})`);
      } else {
        definitions.push(`${name}: TypeAlias = ${JSON.stringify(type(schema, name))}`);
      }
    }
  }
  const errors = [...new Set(operations.flatMap(({op}) => Object.entries(op.responses).filter(([code]) => code === 'default' || /^[45]/.test(code)).flatMap(([,response]) => resolve(spec, response).content?.['application/json']?.schema ? [type(resolve(spec, response).content['application/json'].schema, 'APIErrorBody')] : [])))];
  const errorType = [...errors, 'InvalidResponseBody'].join(' | ');
  const errorSchemas = Object.fromEntries(operations.map(({op}) => [op.operationId, Object.fromEntries(Object.entries(op.responses).filter(([code]) => code === 'default' || /^[45]/.test(code)).flatMap(([code,response]) => {
    const ref = resolve(spec,response)?.content?.['application/json']?.schema?.$ref;
    return ref ? [[code, refName(ref)]] : [];
  }))]));
  const groups = new Map();
  for (const operation of operations) {
    const resource = operation.op['x-sdk-resource'] || 'api';
    if (!groups.has(resource)) groups.set(resource, []);
    groups.get(resource).push(operation);
  }
  const resources = [];
  for (const [resource, ops] of groups) {
    let source = `class ${pascal(resource)}Resource:\n    def __init__(self, client: BeeOSClient) -> None:\n        self._client = client\n`;
    for (const {path, verb, op, params, input, optionalBody, media, output, responseMedia, optionsName, optional} of ops) {
      const args = ['self', ...params.filter(p => p.in === 'path').map(p => `${snake(p.name)}: ${type(p.schema, pascal(p.name))}`)];
      if (input) args.push(`input: ${input}${optionalBody ? " | None = None" : ""}`);
      if (optionalBody && optional.some(p => p.required)) args.push("*");
      if (optional.length) args.push(`options: ${optionsName}${optional.some(p => p.required) ? '' : ' | None = None'}`);
      let route = JSON.stringify(path).replace(/\{([^}]+)\}/g, (_, key) => `{quote(str(${snake(key)}), safe='')}`);
      const prefix = operationBasePath(op);
      source += `\n    def ${snake(op['x-sdk-method'] || op.operationId)}(${args.join(', ')}) -> ${output}:\n`;
      source += `        path = f${route}\n        query: dict[str, str] = {}\n        headers: dict[str, str] = {}\n`;
      if (optional.length) {
        source += `        opts = options${optional.some(p => p.required) ? '' : ' if options is not None else {}'}\n`;
        for (const p of optional) source += `        if ${JSON.stringify(p.name)} in opts:\n            ${p.in === 'header' ? 'headers' : 'query'}[${JSON.stringify(p.name)}] = str(opts[${JSON.stringify(p.name)}])${resolve(spec, p.schema)?.type === 'boolean' ? '.lower()' : ''}\n`;
      }
      const bodyExpr = !input ? 'None' : media === 'application/json' ? optionalBody ? 'json.dumps(input).encode() if input is not None else None' : 'json.dumps(input).encode()' : media === 'multipart/form-data' ? 'multipart_body' : 'input';
      if (media === 'multipart/form-data') source += `        multipart_body, content_type = self._client._multipart(input["file"])\n`;
      if (responseMedia === 'text/event-stream') {
        source += `        return cast(${JSON.stringify(output)}, self._client._stream(${JSON.stringify(op.operationId)}, ${JSON.stringify(verb.toUpperCase())}, path, ${JSON.stringify(prefix)}, query, headers, ${bodyExpr}, ${JSON.stringify(media || '')}))\n`;
        continue;
      }
      source += `        payload = self._client._request(${JSON.stringify(op.operationId)}, ${JSON.stringify(verb.toUpperCase())}, path, ${JSON.stringify(prefix)}, query, headers, ${bodyExpr}, ${media === 'multipart/form-data' ? 'content_type' : JSON.stringify(media || '')})\n`;
      source += output === 'None' ? '        return None\n' : responseMedia !== 'application/json' ? '        return payload\n' : `        return cast(${JSON.stringify(output)}, json.loads(payload))\n`;
    }
    if (resource === 'responses' && schemas.UHPEvent) {
      source += `\n    def create_stream(self, input: UHPCreateResponseRequest, options: CreateResponseOptions | None = None) -> Iterator[UHPEvent]:\n        body: UHPCreateResponseRequest = {**input, "stream": True}\n        headers: dict[str, str] = {}\n        if options is not None:\n            headers.update({key: str(value) for key, value in options.items()})\n        return cast(Iterator[UHPEvent], self._client._stream("createResponse", "POST", "/responses", ${JSON.stringify(operationBasePath(ops.find(({op}) => op.operationId === "createResponse").op))}, {}, headers, json.dumps(body).encode(), "application/json"))\n`;
    }
    resources.push(source);
  }
  const runtime = `# Generated from spec/server.openapi.json; do not edit.\nfrom __future__ import annotations\n\nimport json\nfrom collections.abc import Callable, Iterator\nfrom typing import Literal, NotRequired, Required, TypeAlias, TypedDict, cast\nfrom http.client import HTTPResponse\nfrom urllib.error import HTTPError\nfrom urllib.parse import quote, urlencode, urlsplit, urlunsplit\nfrom urllib.request import Request as URLRequest, urlopen\nfrom uuid import uuid4\n\nJSONValue: TypeAlias = None | bool | int | float | str | list["JSONValue"] | dict[str, "JSONValue"]\n\n${definitions.join('\n\n')}\n\n${[...openDefinitions.values()].join('\n\n')}\n\nclass InvalidResponseBody(TypedDict):\n    code: Literal["invalid_response"]\n    content_type: str\n    body: str\n    raw_body: bytes\n    reason: str\n\n_ERROR_SCHEMAS: dict[str, dict[str, str]] = ${JSON.stringify(errorSchemas)}\n\ndef _matches_error_body(schema: str | None, value: JSONValue) -> bool:\n    if not isinstance(value, dict):\n        return False\n    if schema == "UHPErrorEnvelope":\n        nested = value.get("error")\n        return isinstance(nested, dict) and isinstance(nested.get("code"), str) and nested.get("code") != "" and isinstance(nested.get("message"), str)\n    if schema == "DeviceBindingErrorResponse":\n        return isinstance(value.get("error"), str) and value.get("error") != "" and isinstance(value.get("message"), str)\n    return schema == "ErrorResponse" and isinstance(value.get("code"), str) and value.get("code") != "" and isinstance(value.get("message"), str)\n\nclass APIError(Exception):\n    def __init__(self, status: int, body: ${errorType}) -> None:\n        self.status = status\n        self.body = body\n        super().__init__(f"BeeOS API returned HTTP {status}")\n\nclass BeeOSClient:\n    def __init__(self, base_url: str, api_key: str | Callable[[], str], *, external_user_id: str | None = None, timeout: float = 30.0) -> None:\n        self.base_url = base_url.rstrip("/")\n        self.api_key = api_key\n        self.external_user_id = external_user_id\n        self.timeout = timeout\n${[...groups.keys()].map(r => `        self.${snake(r)} = ${pascal(r)}Resource(self)`).join('\n')}\n\n    def with_external_user(self, external_user_id: str) -> BeeOSClient:\n        return BeeOSClient(self.base_url, self.api_key, external_user_id=external_user_id, timeout=self.timeout)\n\n    def _request(self, operation: str, method: str, path: str, base_path: str, query: dict[str, str], headers: dict[str, str], body: bytes | None, content_type: str) -> bytes:\n        base = self.base_url\n        if base_path:\n            parts = urlsplit(base)\n            base = urlunsplit((parts.scheme, parts.netloc, base_path, "", ""))\n        target = base + path\n        if query:\n            target += "?" + urlencode(query)\n        key = self.api_key() if callable(self.api_key) else self.api_key\n        headers["Authorization"] = "Bearer " + key\n        if self.external_user_id is not None:\n            headers["X-BeeOS-External-User-ID"] = self.external_user_id\n        if content_type:\n            headers["Content-Type"] = content_type\n        request = URLRequest(target, data=body, headers=headers, method=method)\n        with self._open(request, operation) as response:\n            return response.read()\n\n    def _open(self, request: URLRequest, operation: str) -> HTTPResponse:\n        try:\n            return cast(HTTPResponse, urlopen(request, timeout=self.timeout))\n        except HTTPError as error:\n            with error:\n                payload = error.read()\n                content_type = error.headers.get("Content-Type", "")\n                media_type = content_type.split(";", 1)[0].strip().lower()\n                invalid = InvalidResponseBody(code="invalid_response", content_type=content_type, body=payload.decode("utf-8", errors="replace"), raw_body=payload, reason="non_json_error")\n                body: ${errorType} = invalid\n                if media_type == "application/json" or media_type.endswith("+json"):\n                    try:\n                        candidate = cast(JSONValue, json.loads(payload))\n                    except (json.JSONDecodeError, UnicodeDecodeError):\n                        invalid["reason"] = "invalid_json_error"\n                    else:\n                        schemas = _ERROR_SCHEMAS[operation]\n                        schema = schemas.get(str(error.code), schemas.get(f"{error.code // 100}XX", schemas.get("default")))\n                        if _matches_error_body(schema, candidate):\n                            body = cast(${JSON.stringify(errorType)}, candidate)\n                        else:\n                            invalid["reason"] = "invalid_error_shape"\n            raise APIError(error.code, body) from error\n\n    @staticmethod\n    def _multipart(file: bytes) -> tuple[bytes, str]:\n        boundary = uuid4().hex\n        prefix = (f'--{boundary}\\r\\nContent-Disposition: form-data; name="file"; filename="audio"\\r\\nContent-Type: application/octet-stream\\r\\n\\r\\n').encode()\n        suffix = f"\\r\\n--{boundary}--\\r\\n".encode()\n        return prefix + file + suffix, f"multipart/form-data; boundary={boundary}"\n\n    def _stream(self, operation: str, method: str, path: str, base_path: str, query: dict[str, str], headers: dict[str, str], body: bytes | None, content_type: str) -> Iterator[JSONValue]:\n        parts = urlsplit(self.base_url)\n        target = urlunsplit((parts.scheme, parts.netloc, (base_path or parts.path.rstrip("/")) + path, urlencode(query), ""))\n        key = self.api_key() if callable(self.api_key) else self.api_key\n        headers["Authorization"] = "Bearer " + key\n        if content_type:\n            headers["Content-Type"] = content_type\n        if self.external_user_id is not None:\n            headers["X-BeeOS-External-User-ID"] = self.external_user_id\n        request = URLRequest(target, data=body, headers=headers, method=method)\n        with self._open(request, operation) as response:\n            data: list[str] = []\n            for raw in response:\n                line = raw.decode().rstrip("\\r\\n")\n                if line == "":\n                    if data:\n                        yield cast(JSONValue, json.loads("\\n".join(data)))\n                        data = []\n                elif line.startswith("data:"):\n                    data.append(line[5:].removeprefix(" "))\n            if data:\n                yield cast(JSONValue, json.loads("\\n".join(data)))\n\n${resources.join('\n\n')}\n`;
  return {
    'python/beeos_cloud_sdk/__init__.py': runtime,
    'python/beeos_cloud_sdk/py.typed': '',
    'python/pyproject.toml': '[build-system]\nrequires = ["setuptools>=77"]\nbuild-backend = "setuptools.build_meta"\n\n[project]\nname = "beeos-cloud-sdk"\nversion = "3.0.0"\ndescription = "Typed BeeOS Cloud Server API client"\nrequires-python = ">=3.11"\nlicense = "MIT"\nauthors = [{name = "BeeOS"}]\nreadme = {text = "Typed BeeOS Cloud Server SDK. BeeOSClient(base_url, api_key, timeout=30.0) uses a 30-second timeout; with_external_user retains it. Development: install the dev extra (mypy==2.4.0); run mypy --strict --python-version 3.11 beeos_cloud_sdk examples/typed_smoke.py. No request retries.", content-type = "text/markdown"}\n\n[project.urls]\nHomepage = "https://github.com/beeos-ai/beeos-cloud-sdks"\nRepository = "https://github.com/beeos-ai/beeos-cloud-sdks"\nIssues = "https://github.com/beeos-ai/beeos-cloud-sdks/issues"\n\n[project.optional-dependencies]\ndev = ["mypy==2.4.0"]\n\n[tool.setuptools.package-data]\nbeeos_cloud_sdk = ["py.typed"]\n',
  };
}
