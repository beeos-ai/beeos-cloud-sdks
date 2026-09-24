import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { BeeOSAPIError, BeeOSClient } from "./index.ts";

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
      fetch: async () => new Response(JSON.stringify({ code: "instance_execution_unavailable", message: "no runtime" }), { status: 503 }),
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

  it("uses IMAGE-API list/create paths and never puts bsk_ in JSON", async () => {
    const calls: Array<{ url: string; method: string | undefined; auth: string | null; idem: string | null; match: string | null; body: string | undefined }> = [];
    const client = new BeeOSClient({
      baseURL: "https://api.cloud.beeos.ai/v1/",
      apiKey: "bsk_test",
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        const body = typeof init?.body === "string" ? init.body : undefined;
        calls.push({
          url: String(input),
          method: init?.method,
          auth: headers.get("Authorization"),
          idem: headers.get("Idempotency-Key"),
          match: headers.get("If-Match"),
          body,
        });
        if (String(input).endsWith("/images") && init?.method === "POST") {
          return new Response(JSON.stringify({ image_id: "img-1", name: "runtime", visibility: "private" }), { status: 201, headers: { "Content-Type": "application/json" } });
        }
        if (init?.method === "DELETE") {
          return new Response(null, { status: 204 });
        }
        if (String(input).includes("/images/img-1/versions") && init?.method === "POST") {
          return new Response(JSON.stringify({ version_id: "ver-1", image_id: "img-1", status: "scanning" }), { status: 202, headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ data: [], total: 0 }), { status: 200, headers: { "Content-Type": "application/json" } });
      },
    });
    await client.images.list({ status: "active", page: 1, page_size: 20 });
    await client.images.create({ name: "runtime", visibility: "private" }, "idem-create-image");
    await client.images.get("img-1");
    await client.images.update("img-1", { name: "runtime-2" }, 3);
    await client.images.delete("img-1", "idem-delete-image");
    await client.images.listVersions("img-1", { page_size: 5 });
    await client.images.createVersion("img-1", { version: "1.0.0", image_ref: "ocir.example/app/runtime", checksum_sha256: "a".repeat(64) }, "idem-create-version");
    await client.imageVersions.get("ver-1");
    await client.imageVersions.update("ver-1", { status: "deprecated" }, 1);
    await client.imageVersions.delete("ver-1", "idem-delete-version");
    expect(calls[0].auth).toBe("Bearer bsk_test");
    expect(calls[0].url).toContain("/images?");
    expect(calls[0].url).toContain("status=active");
    expect(calls[0].method).toBe("GET");
    expect(calls[1].url).toMatch(/\/images$/);
    expect(calls[1].method).toBe("POST");
    expect(calls[1].idem).toBe("idem-create-image");
    expect(JSON.parse(calls[1].body ?? "{}")).toEqual({ name: "runtime", visibility: "private" });
    expect(calls[2].url).toMatch(/\/images\/img-1$/);
    expect(calls[3].method).toBe("PUT");
    expect(calls[3].match).toBe('"3"');
    expect(calls[4].method).toBe("DELETE");
    expect(calls[4].idem).toBe("idem-delete-image");
    expect(calls[5].url).toContain("/images/img-1/versions");
    expect(calls[6].method).toBe("POST");
    expect(calls[6].url).toContain("/images/img-1/versions");
    expect(calls[6].idem).toBe("idem-create-version");
    expect(calls[7].url).toMatch(/\/image-versions\/ver-1$/);
    expect(calls[8].method).toBe("PUT");
    expect(calls[8].match).toBe('"1"');
    expect(calls[9].method).toBe("DELETE");
    expect(calls[9].idem).toBe("idem-delete-version");
    expect(JSON.stringify(calls.map((call) => call.body))).not.toContain("bsk_");
  });

  it("verifies task webhook HMAC", () => {
    const secret = "s".repeat(32);
    const body = Buffer.from(`{"ok":true}`);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest("hex");
    const client = new BeeOSClient({ baseURL: "https://api.cloud.beeos.ai/v1/", apiKey: "bsk_test", fetch: async () => new Response("{}", { status: 200 }) });
    expect(client.taskWebhooks.verifySignature(body, { "X-BeeOS-Event-Id": "evt_1", "X-BeeOS-Signature": `t=${timestamp},v1=${signature}` }, secret)).toBe(true);
  });
});
