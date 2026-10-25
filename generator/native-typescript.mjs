// Canonical native producer -> typed models, options, resources and maintained runtime.
import { operations, resolve, pascal } from './common.mjs';
const camel = value => value.toLowerCase().replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
const modelName = value => /^\d/.test(value) ? 'Schema' + value : value === 'Error' ? 'NativeErrorEnvelope' : value === 'Record' ? 'MemoryRecord' : value;
function tsType(schema) {
  if (schema === true || schema === undefined) return 'unknown';
  if (schema === false) return 'never';
  if (schema.$ref) return modelName(schema.$ref.split('/').pop());
  if ('const' in schema) return JSON.stringify(schema.const);
  if (schema.enum) return schema.enum.map(value => JSON.stringify(value)).join(' | ');
  if (schema.oneOf || schema.anyOf) return (schema.oneOf ?? schema.anyOf).map(tsType).join(' | ');
  if (Array.isArray(schema.type)) return schema.type.map(type => tsType({...schema, type})).join(' | ');
  if (schema.type === 'array') return '(' + tsType(schema.items) + ')[]';
  if (schema.type === 'string') return 'string';
  if (['number','integer'].includes(schema.type)) return 'number';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'null') return 'null';
  if (schema.properties || schema.type === 'object') {
    const fields = Object.entries(schema.properties ?? {}).map(([name, property]) => (property.readOnly ? "readonly " : "") + JSON.stringify(name) + ((schema.required ?? []).includes(name) ? '' : '?') + ': ' + tsType(property) + ';');
    if (schema.additionalProperties) fields.push('[key: string]: ' + (schema.additionalProperties === true ? 'unknown' : tsType(schema.additionalProperties)) + ';');
    const base = '{ ' + fields.join(' ') + ' }';
    const extensions = (schema.allOf ?? []).filter(branch => branch.$ref || branch.properties).map(tsType);
    return extensions.length ? base + ' & ' + extensions.join(' & ') : base;
  }
  if (schema.allOf) return schema.allOf.filter(branch => branch.$ref || branch.properties || branch.type).map(tsType).join(' & ') || 'unknown';
  return 'unknown';
}
function nativeEventTypes(spec) {
  const types = [];
  for (const variant of spec.components.schemas.NativeResponseEvent.oneOf ?? []) {
    const type = variant.properties?.type;
    if (typeof type?.const === 'string') types.push(type.const);
    for (const value of type?.enum ?? []) types.push(value);
  }
  return [...new Set(types)];
}
export function generateNativeTypeScript(spec) {
  const ops = operations(spec);
  const eventTypes = nativeEventTypes(spec);
  const table = Object.fromEntries(ops.map(op => {
    const success = resolve(spec, Object.entries(op.responses).find(([code]) => code.startsWith('2'))[1]);
    const [media = '', response = {}] = Object.entries(success.content ?? {})[0] ?? [];
    const content = Object.keys(resolve(spec, op.requestBody)?.content ?? {})[0];
    return [op.operationId, {id: op.operationId, method: op.method, path: op.path, parameters: op.parameters.map(p => ({name:p.name,in:p.in,required:p.required,option:camel(p.name)})), contentType:content, responseType:media === 'text/event-stream' ? 'sse' : media === 'application/octet-stream' ? 'bytes' : media ? 'json' : 'void', wait:op['x-sdk-wait-default'] === true}];
  }));
  let models = Object.entries(spec.components.schemas).map(([name,schema]) => 'export type ' + modelName(name) + ' = ' + tsType(schema) + ';').join('\n') + '\n';
  const resourceNames = [...new Set(ops.map(op => op['x-sdk-resource']))];
  const classes = [];
  const roots = [...new Set(resourceNames.map(name => name.split('.')[0]))];
  let source = runtime.replace('/*RESOURCES*/', roots.map(name => 'readonly ' + name + ': Native' + pascal(name) + 'Module;').join('\n  '))
    .replace('/*INITIALIZE*/', roots.map(name => 'this.' + name + ' = new Native' + pascal(name) + 'Module(this);').join('\n    '))
    .replace('/*NATIVE_RESPONSE_EVENT_TYPES*/', eventTypes.map(value => JSON.stringify(value)).join(', '));
  for (const name of [...resourceNames, 'sandboxes.pty', 'sandboxes.desktop']) {
    const className = 'Native' + pascal(name) + 'Module';
    const children = [...new Set([...resourceNames, 'sandboxes.pty','sandboxes.desktop'].filter(child => child.startsWith(name + '.') && child.split('.').length === name.split('.').length + 1).map(child => child.slice(name.length + 1)))];
    const lines = ['export class ' + className + ' {', ...children.map(child => '  readonly ' + child + ': Native' + pascal(name + '.' + child) + 'Module;'), '  constructor(private readonly client: NativeBeeOSClient) {' + children.map(child => 'this.' + child + ' = new Native' + pascal(name + '.' + child) + 'Module(client);').join(' ') + '}'];
    for (const op of ops.filter(op => op['x-sdk-resource'] === name)) {
      const parameters = op.parameters.filter(p => p.in !== 'path' && p.name !== 'Idempotency-Key');
      const required = parameters.some(p => p.required);
      const optionName = op['x-sdk-options-type'] ?? pascal(op.operationId) + 'Options';
      models += 'export interface ' + optionName + ' extends NativeRequestOptions {' + parameters.map(p => camel(p.name) + (p.required ? '' : '?') + ': ' + tsType(p.schema) + ';').join(' ') + '}\n';
      const path = op.parameters.filter(p => p.in === 'path');
      const body = Object.entries(resolve(spec, op.requestBody)?.content ?? {})[0];
      const args = [...path.map(p => camel(p.name) + ': string'), ...(body ? ['body: ' + (body[0] === 'application/octet-stream' ? 'BinaryStream' : tsType(body[1].schema))] : []), 'options: ' + optionName + (required ? '' : ' = {}')];
      const success = resolve(spec,Object.entries(op.responses).find(([code])=>code.startsWith('2'))[1]);
      const [media='',response={}] = Object.entries(success.content ?? {})[0] ?? [];
      const stream = media === 'text/event-stream';
      const responseType = stream ? op.operationId === 'streamSandboxCommandEvents' ? 'CommandEvent' : 'NativeResponseEvent' : media === 'application/octet-stream' ? 'Uint8Array' : response.schema ? tsType(response.schema) : 'void';
      const invoke = 'this.client.' + (stream ? 'stream' : 'call') + '<' + responseType + '>(nativeOperations.' + op.operationId + ', {' + path.map(p => JSON.stringify(p.name) + ': ' + camel(p.name)).join(', ') + '}, ' + (stream ? '' : (body ? 'body' : 'undefined') + ', ') + 'options)';
      lines.push('  ' + op['x-sdk-method'] + '(' + args.join(', ') + '): Promise<' + (stream ? 'NativeEventStream<' : 'BeeOSHTTPResponse<') + responseType + '>> { return ' + invoke + '; }');
    }
    if (name === 'responses') lines.push('  async createStream(body: NativeResponseCreate, options: CreateNativeResponseOptions & {lastEventId?: string} = {}): Promise<NativeResponseStream> { const response = await this.create(body, options); const response_id = response.body.data.id; try { const events = await this.events(response_id, options); return {response_id, response, events}; } catch (error) { if (error instanceof Error && Object.isExtensible(error)) Object.assign(error, {acceptance: response.acceptance, last_response: response, response_id}); throw error; } }');
    if (['sandboxes.pty', 'sandboxes.desktop'].includes(name)) lines.push('  connect(sandboxId: string, body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions = {}): Promise<NativeSocketConnection> { return connectNativeSocket(this.client, sandboxId, ' + JSON.stringify(name.split('.')[1] === 'pty' ? 'pty' : 'desktop') + ', body, options); }');
    lines.push('}'); classes.push(lines.join('\n'));
  }
  return {'src/native.ts': '// Generated from spec/native.openapi.json by generator/native-typescript.mjs.\n' + models + '\n' + source + '\nconst nativeOperations = ' + JSON.stringify(table,null,2) + ' satisfies Record<string, NativeOperation>;\n\n' + classes.join('\n\n') + '\n'};
}

