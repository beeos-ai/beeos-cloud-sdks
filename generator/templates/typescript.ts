/** Production BeeOS Cloud SDK. One install: @beeos-ai/cloud-sdk. Credential is bsk_ only. */

import { createHmac, timingSafeEqual } from "node:crypto";

export type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };

export interface HTTPErrorBody { contentType: string; text: string; json?: JSONValue; reason?: string; }

export class BeeOSAPIError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
    readonly body?: Models.APIErrorBody | HTTPErrorBody,
  ) {
    super(message);
    this.name = "BeeOSAPIError";
  }
}

export interface BeeOSClientOptions {
  baseURL: string;
  apiKey: string | (() => string);
  fetch?: typeof fetch;
  externalUserId?: string;
}

type Query = Record<string, string | number | boolean | undefined>;

export class BeeOSClient {
  readonly identity: IdentityModule;
  readonly usage: UsageModule;
  readonly catalog: CatalogModule;
  readonly instances: InstancesModule;
  readonly agents: AgentsModule;
  readonly conversations: ConversationsModule;
  readonly messages: MessagesModule;
  readonly tasks: TasksModule;
  readonly files: FilesModule;
  readonly appWebhooks: AppWebhooksModule;
  readonly methods: MethodsModule;

  constructor(private readonly options: BeeOSClientOptions) {
    if (!options.baseURL || !options.apiKey) throw new Error("Server baseURL and bsk_ apiKey are required");
    this.identity = new IdentityModule(this);
    this.usage = new UsageModule(this);
    this.catalog = new CatalogModule(this);
    this.instances = new InstancesModule(this);
    this.agents = new AgentsModule(this);
    this.conversations = new ConversationsModule(this);
    this.messages = new MessagesModule(this);
    this.tasks = new TasksModule(this);
    this.files = new FilesModule(this);
    this.appWebhooks = new AppWebhooksModule(this);
    this.methods = new MethodsModule(this);
  }

  withExternalUser(id: string): BeeOSClient {
    if (!id || id.trim() !== id || id === "." || id === "..") throw new Error("invalid external user id");
    return new BeeOSClient({ ...this.options, externalUserId: id });
  }

