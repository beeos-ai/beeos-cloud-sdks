import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { NativeWebhookEvent } from "./index.ts";

const events = (JSON.parse(readFileSync(new URL("../spec/native-webhook-events.json", import.meta.url), "utf8")) as { events: NativeWebhookEvent[] }).events;

describe("NativeWebhookEvent", () => {
  it("narrows each published example by type", () => {
    expect(events.length).toBeGreaterThan(0);
    for (const body of events) {
      const { event } = body;
      expect(Object.keys(body).sort()).toEqual(["app_id", "event", "organization_id"]);
      if (event.type === "response.terminal") {
        expect(Object.keys(event.scope).sort()).toEqual(["agentId", "responseId", "sessionId"]);
        expect(["completed", "failed", "cancelled", "incomplete"]).toContain(event.data.status);
      } else {
        expect(Object.keys(event.scope).sort()).toEqual(["agentId", "sessionId"]);
        expect(Object.keys(event.data).sort()).toEqual(["metadata", "name", "resourceVersion"]);
      }
    }
  });
});