const runtime = String.raw`import { parseNativeSSE } from "./native-sse.js";

/** Modeled NativeResponseEvent type set; unknown future types are skipped, never fatal. */
const NATIVE_RESPONSE_EVENT_TYPES: ReadonlySet<string> = new Set([/*NATIVE_RESPONSE_EVENT_TYPES*/]);

export interface BeeOSHTTPHeaders {
  request_id?: string; etag?: string; location?: string; should_retry?: boolean; retry_after?: string;
  raw: Headers;
}
export interface NativeAcceptance {
  status: number | null; resource_id: string | null; etag: string | null; request_id: string | null; idempotency_key: string;
}
export interface BeeOSHTTPResponse<T> {
  status: number; body: T; headers: BeeOSHTTPHeaders; acceptance?: NativeAcceptance;
}
export class NativeBeeOSAPIError extends Error {
  readonly name = "BeeOSAPIError";
  constructor(readonly http_status: number, readonly code: string, message: string,
    readonly reason: string | undefined, readonly should_retry: boolean | undefined,
    readonly retry_after: string | number | undefined, readonly request_id: string | undefined,
    readonly raw_envelope: unknown, readonly headers: BeeOSHTTPHeaders,
    readonly acceptance?: NativeAcceptance) { super(message); }
  get status(): number { return this.http_status; }
}
export class SDKWaitTimeout extends Error {
  readonly name: string = "SDKWaitTimeout";
  constructor(message: string, readonly acceptance?: NativeAcceptance,
    readonly last_response?: BeeOSHTTPResponse<unknown>) { super(message); }
}
export class SDKRequestTimeout extends SDKWaitTimeout { override readonly name = "SDKRequestTimeout"; }
export class SDKCancelled extends SDKWaitTimeout { override readonly name = "SDKCancelled"; }
export class SDKPublicationSuperseded extends SDKWaitTimeout { override readonly name = "SDKPublicationSuperseded"; }
export class SDKOperationFailed extends SDKWaitTimeout { override readonly name = "SDKOperationFailed"; }
export class SDKTransportError extends SDKWaitTimeout {
  override readonly name = "SDKTransportError";
  constructor(message: string, acceptance: NativeAcceptance | undefined, last: BeeOSHTTPResponse<unknown> | undefined, override readonly cause: unknown) { super(message, acceptance, last); }
}
export class SDKConnectionError extends Error {
  override readonly name = "SDKConnectionError";
  constructor(readonly ticket: Omit<AccessTicket, "ticket">, readonly acceptance: NativeAcceptance | undefined, override readonly cause: unknown) { super("Connection admission failed"); }
}
export type BinaryStream = Uint8Array | Blob | ReadableStream<Uint8Array>;
export interface NativeRequestOptions {
  idempotencyKey?: string; signal?: AbortSignal; wait?: boolean;
  requestTimeoutSeconds?: number; waitTimeoutSeconds?: number; pollIntervalSeconds?: number;
  onProgress?: (observation: BeeOSHTTPResponse<unknown>) => void;
}
export interface NativeClientOptions {
  baseURL: string; apiKey: string | (() => string); fetch?: typeof fetch;
  webSocketFactory?: (url: string, profile: string) => NativeWebSocket;
}
export function createNativeIdempotencyKey(): string { return globalThis.crypto.randomUUID(); }
interface NativeParameter { name: string; in: string; required?: boolean; option: string; }
interface NativeOperation {
  id: string; method: string; path: string; parameters: NativeParameter[];
  contentType?: string; responseType: "json" | "bytes" | "sse" | "void"; wait: boolean;
}
interface OperationContext {
  key?: string; acceptance?: NativeAcceptance; last?: BeeOSHTTPResponse<unknown>; deadline?: number;
}
function nativeHeaders(raw: Headers): BeeOSHTTPHeaders {
  const retry = raw.get("Should-Retry") ?? raw.get("X-Should-Retry");
  return { request_id: raw.get("X-Request-ID") ?? undefined, etag: raw.get("ETag") ?? undefined,
    location: raw.get("Location") ?? undefined, should_retry: retry === null ? undefined : retry === "true",
    retry_after: raw.get("Retry-After") ?? undefined, raw };
}
function resourceId(body: unknown): string | null {
  const data = (body as {data?: {id?: string; receipt?: {receipt_id?: string}}} | undefined)?.data;
  return data?.id ?? data?.receipt?.receipt_id ?? null;
}
function retryMilliseconds(value?: string | number): number | undefined {
  if (value === undefined) return undefined;
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric * 1000;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? Math.max(0, parsed - Date.now()) : undefined;
}
function abortError(ctx: OperationContext, signal?: AbortSignal): SDKWaitTimeout {
  return signal?.aborted ? new SDKCancelled("Local operation cancelled", ctx.acceptance, ctx.last)
    : new SDKWaitTimeout("Local wait deadline exceeded", ctx.acceptance, ctx.last);
}
function ensureLocal(ctx: OperationContext, options: NativeRequestOptions): void {
  if (options.signal?.aborted || (ctx.deadline !== undefined && Date.now() >= ctx.deadline)) throw abortError(ctx, options.signal);
}
async function waitDelay(ms: number, ctx: OperationContext, options: NativeRequestOptions): Promise<void> {
  ensureLocal(ctx, options);
  const remaining = ctx.deadline === undefined ? ms : Math.min(ms, Math.max(0, ctx.deadline - Date.now()));
  await new Promise<void>((resolve, reject) => {
    const done = (): void => { clearTimeout(timer); options.signal?.removeEventListener("abort", cancelled); resolve(); };
    const cancelled = (): void => { clearTimeout(timer); options.signal?.removeEventListener("abort", cancelled); reject(abortError(ctx, options.signal)); };
    const timer = setTimeout(done, remaining);
    options.signal?.addEventListener("abort", cancelled, {once: true});
  });
  ensureLocal(ctx, options);
}

export class NativeBeeOSClient {
  /*RESOURCES*/
  constructor(readonly options: NativeClientOptions) {
    const url = new URL(options.baseURL);
    if (!options.apiKey || !["https:", "http:"].includes(url.protocol)) throw new Error("baseURL and server API key are required");
    /*INITIALIZE*/
  }
  async call<T>(op: NativeOperation, path: Record<string, string>, body: unknown, options: NativeRequestOptions): Promise<BeeOSHTTPResponse<T>> {
    const ctx = this.context(op, options);
    let result = await this.request<T>(op, path, body, options, ctx);
    if (op.wait && options.wait !== false) result = await this.observe(op, path, result, options, ctx);
    return result;
  }
  private context(op: NativeOperation, options: NativeRequestOptions): OperationContext {
    const keyed = op.parameters.some(p => p.name === "Idempotency-Key");
    const key = keyed ? options.idempotencyKey ?? createNativeIdempotencyKey() : undefined;
    if (key !== undefined && (!key.length || key.length > 256)) throw new Error("Idempotency-Key must contain 1–256 characters");
    for (const seconds of [options.requestTimeoutSeconds, options.waitTimeoutSeconds, options.pollIntervalSeconds]) {
      if (seconds !== undefined && (!Number.isFinite(seconds) || seconds <= 0)) throw new Error("Local timeout and polling values must be positive");
    }
    return {key, acceptance: key === undefined ? undefined : {status: null, resource_id: null, etag: null, request_id: null, idempotency_key: key},
      deadline: op.wait && options.wait !== false ? Date.now() + (options.waitTimeoutSeconds ?? 300) * 1000 : undefined};
  }
  private async open(op: NativeOperation, path: Record<string, string>, body: unknown, options: NativeRequestOptions, ctx: OperationContext): Promise<{response: Response; release: () => void; controller: AbortController}> {
    ensureLocal(ctx, options);
    let target = op.path;
    for (const [key, value] of Object.entries(path)) target = target.replace("{" + key + "}", encodeURIComponent(value));
    const url = new URL(target, new URL(this.options.baseURL).origin);
    const headers = new Headers({Authorization: "Bearer " + (typeof this.options.apiKey === "function" ? this.options.apiKey() : this.options.apiKey), Accept: op.responseType === "sse" ? "text/event-stream" : op.responseType === "bytes" ? "application/octet-stream" : "application/json"});
    const values = options as NativeRequestOptions & Record<string, unknown>;
    for (const parameter of op.parameters) {
      if (parameter.in === "path") continue;
      const value = parameter.name === "Idempotency-Key" ? ctx.key : values[parameter.option];
      if (value === undefined) {
        if (parameter.required) throw new Error("Missing required option: " + parameter.option);
        continue;
      }
      if (parameter.name === "If-Match" && (typeof value !== "string" || !/^"[^"\r\n]+"$/.test(value))) throw new Error("ifMatch must be a strong quoted ETag");
      if (parameter.in === "header") headers.set(parameter.name, String(value));
      else if (parameter.in === "query") for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(parameter.name, String(item));
    }
    if (op.contentType) headers.set("Content-Type", op.contentType);
    const controller = new AbortController();
    const abort = (): void => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", abort, {once: true});
    let requestExpired = false;
    const limit = Math.min((options.requestTimeoutSeconds ?? 30) * 1000, ctx.deadline === undefined ? Infinity : Math.max(0, ctx.deadline - Date.now()));
    const timer = setTimeout(() => {requestExpired = true; controller.abort();}, limit);
    const release = (): void => {clearTimeout(timer); options.signal?.removeEventListener("abort", abort);};
    try {
      const init: RequestInit & {duplex?: "half"} = {method: op.method, headers, signal: controller.signal};
      if (body !== undefined) init.body = op.contentType === "application/json" ? JSON.stringify(body) : body as BodyInit;
      if (body instanceof ReadableStream) init.duplex = "half";
      const response = await (this.options.fetch ?? globalThis.fetch)(url, init);
      if (!response.ok) {
        const responseHeaders = nativeHeaders(response.headers);
        const text = await response.text();
        let envelope: unknown = text;
        try { envelope = JSON.parse(text); } catch (error) { if (!(error instanceof SyntaxError)) throw error; }
        const flat = typeof envelope === "object" && envelope !== null ? envelope as Record<string, unknown> : {};
        const payload = typeof flat.error === "object" && flat.error !== null ? flat.error as Record<string, unknown> : flat;
        const details = typeof payload.details === "object" && payload.details !== null ? payload.details as Record<string, unknown> : {};
        throw new NativeBeeOSAPIError(response.status, typeof payload.code === "string" ? payload.code : "invalid_response",
          typeof payload.message === "string" ? payload.message : response.statusText,
          typeof payload.reason === "string" ? payload.reason : typeof details.reason === "string" ? details.reason : undefined,
          responseHeaders.should_retry ?? (typeof payload.should_retry === "boolean" ? payload.should_retry : undefined),
          responseHeaders.retry_after ?? (typeof payload.retry_after === "number" ? payload.retry_after : undefined),
          responseHeaders.request_id ?? (typeof payload.request_id === "string" ? payload.request_id : undefined), envelope, responseHeaders, ctx.acceptance);
      }
      return {response, release, controller};
    } catch (error) {
      release();
      if (options.signal?.aborted) throw new SDKCancelled("Local operation cancelled", ctx.acceptance, ctx.last);
      if (ctx.deadline !== undefined && Date.now() >= ctx.deadline) throw new SDKWaitTimeout("Local wait deadline exceeded", ctx.acceptance, ctx.last);
      if (requestExpired) throw new SDKRequestTimeout("HTTP request deadline exceeded", ctx.acceptance, ctx.last);
      if (error instanceof NativeBeeOSAPIError || error instanceof SDKWaitTimeout) throw error;
      throw new SDKTransportError("HTTP transport failed", ctx.acceptance, ctx.last, error);
    }
  }
  private async request<T>(op: NativeOperation, path: Record<string, string>, body: unknown, options: NativeRequestOptions, ctx: OperationContext): Promise<BeeOSHTTPResponse<T>> {
    const opened = await this.open(op, path, body, options, ctx);
    try {
      const response = opened.response;
      const value = response.status === 204 ? undefined : op.responseType === "bytes" ? new Uint8Array(await response.arrayBuffer()) : await response.json();
      const result: BeeOSHTTPResponse<T> = {status: response.status, body: value as T, headers: nativeHeaders(response.headers)};
      if (ctx.key && ctx.acceptance?.status === null) ctx.acceptance = {status: result.status, resource_id: resourceId(value), etag: result.headers.etag ?? null, request_id: result.headers.request_id ?? null, idempotency_key: ctx.key};
      if (ctx.acceptance) result.acceptance = ctx.acceptance;
      ctx.last = result;
      return result;
    } catch (error) {
      if (opened.controller.signal.aborted) {
        if (options.signal?.aborted) throw new SDKCancelled("Local operation cancelled", ctx.acceptance, ctx.last);
        if (ctx.deadline !== undefined && Date.now() >= ctx.deadline) throw new SDKWaitTimeout("Local wait deadline exceeded", ctx.acceptance, ctx.last);
        throw new SDKRequestTimeout("HTTP response deadline exceeded", ctx.acceptance, ctx.last);
      }
      throw error;
    } finally { opened.release(); }
  }
  private async observe<T>(op: NativeOperation, path: Record<string, string>, initial: BeeOSHTTPResponse<T>, options: NativeRequestOptions, ctx: OperationContext): Promise<BeeOSHTTPResponse<T>> {
    let result = initial;
    let previous: string | undefined;
    const revision = op.id === "createNativeAgent" || op.id === "updateNativeAgent" ? (initial.body as NativeAgentResult).data.publication.accepted_config_revision : undefined;
    const sandbox = revision === undefined ? undefined : (initial.body as NativeAgentResult).data.configuration.sandbox;
    for (;;) {
      ensureLocal(ctx, options);
      const observation = JSON.stringify([result.status, result.headers.etag, result.body]);
      if (observation !== previous) {
        previous = observation;
        try {options.onProgress?.(result);} catch (error) {
          if (error instanceof Error && Object.isExtensible(error)) Object.assign(error, {acceptance: ctx.acceptance, last_response: ctx.last});
          throw error;
        }
      }
      let poll: NativeOperation; let args: Record<string, string>;
      if (op.id === "createSandbox" || op.id === "resumeSandbox") {
        const sandbox = (result.body as SandboxResult).data;
        if (sandbox.status === "running") return result;
        if (sandbox.status === "error" || sandbox.status === "unknown") throw new SDKOperationFailed("Sandbox preparation requires inspection", ctx.acceptance, result);
        poll = nativeOperations.getSandbox; args = {sandbox_id: sandbox.id};
      } else if (revision !== undefined) {
        const agent = (result.body as NativeAgentResult).data;
        if (agent.desired_config_revision !== revision || agent.publication.accepted_config_revision !== revision || agent.publication.state === "superseded") throw new SDKPublicationSuperseded("Agent publication was superseded", ctx.acceptance, result);
        if (agent.publication.state === "deferred" || !sandbox || "template_id" in sandbox || agent.publication.changed_components.length === 0) return result;
        if (["failed", "partial", "unknown"].includes(agent.publication.state)) throw new SDKOperationFailed("Agent publication requires inspection", ctx.acceptance, result);
        if (agent.publication.state === "ready" && agent.binding?.prepared_config_revision === revision && "id" in sandbox && agent.binding.sandbox_id === sandbox.id) return result;
        poll = nativeOperations.getNativeAgent; args = {agent_id: agent.id};
      } else if (op.id === "runSandboxCommand") {
        const command = (result.body as CommandResultEnvelope).data;
        if (command.state === "completed" || command.state === "unknown") return result;
        poll = nativeOperations.getSandboxCommand; args = {sandbox_id: path.sandbox_id, command_id: command.id};
      } else {
        const memory = (result.body as NativeMemoryReceiptResult).data;
        if (["durable", "recallable"].includes(memory.completion) && ["committed", "duplicate"].includes(memory.receipt.disposition) && memory.receipt.committed_at !== null && memory.receipt.read_watermark !== null) return result;
        if (["failed", "blocked", "unknown"].includes(memory.completion)) throw new SDKOperationFailed("Memory durability requires inspection", ctx.acceptance, result);
        poll = nativeOperations.getNativeMemoryReceipt; args = {agent_id: path.agent_id, receipt_id: memory.receipt.receipt_id};
      }
      await waitDelay(retryMilliseconds(result.headers.retry_after) ?? (options.pollIntervalSeconds ?? .25) * 1000, ctx, options);
      for (;;) {
        try { result = await this.request<T>(poll, args, undefined, options, ctx); break; }
        catch (error) {
          if (!(error instanceof NativeBeeOSAPIError) || error.should_retry !== true || [401,403,409,412].includes(error.status)) throw error;
          await waitDelay(retryMilliseconds(error.retry_after) ?? (options.pollIntervalSeconds ?? .25) * 1000, ctx, options);
        }
      }
    }
  }
  async stream<T>(op: NativeOperation, path: Record<string, string>, options: NativeRequestOptions & {lastEventId?: string}): Promise<NativeEventStream<T>> {
    const ctx = this.context(op, options);
    const opened = await this.open(op, path, undefined, options, ctx);
    opened.release();
    if (!opened.response.headers.get("Content-Type")?.toLowerCase().startsWith("text/event-stream") || !opened.response.body) {
      opened.controller.abort(); throw new Error("Expected a text/event-stream response body");
    }
    return new NativeEventStream<T>(opened.response, opened.controller, options.signal, options.lastEventId,
      op.id === "streamNativeResponseEvents" ? NATIVE_RESPONSE_EVENT_TYPES : undefined);
  }
}
export class NativeEventStream<T> implements AsyncIterable<T> {
  readonly status: number; readonly headers: BeeOSHTTPHeaders; lastEventId?: string;
  private started = false;
  private readonly abort: () => void;
  constructor(private readonly response: Response, private readonly controller: AbortController, private readonly signal?: AbortSignal, lastEventId?: string,
    private readonly eventTypes?: ReadonlySet<string>) {
    this.status = response.status; this.headers = nativeHeaders(response.headers); this.lastEventId = lastEventId;
    this.abort = () => this.controller.abort(this.signal?.reason);
    signal?.addEventListener("abort", this.abort, {once: true});
    if (signal?.aborted) this.abort();
  }
  close(): void { this.controller.abort(); this.signal?.removeEventListener("abort", this.abort); }
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    if (this.started) throw new Error("An event stream can only be consumed once");
    this.started = true;
    try {
      for await (const event of parseNativeSSE(this.response.body!, {signal: this.controller.signal, maxEventBytes: 1024 * 1024})) {
        const value = JSON.parse(event.data) as T;
        if (event.id !== undefined) this.lastEventId = event.id;
        // A newer producer may emit an event type this SDK does not model yet;
        // skip it and keep the durable stream open at the last seen ID.
        if (this.eventTypes && (typeof (value as {type?: unknown}).type !== "string" || !this.eventTypes.has((value as {type: string}).type))) continue;
        yield value;
      }
    } finally { this.close(); }
  }
}
export interface NativeResponseStream { response_id: string; response: BeeOSHTTPResponse<NativeResponseResult>; events: NativeEventStream<NativeResponseEvent>; }
export interface NativeWebSocket {
  readonly readyState: number; readonly bufferedAmount: number; readonly protocol: string; binaryType?: string;
  send(data: string | Uint8Array): void; close(code?: number, reason?: string): void;
  addEventListener(type: string, listener: (event: {data?: unknown}) => void, options?: {once?: boolean}): void;
  removeEventListener(type: string, listener: (event: {data?: unknown}) => void): void;
}
export interface TerminalServerFrame {
  type: "terminal.opened" | "terminal.output" | "terminal.exit" | "terminal.error" | "terminal.pong";
  protocolVersion: 1; clientId: string; terminalId: string; sequence: string;
  resumed?: boolean; columns?: number; rows?: number; data?: string; encoding?: "utf8" | "base64";
  truncated?: boolean; exitCode?: number; code?: string; message?: string;
}
export interface DesktopServerFrame {
  type: "desktop_ready" | "answer" | "ice_candidate" | "fallback_ready" | "error";
  transport_generation?: 1 | 2; protocol_version?: 1; connection_id?: string;
  ice_transport_policy?: "relay"; ice_servers?: {urls: string[]; username: string; credential: string}[];
  rfb_profile?: "beeos-rfb-3.8-v1"; sdp?: string; candidate?: string;
  sdp_mid?: string | null; sdp_mline_index?: number | null; code?: string; message?: string;
}
export interface NativeConnectOptions extends NativeRequestOptions {
  lastServerSequence?: string; command?: string; args?: string[]; env?: Record<string, string>; cwd?: string;
}
/** A disconnect closes only the local socket. terminal.close is an explicit remote process-stop intent. */
export class NativeSocketConnection implements AsyncIterable<TerminalServerFrame | DesktopServerFrame | Uint8Array> {
  private queue: (TerminalServerFrame | DesktopServerFrame | Uint8Array)[] = [];
  private queuedBytes = 0;
  private pending?: {resolve: (value: IteratorResult<TerminalServerFrame | DesktopServerFrame | Uint8Array>) => void; reject: (error: unknown) => void};
  private ended = false; private failure?: Error; private sequence = 0n; private desktopGeneration = 1; lastServerSequence = "0"; private readonly abort: () => void;
  private readonly onMessage: (event: {data?: unknown}) => void;
  private readonly onClose: () => void;
  private readonly onError: () => void;
  private readonly encoder = new TextEncoder();
  constructor(readonly socket: NativeWebSocket, readonly ticket: Omit<AccessTicket, "ticket">, private readonly signal?: AbortSignal) {
    this.abort = () => {this.finish(new SDKCancelled("Local connection cancelled")); socket.close();};
    this.onMessage = event => {
      try {
        const value = typeof event.data === "string" ? JSON.parse(event.data) as TerminalServerFrame | DesktopServerFrame : event.data instanceof ArrayBuffer ? new Uint8Array(event.data) : event.data instanceof Uint8Array ? event.data : undefined;
        if (value === undefined) throw new Error("Unsupported WebSocket message type");
        if (value instanceof Uint8Array) {
          if (this.ticket.purpose !== "desktop" || this.desktopGeneration !== 2) throw new Error("WSS desktop fallback is not admitted");
        } else if (value.type === "fallback_ready" && value.transport_generation === 2) this.desktopGeneration = 2;
        else if (value.type.startsWith("terminal.")) {
          const terminal = value as TerminalServerFrame;
          if (this.ticket.purpose !== "pty" || terminal.protocolVersion !== 1 || terminal.clientId !== this.ticket.client_id || terminal.terminalId !== this.ticket.pty_id || !/^[1-9][0-9]{0,19}$/.test(terminal.sequence) || BigInt(terminal.sequence) > 18446744073709551615n) throw new Error("Terminal frame identity or sequence mismatch");
          if (terminal.type === "terminal.output" && BigInt(terminal.sequence) <= BigInt(this.lastServerSequence)) return;
          if (BigInt(terminal.sequence) > BigInt(this.lastServerSequence)) this.lastServerSequence = terminal.sequence;
        }
        const bytes = value instanceof Uint8Array ? value.byteLength : this.encoder.encode(JSON.stringify(value)).byteLength;
        if (bytes > 1024 * 1024 || this.queuedBytes + bytes > 1024 * 1024) throw new Error("WebSocket receive queue exceeded 1 MiB");
        if (this.pending) {const pending = this.pending; this.pending = undefined; pending.resolve({value, done: false});}
        else {this.queue.push(value); this.queuedBytes += bytes;}
      } catch (error) {this.finish(error instanceof Error ? error : new Error(String(error))); socket.close();}
    };
    this.onClose = () => this.finish();
    this.onError = () => this.finish(new Error("WebSocket connection failed"));
    socket.addEventListener("message", this.onMessage);
    socket.addEventListener("close", this.onClose);
    socket.addEventListener("error", this.onError);
    signal?.addEventListener("abort", this.abort, {once: true});
    if (signal?.aborted) this.abort();
  }
  private finish(error?: Error): void {
    this.ended = true; this.failure = error;
    if (this.pending) { const pending = this.pending; this.pending = undefined; if (error) pending.reject(error); else pending.resolve({done: true, value: undefined}); }
    this.signal?.removeEventListener("abort", this.abort);
    this.socket.removeEventListener("message", this.onMessage);
    this.socket.removeEventListener("close", this.onClose);
    this.socket.removeEventListener("error", this.onError);
  }
  private send(value: object | Uint8Array): void {
    if (this.ended || this.socket.readyState !== 1) throw this.failure ?? new Error("Connection is closed");
    const data = value instanceof Uint8Array ? value : JSON.stringify(value);
    const bytes = typeof data === "string" ? this.encoder.encode(data).byteLength : data.byteLength;
    if (bytes > 1024 * 1024 || this.socket.bufferedAmount + bytes > 1024 * 1024) throw new Error("WebSocket send queue exceeded 1 MiB");
    this.socket.send(data);
  }
  private terminal(type: string, fields: object = {}): void {
    if (this.ticket.purpose !== "pty" || !this.ticket.pty_id) throw new Error("This connection is not a PTY");
    this.sequence += 1n;
    if (this.sequence > 18446744073709551615n) throw new Error("Terminal client sequence exhausted");
    this.send({protocolVersion: 1, clientId: this.ticket.client_id, terminalId: this.ticket.pty_id, clientSequence: this.sequence.toString(), type, ...fields});
  }
  /** Sending input proves local send only. Unacknowledged input is never replayed. */
  write(data: string, encoding: "utf8" | "base64" = "utf8"): void {
    const bytes = encoding === "utf8" ? this.encoder.encode(data).byteLength : Uint8Array.from(atob(data), c => c.charCodeAt(0)).byteLength;
    if (bytes > 16384) throw new Error("Terminal input exceeds 16 KiB");
    this.terminal("terminal.input", {data, encoding});
  }
  resize(columns: number, rows: number): void {
    if (![columns, rows].every(value => Number.isInteger(value) && value >= 1 && value <= 1000)) throw new Error("Terminal dimensions must be 1–1000");
    this.terminal("terminal.resize", {columns, rows});
  }
  ping(): void { this.terminal("terminal.ping"); }
  closeTerminal(): void { this.terminal("terminal.close"); }
  disconnect(): void {this.finish(); this.socket.close(1000);}
  private desktop(value: object): void { if (this.ticket.purpose !== "desktop") throw new Error("Connection is not desktop"); this.send(value); }
  offer(sdp: string): void { this.desktop({type: "offer", protocol_version: 1, sdp, transport_generation: 1}); }
  ice(candidate: string, sdp_mid: string | null, sdp_mline_index: number | null): void { this.desktop({type: "ice_candidate", candidate, sdp_mid, sdp_mline_index, transport_generation: 1}); }
  startDesktop(): void { this.desktop({type: "desktop_start", transport: "webrtc", transport_generation: 1}); }
  /** Call after the negotiated WebRTC DataChannel opens to start the generation-1 stream. */
  startDesktopStream(): void { this.desktop({type: "start", transport_generation: 1}); }
  fallback(): void { this.desktop({type: "fallback", transport: "websocket", protocol: "rfb-3.8", transport_generation: 2}); }
  sendDesktopBytes(data: Uint8Array): void { if (this.ticket.purpose !== "desktop" || this.desktopGeneration !== 2) throw new Error("WSS desktop fallback is not admitted"); this.send(data); }
  openTerminal(body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions): void {
    if (body.pty_id) this.terminal("terminal.resume", {lastServerSequence: options.lastServerSequence ?? "0"});
    else this.terminal("terminal.open", {columns: body.cols, rows: body.rows, command: options.command, args: options.args, env: options.env, cwd: options.cwd});
  }
  async next(): Promise<IteratorResult<TerminalServerFrame | DesktopServerFrame | Uint8Array>> {
    if (this.queue.length) { const value = this.queue.shift()!; this.queuedBytes -= value instanceof Uint8Array ? value.byteLength : this.encoder.encode(JSON.stringify(value)).byteLength; return {value, done: false}; }
    if (this.failure) throw this.failure;
    if (this.ended) return {value: undefined, done: true};
    if (this.pending) throw new Error("Only one WebSocket reader is allowed");
    return new Promise((resolve, reject) => {this.pending = {resolve, reject};});
  }
  async *[Symbol.asyncIterator](): AsyncIterator<TerminalServerFrame | DesktopServerFrame | Uint8Array> {
    try { for (;;) {const item = await this.next(); if (item.done) return; yield item.value;} }
    finally {this.disconnect();}
  }
}
async function connectNativeSocket(client: NativeBeeOSClient, sandboxId: string, purpose: "pty" | "desktop", body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions): Promise<NativeSocketConnection> {
  const accepted = await client.accessTickets.create(sandboxId, {...body, purpose}, options);
  const ticket = accepted.body.data;
  const {ticket: secret, ...metadata} = ticket;
  try {
  const url = new URL(ticket.connect_url);
  if (url.protocol !== "wss:" || url.search || url.username || url.password || url.hash) throw new Error("Access ticket connect_url must be an exact WSS URL without query credentials");
  const expected = purpose === "pty" ? "beeos-terminal-v2" : "beeos-desktop-v1";
  if (ticket.profile !== expected || ticket.purpose !== purpose || ticket.sandbox_id !== sandboxId) throw new Error("Access ticket profile or target mismatch");
  const factory = client.options.webSocketFactory ?? ((endpoint: string, profile: string) => new WebSocket(endpoint, profile) as unknown as NativeWebSocket);
  const socket = factory(ticket.connect_url, expected);
  socket.binaryType = "arraybuffer";
  const connection = new NativeSocketConnection(socket, metadata, options.signal);
  connection.lastServerSequence = options.lastServerSequence ?? "0";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.min(5000, (options.requestTimeoutSeconds ?? 30) * 1000));
  const cancel = (): void => controller.abort();
  options.signal?.addEventListener("abort", cancel, {once: true});
  const closeOnAbort = (): void => connection.disconnect();
  controller.signal.addEventListener("abort", closeOnAbort, {once: true});
  try {
    await new Promise<void>((resolve, reject) => {
      const clean = (): void => {socket.removeEventListener("open", opened); socket.removeEventListener("error", failed); socket.removeEventListener("close", failed); controller.signal.removeEventListener("abort", failed);};
      const opened = (): void => {clean(); resolve();};
      const failed = (): void => {clean(); reject(new Error("WebSocket admission failed"));};
      socket.addEventListener("open", opened, {once: true}); socket.addEventListener("error", failed, {once: true}); socket.addEventListener("close", failed, {once: true}); controller.signal.addEventListener("abort", failed, {once: true});
      if (socket.readyState === 1) opened();
    });
    if (socket.protocol !== expected) throw new Error("WebSocket subprotocol mismatch");
    socket.send(JSON.stringify({type: "authenticate", profile: expected, ticket: secret}));
    const auth = await connection.next();
    const value = auth.value as unknown as {type?: string; profile?: string; client_id?: string; sandbox_id?: string; terminal_id?: string};
    if (auth.done || value.type !== "authenticated" || value.profile !== expected || value.client_id !== ticket.client_id || value.sandbox_id !== sandboxId || (purpose === "pty" && value.terminal_id !== ticket.pty_id)) throw new Error("WebSocket authenticated identity mismatch");
    if (purpose === "pty") {
      connection.openTerminal(body, options);
      const opened = await connection.next();
      const frame = opened.value as TerminalServerFrame;
      if (opened.done || frame.type !== "terminal.opened" || frame.terminalId !== ticket.pty_id || frame.clientId !== ticket.client_id || frame.resumed !== Boolean(body.pty_id)) throw new Error("PTY did not open or resume the requested terminal");
    }
    return connection;
  } catch (error) {connection.disconnect(); throw error;}
  finally {clearTimeout(timeout); options.signal?.removeEventListener("abort", cancel); controller.signal.removeEventListener("abort", closeOnAbort);}
  } catch (error) {throw new SDKConnectionError(metadata, accepted.acceptance, error);}
}

export type TerminalConnection = NativeSocketConnection;
export type DesktopSignalingConnection = NativeSocketConnection;
`;
