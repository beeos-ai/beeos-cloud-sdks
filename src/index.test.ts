import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { BeeOSAPIError, BeeOSClient, verifyTaskWebhookSignature } from "./index.ts";

describe("BeeOSClient", () => {
  it("sends bsk_ and scopes external user without mutating the parent", async () => {
    const calls: Array<{ url: string; auth: string | null; user: string | null }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      const headers = new Headers(init?.headers);
      calls.push({ url, auth: headers.get("Authorization"), user: headers.get("X-BeeOS-External-User-ID") });
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
    };
    const client = new BeeOSClient({ baseURL: "https://api.cloud.beeos.ai/v1/", apiKey: "bsk_test", fetch: fetchImpl });
    const scoped = client.withExternalUser("user-a");
    await client.instances.list();
    await scoped.agents.get("agt_1");
    expect(calls[0].auth).toBe("Bearer bsk_test");
    expect(calls[0].user).toBeNull();
    expect(calls[1].user).toBe("user-a");
    expect(calls[1].url).toContain("/agents/agt_1");
  });

  it("maps error envelopes", async () => {
    const client = new BeeOSClient({
      baseURL: "https://api.cloud.beeos.ai/v1/",
      apiKey: "bsk_test",
      fetch: async () => new Response(JSON.stringify({ code: "instance_execution_unavailable", message: "no runtime" }), { status: 503, headers: { "Content-Type": "application/json" } }),
    });
    await expect(client.instances.create({ name: "n" }, "key")).rejects.toMatchObject({
      status: 503,
      code: "instance_execution_unavailable",
    } satisfies Partial<BeeOSAPIError>);
  });

  it("uses ISV /v1 instance lifecycle paths, Idempotency-Key and If-Match", async () => {
    const calls: Array<{ url: string; method: string | undefined; idem: string | null; match: string | null; body: string | undefined }> = [];
    const client = new BeeOSClient({
      baseURL: "https://api.cloud.beeos.ai/v1/",
      apiKey: "bsk_test",
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        calls.push({
          url: String(input),
          method: init?.method,
          idem: headers.get("Idempotency-Key"),
          match: headers.get("If-Match"),
          body: typeof init?.body === "string" ? init.body : undefined,
        });
        if (init?.method === "POST" || init?.method === "DELETE") {
          return new Response(JSON.stringify({ data: { id: "inst_1", status: "provisioning" }, operation: { id: "op_1", kind: "create", phase: "provisioning" } }), { status: 202, headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ data: { id: "inst_1", status: "running" } }), { status: 200, headers: { "Content-Type": "application/json" } });
      },
    });
    await client.instances.create({ name: "nightly" }, "idem-create");
    await client.instances.get("inst_1");
    await client.instances.getStatus("inst_1");
    await client.instances.stop("inst_1", "idem-stop", 3);
    await client.instances.delete("inst_1", "idem-delete", 4);
    expect(calls[0].url).toMatch(/\/instances$/);
    expect(calls[0].method).toBe("POST");
    expect(calls[0].idem).toBe("idem-create");
    expect(JSON.parse(calls[0].body ?? "{}")).toEqual({ name: "nightly" });
    expect(calls[1].url).toMatch(/\/instances\/inst_1$/);
    expect(calls[2].url).toContain("/instances/inst_1/status");
    expect(calls[3].url).toMatch(/\/instances\/inst_1\/stop$/);
    expect(calls[3].method).toBe("POST");
    expect(calls[3].idem).toBe("idem-stop");
    expect(calls[3].match).toBe('"3"');
    expect(JSON.parse(calls[3].body ?? "{}")).toEqual({});
    expect(calls[4].method).toBe("DELETE");
    expect(calls[4].url).toMatch(/\/instances\/inst_1$/);
    expect(calls[4].idem).toBe("idem-delete");
    expect(calls[4].match).toBe('"4"');
    expect(calls.every((call) => !call.url.includes("/open/v1") && !call.url.includes("/api/v1"))).toBe(true);
    expect(JSON.stringify(calls.map((call) => call.body))).not.toContain("bsk_");
  });

  it("uses FILE-API-001 presign-upload and METHOD-API-002 JSON-RPC", async () => {
    const calls: Array<{ url: string; method: string | undefined; body: string | undefined }> = [];
    const client = new BeeOSClient({
      baseURL: "https://api.cloud.beeos.ai/v1/",
      apiKey: "bsk_test",
      fetch: async (input, init) => {
        calls.push({ url: String(input), method: init?.method, body: typeof init?.body === "string" ? init.body : undefined });
        return new Response(JSON.stringify({ file_id: "file_1" }), { status: 200, headers: { "Content-Type": "application/json" } });
      },
    });
    await client.catalog.listRegions();
    await client.catalog.listModels();
    await client.files.prepareUpload({ filename: "a.txt", content_type: "text/plain", size_bytes: 1 }, "idem-1");
    await client.files.resolveDownload("file_1");
    await client.instances.getStatus("inst_1");
    await client.methods.invoke("inst_1", "models/list", {}, "idem-2");
    await client.instances.open("inst_1").agents.create({ name: "a" }, "idem-3");
    await client.methods.canvas.setDimensions("inst_1", { width: 1, height: 1 }, "idem-4");
    expect(calls[0].url).toContain("/deploy/regions");
    expect(calls[1].url).toContain("/deploy/models");
    expect(calls[2].url).toContain("/files/presign-upload");
    expect(calls[3].method).toBe("GET");
    expect(calls[3].url).toMatch(/\/files\/file_1$/);
    expect(calls[4].url).toContain("/instances/inst_1/status");
    expect(calls[5].url).toMatch(/\/instances\/inst_1\/methods$/);
    expect(JSON.parse(calls[5].body ?? "{}")).toMatchObject({ jsonrpc: "2.0", id: "idem-2", method: "models/list" });
    expect(calls[6].url).toMatch(/\/instances\/inst_1\/methods$/);
    expect(JSON.parse(calls[6].body ?? "{}")).toMatchObject({ jsonrpc: "2.0", id: "idem-3", method: "agent/create" });
    expect(JSON.parse(calls[7].body ?? "{}")).toMatchObject({ method: "canvas/dimensions", id: "idem-4" });
  });

  it("verifies task webhook HMAC", () => {
    const secret = "s".repeat(32);
    const body = Buffer.from(`{"ok":true}`);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest("hex");
    const client = new BeeOSClient({ baseURL: "https://api.cloud.beeos.ai/v1/", apiKey: "bsk_test", fetch: async () => new Response("{}", { status: 200 }) });
    expect(verifyTaskWebhookSignature(body, { "X-BeeOS-Event-Id": "evt_1", "X-BeeOS-Signature": `t=${timestamp},v1=${signature}` }, secret)).toBe(true);
  });
});

