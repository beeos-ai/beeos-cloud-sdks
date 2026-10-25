/**
 * Payload types of the Sandbox and /v2 Agent lifecycle webhooks (hand-written,
 * mirrors `$defs/sandbox.*` and `$defs/agent.*` of cloud-webhooks-v1.schema.json).
 * Verify the signature over the raw body first, then `JSON.parse` it into
 * `SandboxAgentWebhookEvent` and switch on `event.type`. Dedupe on `event.eventId`.
 */

export type SandboxWebhookType = "sandbox.created" | "sandbox.updated" | "sandbox.terminated";
export type AgentWebhookType = "agent.created" | "agent.updated" | "agent.deleted";

/** Public Sandbox status plus the `terminating` / `terminated` states GET hides with 404. */
export type SandboxWebhookStatus =
  | "pending"
  | "provisioning"
  | "running"
  | "pausing"
  | "paused"
  | "resuming"
  | "error"
  | "unknown"
  | "terminating"
  | "terminated";

export interface SandboxWebhookSnapshot {
  id: string;
  status: SandboxWebhookStatus;
  pausedMode: "filesystem" | "full_state" | null;
  /** For example `insufficient_bc`, `capacity_exhausted`, `resource_limit`, `deadline_exceeded`. */
  lastError: { code: string; reason?: string } | null;
  agentId: string | null;
  managementSource: "explicit" | "agent";
  labels: Record<string, string>;
  /** Decimal string. */
  resourceVersion: string;
}

/** `accepted`: committed, not yet observed; other values equal the public publication.state when observed. */
export type AgentPublicationWebhookState = "accepted" | "preparing" | "ready" | "deferred" | "failed" | "unknown";

export interface AgentWebhookSnapshot {
  id: string;
  resourceVersion: string;
  desiredConfigRevision: string | null;
  publication: { acceptedConfigRevision: string | null; state: AgentPublicationWebhookState };
}

export interface AgentDeletedWebhookSnapshot {
  id: string;
  resourceVersion: string;
}

interface WebhookEnvelope<Type extends string, Scope, Data> {
  organization_id: string;
  app_id: string;
  event: {
    schemaVersion: 1;
    eventId: string;
    type: Type;
    /** RFC 3339 UTC. */
    occurredAt: string;
    scope: Scope;
    data: Data;
  };
}

export type SandboxWebhookEvent = WebhookEnvelope<SandboxWebhookType, { sandboxId: string; agentId?: string }, SandboxWebhookSnapshot>;
export type AgentWebhookEvent =
  | WebhookEnvelope<"agent.created" | "agent.updated", { agentId: string }, AgentWebhookSnapshot>
  | WebhookEnvelope<"agent.deleted", { agentId: string }, AgentDeletedWebhookSnapshot>;
export type SandboxAgentWebhookEvent = SandboxWebhookEvent | AgentWebhookEvent;
