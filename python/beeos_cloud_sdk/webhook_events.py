"""Payload types of the Sandbox and /v2 Agent lifecycle webhooks (hand-written).

Mirrors ``$defs/sandbox.*`` and ``$defs/agent.*`` of cloud-webhooks-v1.schema.json.
Verify the signature over the raw body first, then ``json.loads`` it and
``cast`` to :data:`SandboxAgentWebhookEvent` after checking ``event.type``.
Dedupe on ``event.eventId``.
"""

from __future__ import annotations

from typing import Literal, NotRequired, TypeAlias, TypedDict

SandboxWebhookType: TypeAlias = Literal["sandbox.created", "sandbox.updated", "sandbox.terminated"]
AgentWebhookType: TypeAlias = Literal["agent.created", "agent.updated", "agent.deleted"]
SandboxWebhookStatus: TypeAlias = Literal[
    "pending", "provisioning", "running", "pausing", "paused", "resuming", "error", "unknown", "terminating", "terminated"
]
AgentPublicationWebhookState: TypeAlias = Literal["accepted", "preparing", "ready", "deferred", "failed", "unknown"]


class SandboxWebhookError(TypedDict):
    code: str
    reason: NotRequired[str]


class SandboxWebhookSnapshot(TypedDict):
    id: str
    status: SandboxWebhookStatus
    pausedMode: Literal["filesystem", "full_state"] | None
    lastError: SandboxWebhookError | None
    agentId: str | None
    managementSource: Literal["explicit", "agent"]
    labels: dict[str, str]
    resourceVersion: str


class SandboxWebhookScope(TypedDict):
    sandboxId: str
    agentId: NotRequired[str]


class SandboxWebhookBody(TypedDict):
    schemaVersion: Literal[1]
    eventId: str
    type: SandboxWebhookType
    occurredAt: str
    scope: SandboxWebhookScope
    data: SandboxWebhookSnapshot


class SandboxWebhookEvent(TypedDict):
    organization_id: str
    app_id: str
    event: SandboxWebhookBody


class AgentWebhookPublication(TypedDict):
    acceptedConfigRevision: str | None
    state: AgentPublicationWebhookState


class AgentWebhookSnapshot(TypedDict):
    """``agent.deleted`` carries only ``id`` and ``resourceVersion``."""

    id: str
    resourceVersion: str
    desiredConfigRevision: NotRequired[str | None]
    publication: NotRequired[AgentWebhookPublication]


class AgentWebhookScope(TypedDict):
    agentId: str


class AgentWebhookBody(TypedDict):
    schemaVersion: Literal[1]
    eventId: str
    type: AgentWebhookType
    occurredAt: str
    scope: AgentWebhookScope
    data: AgentWebhookSnapshot


class AgentWebhookEvent(TypedDict):
    organization_id: str
    app_id: str
    event: AgentWebhookBody


SandboxAgentWebhookEvent: TypeAlias = SandboxWebhookEvent | AgentWebhookEvent