  async request(method: string, path: string, init: { query?: Query; json?: unknown; idempotencyKey?: string; headers?: Record<string, string> } = {}): Promise<unknown> {
    const url = new URL(path.replace(/^\//, ""), this.options.baseURL.endsWith("/") ? this.options.baseURL : this.options.baseURL + "/");
    for (const [key, value] of Object.entries(init.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const headers: Record<string, string> = {
      Authorization: `Bearer ${typeof this.options.apiKey === "function" ? this.options.apiKey() : this.options.apiKey}`,
      Accept: "application/json",
      ...init.headers,
    };
    if (this.options.externalUserId) headers["X-BeeOS-External-User-ID"] = this.options.externalUserId;
    if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;
    let body: string | undefined;
    if (init.json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(init.json);
    }
    const fetchImpl = this.options.fetch ?? globalThis.fetch;
    const response = await fetchImpl(url, { method, headers, body });
    const requestId = response.headers.get("X-Request-ID") ?? undefined;
    if (!response.ok) {
      const contentType = response.headers.get("Content-Type") ?? "";
      const text = await response.text();
      let payload: JSONValue;
      try {
        payload = JSON.parse(text) as JSONValue;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        throw new BeeOSAPIError(response.status, "invalid_response", response.statusText, requestId, { contentType, text, reason: "invalid_json" });
      }
      let code = "invalid_response";
      let message = response.statusText;
      let body: Models.APIErrorBody | HTTPErrorBody = { contentType, text, json: payload, reason: "invalid_envelope" };
      if (payload !== null && typeof payload === "object" && !Array.isArray(payload)) {
        if (typeof payload.message === "string") message = payload.message;
        const envelope = init.basePath === "/uhp/v1" ? payload.error : payload;
        if (envelope !== null && typeof envelope === "object" && !Array.isArray(envelope)) {
          const candidate = envelope[init.errorCodeField === "error" ? "error" : "code"];
          if (typeof candidate === "string" && candidate.length > 0) {
            code = candidate;
            if (typeof envelope.message === "string") {
              message = envelope.message;
              body = payload as Models.APIErrorBody;
            }
          }
        }
      }
      throw new BeeOSAPIError(response.status, code, message, requestId, body);
    }
    if (response.status === 204) return undefined;
    return response.json();
  }
}

class IdentityModule {
  constructor(private readonly client: BeeOSClient) {}
  createClientSession(input: unknown, idempotencyKey: string) {
    return this.client.request("POST", "client-sessions", { json: input, idempotencyKey });
  }
  refreshClientSession(sessionId: string, input: unknown, idempotencyKey: string) {
    return this.client.request("POST", `client-sessions/${sessionId}/refresh`, { json: input, idempotencyKey });
  }
  revokeClientSession(sessionId: string, idempotencyKey: string) {
    return this.client.request("DELETE", `client-sessions/${sessionId}`, { idempotencyKey });
  }
  deleteExternalUser(externalUserId: string, idempotencyKey: string) {
    return this.client.request("DELETE", `external-users/${externalUserId}`, { idempotencyKey });
  }
  getExternalUserDeletion(externalUserId: string, deletionId: string) {
    return this.client.request("GET", `external-users/${externalUserId}/deletions/${deletionId}`);
  }
}

class UsageModule {
  constructor(private readonly client: BeeOSClient) {}
  getSummary(query: Query) {
    return this.client.request("GET", "usage/summary", { query });
  }
}

class CatalogModule {
  constructor(private readonly client: BeeOSClient) {}
  listProviders(query?: Query) {
    return this.client.request("GET", "providers", { query });
  }
  listRegions(query?: Query) {
    return this.client.request("GET", "deploy/regions", { query });
  }
  listModels(query?: Query) {
    return this.client.request("GET", "deploy/models", { query });
  }
  listInstanceTemplates(query?: Query) {
    return this.client.request("GET", "instance-templates", { query });
  }
  getInstanceTemplate(id: string) {
    return this.client.request("GET", `instance-templates/${id}`);
  }
  listAgentTemplates(query?: Query) {
    return this.client.request("GET", "agent-templates", { query });
  }
  getAgentTemplate(id: string) {
    return this.client.request("GET", `agent-templates/${id}`);
  }
}

class InstancesModule {
  constructor(private readonly client: BeeOSClient) {}
  create(input: { name: string }, idempotencyKey: string) {
    return this.client.request("POST", "instances", { json: { name: input.name }, idempotencyKey });
  }
  list(query?: Query) {
    return this.client.request("GET", "instances", { query });
  }
  get(id: string) {
    return this.client.request("GET", `instances/${id}`);
  }
  getStatus(id: string) {
    return this.client.request("GET", `instances/${id}/status`);
  }
  stop(id: string, idempotencyKey: string, version: number) {
    return this.client.request("POST", `instances/${id}/stop`, { json: {}, idempotencyKey, headers: { "If-Match": `"${version}"` } });
  }
  delete(id: string, idempotencyKey: string, version: number) {
    return this.client.request("DELETE", `instances/${id}`, { idempotencyKey, headers: { "If-Match": `"${version}"` } });
  }
  open(id: string) {
    return new Instance(this.client, id);
  }
}

class AgentsModule {
  constructor(private readonly client: BeeOSClient) {}
  list(query?: Query) {
    return this.client.request("GET", "agents", { query });
  }
  get(id: string) {
    return this.client.request("GET", `agents/${id}`);
  }
  update(id: string, patch: unknown, resourceVersion: number) {
    return this.client.request("PATCH", `agents/${id}`, { json: patch, headers: { "If-Match": `"${resourceVersion}"` } });
  }
}

class ConversationsModule {
  constructor(private readonly client: BeeOSClient) {}
  create(agentId: string, input: unknown, idempotencyKey: string) {
    return this.client.request("POST", `agents/${agentId}/conversations`, { json: input, idempotencyKey });
  }
  list(agentId: string, query?: Query) {
    return this.client.request("GET", `agents/${agentId}/conversations`, { query });
  }
  get(agentId: string, conversationId: string) {
    return this.client.request("GET", `agents/${agentId}/conversations/${conversationId}`);
  }
  update(agentId: string, conversationId: string, input: unknown, version: number) {
    return this.client.request("PATCH", `agents/${agentId}/conversations/${conversationId}`, { json: input, headers: { "If-Match": `"${version}"` } });
  }
  delete(agentId: string, conversationId: string, idempotencyKey: string) {
    return this.client.request("DELETE", `agents/${agentId}/conversations/${conversationId}`, { idempotencyKey });
  }
  cancel(agentId: string, conversationId: string, idempotencyKey: string, input?: unknown) {
    return this.client.request("POST", `agents/${agentId}/conversations/${conversationId}/cancel`, { json: input ?? {}, idempotencyKey });
  }
  clear(agentId: string, conversationId: string, idempotencyKey: string) {
    return this.client.request("POST", `agents/${agentId}/conversations/${conversationId}/clear`, { idempotencyKey });
  }
  setModel(agentId: string, conversationId: string, modelId: string | null, version: number) {
    return this.client.request("PUT", `agents/${agentId}/conversations/${conversationId}/model`, {
      json: { model_override_id: modelId },
      headers: { "If-Match": `"${version}"` },
    });
  }
}

class MessagesModule {
  constructor(private readonly client: BeeOSClient) {}
  list(agentId: string, conversationId: string, query?: Query) {
    return this.client.request("GET", `agents/${agentId}/conversations/${conversationId}/messages`, { query });
  }
  get(agentId: string, conversationId: string, messageId: string) {
    return this.client.request("GET", `agents/${agentId}/conversations/${conversationId}/messages/${messageId}`);
  }
}

class TasksModule {
  constructor(private readonly client: BeeOSClient) {}
  create(agentId: string, input: unknown, idempotencyKey: string) {
    return this.client.request("POST", `agents/${agentId}/tasks`, { json: input, idempotencyKey });
  }
  list(agentId: string, query?: Query) {
    return this.client.request("GET", `agents/${agentId}/tasks`, { query });
  }
  get(agentId: string, taskId: string) {
    return this.client.request("GET", `agents/${agentId}/tasks/${taskId}`);
  }
  listMessages(agentId: string, taskId: string, query?: Query) {
    return this.client.request("GET", `agents/${agentId}/tasks/${taskId}/messages`, { query });
  }
  cancel(agentId: string, taskId: string, idempotencyKey: string) {
    return this.client.request("POST", `agents/${agentId}/tasks/${taskId}/cancel`, { idempotencyKey });
  }
  continueTask(agentId: string, taskId: string, input: unknown, idempotencyKey: string) {
    return this.client.request("POST", `agents/${agentId}/tasks/${taskId}/continue`, { json: input, idempotencyKey });
  }
}

class FilesModule {
  constructor(private readonly client: BeeOSClient) {}
  prepareUpload(input: unknown, idempotencyKey: string) {
    return this.client.request("POST", "files/presign-upload", { json: input, idempotencyKey });
  }
  confirmUpload(fileId: string, input: unknown, idempotencyKey: string) {
    return this.client.request("POST", `files/${fileId}/confirm`, { json: input, idempotencyKey });
  }
  list(query?: Query) {
    return this.client.request("GET", "files", { query });
  }
  get(fileId: string) {
    return this.client.request("GET", `files/${fileId}`);
  }
  resolveDownload(fileId: string) {
    return this.client.request("GET", `files/${fileId}`);
  }
  upload(input: unknown, idempotencyKey: string) {
    return this.prepareUpload(input, idempotencyKey);
  }
  download(fileId: string) {
    return this.resolveDownload(fileId);
  }
  delete(fileId: string, idempotencyKey: string) {
    return this.client.request("DELETE", `files/${fileId}`, { idempotencyKey });
  }
}

class AppWebhooksModule {
  constructor(private readonly client: BeeOSClient) {}
  verifySvixSignature(rawBody: Uint8Array, headers: Record<string, string>, secret: string, now = Date.now()) {
    return verifySvixWebhookSignature(rawBody, headers, secret, now);
  }
}

function header(headers: Record<string, string>, name: string): string {
  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === wanted) return value;
  }
  return "";
}

function timestampAccepted(timestamp: number, now: number): boolean {
  const skew = Math.abs(now / 1000 - timestamp);
  return Number.isFinite(timestamp) && skew <= 300;
}

export function verifyTaskWebhookSignature(rawBody: Uint8Array, headers: Record<string, string>, secret: string, now = Date.now()): boolean {
  if (secret.length < 32 || !header(headers, "X-BeeOS-Event-Id")) {
    throw new BeeOSAPIError(401, "invalid_webhook_signature", "invalid Task Webhook signature input");
  }
  const parsed = parseVersionedSignature(header(headers, "X-BeeOS-Signature"));
  if (!parsed || !timestampAccepted(parsed.timestamp, now)) {
    throw new BeeOSAPIError(401, "invalid_webhook_signature", "invalid Task Webhook signature");
  }
  const expected = createHmac("sha256", secret).update(`${parsed.timestamp}.`).update(rawBody).digest();
  for (const signature of parsed.signatures) {
    const actual = Buffer.from(signature, "hex");
    if (actual.length === expected.length && timingSafeEqual(actual, expected)) return true;
  }
  throw new BeeOSAPIError(401, "invalid_webhook_signature", "invalid Task Webhook signature");
}

export function verifySvixWebhookSignature(rawBody: Uint8Array, headers: Record<string, string>, secret: string, now = Date.now()): boolean {
  const messageId = header(headers, "svix-id");
  const timestampValue = header(headers, "svix-timestamp");
  const signatureValue = header(headers, "svix-signature");
  if (!secret.startsWith("whsec_") || !messageId) {
    throw new BeeOSAPIError(401, "invalid_webhook_signature", "invalid Svix signature input");
  }
  const timestamp = Number(timestampValue);
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  if (!timestampAccepted(timestamp, now) || key.length < 16) {
    throw new BeeOSAPIError(401, "invalid_webhook_signature", "invalid Svix signature");
  }
  const expected = createHmac("sha256", key).update(`${messageId}.${timestampValue}.`).update(rawBody).digest();
  for (const candidate of signatureValue.split(/\s+/)) {
    const [version, value] = candidate.split(",", 2);
    if (version !== "v1" || !value) continue;
    const actual = Buffer.from(value, "base64");
    if (actual.length === expected.length && timingSafeEqual(actual, expected)) return true;
  }
  throw new BeeOSAPIError(401, "invalid_webhook_signature", "invalid Svix signature");
}

function parseVersionedSignature(value: string): { timestamp: number; signatures: string[] } | null {
  let timestamp = 0;
  const signatures: string[] = [];
  for (const part of value.split(",")) {
    const [key, raw] = part.trim().split("=", 2);
    if (!raw) return null;
    if (key === "t") timestamp = Number(raw);
    if (key === "v1") signatures.push(raw);
  }
  return timestamp && signatures.length ? { timestamp, signatures } : null;
}

class MethodsModule {
  constructor(private readonly client: BeeOSClient) {}
  getCapabilities(instanceId: string) {
    return this.client.request("GET", `instances/${instanceId}/runtime-capabilities`);
  }
  invoke(instanceId: string, method: string, params: unknown, idempotencyKey: string) {
    return this.client.request("POST", `instances/${instanceId}/methods`, {
      json: { jsonrpc: "2.0", id: idempotencyKey, method, params },
      idempotencyKey,
    });
  }
  readonly agents = {
    create: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "agent/create", params, idempotencyKey),
    update: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "agent/update", params, idempotencyKey),
    delete: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "agent/delete", params, idempotencyKey),
    applyTemplate: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "agent/applyTemplate", params, idempotencyKey),
  };
  readonly skills = {
    list: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "skills/list", params, idempotencyKey),
    install: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "skills/install", params, idempotencyKey),
    update: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "skills/update", params, idempotencyKey),
    uninstall: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "skills/uninstall", params, idempotencyKey),
  };
  readonly models = {
    list: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "models/list", params, idempotencyKey),
  };
  readonly cron = {
    list: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/list", params, idempotencyKey),
    getStatus: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/status", params, idempotencyKey),
    add: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/add", params, idempotencyKey),
    update: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/update", params, idempotencyKey),
    remove: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/remove", params, idempotencyKey),
    run: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/run", params, idempotencyKey),
    listRuns: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "cron/runs", params, idempotencyKey),
  };
  readonly mcp = {
    list: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "mcp/list", params, idempotencyKey),
    set: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "mcp/set", params, idempotencyKey),
    unset: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "mcp/unset", params, idempotencyKey),
  };
  readonly sessions = {
    setMode: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "session/set_mode", params, idempotencyKey),
    setModel: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "session/set_model", params, idempotencyKey),
    clear: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "session/clear", params, idempotencyKey),
    cancel: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "session/cancel", params, idempotencyKey),
  };
  readonly canvas = {
    toggle: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "canvas/toggle", params, idempotencyKey),
    clear: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "canvas/clear", params, idempotencyKey),
    reference: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "canvas/reference", params, idempotencyKey),
    setDimensions: (instanceId: string, params: unknown, idempotencyKey: string) => this.invoke(instanceId, "canvas/dimensions", params, idempotencyKey),
  };
}

