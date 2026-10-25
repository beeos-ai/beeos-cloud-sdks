// SDK-1/SDK-2 live entry: the TypeScript client against an actually running
// isolated public Gateway. Unconfigured is UNQUALIFIED (skipped), never a pass.
//   BEEOS_NATIVE_SDK_LIVE_URL=http://127.0.0.1:<port>
//   BEEOS_NATIVE_SDK_LIVE_API_KEY_FILE=<isolated bsk_ server key file>
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  NativeBeeOSAPIError, NativeBeeOSClient, SDKCancelled, SDKWaitTimeout, createNativeIdempotencyKey,
  type NativeResponseEvent,
} from "./native.js";

const origin = process.env.BEEOS_NATIVE_SDK_LIVE_URL ?? "";
const keyFile = process.env.BEEOS_NATIVE_SDK_LIVE_API_KEY_FILE ?? "";
const recipeSandbox = { template_id: "beeos/base" } as const;

describe.skipIf(!origin && !keyFile)("live Gateway (TypeScript)", () => {
  it("covers envelope, errors, retry keys, waits, local versus server cancellation and SSE cursor", async () => {
    expect(origin).toMatch(/^https?:\/\/127\.0\.0\.1:\d+$/);
    const key = readFileSync(keyFile, "utf8").trim();
    expect(key.startsWith("bsk_")).toBe(true);
    const client = new NativeBeeOSClient({baseURL: origin, apiKey: key});
    const intent = createNativeIdempotencyKey();
    const name = "sdk-ts-live-" + intent;
    const apiError = async (promise: Promise<unknown>): Promise<NativeBeeOSAPIError> => {
      const error = await promise.then(() => undefined, (failure: unknown) => failure);
      expect(error).toBeInstanceOf(NativeBeeOSAPIError);
      return error as NativeBeeOSAPIError;
    };

    const unauthorized = await apiError(new NativeBeeOSClient({baseURL: origin, apiKey: "bsk_invalid"}).agents.list());
    expect([unauthorized.http_status, !!unauthorized.code, !!unauthorized.request_id]).toEqual([401, true, true]);
    const missing = await apiError(client.agents.get("00000000-0000-4000-8000-000000000000"));
    expect([missing.http_status, !!missing.code, !!missing.request_id]).toEqual([404, true, true]);

    const agentKey = intent + "-agent";
    const body = {engine: "openclaw", sandbox: recipeSandbox, name, instructions: "SDK live check."};
    const created = await client.agents.create(body, {idempotencyKey: agentKey});
    const agent = created.body.data;
    try {
      expect(created.acceptance?.idempotency_key).toBe(agentKey);
      expect(created.acceptance?.request_id && created.headers.request_id && created.headers.etag).toBeTruthy();
      expect([agent.binding, agent.publication.state]).toEqual([null, "deferred"]);
      const replay = await client.agents.create(body, {idempotencyKey: agentKey});
      expect([replay.body.data.id, replay.headers.etag]).toEqual([agent.id, created.headers.etag]);
      const conflict = await apiError(client.agents.create({...body, name: name + "-changed"}, {idempotencyKey: agentKey}));
      expect([conflict.http_status, !!conflict.request_id]).toEqual([409, true]);

      for (const label of ["deadline", "cancel"] as const) {
        const localKey = intent + "-" + label;
        const controller = new AbortController();
        if (label === "cancel") controller.abort();
        const failure = await client.agents.create({engine: "openclaw", sandbox: recipeSandbox, name: name + "-" + label},
          {idempotencyKey: localKey, signal: controller.signal, waitTimeoutSeconds: label === "deadline" ? 0.000001 : undefined}).then(() => undefined, (error: unknown) => error);
        expect(failure).toBeInstanceOf(SDKWaitTimeout);
        expect(failure instanceof SDKCancelled).toBe(label === "cancel");
        expect((failure as SDKWaitTimeout).acceptance?.idempotency_key).toBe(localKey);
        const recovered = await client.agents.create({engine: "openclaw", sandbox: recipeSandbox, name: name + "-" + label}, {idempotencyKey: localKey});
        await client.agents.delete(recovered.body.data.id, {idempotencyKey: localKey + "-delete"});
      }

      const remembered = await client.agents.memory.remember(agent.id, {content: name + " memory", kind: "semantic", source: {kind: "explicit"}}, {idempotencyKey: intent + "-remember"});
      expect(["durable", "recallable"]).toContain(remembered.body.data.completion);
      expect(remembered.body.data.receipt.read_watermark).toBeTruthy();

      const session = (await client.sessions.create({agent_id: agent.id, name}, {idempotencyKey: intent + "-session"})).body.data;
      const responseKey = intent + "-response";
      try {
        const admitted = await client.responses.create({session_id: session.id, input: [{type: "input_text", text: name}], timeout_seconds: 60}, {idempotencyKey: responseKey});
        expect(admitted.status).toBe(202);
      } catch (error) {
        // Recorded producer behaviour without an execution chain (State/CP-9).
        expect(error).toBeInstanceOf(NativeBeeOSAPIError);
        const failure = error as NativeBeeOSAPIError;
        expect([failure.http_status, failure.code, failure.acceptance?.idempotency_key, !!failure.request_id]).toEqual([503, "outcome_unknown", responseKey, true]);
      }
      const history = (await client.sessions.listResponses(session.id)).body.data;
      expect(history).toHaveLength(1);
      const responseId = history[0]!.id;
      let current = (await client.responses.cancel(responseId, {idempotencyKey: intent + "-cancel-response"})).body.data;
      while (!current.terminal) {
        await new Promise(resolve => setTimeout(resolve, 200));
        current = (await client.responses.get(responseId)).body.data;
      }
      expect(current.status).toBe("cancelled");
      const stream = await client.responses.events(responseId);
      let terminal: NativeResponseEvent | undefined;
      for await (const event of stream) {
        if (event.type === "response.completed" || event.type === "response.failed" || event.type === "response.cancelled" || event.type === "response.unknown") { terminal = event; break; }
      }
      expect(terminal?.type).toBe("response.cancelled");
      expect(stream.lastEventId).toBeTruthy();
      const resumed = await client.responses.events(responseId, {lastEventId: stream.lastEventId!});
      const replayed: NativeResponseEvent[] = [];
      for await (const event of resumed) replayed.push(event);
      expect(replayed).toEqual([]);
    } finally {
      await client.agents.delete(agent.id, {idempotencyKey: intent + "-agent-delete"});
    }
  }, 180_000);
});
