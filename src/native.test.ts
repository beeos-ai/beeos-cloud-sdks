import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { NativeBeeOSClient, NativeBeeOSAPIError, SDKCancelled, SDKWaitTimeout, SDKPublicationSuperseded } from "./native.js";
import type { AuthorizationEnforcement, CredentialPublicStatus } from "./native.js";
const servers: Server[] = [];
afterEach(async () => { for (const server of servers.splice(0))
    await new Promise<void>(resolve => server.close(() => resolve())); });
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
const client = (fetchImpl: typeof fetch) => new NativeBeeOSClient({ baseURL: "https://cloud.example/v1/ignored", apiKey: "bsk_test", fetch: fetchImpl });
const sandbox = (status: string) => ({ data: { id: "sbx_test", status } });
const recipeTarget = { kind: "recipe", template: "beeos/base" } as const;
const agent = (state: string, revision = "rev_2", target = "managed") => ({ data: { id: "agent_test", desired_config_revision: revision, configuration: { target: target === "managed" ? { kind: "managed", sandbox_id: "sbx_test" } : recipeTarget, credential_status: {slots: []} }, publication: { accepted_config_revision: revision, state, changed_components: ["model"], components: [] }, binding: { sandbox_id: "sbx_test", prepared_config_revision: revision, credential_activation_revision: "rev_1", credential_status: { slots: [{slot: "model_primary", configured: true}, {slot: "search_provider", configured: false}] } } } });
describe("native transport and observations", () => {
    it("performs all 58 canonical HTTP operations with versioned/encoded paths and wire options", async () => {
        const spec = JSON.parse(readFileSync(new URL("../spec/native.openapi.json", import.meta.url), "utf8"));
        let count = 0;
        for (const [path, item] of Object.entries(spec.paths) as [
            string,
            Record<string, any>
        ][])
            for (const [method, op] of Object.entries(item)) {
                if (!op.operationId)
                    continue;
                let observed = false;
                const response = Object.entries(op.responses).find(([code]) => code.startsWith("2"))!;
                const status = Number(response[0]);
                const media = Object.keys((response[1] as any).content ?? {})[0];
                const streamFrame = op.operationId === "streamNativeResponseEvents"
                    ? 'id: 3\ndata: {"type":"response.phase","response_id":"id_one","sequence":3,"phase":"executing"}\n\n'
                    : 'id: 3\ndata: {"type":"status"}\n\n';
                const c = client(async (input, init) => { observed = true; expect(new URL(String(input)).pathname).toBe(path.replace(/\{[^}]+\}/g, "id%2Fone")); expect(init?.method).toBe(method.toUpperCase()); expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer bsk_test"); return media === "text/event-stream" ? new Response(streamFrame, { headers: { "Content-Type": media } }) : status === 204 ? new Response(null, { status }) : media === "application/octet-stream" ? new Response(new Uint8Array([0, 255])) : json({ data: { id: "id_one" } }, status); });
                const module = op["x-sdk-resource"].split(".").reduce((parent: any, key: string) => parent[key], c);
                const params = (op.parameters ?? []).map((p: any) => p.$ref ? p.$ref.split("/").slice(1).reduce((v: any, k: string) => v[k], spec) : p);
                const options = { wait: false, idempotencyKey: "restore-key", ifMatch: '"7"', path: "/workspace/a", contentLength: 2, contentSha256: "a".repeat(64), filename: "a.bin", mediaType: "application/octet-stream" };
                const args: any[] = params.filter((p: any) => p.in === "path").map(() => "id/one");
                if (op.requestBody)
                    args.push(Object.keys(op.requestBody.content)[0] === "application/octet-stream" ? new Uint8Array([0, 255]) : {});
                args.push(options);
                const result = await module[op["x-sdk-method"]](...args);
                if (media === "text/event-stream") {
                    for await (const event of result)
                        expect(event.type).toBe(op.operationId === "streamNativeResponseEvents" ? "response.phase" : "status");
                    expect(result.lastEventId).toBe("3");
                }
                else
                    expect(result.status).toBe(status);
                expect(observed).toBe(true);
                count++;
            }
        expect(count).toBe(58);
    });
    it("preserves original acceptance and final observed headers without retrying the write", async () => {
        const calls: RequestInit[] = [];
        const c = client(async (_url, init) => { calls.push(init!); return calls.length === 1 ? json(sandbox("pending"), 202, { ETag: '"1"', "X-Request-ID": "accept", Location: "/v1/sandboxes/sbx_test" }) : json(sandbox("running"), 200, { ETag: '"2"', "X-Request-ID": "observed" }); });
        const result = await c.sandboxes.create({ template: "beeos/base" }, { idempotencyKey: "persisted", pollIntervalSeconds: .001 });
        expect(result.status).toBe(200);
        expect(result.headers.etag).toBe('"2"');
        expect(result.acceptance).toEqual({ status: 202, resource_id: "sbx_test", etag: '"1"', request_id: "accept", idempotency_key: "persisted" });
        expect(calls.map(c => c.method)).toEqual(["POST", "GET"]);
    });
    it("generates a recoverable key and refuses a weak ETag before HTTP", async () => {
        let calls = 0, key = "";
        const c = client(async (_url, init) => { calls++; key = new Headers(init?.headers).get("Idempotency-Key") ?? ""; return json(sandbox("pending"), 202); });
        const result = await c.sandboxes.create({ template: "beeos/desktop" }, { wait: false });
        expect(key.length).toBeGreaterThan(10);
        expect(result.acceptance?.idempotency_key).toBe(key);
        await expect(c.sandboxes.terminate("sbx", { ifMatch: 'W/"1"' })).rejects.toThrow("strong quoted");
        expect(calls).toBe(1);
    });
    it("waits for exact publication while allowing older valid credential activation", async () => {
        let calls = 0;
        const seen: unknown[] = [];
        const c = client(async () => { calls++; return json(agent(calls < 3 ? "preparing" : "ready"), 200, { ETag: calls < 3 ? '"4"' : '"5"' }); });
        const result = await c.agents.update("agent_test", { model_id: "model" }, { ifMatch: '"3"', pollIntervalSeconds: .001, onProgress: value => seen.push(value) });
        expect(result.body.data.publication.state).toBe("ready");
        expect(calls).toBe(3);
        expect(seen).toHaveLength(2);
    });
    it("returns deferred recipe immediately and exposes supersession", async () => {
        let calls = 0;
        const c = client(async () => { calls++; return json(agent("deferred", "rev_2", "recipe"), 201); });
        await c.agents.create({ engine: "openclaw", target: recipeTarget });
        expect(calls).toBe(1);
        let otherCalls = 0;
        const other = client(async () => json(agent(++otherCalls === 1 ? "preparing" : "ready", otherCalls === 1 ? "rev_2" : "rev_3")));
        await expect(other.agents.update("agent_test", { model_id: "next" }, { ifMatch: '"3"', pollIntervalSeconds: .001 })).rejects.toBeInstanceOf(SDKPublicationSuperseded);
    });
    it("returns unsuccessful command terminal snapshots without claiming business success", async () => {
        const c = client(async () => json({ data: { id: "cmd", state: "completed", process_outcome: "exited", exit_code: 0, capture_status: "failed", result: { status: "failed" } } }, 202));
        expect((await c.sandboxes.commands.run("sbx", { argv: ["true"] })).body.data.capture_status).toBe("failed");
        const unknown = client(async () => json({ data: { id: "cmd", state: "unknown" } }, 202));
        expect((await unknown.sandboxes.commands.run("sbx", { argv: ["true"] })).body.data.state).toBe("unknown");
    });
    it("waits for the canonical memory durability receipt without waiting for index", async () => {
        let calls = 0;
        const c = client(async () => json({ data: { completion: ++calls === 1 ? "accepted" : "durable", receipt: { receipt_id: "receipt", disposition: calls === 1 ? "accepted" : "committed", committed_at: calls === 1 ? null : "now", read_watermark: calls === 1 ? null : "watermark", index_watermark: null } } }, calls === 1 ? 202 : 200));
        const result = await c.agents.memory.remember("agent", { content: "value", kind: "semantic", source: { kind: "explicit" } }, { pollIntervalSeconds: .001 });
        expect(result.body.data.completion).toBe("durable");
        expect(result.acceptance?.resource_id).toBe("receipt");
        expect(calls).toBe(2);
    });
    it("bounds the whole wait, preserves recovery context and never cancels the remote resource", async () => {
        const methods: string[] = [];
        const c = client(async (_url, init) => { methods.push(init!.method!); return json(sandbox("pending"), methods.length === 1 ? 202 : 200); });
        try {
            await c.sandboxes.create({ template: "beeos/base" }, { idempotencyKey: "restore", waitTimeoutSeconds: .02, pollIntervalSeconds: .005 });
            throw new Error("expected deadline");
        }
        catch (error) {
            expect(error).toBeInstanceOf(SDKWaitTimeout);
            expect((error as SDKWaitTimeout).acceptance?.resource_id).toBe("sbx_test");
            expect((error as SDKWaitTimeout).acceptance?.idempotency_key).toBe("restore");
        }
        expect(methods.filter(m => m !== "GET")).toEqual(["POST"]);
        const controller = new AbortController();
        controller.abort();
        await expect(c.sandboxes.create({ template: "beeos/base" }, { signal: controller.signal })).rejects.toBeInstanceOf(SDKCancelled);
    });
    it("preserves unknown flat errors, reasons, retry guidance and raw envelope", async () => {
        const envelope = { code: "future_code", message: "retry later", details: { reason: "future_reason" }, retry_after: 4, request_id: "request" };
        const c = client(async () => json(envelope, 503, { "Should-Retry": "true", "Retry-After": "2" }));
        try {
            await c.sessions.get("session");
            throw new Error("expected error");
        }
        catch (error) {
            expect(error).toBeInstanceOf(NativeBeeOSAPIError);
            const api = error as NativeBeeOSAPIError;
            expect([api.code, api.reason, api.should_retry, api.retry_after]).toEqual(["future_code", "future_reason", true, "2"]);
            expect(api.raw_envelope).toEqual(envelope);
        }
    });
    it("keeps undeclared error detail keys on a failed Response (INT-2)", async () => {
        const details = { reason: "compute_preparation_failed", runtime_code: "unsupported_capability" };
        const c = client(async () => json({ id: "resp_1", status: "failed", error: { code: "runtime_error", message: "compute preparation failed", request_id: "req_1", details } }));
        const result = await c.responses.get("resp_1");
        expect(result.body.error?.details).toEqual(details);
    });
    it("accepts a Response once and opens that exact ID/cursor", async () => {
        const calls: {
            url: string;
            method: string;
            cursor: string | null;
        }[] = [];
        const c = client(async (input, init) => { const method = init!.method!; calls.push({ url: String(input), method, cursor: new Headers(init?.headers).get("Last-Event-ID") }); return method === "POST" ? json({ data: { id: "response_1" } }, 202) : new Response('id: 9\ndata: {"type":"response.phase","response_id":"response_1"}\n\n', { headers: { "Content-Type": "text/event-stream" } }); });
        const stream = await c.responses.createStream({ session_id: "session", input: [{ type: "input_text", text: "hello" }] }, { idempotencyKey: "intent", lastEventId: "8" });
        for await (const _event of stream.events) { }
        expect(stream.response_id).toBe("response_1");
        expect(stream.events.lastEventId).toBe("9");
        expect(calls.map(c => c.method)).toEqual(["POST", "GET"]);
        expect(calls[1].cursor).toBe("8");
    });
    it("skips unknown response event types without closing the durable stream", async () => {
        const frames = [
            'id: 1\ndata: {"type":"response.output_text.preview","response_id":"response_1","sequence":1,"delta":"x"}\n\n',
            'id: 2\ndata: {"type":"response.beeos.part","response_id":"response_1","sequence":2}\n\n',
            'id: 3\ndata: {"type":"response.output","response_id":"response_1","sequence":3,"item":{"type":"output_text","text":"done"}}\n\n',
            'id: 4\ndata: {"type":"response.completed","response_id":"response_1","sequence":4,"response":{}}\n\n'];
        const c = client(async () => new Response(frames.join(""), { headers: { "Content-Type": "text/event-stream" } }));
        const stream = await c.responses.events("response_1");
        const seen: string[] = [];
        for await (const event of stream) seen.push(event.type);
        expect(seen).toEqual(["response.output", "response.completed"]);
        expect(stream.lastEventId).toBe("4");
    });
    it("writes and reads binary bytes through an actual local HTTP server", async () => {
        const bytes = new Uint8Array([0, 255, 4]);
        const server = createServer(async (req, res) => { expect(req.url).toBe("/v1/sandboxes/sbx/files?path=%2Fworkspace%2Fa"); expect(req.headers.authorization).toBe("Bearer bsk_local"); if (req.method === "PUT") {
            const chunks: Buffer[] = [];
            for await (const chunk of req)
                chunks.push(chunk);
            expect(new Uint8Array(Buffer.concat(chunks))).toEqual(bytes);
            expect(req.headers["content-sha256"]).toBe("a".repeat(64));
            res.setHeader("Content-Type", "application/json");
            res.end('{"data":{"path":"/workspace/a"}}');
        }
        else
            res.end(bytes); });
        servers.push(server);
        await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
        const address = server.address() as {
            port: number;
        };
        const c = new NativeBeeOSClient({ baseURL: "http://127.0.0.1:" + address.port + "/ignored/v2", apiKey: "bsk_local" });
        await c.sandboxes.files.write("sbx", bytes, { path: "/workspace/a", contentLength: 3, contentSha256: "a".repeat(64) });
        expect((await c.sandboxes.files.read("sbx", { path: "/workspace/a" })).body).toEqual(bytes);
    });
});
it("performs ticket authentication and PTY open with string sequences and no input replay", async () => {
    const listeners = new Map<string, Set<(event: {
        data?: unknown;
    }) => void>>();
    const sent: Record<string, unknown>[] = [];
    let closed = 0;
    const emit = (type: string, data?: unknown) => { for (const listener of [...listeners.get(type) ?? []])
        listener({ data }); };
    const socket = { readyState: 0, bufferedAmount: 0, protocol: "beeos-terminal-v2", binaryType: "", addEventListener(type: string, listener: (event: {
            data?: unknown;
        }) => void) { const set = listeners.get(type) ?? new Set(); set.add(listener); listeners.set(type, set); }, removeEventListener(type: string, listener: (event: {
            data?: unknown;
        }) => void) { listeners.get(type)?.delete(listener); }, close() { closed++; this.readyState = 3; emit("close"); }, send(data: string | Uint8Array) { expect(typeof data).toBe("string"); const frame = JSON.parse(data as string); sent.push(frame); if (frame.type === "authenticate")
            queueMicrotask(() => emit("message", JSON.stringify({ type: "authenticated", profile: "beeos-terminal-v2", client_id: "client", sandbox_id: "sandbox", terminal_id: "terminal" }))); if (frame.type === "terminal.open")
            queueMicrotask(() => emit("message", JSON.stringify({ type: "terminal.opened", protocolVersion: 1, clientId: "client", terminalId: "terminal", sequence: "9007199254740993", resumed: false, columns: 80, rows: 24 }))); } };
    const c = new NativeBeeOSClient({ baseURL: "https://cloud.example", apiKey: "bsk_secret", fetch: async () => json({ data: { id: "ticket", sandbox_id: "sandbox", purpose: "pty", ticket: "ONE_USE_SECRET", connect_url: "wss://access.example/connect", profile: "beeos-terminal-v2", client_id: "client", pty_id: "terminal" } }, 201), webSocketFactory: (url, profile) => { expect(url).toBe("wss://access.example/connect"); expect(profile).toBe("beeos-terminal-v2"); queueMicrotask(() => { socket.readyState = 1; emit("open"); }); return socket; } });
    const connection = await c.sandboxes.pty.connect("sandbox", { cols: 80, rows: 24 });
    expect(connection.lastServerSequence).toBe("9007199254740993");
    expect("ticket" in connection.ticket).toBe(false);
    connection.write("echo once\n");
    connection.resize(90, 30);
    connection.disconnect();
    expect(sent.map(frame => frame.type)).toEqual(["authenticate", "terminal.open", "terminal.input", "terminal.resize"]);
    expect(sent[0]).toEqual({ type: "authenticate", profile: "beeos-terminal-v2", ticket: "ONE_USE_SECRET" });
    expect(sent[2].clientSequence).toBe("2");
    expect(sent.some(frame => JSON.stringify(frame).includes("bsk_secret"))).toBe(false);
    expect(closed).toBe(1);
});
it("retains the generated intent key on network failure and accepted Response ID on stream admission failure", async () => {
    const c = client(async () => { throw new TypeError("network lost"); });
    try {
        await c.sandboxes.create({ template: "beeos/base" });
        throw new Error("expected failure");
    }
    catch (error) {
        const recovery = error as {
            acceptance: {
                status: number | null;
                resource_id: string | null;
                idempotency_key: string;
            };
        };
        expect(recovery.acceptance.status).toBeNull();
        expect(recovery.acceptance.resource_id).toBeNull();
        expect(recovery.acceptance.idempotency_key.length).toBeGreaterThan(10);
    }
    let calls = 0;
    const other = client(async () => { if (++calls === 1)
        return json({ data: { id: "response_accepted" } }, 202); throw new TypeError("stream unavailable"); });
    try {
        await other.responses.createStream({ session_id: "session", input: [] }, { idempotencyKey: "restore" });
        throw new Error("expected failure");
    }
    catch (error) {
        const recovery = error as {
            response_id: string;
            acceptance: {
                idempotency_key: string;
                resource_id: string;
            };
        };
        expect(recovery.response_id).toBe("response_accepted");
        expect(recovery.acceptance.resource_id).toBe("response_accepted");
        expect(recovery.acceptance.idempotency_key).toBe("restore");
    }
    expect(calls).toBe(2);
});

it("keeps committed Response input identities separate from creation content and preserves capability observations", async () => {
    const content = {type: "input_text" as const, text: "committed input"};
    const c = client(async (input, init) => {
        const path = new URL(String(input)).pathname;
        if (path.endsWith("/input-items")) return json({data: [{id: "source-input", content}], next_cursor: null, has_more: false});
        if (path === "/v2/capabilities") return json({data: {api_version: "2", features: {desktop: "conditional", provider: "unknown"}, limits: {}, engines: []}});
        expect(init?.method).toBe("POST");
        expect(JSON.parse(String(init?.body))).toEqual({session_id: "session", input: [content]});
        return json({data: {id: "response"}}, 202);
    });
    const item = (await c.responses.listInputItems("response")).body.data[0];
    expect(item.id).toBe("source-input");
    expect(item.content).toEqual(content);
    if (false) {
        // @ts-expect-error The committed owner identity is read-only.
        item.id = "invented-input";
        // @ts-expect-error A committed identity wrapper is not creation input.
        await c.responses.create({session_id: "session", input: [item]});
    }
    await c.responses.create({session_id: "session", input: [item.content]});
    const features = (await c.capabilities.get()).body.data.features;
    expect(features.desktop).toBe("conditional");
    expect(features.provider).toBe("unknown");
});

it("starts the desktop stream after DataChannel open and admits binary only after actual fallback_ready generation 2", async () => {
    const listeners = new Map<string, Set<(event: {data?: unknown}) => void>>();
    const sent: (Record<string, unknown> | Uint8Array)[] = [];
    const emit = (type: string, data?: unknown): void => { for (const listener of [...listeners.get(type) ?? []]) listener({data}); };
    const socket = {
        readyState: 0, bufferedAmount: 0, protocol: "beeos-desktop-v1", binaryType: "",
        addEventListener(type: string, listener: (event: {data?: unknown}) => void) { const set = listeners.get(type) ?? new Set(); set.add(listener); listeners.set(type, set); },
        removeEventListener(type: string, listener: (event: {data?: unknown}) => void) { listeners.get(type)?.delete(listener); },
        close() { this.readyState = 3; emit("close"); },
        send(data: string | Uint8Array) {
            if (data instanceof Uint8Array) {sent.push(data); return;}
            const frame = JSON.parse(data) as Record<string, unknown>;
            sent.push(frame);
            if (frame.type === "authenticate") queueMicrotask(() => emit("message", JSON.stringify({type: "authenticated", profile: "beeos-desktop-v1", client_id: "client", sandbox_id: "sandbox"})));
        },
    };
    const c = new NativeBeeOSClient({baseURL: "https://cloud.example", apiKey: "bsk_secret", fetch: async () => json({data: {id: "ticket", sandbox_id: "sandbox", purpose: "desktop", ticket: "ONE_USE_SECRET", connect_url: "wss://access.example/connect", profile: "beeos-desktop-v1", client_id: "client"}}, 201), webSocketFactory: () => {queueMicrotask(() => {socket.readyState = 1; emit("open");}); return socket;}});
    const connection = await c.sandboxes.desktop.connect("sandbox", {});
    connection.startDesktop();
    connection.offer("negotiated-sdp");
    connection.ice("candidate", null, null);
    expect(sent.map(frame => (frame as Record<string, unknown>).type)).toEqual(["authenticate", "desktop_start", "offer", "ice_candidate"]);
    // The application invokes this callback when its negotiated channel opens.
    const onDataChannelOpen = (): void => connection.startDesktopStream();
    onDataChannelOpen();
    expect(sent[4]).toEqual({type: "start", transport_generation: 1});
    expect(sent[3]).toEqual({type: "ice_candidate", candidate: "candidate", sdp_mid: null, sdp_mline_index: null, transport_generation: 1});
    connection.fallback();
    expect(() => connection.sendDesktopBytes(new Uint8Array([1]))).toThrow("not admitted");
    emit("message", JSON.stringify({type: "fallback_ready", transport_generation: 1}));
    expect(() => connection.sendDesktopBytes(new Uint8Array([1]))).toThrow("not admitted");
    emit("message", JSON.stringify({type: "fallback_ready", transport_generation: 2}));
    connection.sendDesktopBytes(new Uint8Array([0, 255]));
    expect(sent.at(-1)).toEqual(new Uint8Array([0, 255]));
    connection.disconnect();
});

it("round-trips every credential slot and all scopes from a maximum legal combined revocation", async () => {
    const slots: CredentialPublicStatus[] = Array.from({length: 64}, (_, index) => ({slot: `credential_${index}`, configured: index % 3 !== 0}));
    const revoke = {
        tool_ids: Array.from({length: 256}, (_, index) => `tool_${index}`),
        mcp_server_refs: Array.from({length: 64}, (_, index) => `mcp_${index}`),
        credential_slots: slots.map(value => value.slot),
    };
    const affected: AuthorizationEnforcement["affected_scopes"] = [
        ...revoke.tool_ids.map(id => ({kind: "tool" as const, id, state: "enforced" as const})),
        ...revoke.mcp_server_refs.map(id => ({kind: "mcp" as const, id, state: "enforced" as const})),
        ...revoke.credential_slots.map((id, index) => ({kind: "credential" as const, id, state: index % 2 ? "enforced" as const : "unknown" as const})),
        {kind: "binding", id: "binding_expanded", state: "failed"},
        {kind: "sandbox", id: "sandbox_expanded", state: "pending"},
        {kind: "session", id: "session_expanded", state: "enforced"},
    ];
    const desiredSlots = slots.map(value => ({slot: value.slot, configured: false}));
    const configuration = {name: "agent", engine: "openclaw", instructions: "", model_id: null, skills: [], mcp_servers: [], disabled_tools: [], run_timeout_seconds: 600, target: {kind: "managed", sandbox_id: "sandbox"}, credential_status: {slots: desiredSlots}};
    const binding = {
        binding_id: "binding", sandbox_id: "sandbox", state: "ready", prepared_config_revision: "c1", credential_activation_revision: "c1",
        credential_status: {slots}, persona_scope: "session", components: [], error: null,
    };
    let writes = 0;
    const c = client(async (input, init) => {
        const path = new URL(String(input)).pathname;
        if (init?.method === "POST") {
            writes++;
            expect(path).toBe("/v2/agents/agent/authorizations/revoke");
            expect(new Headers(init.headers).get("Idempotency-Key")).toBe("maximum-legal-revocation");
            expect(JSON.parse(String(init.body))).toEqual(revoke);
            return json({data: {authorization_revision: "authorization_revision", state: "partial", affected_scopes: affected, error: null}}, 202);
        }
        const desired = path.endsWith("/empty") ? {...configuration, credential_status: {slots: []}} : configuration;
        const actual = path.endsWith("/unprepared") ? null : path.endsWith("/not-prepared") ? {...binding, state: "preparing", prepared_config_revision: null, credential_activation_revision: null, credential_status: {slots: []}} : path.endsWith("/empty") ? {...binding, credential_status: {slots: []}} : binding;
        return json({data: {id: "agent", desired_config_revision: "c3", configuration: desired, binding: actual}});
    });
    const observedAgent = (await c.agents.get("agent")).body.data;
    const observed = observedAgent.binding!;
    expect(observedAgent.desired_config_revision).toBe("c3");
    expect(observedAgent.configuration.credential_status.slots).toEqual(desiredSlots);
    expect(JSON.parse(JSON.stringify(observedAgent.configuration))).toEqual(configuration);
    expect(observedAgent.configuration.credential_status.slots[1].configured).toBe(false);
    expect(observed.credential_status.slots[1].configured).toBe(true);
    expect(observed.prepared_config_revision).toBe("c1");
    expect(observed.credential_activation_revision).toBe("c1");
    expect(observed.credential_status.slots).toEqual(slots);
    expect(observed.credential_status.slots).toHaveLength(64);
    expect(JSON.parse(JSON.stringify(observed))).toEqual(binding);
    const empty = (await c.agents.get("empty")).body.data.binding!.credential_status;
    expect(empty).toEqual({slots: []});
    expect(JSON.parse(JSON.stringify(empty))).toEqual({slots: []});
    const unprepared = (await c.agents.get("unprepared")).body.data;
    expect(unprepared.binding).toBeNull();
    expect(unprepared.configuration.credential_status.slots).toEqual(desiredSlots);
    const notPrepared = (await c.agents.get("not-prepared")).body.data;
    expect(notPrepared.configuration.credential_status.slots).toEqual(desiredSlots);
    expect(notPrepared.binding!.credential_status).toEqual({slots: []});
    expect(notPrepared.binding!.credential_activation_revision).toBeNull();
    const emptyAgent = (await c.agents.get("empty")).body.data;
    expect(emptyAgent.configuration.credential_status).toEqual({slots: []});
    const result = await c.agents.revokeAuthorizations("agent", revoke, {idempotencyKey: "maximum-legal-revocation"});
    expect(result.status).toBe(202);
    expect(result.body.data.state).toBe("partial");
    expect(result.body.data.affected_scopes).toHaveLength(387);
    expect(result.body.data.affected_scopes).toEqual(affected);
    expect(JSON.parse(JSON.stringify(result.body.data)).affected_scopes).toEqual(affected);
    expect(writes).toBe(1);
});