describe('generated typed resources', () => {
  it('preserves variant and BYOK configuration, auth and scoped actor', async () => {
    const llm = { providers: [{ id: 'provider-example', protocol: 'openai' as const, base_url: 'https://example.invalid/v1', api_key: 'example-provider-key' }], models: [{ provider_id: 'provider-example', model: 'model-example', role: 'default', order: 0 }] };
    const input = { name: 'typed', variant_id: 'variant-example', llm };
    let request: Request | undefined;
    const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: () => 'example-api-key', fetch: async (url, init) => {
      request = new Request(url, init);
      return Response.json({ data: { id: 'instance-example' }, operation: { id: 'operation-example' } }, { status: 202 });
    } }).withExternalUser('example-user');
    const result = await client.instances.create(input, 'example-idempotency-key');
    expect(result.data.id).toBe('instance-example');
    expect(await request!.json()).toEqual(input);
    expect(request!.headers.get('Authorization')).toBe('Bearer example-api-key');
    expect(request!.headers.get('X-BeeOS-External-User-ID')).toBe('example-user');
  });

  it('uses the producer UHP surface and preserves typed nested errors', async () => {
    const calls: string[] = [];
    const body = { error: { type: 'invalid_request_error', code: 'harness_not_found', message: 'missing harness' } };
    const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async (url) => {
      calls.push(String(url));
      return Response.json(body, { status: 404, headers: { 'X-Request-ID': 'request-example' } });
    } });
    await expect(client.responses.create({ input: 'hello', metadata: { harness_id: 'harness-example' } })).rejects.toMatchObject({ status: 404, code: 'harness_not_found', requestId: 'request-example', body });
    expect(calls).toEqual(['https://example.invalid/uhp/v1/responses']);
  });

  it('decodes typed SSE events across CRLF chunk boundaries', async () => {
    const chunks = ['data: {"type":"response.created","response":{"id":"response-example"}}\r', '\n\r\n', 'data: [DONE]\r\n\r\n'];
    const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async (_url, init) => {
      expect(new Headers(init?.headers).get('Accept')).toBe('text/event-stream');
      expect(JSON.parse(String(init?.body)).stream).toBe(true);
      return new Response(new ReadableStream<Uint8Array>({ start(controller) { for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk)); controller.close(); } }), { headers: { 'Content-Type': 'text/event-stream' } });
    } });
    const events = await client.responses.createStream({ input: 'hello' });
    const received = [];
    for await (const event of events) received.push(event);
    expect(received).toEqual([{ type: 'response.created', response: { id: 'response-example' } }]);
  });

  it('keeps malformed error responses visible', async () => {
    const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => new Response('invalid JSON', { status: 500, headers: { 'Content-Type': 'application/json' } }) });
    await expect(client.instances.get('instance-example')).rejects.toMatchObject({ status: 500, code: 'invalid_response', body: { text: 'invalid JSON', reason: 'invalid_json' } });
  });
});

it('sends audio as multipart rather than JSON', async () => {
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async (_url, init) => {
    expect(init?.body).toBeInstanceOf(FormData);
    expect(new Headers(init?.headers).has('Content-Type')).toBe(false);
    const file = (init!.body as FormData).get('file') as Blob;
    expect(await file.text()).toBe('example-audio-bytes');
    return Response.json({ success: true, data: { text: 'hello', duration_seconds: 1 } });
  } });
  const result = await client.audio.transcribe({ file: new Blob(['example-audio-bytes'], { type: 'audio/wav' }) });
  expect(result.data.text).toBe('hello');
});