type C14Call = (params: unknown, idempotencyKey: string) => Promise<unknown>;

export class Instance {
  readonly agents: { create: C14Call; update: C14Call; delete: C14Call; applyTemplate: C14Call };
  readonly skills: { list: C14Call; install: C14Call; update: C14Call; uninstall: C14Call };
  readonly models: { list: C14Call };
  readonly cron: { list: C14Call; getStatus: C14Call; add: C14Call; update: C14Call; remove: C14Call; run: C14Call; listRuns: C14Call };
  readonly mcp: { list: C14Call; set: C14Call; unset: C14Call };
  readonly sessions: { setMode: C14Call; setModel: C14Call; clear: C14Call; cancel: C14Call };
  readonly canvas: { toggle: C14Call; clear: C14Call; reference: C14Call; setDimensions: C14Call };

  constructor(private readonly client: BeeOSClient, readonly id: string) {
    const invoke = (method: string): C14Call => (params, idempotencyKey) => this.client.methods.invoke(this.id, method, params, idempotencyKey);
    this.agents = { create: invoke("agent/create"), update: invoke("agent/update"), delete: invoke("agent/delete"), applyTemplate: invoke("agent/applyTemplate") };
    this.skills = { list: invoke("skills/list"), install: invoke("skills/install"), update: invoke("skills/update"), uninstall: invoke("skills/uninstall") };
    this.models = { list: invoke("models/list") };
    this.cron = { list: invoke("cron/list"), getStatus: invoke("cron/status"), add: invoke("cron/add"), update: invoke("cron/update"), remove: invoke("cron/remove"), run: invoke("cron/run"), listRuns: invoke("cron/runs") };
    this.mcp = { list: invoke("mcp/list"), set: invoke("mcp/set"), unset: invoke("mcp/unset") };
    this.sessions = { setMode: invoke("session/set_mode"), setModel: invoke("session/set_model"), clear: invoke("session/clear"), cancel: invoke("session/cancel") };
    this.canvas = { toggle: invoke("canvas/toggle"), clear: invoke("canvas/clear"), reference: invoke("canvas/reference"), setDimensions: invoke("canvas/dimensions") };
  }

  getCapabilities() {
    return this.client.methods.getCapabilities(this.id);
  }
  invoke(method: string, params: unknown, idempotencyKey: string) {
    return this.client.methods.invoke(this.id, method, params, idempotencyKey);
  }
}
