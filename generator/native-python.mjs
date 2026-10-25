import {operations, resolve, pascal} from './common.mjs';

const snake = value => value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
const identifier = value => /^[A-Za-z_]\w*$/.test(value) ? value : `Model${pascal(value)}`;
const pyLiteral = value => value === null ? 'None' : value === true ? 'True' : value === false ? 'False' : JSON.stringify(value);

export function generateNativePython(spec) {
  const schemas = spec.components.schemas;
  const names = new Map(Object.keys(schemas).map(name => [name, identifier(name)]));
  const definitions = new Map();
  const aliases = new Map();
  const used = new Set(names.values());
  function fresh(hint) {
    let name = identifier(hint), suffix = 2;
    while (used.has(name)) name = identifier(hint) + suffix++;
    used.add(name);
    return name;
  }
  function objectShape(schema, seen = new Set()) {
    if (schema?.$ref) {
      if (seen.has(schema.$ref)) return null;
      return objectShape(resolve(spec, schema), new Set([...seen, schema.$ref]));
    }
    let found = schema?.type === 'object' || schema?.properties;
    const properties = {...schema?.properties};
    const required = new Set(schema?.required || []);
    for (const part of schema?.allOf || []) {
      const object = objectShape(part, seen);
      if (object) {
        found = true;
        Object.assign(properties, object.properties);
        object.required.forEach(name => required.add(name));
      }
    }
    return found ? {properties, required, additionalProperties: schema.additionalProperties} : null;
  }
  function type(schema, hint) {
    if (!schema || schema === true) return 'JSONValue';
    if (schema === false) return 'Never';
    if (schema.$ref) return names.get(schema.$ref.split('/').pop());
    if (schema.const !== undefined) return `Literal[${pyLiteral(schema.const)}]`;
    if (schema.enum) return `Literal[${schema.enum.map(pyLiteral).join(', ')}]`;
    if (schema.oneOf || schema.anyOf) return [...new Set((schema.oneOf || schema.anyOf).map((part, i) => type(part, `${hint}Variant${i + 1}`)))].join(' | ');
    const object = objectShape(schema);
    if (object) {
      if (!Object.keys(object.properties).length && schema.additionalProperties !== false) return `dict[str, ${typeof schema.additionalProperties === 'object' ? type(schema.additionalProperties, `${hint}Value`) : 'JSONValue'}]`;
      const name = fresh(hint);
      define(name, schema);
      return name;
    }
    if (Array.isArray(schema.type)) return schema.type.map(t => type({...schema, type: t}, hint)).join(' | ');
    if (schema.type === 'array') return `list[${type(schema.items, `${hint}Item`)}]`;
    if (schema.type === 'integer') return 'int';
    if (schema.type === 'number') return 'float';
    if (schema.type === 'boolean') return 'bool';
    if (schema.type === 'null') return 'None';
    if (schema.type === 'string') return schema.format === 'binary' ? 'bytes' : 'str';
    return 'JSONValue';
  }
  function define(name, schema) {
    if (definitions.has(name)) return;
    definitions.set(name, '');
    const object = objectShape(schema);
    if (object && (Object.keys(object.properties).length || schema.additionalProperties === false)) {
      const fields = Object.entries(object.properties).map(([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(`${object.required.has(key) ? 'Required' : 'NotRequired'}[${type(value, name + pascal(key))}]`)},`);
      definitions.set(name, `${name} = TypedDict(${JSON.stringify(name)}, {\n${fields.join('\n')}\n})`);
    } else {
      const value = schema.$ref ? names.get(schema.$ref.split('/').pop()) : type(schema, name + 'Value');
      aliases.set(name, value);
    }
  }
  for (const [name, schema] of Object.entries(schemas)) define(names.get(name), schema);
  const ops = operations(spec).map(op => {
    const optionsName = op['x-sdk-options-type'] || pascal(op.operationId) + 'Options';
    const params = op.parameters.filter(p => p.in !== 'path');
    const fields = params.filter(p => p.name !== 'Idempotency-Key').map(p => `    ${snake(p.name)}: ${p.required ? 'Required' : 'NotRequired'}[${type(p.schema, optionsName + pascal(p.name))}]`);
    definitions.set(optionsName, `class ${optionsName}(NativeRequestOptions, total=False):\n${fields.join('\n') || '    pass'}`);
    const content = resolve(spec, op.requestBody)?.content || {};
    const inputMedia = Object.keys(content)[0] || '';
    const input = inputMedia ? type(content[inputMedia].schema, pascal(op.operationId) + 'Body') : null;
    const success = Object.entries(op.responses).find(([code]) => /^2/.test(code));
    const outputContent = resolve(spec, success[1]).content || {};
    const outputMedia = Object.keys(outputContent)[0] || '';
    const output = outputMedia ? type(outputContent[outputMedia].schema, pascal(op.operationId) + 'Result') : 'None';
    return {...op, optionsName, params, inputMedia, input, outputMedia, output, requiredBody: resolve(spec, op.requestBody)?.required, requiredOptions: params.some(p => p.required && p.name !== 'Idempotency-Key')};
  });
  const groups = new Map();
  for (const op of ops) {
    const resource = op['x-sdk-resource'].split('.').map(snake).join('.');
    if (!groups.has(resource)) groups.set(resource, []);
    groups.get(resource).push(op);
  }
  // Parents own concrete nested resources, rather than a public untyped dispatcher.
  for (const resource of [...groups.keys()]) {
    const parts = resource.split('.');
    for (let i = 1; i < parts.length; ++i) {
      const parent = parts.slice(0, i).join('.');
      if (!groups.has(parent)) groups.set(parent, []);
    }
  }
  const resourceName = (resource, async) => `${async ? 'Async' : ''}Native${pascal(resource)}Resource`;
  const classes = [];
  for (const async of [false, true]) {
    for (const [resource, methods] of groups) {
      const children = [...groups.keys()].filter(child => child.startsWith(resource + '.') && child.split('.').length === resource.split('.').length + 1);
      let source = `class ${resourceName(resource, async)}:\n    def __init__(self, client: ${async ? 'Async' : ''}NativeBeeOSClient) -> None:\n        self._client = client\n`;
      for (const child of children) source += `        self.${child.split('.').pop()} = ${resourceName(child, async)}(client)\n`;
      if (resource === 'sandboxes') {
        source += `        self.pty = ${async ? 'Async' : ''}NativePTYResource(client)\n        self.desktop = ${async ? 'Async' : ''}NativeDesktopResource(client)\n`;
      }
      for (const op of methods) {
        const args = ['self', ...op.parameters.filter(p => p.in === 'path').map(p => `${snake(p.name)}: str`)];
        if (op.input) args.push(`body: ${op.input}${op.requiredBody ? '' : ' | None = None'}`);
        if (op.input && !op.requiredBody && op.requiredOptions) args.push('*');
        args.push(`options: ${op.optionsName}${op.requiredOptions ? '' : ' | None = None'}`);
        const streamType = `${async ? 'Async' : ''}EventStream[${op.output}]`;
        const output = op.outputMedia === 'text/event-stream' ? streamType : `BeeOSHTTPResponse[${op.outputMedia === 'application/octet-stream' ? 'bytes' : op.output}]`;
        const pathParams = op.parameters.filter(p => p.in === 'path').map(p => `${JSON.stringify(p.name)}: ${snake(p.name)}`).join(', ');
        const eventFilter = op.operationId === 'streamNativeResponseEvents' ? ', _NATIVE_RESPONSE_EVENT_TYPES' : '';
        source += `\n    ${async ? 'async ' : ''}def ${op['x-sdk-python-method'] || snake(op['x-sdk-method'] || op.operationId)}(${args.join(', ')}) -> ${output}:\n        return cast(${JSON.stringify(output)}, ${async ? 'await ' : ''}self._client._execute(_OPERATIONS[${JSON.stringify(op.operationId)}], {${pathParams}}, ${op.input ? 'body' : 'None'}, options${eventFilter}))\n`;
      }
      if (resource === 'responses') {
        source += `\n    ${async ? 'async ' : ''}def create_stream(self, body: NativeResponseCreate, options: CreateNativeResponseOptions | None = None) -> ${async ? 'Async' : ''}ResponseStream:\n        accepted = ${async ? 'await ' : ''}self.create(body, options)\n        response_id = accepted.body["data"]["id"]\n        try:\n            events = ${async ? 'await ' : ''}self.events(response_id, _event_options(options))\n        except SDKTransportError as error:\n            raise type(error)(cast(OperationContext, accepted.operation_context)) from error\n        except BeeOSAPIError as error:\n            error.acceptance = accepted.acceptance\n            error.operation_context = accepted.operation_context\n            raise\n        return ${async ? 'Async' : ''}ResponseStream(response_id, events, accepted)\n`;
      }
      classes.push(source);
    }
  }
  const eventTypes = (() => {
    const types = [];
    for (const variant of spec.components.schemas.NativeResponseEvent.oneOf ?? []) {
      const type = variant.properties?.type;
      if (typeof type?.const === 'string') types.push(type.const);
      for (const value of type?.enum ?? []) types.push(value);
    }
    return [...new Set(types)];
  })();
  const metadata = ops.map(op => `    ${JSON.stringify(op.operationId)}: _Operation(${JSON.stringify(op.operationId)}, ${JSON.stringify(op.method)}, ${JSON.stringify(op.path)}, ${JSON.stringify(op.inputMedia)}, ${JSON.stringify(op.outputMedia)}, ${op['x-sdk-wait-default'] ? 'True' : 'False'}, (${op.params.map(p => `(${JSON.stringify(snake(p.name))}, ${JSON.stringify(p.name)}, ${JSON.stringify(p.in)}, ${p.required ? 'True' : 'False'})`).join(', ')}${op.params.length === 1 ? ',' : ''})),`).join('\n');
  const roots = [...groups.keys()].filter(resource => !resource.includes('.'));
  const aliasDefinitions = [];
  const remainingAliases = new Map(aliases);
  while (remainingAliases.size) {
    const ready = [...remainingAliases].filter(([name, value]) => {
      const references = value.replace(/"(?:[^"\\]|\\.)*"/g, '').match(/\b[A-Za-z_]\w*\b/g) || [];
      return !references.some(reference => reference !== name && remainingAliases.has(reference));
    });
    if (!ready.length) throw new Error('Cyclic native Python type aliases');
    for (const [name, value] of ready) {
      aliasDefinitions.push(`${name}: TypeAlias = ${value}`);
      remainingAliases.delete(name);
    }
  }
  let runtime = RUNTIME.replace('/*NATIVE_RESPONSE_EVENT_TYPES*/', eventTypes.map(value => JSON.stringify(value)).join(', ')).replace('@@MODELS@@', [...definitions.values(), ...aliasDefinitions].filter(Boolean).join('\n\n')).replace('@@METADATA@@', metadata).replace('@@RESOURCES@@', classes.join('\n\n'));
  runtime = runtime.replace('@@SYNC_ROOTS@@', roots.map(resource => `        self.${resource} = ${resourceName(resource, false)}(self)`).join('\n')).replace('@@ASYNC_ROOTS@@', roots.map(resource => `        self.${resource} = ${resourceName(resource, true)}(self)`).join('\n'));
  return {'python/beeos_cloud_sdk/native.py': runtime};
}

const RUNTIME = String.raw`# Generated from spec/native.openapi.json by native-python.mjs; do not edit.
from __future__ import annotations

# Modeled NativeResponseEvent type set; unknown future types are skipped, never fatal.
_NATIVE_RESPONSE_EVENT_TYPES = frozenset({/*NATIVE_RESPONSE_EVENT_TYPES*/})

import asyncio
import json
import time
from collections.abc import AsyncIterator, Callable, Iterator, Mapping
from dataclasses import dataclass
from typing import Generic, Literal, Never, NotRequired, Required, TypeAlias, TypeVar, TypedDict, cast
from urllib.parse import quote, urlsplit, urlunsplit
from uuid import uuid4

import httpx
from websockets.asyncio.client import ClientConnection as AsyncWebSocket, connect as async_ws_connect
from websockets.sync.client import ClientConnection as WebSocket, connect as sync_ws_connect
from websockets.typing import Origin, Subprotocol

JSONValue: TypeAlias = None | bool | int | float | str | list["JSONValue"] | dict[str, "JSONValue"]
BinaryStream: TypeAlias = bytes
T = TypeVar("T")

@dataclass(frozen=True)
class HTTPHeaders(Mapping[str, str]):
    raw: httpx.Headers

    def __getitem__(self, key: str) -> str:
        return self.raw["x-request-id" if key == "request_id" else key.replace("_", "-")]

    def __iter__(self) -> Iterator[str]:
        return iter(self.raw)

    def __len__(self) -> int:
        return len(self.raw)

    @property
    def request_id(self) -> str | None:
        return cast(str | None, self.raw.get("x-request-id"))

    @property
    def etag(self) -> str | None:
        return cast(str | None, self.raw.get("etag"))

    @property
    def location(self) -> str | None:
        return cast(str | None, self.raw.get("location"))

    @property
    def should_retry(self) -> bool | None:
        value = self.raw.get("should-retry")
        return None if value is None else value.lower() == "true"

    @property
    def retry_after(self) -> str | None:
        return cast(str | None, self.raw.get("retry-after"))

@dataclass(frozen=True)
class Acceptance:
    status: int
    resource_id: str | None
    etag: str | None
    request_id: str | None
    idempotency_key: str

@dataclass(frozen=True)
class BeeOSHTTPResponse(Generic[T]):
    status: int
    body: T
    headers: HTTPHeaders
    acceptance: Acceptance | None = None
    raw_body: bytes = b""
    operation_context: OperationContext | None = None

@dataclass
class OperationContext:
    """Keep this per operation to recover an accepted intent after local cancellation."""
    operation_id: str | None = None
    idempotency_key: str | None = None
    acceptance: Acceptance | None = None
    last_response: BeeOSHTTPResponse[object] | None = None

class NativeRequestOptions(TypedDict, total=False):
    idempotency_key: str
    request_timeout_seconds: float
    wait_timeout_seconds: float
    poll_interval_seconds: float
    wait: bool
    on_progress: Callable[[BeeOSHTTPResponse[object]], None]
    context: OperationContext

@@MODELS@@

class BeeOSAPIError(Exception):
    def __init__(self, response: BeeOSHTTPResponse[object], context: OperationContext | None = None) -> None:
        envelope = response.body
        normalized = envelope.get("error", envelope) if isinstance(envelope, dict) else {}
        normalized = normalized if isinstance(normalized, dict) else {}
        details = normalized.get("details")
        details = details if isinstance(details, dict) else {}
        self.http_status = response.status
        self.status = response.status
        self.raw_envelope = envelope
        self.raw_body = response.raw_body
        self.headers = response.headers
        self.code: str | None = cast(str | None, normalized.get("code"))
        self.reason: str | None = cast(str | None, normalized.get("reason") or details.get("reason"))
        self.request_id: str | None = response.headers.request_id or cast(str | None, normalized.get("request_id"))
        self.should_retry: bool | None = response.headers.should_retry
        if self.should_retry is None:
            self.should_retry = cast(bool | None, normalized.get("should_retry"))
        self.retry_after: str | int | None = response.headers.retry_after or cast(int | None, normalized.get("retry_after"))
        self.operation_context = context
        self.acceptance = context.acceptance if context else None
        super().__init__(f"BeeOS API returned HTTP {response.status}: {self.code or 'http_error'}")

class SDKWaitTimeout(TimeoutError):
    def __init__(self, context: OperationContext) -> None:
        self.operation_context = context
        self.acceptance = context.acceptance
        self.last_response = context.last_response
        self.idempotency_key = context.idempotency_key
        super().__init__("BeeOS local wait deadline elapsed; recover the same intent or observe its resource")

class SDKWaitError(RuntimeError):
    def __init__(self, reason: str, context: OperationContext) -> None:
        self.reason = reason
        self.operation_context = context
        self.acceptance = context.acceptance
        self.last_response = context.last_response
        self.idempotency_key = context.idempotency_key
        super().__init__(f"BeeOS wait stopped: {reason}")

class SDKTransportError(RuntimeError):
    """Local I/O failed; the original intent may already have been accepted."""
    def __init__(self, context: OperationContext) -> None:
        self.operation_context = context
        self.acceptance = context.acceptance
        self.last_response = context.last_response
        self.idempotency_key = context.idempotency_key
        super().__init__("BeeOS transport failed; recover the same intent or observe its resource")

class SDKRequestTimeout(SDKTransportError):
    """One local HTTP request timed out; this is not remote cancellation."""

@dataclass(frozen=True)
class _Operation:
    operation_id: str
    method: str
    path: str
    input_media: str
    output_media: str
    wait_default: bool
    parameters: tuple[tuple[str, str, str, bool], ...]

_OPERATIONS: dict[str, _Operation] = {
@@METADATA@@
}

@dataclass
class _Call:
    operation: _Operation
    url: str
    query: list[tuple[str, str]]
    headers: dict[str, str]
    content: bytes | None
    context: OperationContext
    deadline: float | None
    request_timeout: float
    options: Mapping[str, object]

    def remaining(self) -> float | None:
        if self.deadline is None:
            return None
        value = self.deadline - time.monotonic()
        if value <= 0:
            raise SDKWaitTimeout(self.context)
        return value

    def timeout(self) -> float:
        remaining = self.remaining()
        return self.request_timeout if remaining is None else min(self.request_timeout, remaining)

def _data(response: BeeOSHTTPResponse[object]) -> dict[str, object]:
    body = response.body
    data = body.get("data") if isinstance(body, dict) else None
    return cast(dict[str, object], data) if isinstance(data, dict) else {}

def _resource_id(data: Mapping[str, object]) -> str | None:
    receipt = data.get("receipt")
    value = data.get("id") or (receipt.get("receipt_id") if isinstance(receipt, dict) else None)
    return value if isinstance(value, str) else None

def _capture_acceptance(raw: httpx.Response, call: _Call, resource_id: str | None = None) -> None:
    if not 200 <= raw.status_code < 300 or raw.request.method == "GET" or not call.context.idempotency_key:
        return
    accepted = call.context.acceptance
    if accepted is None:
        call.context.acceptance = Acceptance(raw.status_code, resource_id, raw.headers.get("etag"), raw.headers.get("x-request-id"), call.context.idempotency_key)
    elif accepted.resource_id is None and resource_id is not None:
        call.context.acceptance = Acceptance(accepted.status, resource_id, accepted.etag, accepted.request_id, accepted.idempotency_key)

def _response(raw: httpx.Response, content: bytes, call: _Call) -> BeeOSHTTPResponse[object]:
    media = raw.headers.get("content-type", "").split(";", 1)[0].strip().lower()
    body: object = None if raw.status_code == 204 else content
    if content and (media == "application/json" or media.endswith("+json")):
        try:
            body = json.loads(content)
        except (json.JSONDecodeError, UnicodeDecodeError):
            # Preserve malformed error bytes in the same public HTTP error.
            if 200 <= raw.status_code < 300:
                call.context.last_response = BeeOSHTTPResponse(raw.status_code, content, HTTPHeaders(raw.headers), call.context.acceptance, content)
                raise
    headers = HTTPHeaders(raw.headers)
    _capture_acceptance(raw, call, _resource_id(_data(BeeOSHTTPResponse(raw.status_code, body, headers))))
    result = BeeOSHTTPResponse(raw.status_code, body, headers, call.context.acceptance, content, call.context)
    call.context.last_response = result
    if not 200 <= raw.status_code < 300:
        raise BeeOSAPIError(result, call.context)
    return result

def _event_options(options: NativeRequestOptions | None) -> StreamNativeResponseEventsOptions:
    result: StreamNativeResponseEventsOptions = {}
    if options is not None and "request_timeout_seconds" in options:
        result["request_timeout_seconds"] = options["request_timeout_seconds"]
    return result

def _wait_path(call: _Call, first: BeeOSHTTPResponse[object]) -> str | None:
    if not call.options.get("wait", call.operation.wait_default):
        return None
    op = call.operation.operation_id
    data = _data(first)
    resource_id = _resource_id(data)
    if op in ("createSandbox", "resumeSandbox") and resource_id:
        return "/v1/sandboxes/" + quote(resource_id, safe="")
    if op == "runSandboxCommand" and resource_id:
        return urlsplit(call.url).path + "/" + quote(resource_id, safe="")
    if op in ("createNativeAgent", "updateNativeAgent") and resource_id:
        publication = data.get("publication")
        if isinstance(publication, dict) and publication.get("changed_components") == []:
            return None
        return "/v2/agents/" + quote(resource_id, safe="")
    if op in ("rememberNativeMemory", "correctNativeMemory") and resource_id:
        # The State receipt is the existing authority, not a new generic operation.
        return urlsplit(call.url).path.split("/memory", 1)[0] + "/memory/receipts/" + quote(resource_id, safe="")
    return None

def _wait_done(call: _Call, first: BeeOSHTTPResponse[object], current: BeeOSHTTPResponse[object]) -> bool:
    data = _data(current)
    op = call.operation.operation_id
    if op in ("createSandbox", "resumeSandbox"):
        if data.get("status") in ("error", "unknown", "terminated"):
            raise SDKWaitError("sandbox_" + str(data.get("status")), call.context)
        return data.get("status") == "running"
    if op == "runSandboxCommand":
        return data.get("state") in ("completed", "unknown")
    if op in ("rememberNativeMemory", "correctNativeMemory"):
        completion = data.get("completion")
        if completion in ("failed", "blocked", "unknown"):
            raise SDKWaitError("memory_" + str(completion), call.context)
        return completion in ("durable", "recallable")
    if op in ("createNativeAgent", "updateNativeAgent"):
        initial = _data(first)
        publication = data.get("publication")
        initial_publication = initial.get("publication")
        if not isinstance(publication, dict) or not isinstance(initial_publication, dict):
            raise SDKWaitError("missing_publication", call.context)
        revision = initial_publication.get("accepted_config_revision")
        if publication.get("accepted_config_revision") != revision or data.get("desired_config_revision") != revision:
            raise SDKWaitError("publication_superseded", call.context)
        configuration = data.get("configuration")
        initial_configuration = initial.get("configuration")
        sandbox = initial_configuration.get("sandbox") if isinstance(initial_configuration, dict) else None
        if not isinstance(configuration, dict) or configuration.get("sandbox") != sandbox:
            raise SDKWaitError("sandbox_superseded", call.context)
        state = publication.get("state")
        if state in ("failed", "partial", "unknown", "superseded"):
            raise SDKWaitError("publication_" + str(state), call.context)
        # Recipe/no-placement, paused managed targets and metadata-only writes stay deferred.
        if state == "deferred":
            return True
        if state != "ready":
            return False
        if isinstance(sandbox, dict) and "template_id" in sandbox:
            return True
        binding = data.get("binding")
        if not isinstance(binding, dict) or binding.get("prepared_config_revision") != revision:
            return False
        if isinstance(sandbox, dict) and "id" in sandbox and binding.get("sandbox_id") != sandbox.get("id"):
            return False
        # Ready is the server's verified publication projection. Credential revisions may
        # legitimately be older when unchanged; Session Persona revisions are independent.
        return True
    return True

def _notify(call: _Call, response: BeeOSHTTPResponse[object], previous: object) -> object:
    if response.body != previous:
        callback = call.options.get("on_progress")
        if callable(callback):
            callback(response)
    return response.body

class _ClientBase:
    def _configure(self, base_url: str, api_key: str | Callable[[], str], request_timeout_seconds: float, wait_timeout_seconds: float) -> None:
        parts = urlsplit(base_url)
        if parts.scheme not in ("http", "https") or not parts.netloc or parts.username or parts.password or parts.query or parts.fragment:
            raise ValueError("base_url must be an HTTP(S) origin or API URL without credentials/query")
        self.base_url = urlunsplit((parts.scheme, parts.netloc, "", "", ""))
        self.api_key = api_key
        self.request_timeout_seconds = request_timeout_seconds
        self.wait_timeout_seconds = wait_timeout_seconds
        self.last_operation: OperationContext | None = None

    def _prepare(self, operation: _Operation, path_params: Mapping[str, str], body: object, options: Mapping[str, object] | None) -> _Call:
        opts: Mapping[str, object] = options or {}
        context = cast(OperationContext, opts.get("context") or OperationContext())
        if context.operation_id not in (None, operation.operation_id):
            raise ValueError("OperationContext belongs to a different operation")
        context.operation_id = operation.operation_id
        self.last_operation = context
        path = operation.path
        for name, path_value in path_params.items():
            path = path.replace("{" + name + "}", quote(path_value, safe=""))
        key = self.api_key() if callable(self.api_key) else self.api_key
        headers = {"Authorization": "Bearer " + key}
        query: list[tuple[str, str]] = []
        for option, wire, location, required in operation.parameters:
            value = opts.get(option)
            if wire == "Idempotency-Key":
                if value is not None and context.idempotency_key not in (None, value):
                    raise ValueError("OperationContext has a different idempotency key")
                value = value or context.idempotency_key or str(uuid4())
                context.idempotency_key = cast(str, value)
            if value is None:
                if required:
                    raise ValueError(f"Missing required option: {option}")
                continue
            values = value if isinstance(value, list) else [value]
            for item in values:
                encoded = str(item).lower() if isinstance(item, bool) else str(item)
                if location == "query":
                    query.append((wire, encoded))
                else:
                    headers[wire] = encoded
        if operation.input_media:
            headers["Content-Type"] = operation.input_media
        content = None if body is None else body if isinstance(body, bytes) else json.dumps(body, separators=(",", ":")).encode()
        request_timeout = float(cast(float, opts.get("request_timeout_seconds", self.request_timeout_seconds)))
        wait_timeout = float(cast(float, opts.get("wait_timeout_seconds", self.wait_timeout_seconds)))
        if request_timeout <= 0 or wait_timeout <= 0:
            raise ValueError("Request and wait timeouts must be positive")
        interval = float(cast(float, opts.get("poll_interval_seconds", 0.2)))
        if interval < 0:
            raise ValueError("poll_interval_seconds must be nonnegative")
        deadline = time.monotonic() + wait_timeout if opts.get("wait", operation.wait_default) else None
        return _Call(operation, self.base_url + path, query, headers, content, context, deadline, request_timeout, opts)

class NativeBeeOSClient(_ClientBase):
    def __init__(self, base_url: str, api_key: str | Callable[[], str], *, request_timeout_seconds: float = 30.0, wait_timeout_seconds: float = 300.0, http_client: httpx.Client | None = None) -> None:
        self._configure(base_url, api_key, request_timeout_seconds, wait_timeout_seconds)
        self._http = http_client or httpx.Client(follow_redirects=False)
        self._owns_http = http_client is None
@@SYNC_ROOTS@@

    def close(self) -> None:
        if self._owns_http:
            self._http.close()

    def __enter__(self) -> NativeBeeOSClient:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def _perform(self, call: _Call, *, poll_url: str | None = None) -> BeeOSHTTPResponse[object]:
        try:
            with self._http.stream("GET" if poll_url else call.operation.method, poll_url or call.url, params=None if poll_url else tuple(call.query), headers={"Authorization": call.headers["Authorization"]} if poll_url else call.headers, content=None if poll_url else call.content, timeout=call.timeout(), follow_redirects=False) as raw:
                _capture_acceptance(raw, call)
                chunks: list[bytes] = []
                for chunk in raw.iter_bytes():
                    call.remaining()
                    chunks.append(chunk)
                result = _response(raw, b"".join(chunks), call)
                call.remaining()
                return result
        except httpx.TimeoutException as error:
            call.remaining()
            raise SDKRequestTimeout(call.context) from error
        except httpx.RequestError as error:
            raise SDKTransportError(call.context) from error

    def _execute(self, operation: _Operation, path_params: Mapping[str, str], body: object, options: Mapping[str, object] | None, event_types: frozenset[str] | None = None) -> BeeOSHTTPResponse[object] | EventStream[object]:
        call = self._prepare(operation, path_params, body, options)
        if operation.output_media == "text/event-stream":
            try:
                request = self._http.build_request(operation.method, call.url, params=tuple(call.query), headers=call.headers, timeout=call.timeout())
                raw = self._http.send(request, stream=True, follow_redirects=False)
                if not 200 <= raw.status_code < 300:
                    try:
                        _response(raw, raw.read(), call)
                    finally:
                        raw.close()
                return EventStream(raw, call.context, event_types)
            except httpx.TimeoutException as error:
                raise SDKRequestTimeout(call.context) from error
            except httpx.RequestError as error:
                raise SDKTransportError(call.context) from error
        first = current = self._perform(call)
        poll_path = _wait_path(call, first)
        if poll_path is None:
            return first
        previous: object = object()
        while True:
            previous = _notify(call, current, previous)
            if _wait_done(call, first, current):
                return current
            remaining = call.remaining()
            delay = float(cast(float, call.options.get("poll_interval_seconds", 0.2)))
            time.sleep(delay if remaining is None else min(delay, remaining))
            current = self._perform(call, poll_url=self.base_url + poll_path)

class AsyncNativeBeeOSClient(_ClientBase):
    def __init__(self, base_url: str, api_key: str | Callable[[], str], *, request_timeout_seconds: float = 30.0, wait_timeout_seconds: float = 300.0, http_client: httpx.AsyncClient | None = None) -> None:
        self._configure(base_url, api_key, request_timeout_seconds, wait_timeout_seconds)
        self._http = http_client or httpx.AsyncClient(follow_redirects=False)
        self._owns_http = http_client is None
@@ASYNC_ROOTS@@

    async def aclose(self) -> None:
        if self._owns_http:
            await self._http.aclose()

    async def __aenter__(self) -> AsyncNativeBeeOSClient:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

    async def _perform(self, call: _Call, *, poll_url: str | None = None) -> BeeOSHTTPResponse[object]:
        try:
            async with asyncio.timeout(call.timeout()):
                async with self._http.stream("GET" if poll_url else call.operation.method, poll_url or call.url, params=None if poll_url else tuple(call.query), headers={"Authorization": call.headers["Authorization"]} if poll_url else call.headers, content=None if poll_url else call.content, timeout=call.timeout(), follow_redirects=False) as raw:
                    _capture_acceptance(raw, call)
                    content = await raw.aread()
                    result = _response(raw, content, call)
                    call.remaining()
                    return result
        except SDKWaitTimeout:
            raise
        except (httpx.TimeoutException, TimeoutError) as error:
            call.remaining()
            raise SDKRequestTimeout(call.context) from error
        except httpx.RequestError as error:
            raise SDKTransportError(call.context) from error

    async def _execute(self, operation: _Operation, path_params: Mapping[str, str], body: object, options: Mapping[str, object] | None, event_types: frozenset[str] | None = None) -> BeeOSHTTPResponse[object] | AsyncEventStream[object]:
        call = self._prepare(operation, path_params, body, options)
        if operation.output_media == "text/event-stream":
            try:
                async with asyncio.timeout(call.timeout()):
                    request = self._http.build_request(operation.method, call.url, params=tuple(call.query), headers=call.headers, timeout=call.timeout())
                    raw = await self._http.send(request, stream=True, follow_redirects=False)
                    if not 200 <= raw.status_code < 300:
                        try:
                            _response(raw, await raw.aread(), call)
                        finally:
                            await raw.aclose()
                    if raw.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "text/event-stream":
                        await raw.aclose()
                        raise ValueError("Expected text/event-stream response")
                    return AsyncEventStream(raw, call.context, event_types)
            except (httpx.TimeoutException, TimeoutError) as error:
                raise SDKRequestTimeout(call.context) from error
            except httpx.RequestError as error:
                raise SDKTransportError(call.context) from error
        first = current = await self._perform(call)
        poll_path = _wait_path(call, first)
        if poll_path is None:
            return first
        previous: object = object()
        while True:
            previous = _notify(call, current, previous)
            if _wait_done(call, first, current):
                return current
            remaining = call.remaining()
            delay = float(cast(float, call.options.get("poll_interval_seconds", 0.2)))
            await asyncio.sleep(delay if remaining is None else min(delay, remaining))
            current = await self._perform(call, poll_url=self.base_url + poll_path)

class _SSEParser:
    def __init__(self) -> None:
        self.data: list[str] = []
        self.last_event_id: str | None = None
        self._event_id: str | None = None
        self.event_type: str | None = None
        self.size = 0

    def feed(self, line: str) -> tuple[bool, object]:
        self.size += len(line.encode("utf-8"))
        if self.size > 1024 * 1024:
            raise ValueError("SSE event exceeds 1 MiB")
        if not line:
            data, self.data = self.data, []
            self.size = 0
            self.event_type = None
            if not data:
                return False, None
            value = json.loads("\n".join(data))
            if self._event_id is not None:
                self.last_event_id = self._event_id
            return True, value
        if line.startswith(":"):
            return False, None
        name, _, value = line.partition(":")
        value = value.removeprefix(" ")
        if name == "data":
            self.data.append(value)
        elif name == "id" and "\0" not in value:
            self._event_id = value
        elif name == "event":
            self.event_type = value
        return False, None

class EventStream(Generic[T], Iterator[T]):
    def __init__(self, response: httpx.Response, context: OperationContext,
                 event_types: frozenset[str] | None = None) -> None:
        if response.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "text/event-stream":
            response.close()
            raise ValueError("Expected text/event-stream response")
        self._response = response
        self._context = context
        self._lines = response.iter_lines()
        self._parser = _SSEParser()
        self._event_types = event_types
        self.status = response.status_code
        self.headers = HTTPHeaders(response.headers)

    @property
    def last_event_id(self) -> str | None:
        return self._parser.last_event_id

    @property
    def closed(self) -> bool:
        return self._response.is_closed

    def __iter__(self) -> EventStream[T]:
        return self

    def __next__(self) -> T:
        try:
            for line in self._lines:
                ready, value = self._parser.feed(line)
                if ready:
                    # A newer producer may emit an event type this SDK does not
                    # model yet; skip it and keep the durable stream open.
                    if self._event_types is not None and (not isinstance(value, dict) or value.get("type") not in self._event_types):
                        continue
                    return cast(T, value)
            raise StopIteration
        except httpx.TimeoutException as error:
            self.close()
            raise SDKRequestTimeout(self._context) from error
        except httpx.RequestError as error:
            self.close()
            raise SDKTransportError(self._context) from error
        except BaseException:
            self.close()
            raise

    def close(self) -> None:
        self._response.close()

    def __enter__(self) -> EventStream[T]:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

class AsyncEventStream(Generic[T], AsyncIterator[T]):
    def __init__(self, response: httpx.Response, context: OperationContext,
                 event_types: frozenset[str] | None = None) -> None:
        self._response = response
        self._context = context
        self._lines = response.aiter_lines()
        self._parser = _SSEParser()
        self._event_types = event_types
        self.status = response.status_code
        self.headers = HTTPHeaders(response.headers)

    @property
    def last_event_id(self) -> str | None:
        return self._parser.last_event_id

    @property
    def closed(self) -> bool:
        return self._response.is_closed

    def __aiter__(self) -> AsyncEventStream[T]:
        return self

    async def __anext__(self) -> T:
        try:
            if self._response.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "text/event-stream":
                raise ValueError("Expected text/event-stream response")
            async for line in self._lines:
                ready, value = self._parser.feed(line)
                if ready:
                    # A newer producer may emit an event type this SDK does not
                    # model yet; skip it and keep the durable stream open.
                    if self._event_types is not None and (not isinstance(value, dict) or value.get("type") not in self._event_types):
                        continue
                    return cast(T, value)
            raise StopAsyncIteration
        except httpx.TimeoutException as error:
            await self.aclose()
            raise SDKRequestTimeout(self._context) from error
        except httpx.RequestError as error:
            await self.aclose()
            raise SDKTransportError(self._context) from error
        except BaseException:
            await self.aclose()
            raise

    async def aclose(self) -> None:
        await self._response.aclose()

    async def __aenter__(self) -> AsyncEventStream[T]:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

@dataclass(frozen=True)
class ResponseStream:
    response_id: str
    events: EventStream[NativeResponseEvent]
    response: BeeOSHTTPResponse[NativeResponseResult]

@dataclass(frozen=True)
class AsyncResponseStream:
    response_id: str
    events: AsyncEventStream[NativeResponseEvent]
    response: BeeOSHTTPResponse[NativeResponseResult]

class PTYConnectRequest(TypedDict, total=False):
    cols: int
    rows: int
    pty_id: str
    origin: str
    last_server_sequence: str

class DesktopConnectRequest(TypedDict, total=False):
    origin: str

class _ExactAsyncConnect(async_ws_connect):
    def process_redirect(self, exc: Exception) -> Exception | str:
        return exc

def _connection_ticket(ticket: AccessTicket, purpose: str) -> None:
    parts = urlsplit(ticket["connect_url"])
    if parts.scheme != "wss" or parts.username or parts.password or parts.query or parts.fragment:
        raise ValueError("Access ticket must provide an exact WSS URL without credentials or query")
    expected = "beeos-terminal-v2" if purpose == "pty" else "beeos-desktop-v1"
    if ticket["purpose"] != purpose or ticket["profile"] != expected:
        raise ValueError("Access ticket purpose/profile mismatch")

def _authenticate_frame(ticket: AccessTicket) -> str:
    frame = json.dumps({"type": "authenticate", "profile": ticket["profile"], "ticket": ticket["ticket"]})
    if len(frame.encode()) > 16384:
        raise ValueError("Access authentication frame exceeds 16 KiB")
    return frame

def _origin(request: Mapping[str, object]) -> Origin | None:
    value = request.get("origin")
    return Origin(cast(str, value)) if value is not None else None

def _json_frame(raw: str | bytes) -> dict[str, JSONValue]:
    frame = json.loads(raw)
    if not isinstance(frame, dict):
        raise ValueError("Expected a JSON connection frame")
    return cast(dict[str, JSONValue], frame)

def _admitted(frame: Mapping[str, JSONValue], ticket: AccessTicket) -> None:
    if frame.get("type") != "authenticated" or frame.get("profile") != ticket["profile"] or frame.get("client_id") != ticket["client_id"] or frame.get("sandbox_id") != ticket["sandbox_id"]:
        raise ValueError("Access profile admission failed")
    if ticket["purpose"] == "pty" and frame.get("terminal_id") != ticket.get("pty_id"):
        raise ValueError("Terminal admission identity mismatch")

def _terminal_open(ticket: AccessTicket, body: PTYConnectRequest) -> dict[str, JSONValue]:
    frame: dict[str, JSONValue] = {"protocolVersion": 1, "clientId": ticket["client_id"], "terminalId": ticket["pty_id"], "clientSequence": "1"}
    if body.get("pty_id"):
        frame.update(type="terminal.resume", lastServerSequence=body.get("last_server_sequence", "0"))
    else:
        frame.update(type="terminal.open", columns=body["cols"], rows=body["rows"])
    return frame

def _opened(frame: Mapping[str, JSONValue], ticket: AccessTicket, body: PTYConnectRequest) -> None:
    if frame.get("type") != "terminal.opened" or frame.get("protocolVersion") != 1 or frame.get("clientId") != ticket["client_id"] or frame.get("terminalId") != ticket["pty_id"] or frame.get("resumed") is not bool(body.get("pty_id")):
        raise ValueError("Terminal did not confirm open/resume")

class DesktopSignalingConnection:
    def __init__(self, socket: WebSocket, acceptance: Acceptance | None) -> None:
        self._socket = socket
        self.acceptance = acceptance

    def send(self, frame: Mapping[str, JSONValue] | bytes) -> None:
        self._socket.send(frame if isinstance(frame, bytes) else json.dumps(frame))

    def start_desktop_stream(self) -> None:
        """Start the admitted producer's generation1 Desktop stream."""
        self.send({"type": "start", "transport_generation": 1})

    def receive(self) -> dict[str, JSONValue] | bytes:
        frame = self._socket.recv()
        return frame if isinstance(frame, bytes) else _json_frame(frame)

    def close(self) -> None:
        """Close only the local connection; no remote cancellation or input replay."""
        self._socket.close()

    def __enter__(self) -> DesktopSignalingConnection:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

class AsyncDesktopSignalingConnection:
    def __init__(self, socket: AsyncWebSocket, acceptance: Acceptance | None) -> None:
        self._socket = socket
        self.acceptance = acceptance

    async def send(self, frame: Mapping[str, JSONValue] | bytes) -> None:
        try:
            await self._socket.send(frame if isinstance(frame, bytes) else json.dumps(frame))
        except asyncio.CancelledError:
            await self.aclose()
            raise

    async def start_desktop_stream(self) -> None:
        """Start the admitted producer's generation1 Desktop stream."""
        await self.send({"type": "start", "transport_generation": 1})

    async def receive(self) -> dict[str, JSONValue] | bytes:
        try:
            frame = await self._socket.recv()
            return frame if isinstance(frame, bytes) else _json_frame(frame)
        except asyncio.CancelledError:
            await self.aclose()
            raise

    async def aclose(self) -> None:
        await self._socket.close()

    async def __aenter__(self) -> AsyncDesktopSignalingConnection:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

class TerminalConnection(DesktopSignalingConnection):
    def __init__(self, socket: WebSocket, acceptance: Acceptance | None, opened: dict[str, JSONValue]) -> None:
        super().__init__(socket, acceptance)
        self.opened = opened
        self._sequence = 1
        self._last_server_sequence = int(cast(str, opened["sequence"]))

    def receive(self) -> dict[str, JSONValue] | bytes:
        while True:
            frame = super().receive()
            if isinstance(frame, dict) and frame.get("type") == "terminal.output":
                sequence = int(cast(str, frame["sequence"]))
                if sequence <= self._last_server_sequence:
                    continue
                self._last_server_sequence = sequence
            return frame

    def _frame(self, kind: str) -> dict[str, JSONValue]:
        self._sequence += 1
        return {"type": kind, "protocolVersion": 1, "clientId": self.opened["clientId"], "terminalId": self.opened["terminalId"], "clientSequence": str(self._sequence)}

    def write(self, data: str) -> None:
        """Local send only: the public PTY protocol has no stdin acknowledgement."""
        if len(data.encode()) > 16384:
            raise ValueError("PTY input exceeds 16 KiB")
        frame = self._frame("terminal.input")
        frame.update(data=data, encoding="utf8")
        self.send(frame)

    def resize(self, columns: int, rows: int) -> None:
        frame = self._frame("terminal.resize")
        frame.update(columns=columns, rows=rows)
        self.send(frame)

class AsyncTerminalConnection(AsyncDesktopSignalingConnection):
    def __init__(self, socket: AsyncWebSocket, acceptance: Acceptance | None, opened: dict[str, JSONValue]) -> None:
        super().__init__(socket, acceptance)
        self.opened = opened
        self._sequence = 1
        self._last_server_sequence = int(cast(str, opened["sequence"]))

    async def receive(self) -> dict[str, JSONValue] | bytes:
        while True:
            frame = await super().receive()
            if isinstance(frame, dict) and frame.get("type") == "terminal.output":
                sequence = int(cast(str, frame["sequence"]))
                if sequence <= self._last_server_sequence:
                    continue
                self._last_server_sequence = sequence
            return frame

    def _frame(self, kind: str) -> dict[str, JSONValue]:
        self._sequence += 1
        return {"type": kind, "protocolVersion": 1, "clientId": self.opened["clientId"], "terminalId": self.opened["terminalId"], "clientSequence": str(self._sequence)}

    async def write(self, data: str) -> None:
        if len(data.encode()) > 16384:
            raise ValueError("PTY input exceeds 16 KiB")
        frame = self._frame("terminal.input")
        frame.update(data=data, encoding="utf8")
        await self.send(frame)

    async def resize(self, columns: int, rows: int) -> None:
        frame = self._frame("terminal.resize")
        frame.update(columns=columns, rows=rows)
        await self.send(frame)

class NativePTYResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def connect(self, sandbox_id: str, body: PTYConnectRequest, options: CreateSandboxAccessTicketOptions | None = None) -> TerminalConnection:
        request = cast(AccessTicketCreate, {key: value for key, value in body.items() if key != "last_server_sequence"})
        request["purpose"] = "pty"
        accepted = self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "pty")
        socket = sync_ws_connect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(body), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            if socket.subprotocol != ticket["profile"]:
                raise ValueError("WebSocket did not select the requested public profile")
            socket.send(_authenticate_frame(ticket))
            _admitted(_json_frame(socket.recv(timeout=5)), ticket)
            socket.send(json.dumps(_terminal_open(ticket, body)))
            frame = _json_frame(socket.recv(timeout=5))
            _opened(frame, ticket, body)
            return TerminalConnection(socket, accepted.acceptance, frame)
        except BaseException:
            socket.close()
            raise

class AsyncNativePTYResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def connect(self, sandbox_id: str, body: PTYConnectRequest, options: CreateSandboxAccessTicketOptions | None = None) -> AsyncTerminalConnection:
        request = cast(AccessTicketCreate, {key: value for key, value in body.items() if key != "last_server_sequence"})
        request["purpose"] = "pty"
        accepted = await self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "pty")
        socket = await _ExactAsyncConnect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(body), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            async with asyncio.timeout(5):
                if socket.subprotocol != ticket["profile"]:
                    raise ValueError("WebSocket did not select the requested public profile")
                await socket.send(_authenticate_frame(ticket))
                _admitted(_json_frame(await socket.recv()), ticket)
                await socket.send(json.dumps(_terminal_open(ticket, body)))
                frame = _json_frame(await socket.recv())
                _opened(frame, ticket, body)
            return AsyncTerminalConnection(socket, accepted.acceptance, frame)
        except BaseException:
            await socket.close()
            raise

class NativeDesktopResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def connect(self, sandbox_id: str, body: DesktopConnectRequest | None = None, options: CreateSandboxAccessTicketOptions | None = None) -> DesktopSignalingConnection:
        request: AccessTicketCreate = {"purpose": "desktop"}
        if body and "origin" in body:
            request["origin"] = body["origin"]
        accepted = self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "desktop")
        socket = sync_ws_connect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(request), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            if socket.subprotocol != ticket["profile"]:
                raise ValueError("WebSocket did not select the requested public profile")
            socket.send(_authenticate_frame(ticket))
            _admitted(_json_frame(socket.recv(timeout=5)), ticket)
            return DesktopSignalingConnection(socket, accepted.acceptance)
        except BaseException:
            socket.close()
            raise

class AsyncNativeDesktopResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def connect(self, sandbox_id: str, body: DesktopConnectRequest | None = None, options: CreateSandboxAccessTicketOptions | None = None) -> AsyncDesktopSignalingConnection:
        request: AccessTicketCreate = {"purpose": "desktop"}
        if body and "origin" in body:
            request["origin"] = body["origin"]
        accepted = await self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "desktop")
        socket = await _ExactAsyncConnect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(request), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            async with asyncio.timeout(5):
                if socket.subprotocol != ticket["profile"]:
                    raise ValueError("WebSocket did not select the requested public profile")
                await socket.send(_authenticate_frame(ticket))
                _admitted(_json_frame(await socket.recv()), ticket)
            return AsyncDesktopSignalingConnection(socket, accepted.acceptance)
        except BaseException:
            await socket.close()
            raise

@@RESOURCES@@
`;