it('preserves typed HTTP errors for plaintext gateway failures', async () => {
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => new Response('404 page not found', { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'text/plain; charset=utf-8' } }) });
  await expect(client.instances.get('instance-example')).rejects.toMatchObject({ status: 404, code: 'invalid_response', body: { contentType: 'text/plain; charset=utf-8', text: '404 page not found' } } satisfies Partial<BeeOSAPIError>);
});

it('resumes typed Responses events with the producer cursor header', async () => {
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async (url, init) => {
    expect(String(url)).toBe('https://example.invalid/uhp/v1/responses/response-example/events');
    expect(new Headers(init?.headers).get('Last-Event-ID')).toBe('7');
    return new Response('data: {"type":"response.completed","sequence_number":8}\n\n', { headers: { 'Content-Type': 'text/event-stream' } });
  } });
  const events = await client.responses.getEvents('response-example', '7');
  for await (const event of events) expect(event.sequence_number).toBe(8);
});

it('decodes the device binding producer error field', async () => {
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => Response.json({ error: 'not_found', message: 'missing binding' }, { status: 404 }) });
  await expect(client.deviceBindings.getDetails('binding-example')).rejects.toMatchObject({ status: 404, code: 'not_found', message: 'missing binding', body: { error: 'not_found', message: 'missing binding' } });
});

describe.each(['Cloud', 'UHP'] as const)('%s total HTTP error mapping', (surface) => {
  const cases: Array<{ name: string; status: number; statusText: string; body: string; contentType: string }> = [
    { name: 'plain gateway error', status: 502, statusText: 'Bad Gateway', body: 'upstream unavailable', contentType: 'text/plain' },
    { name: 'message-only JSON', status: 502, statusText: 'Bad Gateway', body: '{"message":"gateway failed"}', contentType: 'application/json' },
    { name: 'error string JSON', status: 429, statusText: 'Too Many Requests', body: '{"error":"rate limited"}', contentType: 'application/json' },
    { name: 'invalid JSON media body', status: 502, statusText: 'Bad Gateway', body: '<html>gateway error</html>', contentType: 'application/json' },
    { name: 'empty JSON object', status: 502, statusText: 'Bad Gateway', body: '{}', contentType: 'application/json' },
    { name: 'JSON null', status: 502, statusText: 'Bad Gateway', body: 'null', contentType: 'application/json' },
    { name: 'JSON array', status: 502, statusText: 'Bad Gateway', body: '[]', contentType: 'application/json' },
    { name: 'empty error code', status: 502, statusText: 'Bad Gateway', body: surface === 'UHP' ? '{"error":{"code":"","message":"bad"}}' : '{"code":"","message":"bad"}', contentType: 'application/json' },
  ];
  it.each(cases)('$name preserves APIError status and fallback code', async (example) => {
    const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => new Response(example.body, { status: example.status, statusText: example.statusText, headers: { 'Content-Type': example.contentType, 'X-Request-ID': 'request-example' } }) });
    const request = surface === 'UHP' ? client.responses.get('response-example') : client.instances.get('instance-example');
    try {
      await request;
      throw new Error('expected API failure');
    } catch (error) {
      expect(error).toBeInstanceOf(BeeOSAPIError);
      expect(error).toMatchObject({ status: example.status, code: 'invalid_response', requestId: 'request-example', body: { text: example.body } });
    }
  });
  it('preserves a valid producer envelope and its code', async () => {
    const body = surface === 'UHP' ? { error: { type: 'invalid_request_error', code: 'response_not_found', message: 'missing response' } } : { code: 'not_found', message: 'missing instance', request_id: 'request-example' };
    const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => Response.json(body, { status: 404 }) });
    const request = surface === 'UHP' ? client.responses.get('response-example') : client.instances.get('instance-example');
    await expect(request).rejects.toMatchObject({ status: 404, code: surface === 'UHP' ? 'response_not_found' : 'not_found', body });
  });
});

it('maps a UHP non-envelope without dereferencing missing fields', async () => {
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => Response.json({ code: 'proxy_error', message: 'proxy failed' }, { status: 502 }) });
  await expect(client.responses.get('response-example')).rejects.toMatchObject({ status: 502, code: 'invalid_response', message: 'proxy failed' });
});

it('keeps transport failures without an HTTP status visible', async () => {
  const failure = new TypeError('network unavailable');
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key', fetch: async () => { throw failure; } });
  await expect(client.instances.get('instance-example')).rejects.toBe(failure);
});

it('removes the inactive server resources and methods in v2', () => {
  const client = new BeeOSClient({ baseURL: 'https://example.invalid/v1', apiKey: 'example-api-key' });
  for (const resource of ['images', 'imageVersions', 'eventSessions', 'taskWebhooks', 'runtime']) expect(resource in client).toBe(false);
  for (const method of ['getHistory', 'getLimits']) expect(method in client.usage).toBe(false);
  expect('send' in client.messages).toBe(false);
  expect('getEvents' in client.operations).toBe(false);
});
