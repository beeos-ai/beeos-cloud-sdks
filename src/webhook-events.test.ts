import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { SandboxAgentWebhookEvent } from "./index.ts";

const fixture = JSON.parse(readFileSync(new URL("../spec/sandbox-agent-webhook-examples.json", import.meta.url), "utf8")) as {
  examples: Record<string, SandboxAgentWebhookEvent>;
};

function summary(body: SandboxAgentWebhookEvent): string {
  switch (body.event.type) {
    case "sandbox.created":
    case "sandbox.updated":
    case "sandbox.terminated":
      return `${body.event.type}:${body.event.scope.sandboxId}:${body.event.data.status}`;
    case "agent.deleted":
      return `${body.event.type}:${body.event.data.id}`;
    default:
      return `${body.event.type}:${body.event.data.id}:${body.event.data.publication.state}`;
  }
}

describe("Sandbox and Agent webhook payload types", () => {
  it("narrow every published example by event type", () => {
    const seen = Object.entries(fixture.examples).map(([type, body]) => {
      expect(body.event.type).toBe(type);
      return summary(body);
    });
    expect(seen).toEqual([
      "sandbox.created:sbx_7d2e:provisioning",
      "sandbox.updated:sbx_7d2e:error",
      "sandbox.terminated:sbx_7d2e:terminated",
      "agent.created:6f0a0c55-3c1e-4a63-9a43-3f4b8f3f1d0e:accepted",
      "agent.updated:6f0a0c55-3c1e-4a63-9a43-3f4b8f3f1d0e:ready",
      "agent.deleted:6f0a0c55-3c1e-4a63-9a43-3f4b8f3f1d0e",
    ]);
  });
});
