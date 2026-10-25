package beeoscloudsdk

// Payload types of the Sandbox and /v2 Agent lifecycle webhooks (hand-written,
// mirrors $defs/sandbox.* and $defs/agent.* of cloud-webhooks-v1.schema.json).
// Verify the signature over the raw body first, then json.Unmarshal it into
// SandboxWebhookEvent or AgentWebhookEvent by Event.Type. Dedupe on Event.EventID.

import "time"

const (
	WebhookSandboxCreated    = "sandbox.created"
	WebhookSandboxUpdated    = "sandbox.updated"
	WebhookSandboxTerminated = "sandbox.terminated"
	WebhookAgentCreated      = "agent.created"
	WebhookAgentUpdated      = "agent.updated"
	WebhookAgentDeleted      = "agent.deleted"
)

// WebhookEventHeader is the part of every Cloud webhook body needed to route it.
type WebhookEventHeader struct {
	OrganizationID string `json:"organization_id"`
	AppID          string `json:"app_id"`
	Event          struct {
		SchemaVersion int    `json:"schemaVersion"`
		EventID       string `json:"eventId"`
		Type          string `json:"type"`
	} `json:"event"`
}

// SandboxWebhookError is the Sandbox last_error, e.g. insufficient_bc,
// capacity_exhausted, resource_limit or deadline_exceeded.
type SandboxWebhookError struct {
	Code   string `json:"code"`
	Reason string `json:"reason,omitempty"`
}

// SandboxWebhookSnapshot is the Sandbox state after the change. Status adds
// terminating and terminated to the public Sandbox statuses.
type SandboxWebhookSnapshot struct {
	ID               string               `json:"id"`
	Status           string               `json:"status"`
	PausedMode       *string              `json:"pausedMode"`
	LastError        *SandboxWebhookError `json:"lastError"`
	AgentID          *string              `json:"agentId"`
	ManagementSource string               `json:"managementSource"`
	Labels           map[string]string    `json:"labels"`
	ResourceVersion  string               `json:"resourceVersion"`
}

// SandboxWebhookEvent is a sandbox.created, sandbox.updated or sandbox.terminated body.
type SandboxWebhookEvent struct {
	OrganizationID string `json:"organization_id"`
	AppID          string `json:"app_id"`
	Event          struct {
		SchemaVersion int       `json:"schemaVersion"`
		EventID       string    `json:"eventId"`
		Type          string    `json:"type"`
		OccurredAt    time.Time `json:"occurredAt"`
		Scope         struct {
			SandboxID string `json:"sandboxId"`
			AgentID   string `json:"agentId,omitempty"`
		} `json:"scope"`
		Data SandboxWebhookSnapshot `json:"data"`
	} `json:"event"`
}

// AgentWebhookPublication: State is accepted (committed, not yet observed) or
// the observed public publication.state (preparing, ready, deferred, failed, unknown).
type AgentWebhookPublication struct {
	AcceptedConfigRevision *string `json:"acceptedConfigRevision"`
	State                  string  `json:"state"`
}

// AgentWebhookSnapshot is the Agent state after the change. agent.deleted
// carries only ID and ResourceVersion; Publication is then nil.
type AgentWebhookSnapshot struct {
	ID                    string                   `json:"id"`
	ResourceVersion       string                   `json:"resourceVersion"`
	DesiredConfigRevision *string                  `json:"desiredConfigRevision,omitempty"`
	Publication           *AgentWebhookPublication `json:"publication,omitempty"`
}

// AgentWebhookEvent is an agent.created, agent.updated or agent.deleted body.
type AgentWebhookEvent struct {
	OrganizationID string `json:"organization_id"`
	AppID          string `json:"app_id"`
	Event          struct {
		SchemaVersion int       `json:"schemaVersion"`
		EventID       string    `json:"eventId"`
		Type          string    `json:"type"`
		OccurredAt    time.Time `json:"occurredAt"`
		Scope         struct {
			AgentID string `json:"agentId"`
		} `json:"scope"`
		Data AgentWebhookSnapshot `json:"data"`
	} `json:"event"`
}
