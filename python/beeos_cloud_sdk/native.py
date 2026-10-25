# Generated from spec/native.openapi.json by native-python.mjs; do not edit.
from __future__ import annotations

# Modeled NativeResponseEvent type set; unknown future types are skipped, never fatal.
_NATIVE_RESPONSE_EVENT_TYPES = frozenset({"response.phase", "response.output", "response.interaction", "response.completed", "response.failed", "response.incomplete", "response.cancelled", "response.unknown", "response.output_text.delta"})

import asyncio
import json
import time
from collections.abc import AsyncIterator, Callable, Iterator, Mapping
from dataclasses import dataclass
from typing import Generic, Literal, Never, NotRequired, Required, TypeAlias, TypeVar, TypedDict, cast
from urllib.parse import quote, urlsplit, urlunsplit
from uuid import uuid4

import httpx
from websockets.asyncio.client import ClientConnection as AsyncWebSocket, connect as async_ws_connect
from websockets.sync.client import ClientConnection as WebSocket, connect as sync_ws_connect
from websockets.typing import Origin, Subprotocol

JSONValue: TypeAlias = None | bool | int | float | str | list["JSONValue"] | dict[str, "JSONValue"]
BinaryStream: TypeAlias = bytes
T = TypeVar("T")

@dataclass(frozen=True)
class HTTPHeaders(Mapping[str, str]):
    raw: httpx.Headers

    def __getitem__(self, key: str) -> str:
        return self.raw["x-request-id" if key == "request_id" else key.replace("_", "-")]

    def __iter__(self) -> Iterator[str]:
        return iter(self.raw)

    def __len__(self) -> int:
        return len(self.raw)

    @property
    def request_id(self) -> str | None:
        return cast(str | None, self.raw.get("x-request-id"))

    @property
    def etag(self) -> str | None:
        return cast(str | None, self.raw.get("etag"))

    @property
    def location(self) -> str | None:
        return cast(str | None, self.raw.get("location"))

    @property
    def should_retry(self) -> bool | None:
        value = self.raw.get("should-retry")
        return None if value is None else value.lower() == "true"

    @property
    def retry_after(self) -> str | None:
        return cast(str | None, self.raw.get("retry-after"))

@dataclass(frozen=True)
class Acceptance:
    status: int
    resource_id: str | None
    etag: str | None
    request_id: str | None
    idempotency_key: str

@dataclass(frozen=True)
class BeeOSHTTPResponse(Generic[T]):
    status: int
    body: T
    headers: HTTPHeaders
    acceptance: Acceptance | None = None
    raw_body: bytes = b""
    operation_context: OperationContext | None = None

@dataclass
class OperationContext:
    """Keep this per operation to recover an accepted intent after local cancellation."""
    operation_id: str | None = None
    idempotency_key: str | None = None
    acceptance: Acceptance | None = None
    last_response: BeeOSHTTPResponse[object] | None = None

class NativeRequestOptions(TypedDict, total=False):
    idempotency_key: str
    request_timeout_seconds: float
    wait_timeout_seconds: float
    poll_interval_seconds: float
    wait: bool
    on_progress: Callable[[BeeOSHTTPResponse[object]], None]
    context: OperationContext

Model0 = TypedDict("Model0", {
    "kind": "Required[Literal[\"explicit\"]]",
})

CanvasLink = TypedDict("CanvasLink", {
    "canvas_id": "Required[CanvasId]",
    "session_id": "Required[OpaqueId]",
    "agent_id": "Required[NativeAgentId]",
    "linked_at": "Required[str]",
    "role": "Required[Literal[\"viewer\", \"editor\"]]",
})

CanvasLinkResult = TypedDict("CanvasLinkResult", {
    "data": "Required[CanvasLink | None]",
})

CanvasTicketCreate = TypedDict("CanvasTicketCreate", {
    "canvas_id": "NotRequired[CanvasId]",
})

CanvasTicket = TypedDict("CanvasTicket", {
    "canvas_id": "Required[CanvasId]",
    "session_id": "Required[OpaqueId]",
    "role": "Required[Literal[\"viewer\", \"editor\"]]",
    "relay_url": "Required[str]",
    "open_url": "Required[str]",
    "profile": "Required[Literal[\"beeos-canvas-v1\"]]",
    "ticket": "Required[str]",
    "expires_at": "Required[str]",
    "protocol_version": "Required[Literal[1]]",
})

CanvasTicketResult = TypedDict("CanvasTicketResult", {
    "data": "Required[CanvasTicket]",
})

CanvasShareCreate = TypedDict("CanvasShareCreate", {
    "mode": "Required[Literal[\"link\", \"password\"]]",
    "password": "NotRequired[str]",
    "allow_interaction": "NotRequired[bool]",
})

CanvasShare = TypedDict("CanvasShare", {
    "id": "Required[CanvasId]",
    "canvas_id": "Required[CanvasId]",
    "slug": "Required[str]",
    "url": "Required[str]",
    "mode": "Required[Literal[\"link\", \"password\"]]",
    "allow_interaction": "Required[bool]",
    "expires_at": "Required[str | None]",
    "created_at": "Required[str]",
})

CanvasShareResult = TypedDict("CanvasShareResult", {
    "data": "Required[CanvasShare | None]",
})

CanvasSnapshot = TypedDict("CanvasSnapshot", {
    "id": "Required[CanvasId]",
    "canvas_id": "Required[CanvasId]",
    "version": "Required[int]",
    "actor_type": "Required[str]",
    "description": "Required[str | None]",
    "created_at": "Required[str]",
})

CanvasSnapshotPage = TypedDict("CanvasSnapshotPage", {
    "data": "Required[list[CanvasSnapshot]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

CanvasRestoreResult = TypedDict("CanvasRestoreResult", {
    "data": "Required[CanvasRestoreResultData]",
})

CanvasRestoreResultData = TypedDict("CanvasRestoreResultData", {
    "snapshot_id": "Required[CanvasId]",
    "version": "Required[int]",
})

Error = TypedDict("Error", {
    "code": "Required[str]",
    "message": "Required[str]",
    "request_id": "Required[RequestId]",
    "details": "NotRequired[ErrorDetails]",
    "retry_after": "NotRequired[RetryAfterSeconds]",
})

ErrorResponse = TypedDict("ErrorResponse", {
    "code": "Required[str]",
    "message": "Required[str]",
    "request_id": "Required[RequestId]",
    "details": "NotRequired[ErrorDetails]",
    "retry_after": "NotRequired[RetryAfterSeconds]",
})

ResolvedResources = TypedDict("ResolvedResources", {
    "vcpu": "Required[int]",
    "memory_mib": "Required[int]",
    "disk_gib": "Required[int]",
})

SandboxCreate = TypedDict("SandboxCreate", {
    "template": "Required[str]",
    "timeout_seconds": "NotRequired[int]",
    "on_timeout": "NotRequired[Literal[\"pause\", \"terminate\"]]",
    "labels": "NotRequired[dict[str, str]]",
    "name": "NotRequired[str]",
})

SandboxPatch = TypedDict("SandboxPatch", {
    "labels": "Required[dict[str, str]]",
})

ResolvedTemplate = TypedDict("ResolvedTemplate", {
    "id": "Required[str]",
    "build_id": "Required[OpaqueId]",
    "digest": "Required[str]",
    "runtime_artifact_set": "Required[RuntimeArtifactSetRef]",
})

ResolvedHarness = TypedDict("ResolvedHarness", {
    "name": "Required[str]",
    "version": "Required[str]",
})

Sandbox = TypedDict("Sandbox", {
    "id": "Required[OpaqueId]",
    "template": "Required[ResolvedTemplate]",
    "harness": "Required[ResolvedHarness | None]",
    "agent_id": "Required[AgentId | None]",
    "status": "Required[Literal[\"pending\", \"provisioning\", \"running\", \"pausing\", \"paused\", \"resuming\", \"error\", \"unknown\"]]",
    "timeout_seconds": "Required[int]",
    "on_timeout": "Required[Literal[\"pause\", \"terminate\"]]",
    "expires_at": "Required[str | None]",
    "labels": "Required[dict[str, str]]",
    "resources": "Required[ResolvedResources]",
    "created_at": "Required[str]",
    "last_error": "Required[Error | None]",
    "resource_version": "Required[ResourceVersion]",
    "paused_mode": "Required[Literal[\"filesystem\", \"full_state\"] | None]",
    "name": "Required[str | None]",
    "management_source": "Required[Literal[\"explicit\", \"agent\"]]",
})

PauseRequest = TypedDict("PauseRequest", {
    "mode": "NotRequired[Literal[\"filesystem\", \"full_state\"]]",
})

ResumeRequest = TypedDict("ResumeRequest", {
    "mode": "NotRequired[Literal[\"filesystem\", \"full_state\"]]",
})

TemplateInfrastructure = TypedDict("TemplateInfrastructure", {
    "os": "Required[Literal[\"linux\", \"windows\"]]",
    "architecture": "Required[Literal[\"amd64\", \"arm64\"]]",
    "pause_modes": "Required[list[Literal[\"filesystem\", \"full_state\"]]]",
    "verified_at": "Required[str | None]",
})

TemplateGuestDaemon = TypedDict("TemplateGuestDaemon", {
    "version": "Required[str]",
    "features": "Required[list[Literal[\"desktop\", \"pty\"]]]",
})

TemplateBuild = TypedDict("TemplateBuild", {
    "id": "Required[OpaqueId]",
    "digest": "Required[str]",
    "infrastructure": "Required[TemplateInfrastructure]",
    "guest_daemon": "Required[TemplateGuestDaemon]",
    "base_image_digest": "Required[str]",
    "runtime_artifact_set": "Required[RuntimeArtifactSetRef]",
    "harness_artifacts": "Required[list[TemplateHarnessArtifact]]",
})

Template = TypedDict("Template", {
    "id": "Required[str]",
    "name": "Required[str]",
    "description": "Required[str]",
    "surface": "Required[Literal[\"headless\", \"desktop\"]]",
    "supported_harnesses": "Required[list[str]]",
    "resources": "Required[ResolvedResources]",
    "prewarmed": "Required[bool]",
    "default_build": "Required[TemplateBuild]",
    "region": "Required[str]",
})

AccessTicketCreate = TypedDict("AccessTicketCreate", {
    "purpose": "Required[Literal[\"desktop\", \"pty\"]]",
    "cols": "NotRequired[int]",
    "rows": "NotRequired[int]",
    "pty_id": "NotRequired[str]",
    "origin": "NotRequired[str]",
    "role": "NotRequired[Literal[\"viewer\", \"controller\"]]",
})

AccessTicket = TypedDict("AccessTicket", {
    "id": "Required[OpaqueId]",
    "sandbox_id": "Required[OpaqueId]",
    "purpose": "Required[Literal[\"desktop\", \"pty\"]]",
    "ticket": "Required[str]",
    "connect_url": "Required[str]",
    "expires_at": "Required[str]",
    "resource_version": "Required[ResourceVersion]",
    "transport": "Required[Literal[\"websocket\", \"webrtc\"]]",
    "protocol_version": "Required[Literal[1]]",
    "pty_id": "NotRequired[str]",
    "reconnect_window_seconds": "NotRequired[int]",
    "profile": "Required[Literal[\"beeos-terminal-v2\", \"beeos-desktop-v1\"]]",
    "client_id": "Required[str]",
    "role": "NotRequired[Literal[\"viewer\", \"controller\"]]",
})

SandboxResult = TypedDict("SandboxResult", {
    "data": "Required[Sandbox]",
})

SandboxGetResult = TypedDict("SandboxGetResult", {
    "data": "Required[Sandbox]",
})

TemplateResult = TypedDict("TemplateResult", {
    "data": "Required[Template]",
})

AccessTicketResult = TypedDict("AccessTicketResult", {
    "data": "Required[AccessTicket]",
})

SandboxPage = TypedDict("SandboxPage", {
    "data": "Required[list[Sandbox]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

TemplatePage = TypedDict("TemplatePage", {
    "data": "Required[list[Template]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

SkillSelection = TypedDict("SkillSelection", {
    "skill_id": "Required[OpaqueId]",
    "version": "Required[revision]",
    "digest": "Required[str]",
    "enabled": "Required[bool]",
})

MCPSelection = TypedDict("MCPSelection", {
    "server_ref": "Required[OpaqueId]",
    "enabled": "Required[bool]",
    "required": "Required[bool]",
    "credential_slot": "NotRequired[str]",
    "kind": "NotRequired[Literal[\"catalog\", \"remote\"]]",
    "name": "NotRequired[str]",
    "url": "NotRequired[str]",
    "transport": "NotRequired[Literal[\"streamable-http\", \"sse\"]]",
    "headers": "NotRequired[dict[str, str]]",
    "credential_header": "NotRequired[str]",
})

ComponentObservation = TypedDict("ComponentObservation", {
    "component": "Required[Literal[\"model\", \"persona\", \"tools\", \"skills\", \"mcp\", \"credentials\", \"target\"]]",
    "scope": "Required[Literal[\"agent\", \"binding\", \"session\", \"response\"]]",
    "scope_id": "Required[OpaqueId | None]",
    "revision": "Required[revision | None]",
    "state": "Required[Literal[\"accepted\", \"prepared\", \"loaded\", \"not_applied\", \"deferred\", \"failed\", \"unknown\"]]",
    "observed_at": "Required[str | None]",
    "error": "Required[Error | None]",
})

Publication = TypedDict("Publication", {
    "accepted_config_revision": "Required[revision]",
    "changed_components": "Required[list[Literal[\"model\", \"persona\", \"tools\", \"skills\", \"mcp\", \"credentials\", \"target\"]]]",
    "state": "Required[Literal[\"accepted\", \"preparing\", \"ready\", \"deferred\", \"failed\", \"partial\", \"unknown\", \"superseded\"]]",
    "components": "Required[list[ComponentObservation]]",
})

AgentBindingObservation = TypedDict("AgentBindingObservation", {
    "binding_id": "Required[OpaqueId]",
    "sandbox_id": "Required[OpaqueId]",
    "state": "Required[str]",
    "prepared_config_revision": "Required[revision | None]",
    "credential_activation_revision": "Required[revision | None]",
    "credential_status": "Required[CredentialBindingStatus]",
    "persona_scope": "Required[Literal[\"session\", \"binding\", \"unknown\"]]",
    "components": "Required[list[ComponentObservation]]",
    "error": "Required[Error | None]",
})

NativeAgentCreate = TypedDict("NativeAgentCreate", {
    "name": "NotRequired[str]",
    "engine": "Required[str]",
    "instructions": "NotRequired[str]",
    "model_id": "NotRequired[OpaqueId | None]",
    "skills": "NotRequired[list[SkillSelection]]",
    "mcp_servers": "NotRequired[list[MCPSelection]]",
    "disabled_tools": "NotRequired[list[str]]",
    "run_timeout_seconds": "NotRequired[int]",
    "target": "NotRequired[BeeosTarget]",
    "credentials": "NotRequired[CredentialBindings]",
    "end_user_ref": "NotRequired[EndUserRef]",
})

NativeAgentPatch = TypedDict("NativeAgentPatch", {
    "name": "NotRequired[str]",
    "instructions": "NotRequired[str]",
    "model_id": "NotRequired[OpaqueId | None]",
    "skills": "NotRequired[list[SkillSelection]]",
    "mcp_servers": "NotRequired[list[MCPSelection]]",
    "disabled_tools": "NotRequired[list[str]]",
    "run_timeout_seconds": "NotRequired[int]",
    "target": "NotRequired[BeeosTarget]",
    "credentials": "NotRequired[CredentialBindings]",
})

NativeAgentConfiguration = TypedDict("NativeAgentConfiguration", {
    "name": "Required[str]",
    "engine": "Required[str]",
    "instructions": "Required[str]",
    "model_id": "Required[OpaqueId | None]",
    "skills": "Required[list[SkillSelection]]",
    "mcp_servers": "Required[list[MCPSelection]]",
    "disabled_tools": "Required[list[str]]",
    "run_timeout_seconds": "Required[int]",
    "target": "Required[BeeosTarget]",
    "credential_status": "Required[CredentialBindingStatus]",
})

AuthorizationEnforcement = TypedDict("AuthorizationEnforcement", {
    "authorization_revision": "Required[revision]",
    "state": "Required[Literal[\"enforcing\", \"enforced\", \"partial\", \"unknown\"]]",
    "affected_scopes": "Required[list[AuthorizationEnforcementAffectedScopesItem]]",
    "error": "Required[Error | None]",
})

AuthorizationEnforcementAffectedScopesItem = TypedDict("AuthorizationEnforcementAffectedScopesItem", {
    "kind": "Required[Literal[\"tool\", \"mcp\", \"credential\", \"session\", \"binding\", \"sandbox\"]]",
    "id": "Required[OpaqueId]",
    "state": "Required[Literal[\"pending\", \"enforced\", \"failed\", \"unknown\"]]",
})

NativeAgent = TypedDict("NativeAgent", {
    "id": "Required[NativeAgentId]",
    "configuration": "Required[NativeAgentConfiguration]",
    "desired_config_revision": "Required[Revision]",
    "resource_version": "Required[ResourceVersion]",
    "binding": "Required[AgentBindingObservation | None]",
    "publication": "Required[Publication]",
    "authorization": "Required[AuthorizationEnforcement]",
    "default_model_id": "Required[OpaqueId]",
    "end_user_ref": "Required[EndUserRef | None]",
    "created_at": "Required[str]",
    "updated_at": "Required[str]",
})

AuthorizationRevokeValueVariant1 = TypedDict("AuthorizationRevokeValueVariant1", {
    "all": "Required[Literal[True]]",
})

AuthorizationRevokeValueVariant2 = TypedDict("AuthorizationRevokeValueVariant2", {
    "tool_ids": "NotRequired[list[OpaqueId]]",
    "mcp_server_refs": "NotRequired[list[OpaqueId]]",
    "credential_slots": "NotRequired[list[str]]",
})

DeletedResult = TypedDict("DeletedResult", {
    "id": "Required[OpaqueId]",
    "deleted": "Required[Literal[True]]",
    "cleanup": "Required[Literal[\"pending\", \"complete\"]]",
    "scope": "Required[str]",
})

ModelAvailability = TypedDict("ModelAvailability", {
    "id": "Required[OpaqueId]",
    "provider_id": "Required[OpaqueId]",
    "model_id": "Required[str]",
    "endpoint_ref": "Required[OpaqueId | None]",
    "engine_support": "Required[list[str]]",
    "availability": "Required[Literal[\"available\", \"unavailable\", \"unknown\"]]",
    "reason": "Required[str | None]",
    "observed_at": "Required[str | None]",
    "default": "Required[bool]",
})

SkillFile = TypedDict("SkillFile", {
    "path": "Required[str]",
    "file_id": "Required[OpaqueId]",
    "size_bytes": "Required[int]",
    "sha256": "Required[str]",
    "media_type": "Required[str]",
})

SkillFiles = TypedDict("SkillFiles", {
    "skill_id": "Required[OpaqueId]",
    "version": "Required[revision]",
    "digest": "Required[str]",
    "files": "Required[list[SkillFile]]",
})

FileMetadata = TypedDict("FileMetadata", {
    "id": "Required[OpaqueId]",
    "filename": "Required[str]",
    "media_type": "Required[str]",
    "size_bytes": "Required[int]",
    "sha256": "Required[str]",
    "status": "Required[Literal[\"ready\", \"deleted\", \"revoked\"]]",
    "owner_scope": "Required[Literal[\"org\", \"session\", \"command\"]]",
    "owner_id": "Required[OpaqueId | None]",
    "created_at": "Required[str]",
    "expires_at": "Required[str | None]",
})

FileInput = TypedDict("FileInput", {
    "type": "Required[Literal[\"input_file\", \"input_image\"]]",
    "file_id": "Required[OpaqueId]",
    "sha256": "Required[str]",
})

TextInput = TypedDict("TextInput", {
    "type": "Required[Literal[\"input_text\"]]",
    "text": "Required[str]",
})

ResponseInputItem = TypedDict("ResponseInputItem", {
    "id": "Required[OpaqueId]",
    "content": "Required[ResponseInput]",
})

NativeSessionCreate = TypedDict("NativeSessionCreate", {
    "agent_id": "Required[NativeAgentId]",
    "name": "NotRequired[str]",
    "metadata": "NotRequired[dict[str, str]]",
    "end_user_ref": "NotRequired[EndUserRef]",
})

NativeSessionPatch = TypedDict("NativeSessionPatch", {
    "name": "Required[str]",
})

SessionConfigurationObservation = TypedDict("SessionConfigurationObservation", {
    "persona_revision": "Required[revision | None]",
    "persona_policy": "Required[Literal[\"session_start\", \"binding_next_turn\", \"unknown\"]]",
    "last_loaded_execution_revision": "Required[revision | None]",
    "last_response_id": "Required[OpaqueId | None]",
    "components": "Required[list[ComponentObservation]]",
})

NativeSession = TypedDict("NativeSession", {
    "id": "Required[OpaqueId]",
    "agent_id": "Required[NativeAgentId]",
    "state": "Required[Literal[\"active\", \"agent_deleted\", \"deleting\"]]",
    "read_only": "Required[bool]",
    "name": "Required[str]",
    "metadata": "Required[dict[str, str]]",
    "configuration": "Required[SessionConfigurationObservation]",
    "head_response_id": "Required[OpaqueId | None]",
    "resource_version": "Required[ResourceVersion]",
    "created_at": "Required[str]",
    "updated_at": "Required[str]",
    "last_activity_at": "Required[str]",
    "continuation_available": "Required[bool]",
    "continuation_unavailable_reason": "Required[Literal[\"agent_deleted\", \"session_deleting\", \"history_source_deleted\", \"native_continuity_unproven\"] | None]",
    "end_user_ref": "Required[EndUserRef | None]",
})

NativeResponseCreate = TypedDict("NativeResponseCreate", {
    "session_id": "Required[OpaqueId]",
    "input": "Required[list[ResponseInput]]",
    "instructions": "NotRequired[str]",
    "model_id": "NotRequired[OpaqueId]",
    "previous_response_id": "NotRequired[OpaqueId]",
    "timeout_seconds": "NotRequired[int]",
    "metadata": "NotRequired[NativeMetadata]",
})

EffectiveConfiguration = TypedDict("EffectiveConfiguration", {
    "config_revision": "Required[revision]",
    "persona_revision": "Required[revision | None]",
    "resolved_request_hash": "Required[str]",
    "requested_model_id": "Required[OpaqueId | None]",
    "loaded_model_id": "Required[OpaqueId | None]",
    "actual_provider_id": "Required[OpaqueId | None]",
    "actual_model_id": "Required[OpaqueId | None]",
    "endpoint_ref": "Required[OpaqueId | None]",
    "api_mode": "Required[str | None]",
    "reasoning": "Required[str | None]",
    "fallback_used": "Required[bool | None]",
    "skills_digest": "Required[str | None]",
    "tool_schema_digest": "Required[str | None]",
    "credential_activation_revision": "Required[revision | None]",
    "authorization_revision_at_admission": "Required[AuthorizationRevision]",
    "observation": "Required[Literal[\"selected\", \"loaded\", \"executed\", \"partial\", \"unknown\"]]",
    "components": "Required[list[ComponentObservation]]",
    "memory_read_watermark": "Required[OpaqueId | None]",
    "memory_observation": "Required[Literal[\"not_read\", \"read\", \"unavailable\", \"unknown\"]]",
})

ResponseOutputItemValueVariant1 = TypedDict("ResponseOutputItemValueVariant1", {
    "type": "Required[Literal[\"output_text\"]]",
    "text": "Required[str]",
})

ResponseOutputItemValueVariant2 = TypedDict("ResponseOutputItemValueVariant2", {
    "type": "Required[Literal[\"output_file\"]]",
    "file": "Required[FileMetadata]",
})

ResponseOutputItemValueVariant3 = TypedDict("ResponseOutputItemValueVariant3", {
    "type": "Required[Literal[\"tool_summary\"]]",
    "tool_call_id": "Required[OpaqueId]",
    "tool_name": "Required[str]",
    "outcome": "Required[Literal[\"succeeded\", \"failed\", \"unknown\"]]",
    "summary": "Required[str]",
})

InteractionOption = TypedDict("InteractionOption", {
    "id": "Required[OpaqueId]",
    "label": "Required[str]",
})

InteractionQuestion = TypedDict("InteractionQuestion", {
    "id": "Required[OpaqueId]",
    "prompt": "Required[str]",
    "kind": "Required[Literal[\"text\", \"single_choice\", \"multiple_choice\"]]",
    "options": "Required[list[InteractionOption]]",
})

Interaction = TypedDict("Interaction", {
    "id": "Required[OpaqueId]",
    "response_id": "Required[OpaqueId]",
    "attempt_ref": "Required[OpaqueId]",
    "revision": "Required[ResourceVersion]",
    "kind": "Required[Literal[\"approval\", \"question\", \"resume\"]]",
    "state": "Required[Literal[\"pending\", \"resolved\", \"expired\", \"cancelled\"]]",
    "expires_at": "Required[str]",
    "tool_call_id": "Required[OpaqueId | None]",
    "tool_name": "Required[str | None]",
    "arguments_digest": "Required[str | None]",
    "summary": "Required[str]",
    "options": "Required[list[InteractionOption]]",
    "questions": "Required[list[InteractionQuestion]]",
    "pause_sequence": "Required[int | None]",
})

InteractionReplyValueVariant1 = TypedDict("InteractionReplyValueVariant1", {
    "attempt_ref": "Required[OpaqueId]",
    "interaction_revision": "Required[ResourceVersion]",
    "kind": "Required[Literal[\"approval\"]]",
    "option_id": "Required[OpaqueId]",
})

InteractionReplyValueVariant2 = TypedDict("InteractionReplyValueVariant2", {
    "attempt_ref": "Required[OpaqueId]",
    "interaction_revision": "Required[ResourceVersion]",
    "kind": "Required[Literal[\"question\"]]",
    "answers": "Required[list[InteractionReplyValueVariant2AnswersItem]]",
})

InteractionReplyValueVariant2AnswersItem = TypedDict("InteractionReplyValueVariant2AnswersItem", {
    "question_id": "Required[OpaqueId]",
    "value": "Required[str | list[str]]",
})

InteractionReplyValueVariant3 = TypedDict("InteractionReplyValueVariant3", {
    "attempt_ref": "Required[OpaqueId]",
    "interaction_revision": "Required[ResourceVersion]",
    "kind": "Required[Literal[\"resume\"]]",
    "pause_sequence": "Required[int]",
})

InteractionReplyResult = TypedDict("InteractionReplyResult", {
    "response_id": "Required[OpaqueId]",
    "interaction_id": "Required[OpaqueId]",
    "decision_id": "Required[OpaqueId]",
    "accepted": "Required[Literal[True]]",
    "duplicate": "Required[bool]",
})

NativeResponse = TypedDict("NativeResponse", {
    "id": "Required[OpaqueId]",
    "session_id": "Required[OpaqueId]",
    "sandbox_id": "Required[OpaqueId | None]",
    "agent_id": "Required[NativeAgentId]",
    "status": "Required[Literal[\"queued\", \"in_progress\", \"waiting_input\", \"cancelling\", \"completed\", \"failed\", \"incomplete\", \"cancelled\"]]",
    "phase": "Required[Literal[\"accepted\", \"preparing_compute\", \"loading_session\", \"executing\", \"waiting_input\", \"finished\"]]",
    "terminal": "Required[bool]",
    "effective_configuration": "Required[EffectiveConfiguration | None]",
    "output": "Required[list[ResponseOutputItem]]",
    "input": "Required[list[ResponseInputItem]]",
    "metadata": "Required[NativeMetadata]",
    "pending_interactions": "Required[list[Interaction]]",
    "error": "Required[Error | None]",
    "usage": "Required[NativeResponseUsageVariant1 | None]",
    "stop_observation": "Required[Literal[\"not_requested\", \"requested\", \"proven_stopped\", \"fenced\", \"unknown\"]]",
    "checkpoint": "Required[NativeResponseCheckpoint]",
    "resource_version": "Required[ResourceVersion]",
    "created_at": "Required[str]",
    "completed_at": "Required[str | None]",
    "instructions": "Required[str | None]",
    "previous_response_id": "Required[OpaqueId | None]",
})

NativeResponseUsageVariant1 = TypedDict("NativeResponseUsageVariant1", {
    "input_tokens": "NotRequired[int]",
    "output_tokens": "NotRequired[int]",
    "source": "Required[Literal[\"provider\", \"native\", \"estimated\"]]",
    "actual_model_id": "NotRequired[OpaqueId | None]",
})

NativeResponseCheckpoint = TypedDict("NativeResponseCheckpoint", {
    "state": "Required[Literal[\"not_requested\", \"pending\", \"committed\", \"failed\", \"unknown\"]]",
    "source_revision": "Required[revision | None]",
})

NativeResponseEventValueVariant1 = TypedDict("NativeResponseEventValueVariant1", {
    "type": "Required[Literal[\"response.phase\"]]",
    "response_id": "Required[OpaqueId]",
    "sequence": "Required[int]",
    "phase": "Required[Literal[\"accepted\", \"preparing_compute\", \"loading_session\", \"executing\", \"waiting_input\", \"finished\"]]",
})

NativeResponseEventValueVariant2 = TypedDict("NativeResponseEventValueVariant2", {
    "type": "Required[Literal[\"response.output\"]]",
    "response_id": "Required[OpaqueId]",
    "sequence": "Required[int]",
    "item": "Required[ResponseOutputItem]",
})

NativeResponseEventValueVariant3 = TypedDict("NativeResponseEventValueVariant3", {
    "type": "Required[Literal[\"response.interaction\"]]",
    "response_id": "Required[OpaqueId]",
    "sequence": "Required[int]",
    "interaction": "Required[Interaction]",
})

NativeResponseEventValueVariant4 = TypedDict("NativeResponseEventValueVariant4", {
    "type": "Required[Literal[\"response.completed\", \"response.failed\", \"response.incomplete\", \"response.cancelled\", \"response.unknown\"]]",
    "response_id": "Required[OpaqueId]",
    "sequence": "Required[int]",
    "response": "Required[NativeResponse]",
})

NativeResponseEventValueVariant5 = TypedDict("NativeResponseEventValueVariant5", {
    "type": "Required[Literal[\"response.output_text.delta\"]]",
    "response_id": "Required[OpaqueId]",
    "item_id": "Required[str]",
    "output_index": "Required[int]",
    "content_index": "Required[int]",
    "delta": "Required[str]",
})

CommandCreate = TypedDict("CommandCreate", {
    "argv": "Required[list[str]]",
    "cwd": "NotRequired[str]",
    "env": "NotRequired[dict[str, str]]",
    "timeout_seconds": "NotRequired[int]",
    "result_path": "NotRequired[str]",
    "artifact_paths": "NotRequired[list[str]]",
})

CommandArtifact = TypedDict("CommandArtifact", {
    "id": "Required[OpaqueId]",
    "filename": "Required[str]",
    "media_type": "Required[str]",
    "size_bytes": "Required[int]",
    "sha256": "Required[str]",
    "published_at": "Required[str]",
    "expires_at": "Required[str]",
})

Command = TypedDict("Command", {
    "id": "Required[OpaqueId]",
    "sandbox_id": "Required[OpaqueId]",
    "state": "Required[Literal[\"queued\", \"running\", \"stopping\", \"collecting\", \"completed\", \"unknown\"]]",
    "process_outcome": "Required[Literal[\"pending\", \"exited\", \"cancelled\", \"timed_out\", \"start_failed\", \"lost\", \"unknown\"]]",
    "exit_code": "Required[int | None]",
    "signal": "Required[str | None]",
    "stop_proven": "Required[bool]",
    "capture_status": "Required[Literal[\"not_requested\", \"pending\", \"complete\", \"partial\", \"failed\", \"unknown\"]]",
    "result": "Required[StructuredCommandResult | None]",
    "artifacts": "Required[list[CommandArtifact]]",
    "logs": "Required[CommandLogs]",
    "error": "Required[Error | None]",
    "resource_version": "Required[ResourceVersion]",
    "created_at": "Required[str]",
    "completed_at": "Required[str | None]",
    "expires_at": "Required[str | None]",
})

CommandLogs = TypedDict("CommandLogs", {
    "first_sequence": "Required[int]",
    "last_sequence": "Required[int]",
    "persisted_bytes": "Required[int]",
    "truncated": "Required[bool]",
    "error": "Required[Error | None]",
})

CommandEventValueVariant1 = TypedDict("CommandEventValueVariant1", {
    "type": "Required[Literal[\"stdout\", \"stderr\"]]",
    "command_id": "Required[OpaqueId]",
    "sequence": "Required[int]",
    "data": "Required[str]",
    "decoded_bytes": "Required[int]",
})

CommandEventValueVariant2 = TypedDict("CommandEventValueVariant2", {
    "type": "Required[Literal[\"status\", \"truncated\", \"complete\"]]",
    "command_id": "Required[OpaqueId]",
    "sequence": "Required[int]",
    "command": "Required[Command]",
})

FileWriteResult = TypedDict("FileWriteResult", {
    "path": "Required[str]",
    "size_bytes": "Required[int]",
    "sha256": "Required[str]",
    "etag": "Required[str]",
})

CredentialInputCapabilities = TypedDict("CredentialInputCapabilities", {
    "version": "Required[Literal[1]]",
    "modes": "Required[list[Literal[\"reference\", \"sealed\"]]]",
    "discovery_path": "Required[Literal[\"/uhp/v1/uhp\"]]",
})

NativeCapabilities = TypedDict("NativeCapabilities", {
    "credential_input": "Required[CredentialInputCapabilities]",
    "api_version": "Required[Literal[\"2\"]]",
    "features": "Required[dict[str, Literal[\"supported\", \"unsupported\", \"proposed\", \"conditional\", \"unknown\"]]]",
    "limits": "Required[dict[str, int]]",
    "engines": "Required[list[NativeCapabilitiesEnginesItem]]",
})

NativeCapabilitiesEnginesItem = TypedDict("NativeCapabilitiesEnginesItem", {
    "id": "Required[str]",
    "available": "Required[bool]",
    "persona_scope": "Required[Literal[\"session\", \"binding\", \"unknown\"]]",
    "reason": "Required[str | None]",
})

NativeAgentResult = TypedDict("NativeAgentResult", {
    "data": "Required[NativeAgent]",
})

AuthorizationEnforcementResult = TypedDict("AuthorizationEnforcementResult", {
    "data": "Required[AuthorizationEnforcement]",
})

DeletedResultResult = TypedDict("DeletedResultResult", {
    "data": "Required[DeletedResult]",
})

SkillFilesResult = TypedDict("SkillFilesResult", {
    "data": "Required[SkillFiles]",
})

FileMetadataResult = TypedDict("FileMetadataResult", {
    "data": "Required[FileMetadata]",
})

NativeSessionResult = TypedDict("NativeSessionResult", {
    "data": "Required[NativeSession]",
})

NativeResponseResult = TypedDict("NativeResponseResult", {
    "data": "Required[NativeResponse]",
})

InteractionReplyResultResult = TypedDict("InteractionReplyResultResult", {
    "data": "Required[InteractionReplyResult]",
})

FileWriteResultResult = TypedDict("FileWriteResultResult", {
    "data": "Required[FileWriteResult]",
})

NativeCapabilitiesResult = TypedDict("NativeCapabilitiesResult", {
    "data": "Required[NativeCapabilities]",
})

NativeAgentPage = TypedDict("NativeAgentPage", {
    "data": "Required[list[NativeAgent]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

ModelAvailabilityPage = TypedDict("ModelAvailabilityPage", {
    "data": "Required[list[ModelAvailability]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

FileMetadataPage = TypedDict("FileMetadataPage", {
    "data": "Required[list[FileMetadata]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

ResponseInputPage = TypedDict("ResponseInputPage", {
    "data": "Required[list[ResponseInputItem]]",
    "metadata": "Required[NativeMetadata]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

NativeSessionPage = TypedDict("NativeSessionPage", {
    "data": "Required[list[NativeSession]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

CommandResultEnvelope = TypedDict("CommandResultEnvelope", {
    "data": "Required[Command]",
})

StructuredCommandResult = TypedDict("StructuredCommandResult", {
    "status": "Required[Literal[\"not_requested\", \"ready\", \"failed\"]]",
    "value": "Required[JSONValue]",
    "sha256": "Required[str | None]",
    "error": "Required[Error | None]",
})

NativeResponsePage = TypedDict("NativeResponsePage", {
    "data": "Required[list[NativeResponse]]",
    "next_cursor": "Required[str | None]",
    "has_more": "Required[bool]",
})

TemplateHarnessArtifact = TypedDict("TemplateHarnessArtifact", {
    "harness": "Required[Literal[\"openclaw\", \"hermes\"]]",
    "version": "Required[ExternalOpaqueRef]",
    "artifact_digest": "Required[str]",
    "dependency_lock_digest": "Required[str]",
    "preparation_recipe": "Required[HarnessPreparationRecipeRef]",
})

NativeMemorySourceValueVariant2 = TypedDict("NativeMemorySourceValueVariant2", {
    "kind": "Required[Literal[\"response\"]]",
    "response_id": "Required[OpaqueId]",
    "item_id": "Required[OpaqueId]",
})

NativeMemoryRemember = TypedDict("NativeMemoryRemember", {
    "content": "Required[str]",
    "kind": "Required[Literal[\"core\", \"semantic\", \"episodic\", \"procedural\"]]",
    "source": "Required[NativeMemorySource]",
    "valid_from": "NotRequired[str | None]",
    "valid_to": "NotRequired[str | None]",
})

NativeMemoryRecall = TypedDict("NativeMemoryRecall", {
    "query": "Required[str]",
    "kinds": "Required[list[Literal[\"core\", \"semantic\", \"episodic\", \"procedural\"]]]",
    "token_budget": "NotRequired[int]",
    "page_size": "NotRequired[int]",
    "cursor": "NotRequired[str]",
    "min_read_watermark": "NotRequired[OpaqueId]",
})

NativeMemoryCorrect = TypedDict("NativeMemoryCorrect", {
    "expected_revision": "Required[RecordRevision]",
    "content": "Required[str]",
    "reason": "Required[str]",
    "source": "Required[NativeMemorySource]",
})

NativeMemoryForget = TypedDict("NativeMemoryForget", {
    "expected_revision": "Required[RecordRevision]",
    "reason": "Required[str]",
})

NativeMemoryJobObservation = TypedDict("NativeMemoryJobObservation", {
    "id": "Required[OpaqueId]",
    "state": "Required[state]",
    "next_attempt_at": "Required[nextattemptat]",
    "error": "Required[Error | None]",
})

NativeMemoryErasureObservation = TypedDict("NativeMemoryErasureObservation", {
    "barrier_committed": "Required[bool]",
    "state": "Required[Literal[\"pending\", \"complete\", \"blocked\", \"failed\", \"unknown\"]]",
    "coverage": "Required[list[NativeMemoryErasureObservationCoverageItem]]",
    "error": "Required[Error | None]",
})

NativeMemoryErasureObservationCoverageItem = TypedDict("NativeMemoryErasureObservationCoverageItem", {
    "component": "Required[Literal[\"canonical\", \"index\", \"cache\", \"object_versions\", \"native_snapshots\", \"backup_barrier\"]]",
    "state": "Required[Literal[\"pending\", \"complete\", \"blocked\", \"failed\", \"unknown\"]]",
})

NativeMemoryReceiptObservation = TypedDict("NativeMemoryReceiptObservation", {
    "receipt": "Required[Receipt]",
    "completion": "Required[Literal[\"accepted\", \"durable\", \"recallable\", \"erasure_barrier\", \"erased\", \"blocked\", \"failed\", \"unknown\"]]",
    "job": "Required[NativeMemoryJobObservation | None]",
    "erasure": "Required[NativeMemoryErasureObservation | None]",
    "redacted": "Required[bool]",
})

NativeMemoryReceiptResult = TypedDict("NativeMemoryReceiptResult", {
    "data": "Required[NativeMemoryReceiptObservation]",
})

NativeMemoryRecallResult = TypedDict("NativeMemoryRecallResult", {
    "data": "Required[RecallPage]",
})

OwnerError = TypedDict("OwnerError", {
    "code": "Required[str]",
    "message": "Required[str]",
    "request_id": "Required[RequestId]",
    "details": "NotRequired[ErrorDetails]",
    "retry_after": "NotRequired[RetryAfterSeconds]",
})

ErrorDetails = TypedDict("ErrorDetails", {
    "reason": "NotRequired[str]",
    "fields": "NotRequired[list[ErrorDetailsFieldsItem]]",
    "related_resource": "NotRequired[ErrorDetailsRelatedResource]",
})

ErrorDetailsFieldsItem = TypedDict("ErrorDetailsFieldsItem", {
    "field": "Required[str]",
    "reason": "Required[str]",
})

ErrorDetailsRelatedResource = TypedDict("ErrorDetailsRelatedResource", {
    "id": "Required[OwnerOpaqueId]",
    "resource_version": "Required[OwnerResourceVersion]",
    "expires_at": "Required[str | None]",
})

OwnerErrorResponse = TypedDict("OwnerErrorResponse", {
    "code": "Required[str]",
    "message": "Required[str]",
    "request_id": "Required[RequestId]",
    "details": "NotRequired[ErrorDetails]",
    "retry_after": "NotRequired[RetryAfterSeconds]",
})

RuntimeArtifactSetRef = TypedDict("RuntimeArtifactSetRef", {
    "manifest_id": "Required[ExternalOpaqueRef]",
    "manifest_digest": "Required[str]",
    "schema_id": "Required[Literal[\"urn:beeos:internal:sandbox-runtime:proposal:1#/$defs/RuntimeArtifactSetManifest\"]]",
    "schema_version": "Required[Literal[\"1\"]]",
})

ArtifactRef = TypedDict("ArtifactRef", {
    "manifest_id": "Required[ExternalOpaqueRef]",
    "manifest_digest": "Required[str]",
    "schema_id": "Required[str]",
    "schema_version": "Required[OwnerOpaqueId2]",
})

RuntimeHarnessArtifact = TypedDict("RuntimeHarnessArtifact", {
    "harness": "Required[Literal[\"openclaw\", \"hermes\"]]",
    "version": "Required[ExternalOpaqueRef]",
    "artifact_digest": "Required[str]",
    "dependency_lock_digest": "Required[str]",
    "preparation_recipe": "Required[HarnessPreparationRecipeRef]",
})

HarnessPreparationRecipeRef = TypedDict("HarnessPreparationRecipeRef", {
    "manifest_id": "Required[ExternalOpaqueRef]",
    "manifest_digest": "Required[str]",
    "schema_id": "Required[Literal[\"urn:beeos:internal:sandbox-runtime:proposal:1#/$defs/HarnessPreparationRecipe\"]]",
    "schema_version": "Required[Literal[\"1\"]]",
})

CredentialPublicStatus = TypedDict("CredentialPublicStatus", {
    "slot": "Required[str]",
    "configured": "Required[bool]",
})

CredentialBindingStatus = TypedDict("CredentialBindingStatus", {
    "slots": "Required[list[CredentialPublicStatus]]",
})

BeeosRecipeTarget = TypedDict("BeeosRecipeTarget", {
    "kind": "Required[Literal[\"recipe\"]]",
    "template": "NotRequired[Literal[\"beeos/base\", \"beeos/base-4c8g\"]]",
    "timeout_seconds": "NotRequired[int]",
    "on_timeout": "NotRequired[Literal[\"terminate\"]]",
})

BeeosManagedTarget = TypedDict("BeeosManagedTarget", {
    "kind": "Required[Literal[\"managed\"]]",
    "sandbox_id": "Required[Id]",
})

CredentialBinding = TypedDict("CredentialBinding", {
    "slot": "Required[str]",
    "source": "Required[CredentialReference | SealedCredential]",
})

CredentialReference = TypedDict("CredentialReference", {
    "kind": "Required[Literal[\"reference\"]]",
    "ref": "Required[str]",
})

SealedCredential = TypedDict("SealedCredential", {
    "kind": "Required[Literal[\"sealed\"]]",
    "jwe": "Required[str]",
})

Receipt = TypedDict("Receipt", {
    "receipt_id": "Required[OwnerOpaqueId2]",
    "request_id": "Required[OwnerOpaqueId2]",
    "operation": "Required[Literal[\"observe\", \"remember\", \"recall\", \"revise\", \"forget\", \"consolidate\", \"export\", \"import\"]]",
    "disposition": "Required[Literal[\"accepted\", \"committed\", \"duplicate\"]]",
    "observation_ids": "Required[list[OwnerOpaqueId2]]",
    "record_refs": "Required[list[RecordRef]]",
    "job_ref": "Required[OwnerOpaqueId2 | None]",
    "committed_at": "Required[str | None]",
    "read_watermark": "Required[OwnerOpaqueId2 | None]",
    "index_watermark": "Required[OwnerOpaqueId2 | None]",
    "source_refs": "Required[list[Source]]",
})

RecordRef = TypedDict("RecordRef", {
    "record_id": "Required[OwnerOpaqueId2]",
    "revision": "Required[OwnerRecordRevision]",
})

MessageSource = TypedDict("MessageSource", {
    "kind": "Required[Literal[\"message\"]]",
    "source_id": "Required[OwnerOpaqueId2]",
    "history_generation": "Required[str]",
    "source_revision": "Required[OwnerOpaqueId2]",
    "origin": "Required[Literal[\"user_input\", \"tool_result\", \"assistant_result\", \"memory_recall\", \"import\"]]",
    "capture_kind": "Required[Literal[\"turn_finished\", \"explicit_remember\", \"source_revision\", \"import\"]]",
})

AssertionSource = TypedDict("AssertionSource", {
    "kind": "Required[Literal[\"assertion\"]]",
    "assertion_id": "Required[OwnerOpaqueId2]",
    "assertion_revision": "Required[AssertionRevision]",
})

RecallPage = TypedDict("RecallPage", {
    "items": "Required[list[RecallPageItemsItem]]",
    "next_cursor": "Required[str | None]",
    "read_watermark": "Required[OwnerOpaqueId2]",
    "index_watermark": "Required[OwnerOpaqueId2]",
    "memory_status": "Required[Literal[\"available\"]]",
})

RecallPageItemsItem = TypedDict("RecallPageItemsItem", {
    "record": "Required[Record]",
    "score": "Required[float]",
    "token_count": "Required[int]",
    "truncated": "Required[bool]",
})

Record = TypedDict("Record", {
    "record_id": "Required[OwnerOpaqueId2]",
    "revision": "Required[OwnerRecordRevision]",
    "scope_ref": "Required[OwnerOpaqueId2]",
    "kind": "Required[Literal[\"core\", \"semantic\", \"episodic\", \"procedural\"]]",
    "content": "Required[str]",
    "source_refs": "Required[list[Source]]",
    "trust": "Required[Literal[\"operator_approved\", \"user_asserted\", \"tool_observed\", \"model_inferred\", \"imported_unverified\"]]",
    "event_time": "Required[str | None]",
    "valid_from": "Required[str | None]",
    "valid_to": "Required[str | None]",
    "recorded_at": "Required[str]",
    "status": "Required[Literal[\"active\", \"superseded\", \"invalidated\", \"conflicted\"]]",
    "supersedes": "Required[list[RecordRef]]",
    "conflict_group": "Required[OwnerOpaqueId2 | None]",
    "erasure_epoch": "Required[ErasureEpoch]",
})

class CreateSandboxOptions(NativeRequestOptions, total=False):
    pass

class ListSandboxesOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]
    status: NotRequired[Literal["pending", "provisioning", "running", "pausing", "paused", "resuming", "error", "unknown"]]
    label: NotRequired[list[str]]

class GetSandboxOptions(NativeRequestOptions, total=False):
    pass

class PatchSandboxOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class TerminateSandboxOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class PauseSandboxOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class ResumeSandboxOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class ListSandboxTemplatesOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]

class GetSandboxTemplateOptions(NativeRequestOptions, total=False):
    pass

class CreateSandboxAccessTicketOptions(NativeRequestOptions, total=False):
    pass

class RevokeSandboxAccessTicketOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class RunSandboxCommandOptions(NativeRequestOptions, total=False):
    pass

class GetSandboxCommandOptions(NativeRequestOptions, total=False):
    pass

class CancelSandboxCommandOptions(NativeRequestOptions, total=False):
    pass

class StreamSandboxCommandEventsOptions(NativeRequestOptions, total=False):
    last_event_id: NotRequired[str]

class WriteSandboxFileOptions(NativeRequestOptions, total=False):
    path: Required[str]
    content_length: Required[int]
    content_sha256: Required[str]
    if_match: NotRequired[str]
    if_none_match: NotRequired[Literal["*"]]

class ReadSandboxFileOptions(NativeRequestOptions, total=False):
    path: Required[str]
    if_match: NotRequired[str]

class DownloadCommandArtifactOptions(NativeRequestOptions, total=False):
    pass

class CreateNativeAgentOptions(NativeRequestOptions, total=False):
    pass

class ListNativeAgentsOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]
    end_user_ref: NotRequired[EndUserRef]

class GetNativeAgentOptions(NativeRequestOptions, total=False):
    pass

class UpdateNativeAgentOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class DeleteNativeAgentOptions(NativeRequestOptions, total=False):
    pass

class ListNativeModelsOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]

class ListNativeAgentModelsOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]

class GetNativeAgentSkillFilesOptions(NativeRequestOptions, total=False):
    pass

class RevokeNativeAgentAuthorizationsOptions(NativeRequestOptions, total=False):
    pass

class CreateNativeSessionOptions(NativeRequestOptions, total=False):
    pass

class ListNativeSessionsOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]
    agent_id: NotRequired[NativeAgentId]
    order: NotRequired[Literal["asc", "desc"]]
    state: NotRequired[Literal["active", "agent_deleted", "deleting"]]
    end_user_ref: NotRequired[EndUserRef]

class GetNativeSessionOptions(NativeRequestOptions, total=False):
    pass

class UpdateNativeSessionOptions(NativeRequestOptions, total=False):
    if_match: Required[str]

class DeleteNativeSessionOptions(NativeRequestOptions, total=False):
    pass

class CreateNativeResponseOptions(NativeRequestOptions, total=False):
    pass

class GetNativeResponseOptions(NativeRequestOptions, total=False):
    pass

class DeleteNativeResponseOptions(NativeRequestOptions, total=False):
    pass

class CancelNativeResponseOptions(NativeRequestOptions, total=False):
    pass

class StreamNativeResponseEventsOptions(NativeRequestOptions, total=False):
    last_event_id: NotRequired[str]

class ListNativeResponseInputItemsOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]

class ReplyNativeInteractionOptions(NativeRequestOptions, total=False):
    pass

class CreateNativeFileOptions(NativeRequestOptions, total=False):
    filename: Required[str]
    media_type: Required[str]
    content_length: Required[int]
    content_sha256: Required[str]

class GetNativeFileOptions(NativeRequestOptions, total=False):
    pass

class DeleteNativeFileOptions(NativeRequestOptions, total=False):
    pass

class DownloadNativeFileOptions(NativeRequestOptions, total=False):
    pass

class ListNativeSessionFilesOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]

class GetNativeCapabilitiesOptions(NativeRequestOptions, total=False):
    pass

class ListNativeSessionResponsesOptions(NativeRequestOptions, total=False):
    limit: NotRequired[int]
    cursor: NotRequired[str]
    order: NotRequired[Literal["asc", "desc"]]

class RememberNativeMemoryOptions(NativeRequestOptions, total=False):
    pass

class RecallNativeMemoryOptions(NativeRequestOptions, total=False):
    pass

class CorrectNativeMemoryOptions(NativeRequestOptions, total=False):
    pass

class ForgetNativeMemoryOptions(NativeRequestOptions, total=False):
    pass

class GetNativeMemoryReceiptOptions(NativeRequestOptions, total=False):
    pass

class GetNativeSessionCanvasOptions(NativeRequestOptions, total=False):
    pass

class CreateNativeCanvasTicketOptions(NativeRequestOptions, total=False):
    pass

class GetNativeCanvasShareOptions(NativeRequestOptions, total=False):
    pass

class CreateNativeCanvasShareOptions(NativeRequestOptions, total=False):
    pass

class DeleteNativeCanvasShareOptions(NativeRequestOptions, total=False):
    pass

class ListNativeCanvasSnapshotsOptions(NativeRequestOptions, total=False):
    pass

class RestoreNativeCanvasSnapshotOptions(NativeRequestOptions, total=False):
    pass

CanvasId: TypeAlias = str

EndUserRef: TypeAlias = str

AuthorizationRevoke: TypeAlias = AuthorizationRevokeValueVariant1 | AuthorizationRevokeValueVariant2

ResponseInput: TypeAlias = TextInput | FileInput

NativeMetadata: TypeAlias = dict[str, str]

ResponseOutputItem: TypeAlias = ResponseOutputItemValueVariant1 | ResponseOutputItemValueVariant2 | ResponseOutputItemValueVariant3

InteractionReply: TypeAlias = InteractionReplyValueVariant1 | InteractionReplyValueVariant2 | InteractionReplyValueVariant3

NativeResponseEvent: TypeAlias = NativeResponseEventValueVariant1 | NativeResponseEventValueVariant2 | NativeResponseEventValueVariant3 | NativeResponseEventValueVariant4 | NativeResponseEventValueVariant5

CommandEvent: TypeAlias = CommandEventValueVariant1 | CommandEventValueVariant2

NativeMemorySource: TypeAlias = Model0 | NativeMemorySourceValueVariant2

OwnerOpaqueId: TypeAlias = str

OwnerResourceVersion: TypeAlias = int

RequestId: TypeAlias = str

RetryAfterSeconds: TypeAlias = int

ExternalOpaqueRef: TypeAlias = str

OwnerOpaqueId2: TypeAlias = str

AgentId: TypeAlias = str

harnessartifacts: TypeAlias = list[RuntimeHarnessArtifact]

BeeosTarget: TypeAlias = BeeosRecipeTarget | BeeosManagedTarget

CredentialBindings: TypeAlias = list[CredentialBinding]

AuthorizationRevision: TypeAlias = int

RecordRevision: TypeAlias = int

state: TypeAlias = Literal["queued", "running", "retry_wait", "blocked", "succeeded", "failed", "cancelled"]

nextattemptat: TypeAlias = str | None

OwnerRecordRevision: TypeAlias = int

Source: TypeAlias = MessageSource | AssertionSource

AssertionRevision: TypeAlias = int

ErasureEpoch: TypeAlias = int

OpaqueId: TypeAlias = OwnerOpaqueId

ResourceVersion: TypeAlias = OwnerResourceVersion

NativeAgentId: TypeAlias = AgentId

revision: TypeAlias = OwnerOpaqueId2

Id: TypeAlias = OwnerOpaqueId2

Revision: TypeAlias = revision

class BeeOSAPIError(Exception):
    def __init__(self, response: BeeOSHTTPResponse[object], context: OperationContext | None = None) -> None:
        envelope = response.body
        normalized = envelope.get("error", envelope) if isinstance(envelope, dict) else {}
        normalized = normalized if isinstance(normalized, dict) else {}
        details = normalized.get("details")
        details = details if isinstance(details, dict) else {}
        self.http_status = response.status
        self.status = response.status
        self.raw_envelope = envelope
        self.raw_body = response.raw_body
        self.headers = response.headers
        self.code: str | None = cast(str | None, normalized.get("code"))
        self.reason: str | None = cast(str | None, normalized.get("reason") or details.get("reason"))
        self.request_id: str | None = response.headers.request_id or cast(str | None, normalized.get("request_id"))
        self.should_retry: bool | None = response.headers.should_retry
        if self.should_retry is None:
            self.should_retry = cast(bool | None, normalized.get("should_retry"))
        self.retry_after: str | int | None = response.headers.retry_after or cast(int | None, normalized.get("retry_after"))
        self.operation_context = context
        self.acceptance = context.acceptance if context else None
        super().__init__(f"BeeOS API returned HTTP {response.status}: {self.code or 'http_error'}")

class SDKWaitTimeout(TimeoutError):
    def __init__(self, context: OperationContext) -> None:
        self.operation_context = context
        self.acceptance = context.acceptance
        self.last_response = context.last_response
        self.idempotency_key = context.idempotency_key
        super().__init__("BeeOS local wait deadline elapsed; recover the same intent or observe its resource")

class SDKWaitError(RuntimeError):
    def __init__(self, reason: str, context: OperationContext) -> None:
        self.reason = reason
        self.operation_context = context
        self.acceptance = context.acceptance
        self.last_response = context.last_response
        self.idempotency_key = context.idempotency_key
        super().__init__(f"BeeOS wait stopped: {reason}")

class SDKTransportError(RuntimeError):
    """Local I/O failed; the original intent may already have been accepted."""
    def __init__(self, context: OperationContext) -> None:
        self.operation_context = context
        self.acceptance = context.acceptance
        self.last_response = context.last_response
        self.idempotency_key = context.idempotency_key
        super().__init__("BeeOS transport failed; recover the same intent or observe its resource")

class SDKRequestTimeout(SDKTransportError):
    """One local HTTP request timed out; this is not remote cancellation."""

@dataclass(frozen=True)
class _Operation:
    operation_id: str
    method: str
    path: str
    input_media: str
    output_media: str
    wait_default: bool
    parameters: tuple[tuple[str, str, str, bool], ...]

_OPERATIONS: dict[str, _Operation] = {
    "createSandbox": _Operation("createSandbox", "POST", "/v1/sandboxes", "application/json", "application/json", True, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "listSandboxes": _Operation("listSandboxes", "GET", "/v1/sandboxes", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False), ("status", "status", "query", False), ("label", "label", "query", False))),
    "getSandbox": _Operation("getSandbox", "GET", "/v1/sandboxes/{sandbox_id}", "", "application/json", False, ()),
    "patchSandbox": _Operation("patchSandbox", "PATCH", "/v1/sandboxes/{sandbox_id}", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True), ("if_match", "If-Match", "header", True))),
    "terminateSandbox": _Operation("terminateSandbox", "POST", "/v1/sandboxes/{sandbox_id}/terminate", "", "", False, (("idempotency_key", "Idempotency-Key", "header", True), ("if_match", "If-Match", "header", True))),
    "pauseSandbox": _Operation("pauseSandbox", "POST", "/v1/sandboxes/{sandbox_id}/pause", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True), ("if_match", "If-Match", "header", True))),
    "resumeSandbox": _Operation("resumeSandbox", "POST", "/v1/sandboxes/{sandbox_id}/resume", "application/json", "application/json", True, (("idempotency_key", "Idempotency-Key", "header", True), ("if_match", "If-Match", "header", True))),
    "listSandboxTemplates": _Operation("listSandboxTemplates", "GET", "/v1/sandbox-templates", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False))),
    "getSandboxTemplate": _Operation("getSandboxTemplate", "GET", "/v1/sandbox-templates/{template_id}", "", "application/json", False, ()),
    "createSandboxAccessTicket": _Operation("createSandboxAccessTicket", "POST", "/v1/sandboxes/{sandbox_id}/access-tickets", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "revokeSandboxAccessTicket": _Operation("revokeSandboxAccessTicket", "DELETE", "/v1/sandboxes/{sandbox_id}/access-tickets/{ticket_id}", "", "", False, (("idempotency_key", "Idempotency-Key", "header", True), ("if_match", "If-Match", "header", True))),
    "runSandboxCommand": _Operation("runSandboxCommand", "POST", "/v1/sandboxes/{sandbox_id}/commands", "application/json", "application/json", True, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "getSandboxCommand": _Operation("getSandboxCommand", "GET", "/v1/sandboxes/{sandbox_id}/commands/{command_id}", "", "application/json", False, ()),
    "cancelSandboxCommand": _Operation("cancelSandboxCommand", "POST", "/v1/sandboxes/{sandbox_id}/commands/{command_id}/cancel", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "streamSandboxCommandEvents": _Operation("streamSandboxCommandEvents", "GET", "/v1/sandboxes/{sandbox_id}/commands/{command_id}/events", "", "text/event-stream", False, (("last_event_id", "Last-Event-ID", "header", False),)),
    "writeSandboxFile": _Operation("writeSandboxFile", "PUT", "/v1/sandboxes/{sandbox_id}/files", "application/octet-stream", "application/json", False, (("path", "path", "query", True), ("content_length", "Content-Length", "header", True), ("content_sha256", "Content-SHA256", "header", True), ("if_match", "If-Match", "header", False), ("if_none_match", "If-None-Match", "header", False), ("idempotency_key", "Idempotency-Key", "header", True))),
    "readSandboxFile": _Operation("readSandboxFile", "GET", "/v1/sandboxes/{sandbox_id}/files", "", "application/octet-stream", False, (("path", "path", "query", True), ("if_match", "If-Match", "header", False))),
    "downloadCommandArtifact": _Operation("downloadCommandArtifact", "GET", "/v1/sandboxes/{sandbox_id}/commands/{command_id}/artifacts/{artifact_id}", "", "application/octet-stream", False, ()),
    "createNativeAgent": _Operation("createNativeAgent", "POST", "/v2/agents", "application/json", "application/json", True, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "listNativeAgents": _Operation("listNativeAgents", "GET", "/v2/agents", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False), ("end_user_ref", "end_user_ref", "query", False))),
    "getNativeAgent": _Operation("getNativeAgent", "GET", "/v2/agents/{agent_id}", "", "application/json", False, ()),
    "updateNativeAgent": _Operation("updateNativeAgent", "PATCH", "/v2/agents/{agent_id}", "application/json", "application/json", True, (("if_match", "If-Match", "header", True), ("idempotency_key", "Idempotency-Key", "header", True))),
    "deleteNativeAgent": _Operation("deleteNativeAgent", "DELETE", "/v2/agents/{agent_id}", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "listNativeModels": _Operation("listNativeModels", "GET", "/v2/models", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False))),
    "listNativeAgentModels": _Operation("listNativeAgentModels", "GET", "/v2/agents/{agent_id}/models", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False))),
    "getNativeAgentSkillFiles": _Operation("getNativeAgentSkillFiles", "GET", "/v2/agents/{agent_id}/skills/{skill_id}/files", "", "application/json", False, ()),
    "revokeNativeAgentAuthorizations": _Operation("revokeNativeAgentAuthorizations", "POST", "/v2/agents/{agent_id}/authorizations/revoke", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "createNativeSession": _Operation("createNativeSession", "POST", "/v2/sessions", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "listNativeSessions": _Operation("listNativeSessions", "GET", "/v2/sessions", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False), ("agent_id", "agent_id", "query", False), ("order", "order", "query", False), ("state", "state", "query", False), ("end_user_ref", "end_user_ref", "query", False))),
    "getNativeSession": _Operation("getNativeSession", "GET", "/v2/sessions/{session_id}", "", "application/json", False, ()),
    "updateNativeSession": _Operation("updateNativeSession", "PATCH", "/v2/sessions/{session_id}", "application/json", "application/json", False, (("if_match", "If-Match", "header", True), ("idempotency_key", "Idempotency-Key", "header", True))),
    "deleteNativeSession": _Operation("deleteNativeSession", "DELETE", "/v2/sessions/{session_id}", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "createNativeResponse": _Operation("createNativeResponse", "POST", "/v2/responses", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "getNativeResponse": _Operation("getNativeResponse", "GET", "/v2/responses/{response_id}", "", "application/json", False, ()),
    "deleteNativeResponse": _Operation("deleteNativeResponse", "DELETE", "/v2/responses/{response_id}", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "cancelNativeResponse": _Operation("cancelNativeResponse", "POST", "/v2/responses/{response_id}/cancel", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "streamNativeResponseEvents": _Operation("streamNativeResponseEvents", "GET", "/v2/responses/{response_id}/events", "", "text/event-stream", False, (("last_event_id", "Last-Event-ID", "header", False),)),
    "listNativeResponseInputItems": _Operation("listNativeResponseInputItems", "GET", "/v2/responses/{response_id}/input-items", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False))),
    "replyNativeInteraction": _Operation("replyNativeInteraction", "POST", "/v2/responses/{response_id}/interactions/{interaction_id}/reply", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "createNativeFile": _Operation("createNativeFile", "POST", "/v2/files", "application/octet-stream", "application/json", False, (("filename", "filename", "query", True), ("media_type", "media_type", "query", True), ("content_length", "Content-Length", "header", True), ("content_sha256", "Content-SHA256", "header", True), ("idempotency_key", "Idempotency-Key", "header", True))),
    "getNativeFile": _Operation("getNativeFile", "GET", "/v2/files/{file_id}", "", "application/json", False, ()),
    "deleteNativeFile": _Operation("deleteNativeFile", "DELETE", "/v2/files/{file_id}", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "downloadNativeFile": _Operation("downloadNativeFile", "GET", "/v2/files/{file_id}/content", "", "application/octet-stream", False, ()),
    "listNativeSessionFiles": _Operation("listNativeSessionFiles", "GET", "/v2/sessions/{session_id}/files", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False))),
    "getNativeCapabilities": _Operation("getNativeCapabilities", "GET", "/v2/capabilities", "", "application/json", False, ()),
    "listNativeSessionResponses": _Operation("listNativeSessionResponses", "GET", "/v2/sessions/{session_id}/responses", "", "application/json", False, (("limit", "limit", "query", False), ("cursor", "cursor", "query", False), ("order", "order", "query", False))),
    "rememberNativeMemory": _Operation("rememberNativeMemory", "POST", "/v2/agents/{agent_id}/memory/remember", "application/json", "application/json", True, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "recallNativeMemory": _Operation("recallNativeMemory", "POST", "/v2/agents/{agent_id}/memory/recall", "application/json", "application/json", False, ()),
    "correctNativeMemory": _Operation("correctNativeMemory", "POST", "/v2/agents/{agent_id}/memory/records/{record_id}/correct", "application/json", "application/json", True, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "forgetNativeMemory": _Operation("forgetNativeMemory", "POST", "/v2/agents/{agent_id}/memory/records/{record_id}/forget", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "getNativeMemoryReceipt": _Operation("getNativeMemoryReceipt", "GET", "/v2/agents/{agent_id}/memory/receipts/{receipt_id}", "", "application/json", False, ()),
    "getNativeSessionCanvas": _Operation("getNativeSessionCanvas", "GET", "/v2/sessions/{session_id}/canvas", "", "application/json", False, ()),
    "createNativeCanvasTicket": _Operation("createNativeCanvasTicket", "POST", "/v2/sessions/{session_id}/canvas-tickets", "application/json", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
    "getNativeCanvasShare": _Operation("getNativeCanvasShare", "GET", "/v2/canvases/{canvas_id}/share", "", "application/json", False, ()),
    "createNativeCanvasShare": _Operation("createNativeCanvasShare", "POST", "/v2/canvases/{canvas_id}/share", "application/json", "application/json", False, ()),
    "deleteNativeCanvasShare": _Operation("deleteNativeCanvasShare", "DELETE", "/v2/canvases/{canvas_id}/share", "", "", False, ()),
    "listNativeCanvasSnapshots": _Operation("listNativeCanvasSnapshots", "GET", "/v2/canvases/{canvas_id}/snapshots", "", "application/json", False, ()),
    "restoreNativeCanvasSnapshot": _Operation("restoreNativeCanvasSnapshot", "POST", "/v2/canvases/{canvas_id}/snapshots/{snapshot_id}/restore", "", "application/json", False, (("idempotency_key", "Idempotency-Key", "header", True),)),
}

@dataclass
class _Call:
    operation: _Operation
    url: str
    query: list[tuple[str, str]]
    headers: dict[str, str]
    content: bytes | None
    context: OperationContext
    deadline: float | None
    request_timeout: float
    options: Mapping[str, object]

    def remaining(self) -> float | None:
        if self.deadline is None:
            return None
        value = self.deadline - time.monotonic()
        if value <= 0:
            raise SDKWaitTimeout(self.context)
        return value

    def timeout(self) -> float:
        remaining = self.remaining()
        return self.request_timeout if remaining is None else min(self.request_timeout, remaining)

def _data(response: BeeOSHTTPResponse[object]) -> dict[str, object]:
    body = response.body
    data = body.get("data") if isinstance(body, dict) else None
    return cast(dict[str, object], data) if isinstance(data, dict) else {}

def _resource_id(data: Mapping[str, object]) -> str | None:
    receipt = data.get("receipt")
    value = data.get("id") or (receipt.get("receipt_id") if isinstance(receipt, dict) else None)
    return value if isinstance(value, str) else None

def _capture_acceptance(raw: httpx.Response, call: _Call, resource_id: str | None = None) -> None:
    if not 200 <= raw.status_code < 300 or raw.request.method == "GET" or not call.context.idempotency_key:
        return
    accepted = call.context.acceptance
    if accepted is None:
        call.context.acceptance = Acceptance(raw.status_code, resource_id, raw.headers.get("etag"), raw.headers.get("x-request-id"), call.context.idempotency_key)
    elif accepted.resource_id is None and resource_id is not None:
        call.context.acceptance = Acceptance(accepted.status, resource_id, accepted.etag, accepted.request_id, accepted.idempotency_key)

def _response(raw: httpx.Response, content: bytes, call: _Call) -> BeeOSHTTPResponse[object]:
    media = raw.headers.get("content-type", "").split(";", 1)[0].strip().lower()
    body: object = None if raw.status_code == 204 else content
    if content and (media == "application/json" or media.endswith("+json")):
        try:
            body = json.loads(content)
        except (json.JSONDecodeError, UnicodeDecodeError):
            # Preserve malformed error bytes in the same public HTTP error.
            if 200 <= raw.status_code < 300:
                call.context.last_response = BeeOSHTTPResponse(raw.status_code, content, HTTPHeaders(raw.headers), call.context.acceptance, content)
                raise
    headers = HTTPHeaders(raw.headers)
    _capture_acceptance(raw, call, _resource_id(_data(BeeOSHTTPResponse(raw.status_code, body, headers))))
    result = BeeOSHTTPResponse(raw.status_code, body, headers, call.context.acceptance, content, call.context)
    call.context.last_response = result
    if not 200 <= raw.status_code < 300:
        raise BeeOSAPIError(result, call.context)
    return result

def _event_options(options: NativeRequestOptions | None) -> StreamNativeResponseEventsOptions:
    result: StreamNativeResponseEventsOptions = {}
    if options is not None and "request_timeout_seconds" in options:
        result["request_timeout_seconds"] = options["request_timeout_seconds"]
    return result

def _wait_path(call: _Call, first: BeeOSHTTPResponse[object]) -> str | None:
    if not call.options.get("wait", call.operation.wait_default):
        return None
    op = call.operation.operation_id
    data = _data(first)
    resource_id = _resource_id(data)
    if op in ("createSandbox", "resumeSandbox") and resource_id:
        return "/v1/sandboxes/" + quote(resource_id, safe="")
    if op == "runSandboxCommand" and resource_id:
        return urlsplit(call.url).path + "/" + quote(resource_id, safe="")
    if op in ("createNativeAgent", "updateNativeAgent") and resource_id:
        publication = data.get("publication")
        if isinstance(publication, dict) and publication.get("changed_components") == []:
            return None
        return "/v2/agents/" + quote(resource_id, safe="")
    if op in ("rememberNativeMemory", "correctNativeMemory") and resource_id:
        # The State receipt is the existing authority, not a new generic operation.
        return urlsplit(call.url).path.split("/memory", 1)[0] + "/memory/receipts/" + quote(resource_id, safe="")
    return None

def _wait_done(call: _Call, first: BeeOSHTTPResponse[object], current: BeeOSHTTPResponse[object]) -> bool:
    data = _data(current)
    op = call.operation.operation_id
    if op in ("createSandbox", "resumeSandbox"):
        if data.get("status") in ("error", "unknown", "terminated"):
            raise SDKWaitError("sandbox_" + str(data.get("status")), call.context)
        return data.get("status") == "running"
    if op == "runSandboxCommand":
        return data.get("state") in ("completed", "unknown")
    if op in ("rememberNativeMemory", "correctNativeMemory"):
        completion = data.get("completion")
        if completion in ("failed", "blocked", "unknown"):
            raise SDKWaitError("memory_" + str(completion), call.context)
        return completion in ("durable", "recallable")
    if op in ("createNativeAgent", "updateNativeAgent"):
        initial = _data(first)
        publication = data.get("publication")
        initial_publication = initial.get("publication")
        if not isinstance(publication, dict) or not isinstance(initial_publication, dict):
            raise SDKWaitError("missing_publication", call.context)
        revision = initial_publication.get("accepted_config_revision")
        if publication.get("accepted_config_revision") != revision or data.get("desired_config_revision") != revision:
            raise SDKWaitError("publication_superseded", call.context)
        configuration = data.get("configuration")
        initial_configuration = initial.get("configuration")
        target = initial_configuration.get("target") if isinstance(initial_configuration, dict) else None
        if not isinstance(configuration, dict) or configuration.get("target") != target:
            raise SDKWaitError("target_superseded", call.context)
        state = publication.get("state")
        if state in ("failed", "partial", "unknown", "superseded"):
            raise SDKWaitError("publication_" + str(state), call.context)
        # Recipe/no-placement, paused managed targets and metadata-only writes stay deferred.
        if state == "deferred":
            return True
        if state != "ready":
            return False
        if isinstance(target, dict) and target.get("kind") == "recipe":
            return True
        binding = data.get("binding")
        if not isinstance(binding, dict) or binding.get("prepared_config_revision") != revision:
            return False
        if isinstance(target, dict) and target.get("kind") == "managed" and binding.get("sandbox_id") != target.get("sandbox_id"):
            return False
        # Ready is the server's verified publication projection. Credential revisions may
        # legitimately be older when unchanged; Session Persona revisions are independent.
        return True
    return True

def _notify(call: _Call, response: BeeOSHTTPResponse[object], previous: object) -> object:
    if response.body != previous:
        callback = call.options.get("on_progress")
        if callable(callback):
            callback(response)
    return response.body

class _ClientBase:
    def _configure(self, base_url: str, api_key: str | Callable[[], str], request_timeout_seconds: float, wait_timeout_seconds: float) -> None:
        parts = urlsplit(base_url)
        if parts.scheme not in ("http", "https") or not parts.netloc or parts.username or parts.password or parts.query or parts.fragment:
            raise ValueError("base_url must be an HTTP(S) origin or API URL without credentials/query")
        self.base_url = urlunsplit((parts.scheme, parts.netloc, "", "", ""))
        self.api_key = api_key
        self.request_timeout_seconds = request_timeout_seconds
        self.wait_timeout_seconds = wait_timeout_seconds
        self.last_operation: OperationContext | None = None

    def _prepare(self, operation: _Operation, path_params: Mapping[str, str], body: object, options: Mapping[str, object] | None) -> _Call:
        opts: Mapping[str, object] = options or {}
        context = cast(OperationContext, opts.get("context") or OperationContext())
        if context.operation_id not in (None, operation.operation_id):
            raise ValueError("OperationContext belongs to a different operation")
        context.operation_id = operation.operation_id
        self.last_operation = context
        path = operation.path
        for name, path_value in path_params.items():
            path = path.replace("{" + name + "}", quote(path_value, safe=""))
        key = self.api_key() if callable(self.api_key) else self.api_key
        headers = {"Authorization": "Bearer " + key}
        query: list[tuple[str, str]] = []
        for option, wire, location, required in operation.parameters:
            value = opts.get(option)
            if wire == "Idempotency-Key":
                if value is not None and context.idempotency_key not in (None, value):
                    raise ValueError("OperationContext has a different idempotency key")
                value = value or context.idempotency_key or str(uuid4())
                context.idempotency_key = cast(str, value)
            if value is None:
                if required:
                    raise ValueError(f"Missing required option: {option}")
                continue
            values = value if isinstance(value, list) else [value]
            for item in values:
                encoded = str(item).lower() if isinstance(item, bool) else str(item)
                if location == "query":
                    query.append((wire, encoded))
                else:
                    headers[wire] = encoded
        if operation.input_media:
            headers["Content-Type"] = operation.input_media
        content = None if body is None else body if isinstance(body, bytes) else json.dumps(body, separators=(",", ":")).encode()
        request_timeout = float(cast(float, opts.get("request_timeout_seconds", self.request_timeout_seconds)))
        wait_timeout = float(cast(float, opts.get("wait_timeout_seconds", self.wait_timeout_seconds)))
        if request_timeout <= 0 or wait_timeout <= 0:
            raise ValueError("Request and wait timeouts must be positive")
        interval = float(cast(float, opts.get("poll_interval_seconds", 0.2)))
        if interval < 0:
            raise ValueError("poll_interval_seconds must be nonnegative")
        deadline = time.monotonic() + wait_timeout if opts.get("wait", operation.wait_default) else None
        return _Call(operation, self.base_url + path, query, headers, content, context, deadline, request_timeout, opts)

class NativeBeeOSClient(_ClientBase):
    def __init__(self, base_url: str, api_key: str | Callable[[], str], *, request_timeout_seconds: float = 30.0, wait_timeout_seconds: float = 300.0, http_client: httpx.Client | None = None) -> None:
        self._configure(base_url, api_key, request_timeout_seconds, wait_timeout_seconds)
        self._http = http_client or httpx.Client(follow_redirects=False)
        self._owns_http = http_client is None
        self.sandboxes = NativeSandboxesResource(self)
        self.templates = NativeTemplatesResource(self)
        self.access_tickets = NativeAccessTicketsResource(self)
        self.agents = NativeAgentsResource(self)
        self.models = NativeModelsResource(self)
        self.sessions = NativeSessionsResource(self)
        self.responses = NativeResponsesResource(self)
        self.files = NativeFilesResource(self)
        self.capabilities = NativeCapabilitiesResource(self)
        self.canvases = NativeCanvasesResource(self)

    def close(self) -> None:
        if self._owns_http:
            self._http.close()

    def __enter__(self) -> NativeBeeOSClient:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def _perform(self, call: _Call, *, poll_url: str | None = None) -> BeeOSHTTPResponse[object]:
        try:
            with self._http.stream("GET" if poll_url else call.operation.method, poll_url or call.url, params=None if poll_url else tuple(call.query), headers={"Authorization": call.headers["Authorization"]} if poll_url else call.headers, content=None if poll_url else call.content, timeout=call.timeout(), follow_redirects=False) as raw:
                _capture_acceptance(raw, call)
                chunks: list[bytes] = []
                for chunk in raw.iter_bytes():
                    call.remaining()
                    chunks.append(chunk)
                result = _response(raw, b"".join(chunks), call)
                call.remaining()
                return result
        except httpx.TimeoutException as error:
            call.remaining()
            raise SDKRequestTimeout(call.context) from error
        except httpx.RequestError as error:
            raise SDKTransportError(call.context) from error

    def _execute(self, operation: _Operation, path_params: Mapping[str, str], body: object, options: Mapping[str, object] | None, event_types: frozenset[str] | None = None) -> BeeOSHTTPResponse[object] | EventStream[object]:
        call = self._prepare(operation, path_params, body, options)
        if operation.output_media == "text/event-stream":
            try:
                request = self._http.build_request(operation.method, call.url, params=tuple(call.query), headers=call.headers, timeout=call.timeout())
                raw = self._http.send(request, stream=True, follow_redirects=False)
                if not 200 <= raw.status_code < 300:
                    try:
                        _response(raw, raw.read(), call)
                    finally:
                        raw.close()
                return EventStream(raw, call.context, event_types)
            except httpx.TimeoutException as error:
                raise SDKRequestTimeout(call.context) from error
            except httpx.RequestError as error:
                raise SDKTransportError(call.context) from error
        first = current = self._perform(call)
        poll_path = _wait_path(call, first)
        if poll_path is None:
            return first
        previous: object = object()
        while True:
            previous = _notify(call, current, previous)
            if _wait_done(call, first, current):
                return current
            remaining = call.remaining()
            delay = float(cast(float, call.options.get("poll_interval_seconds", 0.2)))
            time.sleep(delay if remaining is None else min(delay, remaining))
            current = self._perform(call, poll_url=self.base_url + poll_path)

class AsyncNativeBeeOSClient(_ClientBase):
    def __init__(self, base_url: str, api_key: str | Callable[[], str], *, request_timeout_seconds: float = 30.0, wait_timeout_seconds: float = 300.0, http_client: httpx.AsyncClient | None = None) -> None:
        self._configure(base_url, api_key, request_timeout_seconds, wait_timeout_seconds)
        self._http = http_client or httpx.AsyncClient(follow_redirects=False)
        self._owns_http = http_client is None
        self.sandboxes = AsyncNativeSandboxesResource(self)
        self.templates = AsyncNativeTemplatesResource(self)
        self.access_tickets = AsyncNativeAccessTicketsResource(self)
        self.agents = AsyncNativeAgentsResource(self)
        self.models = AsyncNativeModelsResource(self)
        self.sessions = AsyncNativeSessionsResource(self)
        self.responses = AsyncNativeResponsesResource(self)
        self.files = AsyncNativeFilesResource(self)
        self.capabilities = AsyncNativeCapabilitiesResource(self)
        self.canvases = AsyncNativeCanvasesResource(self)

    async def aclose(self) -> None:
        if self._owns_http:
            await self._http.aclose()

    async def __aenter__(self) -> AsyncNativeBeeOSClient:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

    async def _perform(self, call: _Call, *, poll_url: str | None = None) -> BeeOSHTTPResponse[object]:
        try:
            async with asyncio.timeout(call.timeout()):
                async with self._http.stream("GET" if poll_url else call.operation.method, poll_url or call.url, params=None if poll_url else tuple(call.query), headers={"Authorization": call.headers["Authorization"]} if poll_url else call.headers, content=None if poll_url else call.content, timeout=call.timeout(), follow_redirects=False) as raw:
                    _capture_acceptance(raw, call)
                    content = await raw.aread()
                    result = _response(raw, content, call)
                    call.remaining()
                    return result
        except SDKWaitTimeout:
            raise
        except (httpx.TimeoutException, TimeoutError) as error:
            call.remaining()
            raise SDKRequestTimeout(call.context) from error
        except httpx.RequestError as error:
            raise SDKTransportError(call.context) from error

    async def _execute(self, operation: _Operation, path_params: Mapping[str, str], body: object, options: Mapping[str, object] | None, event_types: frozenset[str] | None = None) -> BeeOSHTTPResponse[object] | AsyncEventStream[object]:
        call = self._prepare(operation, path_params, body, options)
        if operation.output_media == "text/event-stream":
            try:
                async with asyncio.timeout(call.timeout()):
                    request = self._http.build_request(operation.method, call.url, params=tuple(call.query), headers=call.headers, timeout=call.timeout())
                    raw = await self._http.send(request, stream=True, follow_redirects=False)
                    if not 200 <= raw.status_code < 300:
                        try:
                            _response(raw, await raw.aread(), call)
                        finally:
                            await raw.aclose()
                    if raw.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "text/event-stream":
                        await raw.aclose()
                        raise ValueError("Expected text/event-stream response")
                    return AsyncEventStream(raw, call.context, event_types)
            except (httpx.TimeoutException, TimeoutError) as error:
                raise SDKRequestTimeout(call.context) from error
            except httpx.RequestError as error:
                raise SDKTransportError(call.context) from error
        first = current = await self._perform(call)
        poll_path = _wait_path(call, first)
        if poll_path is None:
            return first
        previous: object = object()
        while True:
            previous = _notify(call, current, previous)
            if _wait_done(call, first, current):
                return current
            remaining = call.remaining()
            delay = float(cast(float, call.options.get("poll_interval_seconds", 0.2)))
            await asyncio.sleep(delay if remaining is None else min(delay, remaining))
            current = await self._perform(call, poll_url=self.base_url + poll_path)

class _SSEParser:
    def __init__(self) -> None:
        self.data: list[str] = []
        self.last_event_id: str | None = None
        self._event_id: str | None = None
        self.event_type: str | None = None
        self.size = 0

    def feed(self, line: str) -> tuple[bool, object]:
        self.size += len(line.encode("utf-8"))
        if self.size > 1024 * 1024:
            raise ValueError("SSE event exceeds 1 MiB")
        if not line:
            data, self.data = self.data, []
            self.size = 0
            self.event_type = None
            if not data:
                return False, None
            value = json.loads("\n".join(data))
            if self._event_id is not None:
                self.last_event_id = self._event_id
            return True, value
        if line.startswith(":"):
            return False, None
        name, _, value = line.partition(":")
        value = value.removeprefix(" ")
        if name == "data":
            self.data.append(value)
        elif name == "id" and "\0" not in value:
            self._event_id = value
        elif name == "event":
            self.event_type = value
        return False, None

class EventStream(Generic[T], Iterator[T]):
    def __init__(self, response: httpx.Response, context: OperationContext,
                 event_types: frozenset[str] | None = None) -> None:
        if response.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "text/event-stream":
            response.close()
            raise ValueError("Expected text/event-stream response")
        self._response = response
        self._context = context
        self._lines = response.iter_lines()
        self._parser = _SSEParser()
        self._event_types = event_types
        self.status = response.status_code
        self.headers = HTTPHeaders(response.headers)

    @property
    def last_event_id(self) -> str | None:
        return self._parser.last_event_id

    @property
    def closed(self) -> bool:
        return self._response.is_closed

    def __iter__(self) -> EventStream[T]:
        return self

    def __next__(self) -> T:
        try:
            for line in self._lines:
                ready, value = self._parser.feed(line)
                if ready:
                    # A newer producer may emit an event type this SDK does not
                    # model yet; skip it and keep the durable stream open.
                    if self._event_types is not None and (not isinstance(value, dict) or value.get("type") not in self._event_types):
                        continue
                    return cast(T, value)
            raise StopIteration
        except httpx.TimeoutException as error:
            self.close()
            raise SDKRequestTimeout(self._context) from error
        except httpx.RequestError as error:
            self.close()
            raise SDKTransportError(self._context) from error
        except BaseException:
            self.close()
            raise

    def close(self) -> None:
        self._response.close()

    def __enter__(self) -> EventStream[T]:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

class AsyncEventStream(Generic[T], AsyncIterator[T]):
    def __init__(self, response: httpx.Response, context: OperationContext,
                 event_types: frozenset[str] | None = None) -> None:
        self._response = response
        self._context = context
        self._lines = response.aiter_lines()
        self._parser = _SSEParser()
        self._event_types = event_types
        self.status = response.status_code
        self.headers = HTTPHeaders(response.headers)

    @property
    def last_event_id(self) -> str | None:
        return self._parser.last_event_id

    @property
    def closed(self) -> bool:
        return self._response.is_closed

    def __aiter__(self) -> AsyncEventStream[T]:
        return self

    async def __anext__(self) -> T:
        try:
            if self._response.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "text/event-stream":
                raise ValueError("Expected text/event-stream response")
            async for line in self._lines:
                ready, value = self._parser.feed(line)
                if ready:
                    # A newer producer may emit an event type this SDK does not
                    # model yet; skip it and keep the durable stream open.
                    if self._event_types is not None and (not isinstance(value, dict) or value.get("type") not in self._event_types):
                        continue
                    return cast(T, value)
            raise StopAsyncIteration
        except httpx.TimeoutException as error:
            await self.aclose()
            raise SDKRequestTimeout(self._context) from error
        except httpx.RequestError as error:
            await self.aclose()
            raise SDKTransportError(self._context) from error
        except BaseException:
            await self.aclose()
            raise

    async def aclose(self) -> None:
        await self._response.aclose()

    async def __aenter__(self) -> AsyncEventStream[T]:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

@dataclass(frozen=True)
class ResponseStream:
    response_id: str
    events: EventStream[NativeResponseEvent]
    response: BeeOSHTTPResponse[NativeResponseResult]

@dataclass(frozen=True)
class AsyncResponseStream:
    response_id: str
    events: AsyncEventStream[NativeResponseEvent]
    response: BeeOSHTTPResponse[NativeResponseResult]

class PTYConnectRequest(TypedDict, total=False):
    cols: int
    rows: int
    pty_id: str
    origin: str
    last_server_sequence: str

class DesktopConnectRequest(TypedDict, total=False):
    origin: str

class _ExactAsyncConnect(async_ws_connect):
    def process_redirect(self, exc: Exception) -> Exception | str:
        return exc

def _connection_ticket(ticket: AccessTicket, purpose: str) -> None:
    parts = urlsplit(ticket["connect_url"])
    if parts.scheme != "wss" or parts.username or parts.password or parts.query or parts.fragment:
        raise ValueError("Access ticket must provide an exact WSS URL without credentials or query")
    expected = "beeos-terminal-v2" if purpose == "pty" else "beeos-desktop-v1"
    if ticket["purpose"] != purpose or ticket["profile"] != expected:
        raise ValueError("Access ticket purpose/profile mismatch")

def _authenticate_frame(ticket: AccessTicket) -> str:
    frame = json.dumps({"type": "authenticate", "profile": ticket["profile"], "ticket": ticket["ticket"]})
    if len(frame.encode()) > 16384:
        raise ValueError("Access authentication frame exceeds 16 KiB")
    return frame

def _origin(request: Mapping[str, object]) -> Origin | None:
    value = request.get("origin")
    return Origin(cast(str, value)) if value is not None else None

def _json_frame(raw: str | bytes) -> dict[str, JSONValue]:
    frame = json.loads(raw)
    if not isinstance(frame, dict):
        raise ValueError("Expected a JSON connection frame")
    return cast(dict[str, JSONValue], frame)

def _admitted(frame: Mapping[str, JSONValue], ticket: AccessTicket) -> None:
    if frame.get("type") != "authenticated" or frame.get("profile") != ticket["profile"] or frame.get("client_id") != ticket["client_id"] or frame.get("sandbox_id") != ticket["sandbox_id"]:
        raise ValueError("Access profile admission failed")
    if ticket["purpose"] == "pty" and frame.get("terminal_id") != ticket.get("pty_id"):
        raise ValueError("Terminal admission identity mismatch")

def _terminal_open(ticket: AccessTicket, body: PTYConnectRequest) -> dict[str, JSONValue]:
    frame: dict[str, JSONValue] = {"protocolVersion": 1, "clientId": ticket["client_id"], "terminalId": ticket["pty_id"], "clientSequence": "1"}
    if body.get("pty_id"):
        frame.update(type="terminal.resume", lastServerSequence=body.get("last_server_sequence", "0"))
    else:
        frame.update(type="terminal.open", columns=body["cols"], rows=body["rows"])
    return frame

def _opened(frame: Mapping[str, JSONValue], ticket: AccessTicket, body: PTYConnectRequest) -> None:
    if frame.get("type") != "terminal.opened" or frame.get("protocolVersion") != 1 or frame.get("clientId") != ticket["client_id"] or frame.get("terminalId") != ticket["pty_id"] or frame.get("resumed") is not bool(body.get("pty_id")):
        raise ValueError("Terminal did not confirm open/resume")

class DesktopSignalingConnection:
    def __init__(self, socket: WebSocket, acceptance: Acceptance | None) -> None:
        self._socket = socket
        self.acceptance = acceptance

    def send(self, frame: Mapping[str, JSONValue] | bytes) -> None:
        self._socket.send(frame if isinstance(frame, bytes) else json.dumps(frame))

    def start_desktop_stream(self) -> None:
        """Start the admitted producer's generation1 Desktop stream."""
        self.send({"type": "start", "transport_generation": 1})

    def receive(self) -> dict[str, JSONValue] | bytes:
        frame = self._socket.recv()
        return frame if isinstance(frame, bytes) else _json_frame(frame)

    def close(self) -> None:
        """Close only the local connection; no remote cancellation or input replay."""
        self._socket.close()

    def __enter__(self) -> DesktopSignalingConnection:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

class AsyncDesktopSignalingConnection:
    def __init__(self, socket: AsyncWebSocket, acceptance: Acceptance | None) -> None:
        self._socket = socket
        self.acceptance = acceptance

    async def send(self, frame: Mapping[str, JSONValue] | bytes) -> None:
        try:
            await self._socket.send(frame if isinstance(frame, bytes) else json.dumps(frame))
        except asyncio.CancelledError:
            await self.aclose()
            raise

    async def start_desktop_stream(self) -> None:
        """Start the admitted producer's generation1 Desktop stream."""
        await self.send({"type": "start", "transport_generation": 1})

    async def receive(self) -> dict[str, JSONValue] | bytes:
        try:
            frame = await self._socket.recv()
            return frame if isinstance(frame, bytes) else _json_frame(frame)
        except asyncio.CancelledError:
            await self.aclose()
            raise

    async def aclose(self) -> None:
        await self._socket.close()

    async def __aenter__(self) -> AsyncDesktopSignalingConnection:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

class TerminalConnection(DesktopSignalingConnection):
    def __init__(self, socket: WebSocket, acceptance: Acceptance | None, opened: dict[str, JSONValue]) -> None:
        super().__init__(socket, acceptance)
        self.opened = opened
        self._sequence = 1
        self._last_server_sequence = int(cast(str, opened["sequence"]))

    def receive(self) -> dict[str, JSONValue] | bytes:
        while True:
            frame = super().receive()
            if isinstance(frame, dict) and frame.get("type") == "terminal.output":
                sequence = int(cast(str, frame["sequence"]))
                if sequence <= self._last_server_sequence:
                    continue
                self._last_server_sequence = sequence
            return frame

    def _frame(self, kind: str) -> dict[str, JSONValue]:
        self._sequence += 1
        return {"type": kind, "protocolVersion": 1, "clientId": self.opened["clientId"], "terminalId": self.opened["terminalId"], "clientSequence": str(self._sequence)}

    def write(self, data: str) -> None:
        """Local send only: the public PTY protocol has no stdin acknowledgement."""
        if len(data.encode()) > 16384:
            raise ValueError("PTY input exceeds 16 KiB")
        frame = self._frame("terminal.input")
        frame.update(data=data, encoding="utf8")
        self.send(frame)

    def resize(self, columns: int, rows: int) -> None:
        frame = self._frame("terminal.resize")
        frame.update(columns=columns, rows=rows)
        self.send(frame)

class AsyncTerminalConnection(AsyncDesktopSignalingConnection):
    def __init__(self, socket: AsyncWebSocket, acceptance: Acceptance | None, opened: dict[str, JSONValue]) -> None:
        super().__init__(socket, acceptance)
        self.opened = opened
        self._sequence = 1
        self._last_server_sequence = int(cast(str, opened["sequence"]))

    async def receive(self) -> dict[str, JSONValue] | bytes:
        while True:
            frame = await super().receive()
            if isinstance(frame, dict) and frame.get("type") == "terminal.output":
                sequence = int(cast(str, frame["sequence"]))
                if sequence <= self._last_server_sequence:
                    continue
                self._last_server_sequence = sequence
            return frame

    def _frame(self, kind: str) -> dict[str, JSONValue]:
        self._sequence += 1
        return {"type": kind, "protocolVersion": 1, "clientId": self.opened["clientId"], "terminalId": self.opened["terminalId"], "clientSequence": str(self._sequence)}

    async def write(self, data: str) -> None:
        if len(data.encode()) > 16384:
            raise ValueError("PTY input exceeds 16 KiB")
        frame = self._frame("terminal.input")
        frame.update(data=data, encoding="utf8")
        await self.send(frame)

    async def resize(self, columns: int, rows: int) -> None:
        frame = self._frame("terminal.resize")
        frame.update(columns=columns, rows=rows)
        await self.send(frame)

class NativePTYResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def connect(self, sandbox_id: str, body: PTYConnectRequest, options: CreateSandboxAccessTicketOptions | None = None) -> TerminalConnection:
        request = cast(AccessTicketCreate, {key: value for key, value in body.items() if key != "last_server_sequence"})
        request["purpose"] = "pty"
        accepted = self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "pty")
        socket = sync_ws_connect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(body), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            if socket.subprotocol != ticket["profile"]:
                raise ValueError("WebSocket did not select the requested public profile")
            socket.send(_authenticate_frame(ticket))
            _admitted(_json_frame(socket.recv(timeout=5)), ticket)
            socket.send(json.dumps(_terminal_open(ticket, body)))
            frame = _json_frame(socket.recv(timeout=5))
            _opened(frame, ticket, body)
            return TerminalConnection(socket, accepted.acceptance, frame)
        except BaseException:
            socket.close()
            raise

class AsyncNativePTYResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def connect(self, sandbox_id: str, body: PTYConnectRequest, options: CreateSandboxAccessTicketOptions | None = None) -> AsyncTerminalConnection:
        request = cast(AccessTicketCreate, {key: value for key, value in body.items() if key != "last_server_sequence"})
        request["purpose"] = "pty"
        accepted = await self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "pty")
        socket = await _ExactAsyncConnect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(body), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            async with asyncio.timeout(5):
                if socket.subprotocol != ticket["profile"]:
                    raise ValueError("WebSocket did not select the requested public profile")
                await socket.send(_authenticate_frame(ticket))
                _admitted(_json_frame(await socket.recv()), ticket)
                await socket.send(json.dumps(_terminal_open(ticket, body)))
                frame = _json_frame(await socket.recv())
                _opened(frame, ticket, body)
            return AsyncTerminalConnection(socket, accepted.acceptance, frame)
        except BaseException:
            await socket.close()
            raise

class NativeDesktopResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def connect(self, sandbox_id: str, body: DesktopConnectRequest | None = None, options: CreateSandboxAccessTicketOptions | None = None) -> DesktopSignalingConnection:
        request: AccessTicketCreate = {"purpose": "desktop"}
        if body and "origin" in body:
            request["origin"] = body["origin"]
        accepted = self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "desktop")
        socket = sync_ws_connect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(request), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            if socket.subprotocol != ticket["profile"]:
                raise ValueError("WebSocket did not select the requested public profile")
            socket.send(_authenticate_frame(ticket))
            _admitted(_json_frame(socket.recv(timeout=5)), ticket)
            return DesktopSignalingConnection(socket, accepted.acceptance)
        except BaseException:
            socket.close()
            raise

class AsyncNativeDesktopResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def connect(self, sandbox_id: str, body: DesktopConnectRequest | None = None, options: CreateSandboxAccessTicketOptions | None = None) -> AsyncDesktopSignalingConnection:
        request: AccessTicketCreate = {"purpose": "desktop"}
        if body and "origin" in body:
            request["origin"] = body["origin"]
        accepted = await self._client.access_tickets.create(sandbox_id, request, options)
        ticket = accepted.body["data"]
        _connection_ticket(ticket, "desktop")
        socket = await _ExactAsyncConnect(ticket["connect_url"], subprotocols=[Subprotocol(ticket["profile"])], origin=_origin(request), open_timeout=5, close_timeout=1, max_size=1048576, max_queue=1)
        try:
            async with asyncio.timeout(5):
                if socket.subprotocol != ticket["profile"]:
                    raise ValueError("WebSocket did not select the requested public profile")
                await socket.send(_authenticate_frame(ticket))
                _admitted(_json_frame(await socket.recv()), ticket)
            return AsyncDesktopSignalingConnection(socket, accepted.acceptance)
        except BaseException:
            await socket.close()
            raise

class NativeSandboxesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client
        self.commands = NativeSandboxesCommandsResource(client)
        self.files = NativeSandboxesFilesResource(client)
        self.pty = NativePTYResource(client)
        self.desktop = NativeDesktopResource(client)

    def create(self, body: SandboxCreate, options: CreateSandboxOptions | None = None) -> BeeOSHTTPResponse[SandboxResult]:
        return cast("BeeOSHTTPResponse[SandboxResult]", self._client._execute(_OPERATIONS["createSandbox"], {}, body, options))

    def list(self, options: ListSandboxesOptions | None = None) -> BeeOSHTTPResponse[SandboxPage]:
        return cast("BeeOSHTTPResponse[SandboxPage]", self._client._execute(_OPERATIONS["listSandboxes"], {}, None, options))

    def get(self, sandbox_id: str, options: GetSandboxOptions | None = None) -> BeeOSHTTPResponse[SandboxGetResult]:
        return cast("BeeOSHTTPResponse[SandboxGetResult]", self._client._execute(_OPERATIONS["getSandbox"], {"sandbox_id": sandbox_id}, None, options))

    def update(self, sandbox_id: str, body: SandboxPatch, options: PatchSandboxOptions) -> BeeOSHTTPResponse[SandboxGetResult]:
        return cast("BeeOSHTTPResponse[SandboxGetResult]", self._client._execute(_OPERATIONS["patchSandbox"], {"sandbox_id": sandbox_id}, body, options))

    def terminate(self, sandbox_id: str, options: TerminateSandboxOptions) -> BeeOSHTTPResponse[None]:
        return cast("BeeOSHTTPResponse[None]", self._client._execute(_OPERATIONS["terminateSandbox"], {"sandbox_id": sandbox_id}, None, options))

    def pause(self, sandbox_id: str, body: PauseRequest | None = None, *, options: PauseSandboxOptions) -> BeeOSHTTPResponse[SandboxResult]:
        return cast("BeeOSHTTPResponse[SandboxResult]", self._client._execute(_OPERATIONS["pauseSandbox"], {"sandbox_id": sandbox_id}, body, options))

    def resume(self, sandbox_id: str, body: ResumeRequest | None = None, *, options: ResumeSandboxOptions) -> BeeOSHTTPResponse[SandboxResult]:
        return cast("BeeOSHTTPResponse[SandboxResult]", self._client._execute(_OPERATIONS["resumeSandbox"], {"sandbox_id": sandbox_id}, body, options))


class NativeTemplatesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def list(self, options: ListSandboxTemplatesOptions | None = None) -> BeeOSHTTPResponse[TemplatePage]:
        return cast("BeeOSHTTPResponse[TemplatePage]", self._client._execute(_OPERATIONS["listSandboxTemplates"], {}, None, options))

    def get(self, template_id: str, options: GetSandboxTemplateOptions | None = None) -> BeeOSHTTPResponse[TemplateResult]:
        return cast("BeeOSHTTPResponse[TemplateResult]", self._client._execute(_OPERATIONS["getSandboxTemplate"], {"template_id": template_id}, None, options))


class NativeAccessTicketsResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def create(self, sandbox_id: str, body: AccessTicketCreate, options: CreateSandboxAccessTicketOptions | None = None) -> BeeOSHTTPResponse[AccessTicketResult]:
        return cast("BeeOSHTTPResponse[AccessTicketResult]", self._client._execute(_OPERATIONS["createSandboxAccessTicket"], {"sandbox_id": sandbox_id}, body, options))

    def revoke(self, sandbox_id: str, ticket_id: str, options: RevokeSandboxAccessTicketOptions) -> BeeOSHTTPResponse[None]:
        return cast("BeeOSHTTPResponse[None]", self._client._execute(_OPERATIONS["revokeSandboxAccessTicket"], {"sandbox_id": sandbox_id, "ticket_id": ticket_id}, None, options))


class NativeSandboxesCommandsResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client
        self.artifacts = NativeSandboxesCommandsArtifactsResource(client)

    def run(self, sandbox_id: str, body: CommandCreate, options: RunSandboxCommandOptions | None = None) -> BeeOSHTTPResponse[CommandResultEnvelope]:
        return cast("BeeOSHTTPResponse[CommandResultEnvelope]", self._client._execute(_OPERATIONS["runSandboxCommand"], {"sandbox_id": sandbox_id}, body, options))

    def get(self, sandbox_id: str, command_id: str, options: GetSandboxCommandOptions | None = None) -> BeeOSHTTPResponse[CommandResultEnvelope]:
        return cast("BeeOSHTTPResponse[CommandResultEnvelope]", self._client._execute(_OPERATIONS["getSandboxCommand"], {"sandbox_id": sandbox_id, "command_id": command_id}, None, options))

    def cancel(self, sandbox_id: str, command_id: str, options: CancelSandboxCommandOptions | None = None) -> BeeOSHTTPResponse[CommandResultEnvelope]:
        return cast("BeeOSHTTPResponse[CommandResultEnvelope]", self._client._execute(_OPERATIONS["cancelSandboxCommand"], {"sandbox_id": sandbox_id, "command_id": command_id}, None, options))

    def events(self, sandbox_id: str, command_id: str, options: StreamSandboxCommandEventsOptions | None = None) -> EventStream[CommandEvent]:
        return cast("EventStream[CommandEvent]", self._client._execute(_OPERATIONS["streamSandboxCommandEvents"], {"sandbox_id": sandbox_id, "command_id": command_id}, None, options))


class NativeSandboxesFilesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def write(self, sandbox_id: str, body: bytes, options: WriteSandboxFileOptions) -> BeeOSHTTPResponse[FileWriteResultResult]:
        return cast("BeeOSHTTPResponse[FileWriteResultResult]", self._client._execute(_OPERATIONS["writeSandboxFile"], {"sandbox_id": sandbox_id}, body, options))

    def read(self, sandbox_id: str, options: ReadSandboxFileOptions) -> BeeOSHTTPResponse[bytes]:
        return cast("BeeOSHTTPResponse[bytes]", self._client._execute(_OPERATIONS["readSandboxFile"], {"sandbox_id": sandbox_id}, None, options))


class NativeSandboxesCommandsArtifactsResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def download(self, sandbox_id: str, command_id: str, artifact_id: str, options: DownloadCommandArtifactOptions | None = None) -> BeeOSHTTPResponse[bytes]:
        return cast("BeeOSHTTPResponse[bytes]", self._client._execute(_OPERATIONS["downloadCommandArtifact"], {"sandbox_id": sandbox_id, "command_id": command_id, "artifact_id": artifact_id}, None, options))


class NativeAgentsResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client
        self.memory = NativeAgentsMemoryResource(client)

    def create(self, body: NativeAgentCreate, options: CreateNativeAgentOptions | None = None) -> BeeOSHTTPResponse[NativeAgentResult]:
        return cast("BeeOSHTTPResponse[NativeAgentResult]", self._client._execute(_OPERATIONS["createNativeAgent"], {}, body, options))

    def list(self, options: ListNativeAgentsOptions | None = None) -> BeeOSHTTPResponse[NativeAgentPage]:
        return cast("BeeOSHTTPResponse[NativeAgentPage]", self._client._execute(_OPERATIONS["listNativeAgents"], {}, None, options))

    def get(self, agent_id: str, options: GetNativeAgentOptions | None = None) -> BeeOSHTTPResponse[NativeAgentResult]:
        return cast("BeeOSHTTPResponse[NativeAgentResult]", self._client._execute(_OPERATIONS["getNativeAgent"], {"agent_id": agent_id}, None, options))

    def update(self, agent_id: str, body: NativeAgentPatch, options: UpdateNativeAgentOptions) -> BeeOSHTTPResponse[NativeAgentResult]:
        return cast("BeeOSHTTPResponse[NativeAgentResult]", self._client._execute(_OPERATIONS["updateNativeAgent"], {"agent_id": agent_id}, body, options))

    def delete(self, agent_id: str, options: DeleteNativeAgentOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", self._client._execute(_OPERATIONS["deleteNativeAgent"], {"agent_id": agent_id}, None, options))

    def list_models(self, agent_id: str, options: ListNativeAgentModelsOptions | None = None) -> BeeOSHTTPResponse[ModelAvailabilityPage]:
        return cast("BeeOSHTTPResponse[ModelAvailabilityPage]", self._client._execute(_OPERATIONS["listNativeAgentModels"], {"agent_id": agent_id}, None, options))

    def get_skill_files(self, agent_id: str, skill_id: str, options: GetNativeAgentSkillFilesOptions | None = None) -> BeeOSHTTPResponse[SkillFilesResult]:
        return cast("BeeOSHTTPResponse[SkillFilesResult]", self._client._execute(_OPERATIONS["getNativeAgentSkillFiles"], {"agent_id": agent_id, "skill_id": skill_id}, None, options))

    def revoke_authorizations(self, agent_id: str, body: AuthorizationRevoke, options: RevokeNativeAgentAuthorizationsOptions | None = None) -> BeeOSHTTPResponse[AuthorizationEnforcementResult]:
        return cast("BeeOSHTTPResponse[AuthorizationEnforcementResult]", self._client._execute(_OPERATIONS["revokeNativeAgentAuthorizations"], {"agent_id": agent_id}, body, options))


class NativeModelsResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def list(self, options: ListNativeModelsOptions | None = None) -> BeeOSHTTPResponse[ModelAvailabilityPage]:
        return cast("BeeOSHTTPResponse[ModelAvailabilityPage]", self._client._execute(_OPERATIONS["listNativeModels"], {}, None, options))


class NativeSessionsResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client
        self.canvas = NativeSessionsCanvasResource(client)

    def create(self, body: NativeSessionCreate, options: CreateNativeSessionOptions | None = None) -> BeeOSHTTPResponse[NativeSessionResult]:
        return cast("BeeOSHTTPResponse[NativeSessionResult]", self._client._execute(_OPERATIONS["createNativeSession"], {}, body, options))

    def list(self, options: ListNativeSessionsOptions | None = None) -> BeeOSHTTPResponse[NativeSessionPage]:
        return cast("BeeOSHTTPResponse[NativeSessionPage]", self._client._execute(_OPERATIONS["listNativeSessions"], {}, None, options))

    def get(self, session_id: str, options: GetNativeSessionOptions | None = None) -> BeeOSHTTPResponse[NativeSessionResult]:
        return cast("BeeOSHTTPResponse[NativeSessionResult]", self._client._execute(_OPERATIONS["getNativeSession"], {"session_id": session_id}, None, options))

    def update(self, session_id: str, body: NativeSessionPatch, options: UpdateNativeSessionOptions) -> BeeOSHTTPResponse[NativeSessionResult]:
        return cast("BeeOSHTTPResponse[NativeSessionResult]", self._client._execute(_OPERATIONS["updateNativeSession"], {"session_id": session_id}, body, options))

    def delete(self, session_id: str, options: DeleteNativeSessionOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", self._client._execute(_OPERATIONS["deleteNativeSession"], {"session_id": session_id}, None, options))

    def list_files(self, session_id: str, options: ListNativeSessionFilesOptions | None = None) -> BeeOSHTTPResponse[FileMetadataPage]:
        return cast("BeeOSHTTPResponse[FileMetadataPage]", self._client._execute(_OPERATIONS["listNativeSessionFiles"], {"session_id": session_id}, None, options))

    def list_responses(self, session_id: str, options: ListNativeSessionResponsesOptions | None = None) -> BeeOSHTTPResponse[NativeResponsePage]:
        return cast("BeeOSHTTPResponse[NativeResponsePage]", self._client._execute(_OPERATIONS["listNativeSessionResponses"], {"session_id": session_id}, None, options))


class NativeResponsesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def create(self, body: NativeResponseCreate, options: CreateNativeResponseOptions | None = None) -> BeeOSHTTPResponse[NativeResponseResult]:
        return cast("BeeOSHTTPResponse[NativeResponseResult]", self._client._execute(_OPERATIONS["createNativeResponse"], {}, body, options))

    def get(self, response_id: str, options: GetNativeResponseOptions | None = None) -> BeeOSHTTPResponse[NativeResponseResult]:
        return cast("BeeOSHTTPResponse[NativeResponseResult]", self._client._execute(_OPERATIONS["getNativeResponse"], {"response_id": response_id}, None, options))

    def delete(self, response_id: str, options: DeleteNativeResponseOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", self._client._execute(_OPERATIONS["deleteNativeResponse"], {"response_id": response_id}, None, options))

    def cancel(self, response_id: str, options: CancelNativeResponseOptions | None = None) -> BeeOSHTTPResponse[NativeResponseResult]:
        return cast("BeeOSHTTPResponse[NativeResponseResult]", self._client._execute(_OPERATIONS["cancelNativeResponse"], {"response_id": response_id}, None, options))

    def events(self, response_id: str, options: StreamNativeResponseEventsOptions | None = None) -> EventStream[NativeResponseEvent]:
        return cast("EventStream[NativeResponseEvent]", self._client._execute(_OPERATIONS["streamNativeResponseEvents"], {"response_id": response_id}, None, options, _NATIVE_RESPONSE_EVENT_TYPES))

    def list_input_items(self, response_id: str, options: ListNativeResponseInputItemsOptions | None = None) -> BeeOSHTTPResponse[ResponseInputPage]:
        return cast("BeeOSHTTPResponse[ResponseInputPage]", self._client._execute(_OPERATIONS["listNativeResponseInputItems"], {"response_id": response_id}, None, options))

    def reply_interaction(self, response_id: str, interaction_id: str, body: InteractionReply, options: ReplyNativeInteractionOptions | None = None) -> BeeOSHTTPResponse[InteractionReplyResultResult]:
        return cast("BeeOSHTTPResponse[InteractionReplyResultResult]", self._client._execute(_OPERATIONS["replyNativeInteraction"], {"response_id": response_id, "interaction_id": interaction_id}, body, options))

    def create_stream(self, body: NativeResponseCreate, options: CreateNativeResponseOptions | None = None) -> ResponseStream:
        accepted = self.create(body, options)
        response_id = accepted.body["data"]["id"]
        try:
            events = self.events(response_id, _event_options(options))
        except SDKTransportError as error:
            raise type(error)(cast(OperationContext, accepted.operation_context)) from error
        except BeeOSAPIError as error:
            error.acceptance = accepted.acceptance
            error.operation_context = accepted.operation_context
            raise
        return ResponseStream(response_id, events, accepted)


class NativeFilesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def create(self, body: bytes, options: CreateNativeFileOptions) -> BeeOSHTTPResponse[FileMetadataResult]:
        return cast("BeeOSHTTPResponse[FileMetadataResult]", self._client._execute(_OPERATIONS["createNativeFile"], {}, body, options))

    def get(self, file_id: str, options: GetNativeFileOptions | None = None) -> BeeOSHTTPResponse[FileMetadataResult]:
        return cast("BeeOSHTTPResponse[FileMetadataResult]", self._client._execute(_OPERATIONS["getNativeFile"], {"file_id": file_id}, None, options))

    def delete(self, file_id: str, options: DeleteNativeFileOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", self._client._execute(_OPERATIONS["deleteNativeFile"], {"file_id": file_id}, None, options))

    def download(self, file_id: str, options: DownloadNativeFileOptions | None = None) -> BeeOSHTTPResponse[bytes]:
        return cast("BeeOSHTTPResponse[bytes]", self._client._execute(_OPERATIONS["downloadNativeFile"], {"file_id": file_id}, None, options))


class NativeCapabilitiesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def get(self, options: GetNativeCapabilitiesOptions | None = None) -> BeeOSHTTPResponse[NativeCapabilitiesResult]:
        return cast("BeeOSHTTPResponse[NativeCapabilitiesResult]", self._client._execute(_OPERATIONS["getNativeCapabilities"], {}, None, options))


class NativeAgentsMemoryResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def remember(self, agent_id: str, body: NativeMemoryRemember, options: RememberNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", self._client._execute(_OPERATIONS["rememberNativeMemory"], {"agent_id": agent_id}, body, options))

    def recall(self, agent_id: str, body: NativeMemoryRecall, options: RecallNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryRecallResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryRecallResult]", self._client._execute(_OPERATIONS["recallNativeMemory"], {"agent_id": agent_id}, body, options))

    def correct(self, agent_id: str, record_id: str, body: NativeMemoryCorrect, options: CorrectNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", self._client._execute(_OPERATIONS["correctNativeMemory"], {"agent_id": agent_id, "record_id": record_id}, body, options))

    def forget(self, agent_id: str, record_id: str, body: NativeMemoryForget, options: ForgetNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", self._client._execute(_OPERATIONS["forgetNativeMemory"], {"agent_id": agent_id, "record_id": record_id}, body, options))

    def get_receipt(self, agent_id: str, receipt_id: str, options: GetNativeMemoryReceiptOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", self._client._execute(_OPERATIONS["getNativeMemoryReceipt"], {"agent_id": agent_id, "receipt_id": receipt_id}, None, options))


class NativeSessionsCanvasResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def get(self, session_id: str, options: GetNativeSessionCanvasOptions | None = None) -> BeeOSHTTPResponse[CanvasLinkResult]:
        return cast("BeeOSHTTPResponse[CanvasLinkResult]", self._client._execute(_OPERATIONS["getNativeSessionCanvas"], {"session_id": session_id}, None, options))

    def create_ticket(self, session_id: str, body: CanvasTicketCreate | None = None, options: CreateNativeCanvasTicketOptions | None = None) -> BeeOSHTTPResponse[CanvasTicketResult]:
        return cast("BeeOSHTTPResponse[CanvasTicketResult]", self._client._execute(_OPERATIONS["createNativeCanvasTicket"], {"session_id": session_id}, body, options))


class NativeCanvasesResource:
    def __init__(self, client: NativeBeeOSClient) -> None:
        self._client = client

    def get_share(self, canvas_id: str, options: GetNativeCanvasShareOptions | None = None) -> BeeOSHTTPResponse[CanvasShareResult]:
        return cast("BeeOSHTTPResponse[CanvasShareResult]", self._client._execute(_OPERATIONS["getNativeCanvasShare"], {"canvas_id": canvas_id}, None, options))

    def share(self, canvas_id: str, body: CanvasShareCreate, options: CreateNativeCanvasShareOptions | None = None) -> BeeOSHTTPResponse[CanvasShareResult]:
        return cast("BeeOSHTTPResponse[CanvasShareResult]", self._client._execute(_OPERATIONS["createNativeCanvasShare"], {"canvas_id": canvas_id}, body, options))

    def unshare(self, canvas_id: str, options: DeleteNativeCanvasShareOptions | None = None) -> BeeOSHTTPResponse[None]:
        return cast("BeeOSHTTPResponse[None]", self._client._execute(_OPERATIONS["deleteNativeCanvasShare"], {"canvas_id": canvas_id}, None, options))

    def list_snapshots(self, canvas_id: str, options: ListNativeCanvasSnapshotsOptions | None = None) -> BeeOSHTTPResponse[CanvasSnapshotPage]:
        return cast("BeeOSHTTPResponse[CanvasSnapshotPage]", self._client._execute(_OPERATIONS["listNativeCanvasSnapshots"], {"canvas_id": canvas_id}, None, options))

    def restore_snapshot(self, canvas_id: str, snapshot_id: str, options: RestoreNativeCanvasSnapshotOptions | None = None) -> BeeOSHTTPResponse[CanvasRestoreResult]:
        return cast("BeeOSHTTPResponse[CanvasRestoreResult]", self._client._execute(_OPERATIONS["restoreNativeCanvasSnapshot"], {"canvas_id": canvas_id, "snapshot_id": snapshot_id}, None, options))


class AsyncNativeSandboxesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client
        self.commands = AsyncNativeSandboxesCommandsResource(client)
        self.files = AsyncNativeSandboxesFilesResource(client)
        self.pty = AsyncNativePTYResource(client)
        self.desktop = AsyncNativeDesktopResource(client)

    async def create(self, body: SandboxCreate, options: CreateSandboxOptions | None = None) -> BeeOSHTTPResponse[SandboxResult]:
        return cast("BeeOSHTTPResponse[SandboxResult]", await self._client._execute(_OPERATIONS["createSandbox"], {}, body, options))

    async def list(self, options: ListSandboxesOptions | None = None) -> BeeOSHTTPResponse[SandboxPage]:
        return cast("BeeOSHTTPResponse[SandboxPage]", await self._client._execute(_OPERATIONS["listSandboxes"], {}, None, options))

    async def get(self, sandbox_id: str, options: GetSandboxOptions | None = None) -> BeeOSHTTPResponse[SandboxGetResult]:
        return cast("BeeOSHTTPResponse[SandboxGetResult]", await self._client._execute(_OPERATIONS["getSandbox"], {"sandbox_id": sandbox_id}, None, options))

    async def update(self, sandbox_id: str, body: SandboxPatch, options: PatchSandboxOptions) -> BeeOSHTTPResponse[SandboxGetResult]:
        return cast("BeeOSHTTPResponse[SandboxGetResult]", await self._client._execute(_OPERATIONS["patchSandbox"], {"sandbox_id": sandbox_id}, body, options))

    async def terminate(self, sandbox_id: str, options: TerminateSandboxOptions) -> BeeOSHTTPResponse[None]:
        return cast("BeeOSHTTPResponse[None]", await self._client._execute(_OPERATIONS["terminateSandbox"], {"sandbox_id": sandbox_id}, None, options))

    async def pause(self, sandbox_id: str, body: PauseRequest | None = None, *, options: PauseSandboxOptions) -> BeeOSHTTPResponse[SandboxResult]:
        return cast("BeeOSHTTPResponse[SandboxResult]", await self._client._execute(_OPERATIONS["pauseSandbox"], {"sandbox_id": sandbox_id}, body, options))

    async def resume(self, sandbox_id: str, body: ResumeRequest | None = None, *, options: ResumeSandboxOptions) -> BeeOSHTTPResponse[SandboxResult]:
        return cast("BeeOSHTTPResponse[SandboxResult]", await self._client._execute(_OPERATIONS["resumeSandbox"], {"sandbox_id": sandbox_id}, body, options))


class AsyncNativeTemplatesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def list(self, options: ListSandboxTemplatesOptions | None = None) -> BeeOSHTTPResponse[TemplatePage]:
        return cast("BeeOSHTTPResponse[TemplatePage]", await self._client._execute(_OPERATIONS["listSandboxTemplates"], {}, None, options))

    async def get(self, template_id: str, options: GetSandboxTemplateOptions | None = None) -> BeeOSHTTPResponse[TemplateResult]:
        return cast("BeeOSHTTPResponse[TemplateResult]", await self._client._execute(_OPERATIONS["getSandboxTemplate"], {"template_id": template_id}, None, options))


class AsyncNativeAccessTicketsResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def create(self, sandbox_id: str, body: AccessTicketCreate, options: CreateSandboxAccessTicketOptions | None = None) -> BeeOSHTTPResponse[AccessTicketResult]:
        return cast("BeeOSHTTPResponse[AccessTicketResult]", await self._client._execute(_OPERATIONS["createSandboxAccessTicket"], {"sandbox_id": sandbox_id}, body, options))

    async def revoke(self, sandbox_id: str, ticket_id: str, options: RevokeSandboxAccessTicketOptions) -> BeeOSHTTPResponse[None]:
        return cast("BeeOSHTTPResponse[None]", await self._client._execute(_OPERATIONS["revokeSandboxAccessTicket"], {"sandbox_id": sandbox_id, "ticket_id": ticket_id}, None, options))


class AsyncNativeSandboxesCommandsResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client
        self.artifacts = AsyncNativeSandboxesCommandsArtifactsResource(client)

    async def run(self, sandbox_id: str, body: CommandCreate, options: RunSandboxCommandOptions | None = None) -> BeeOSHTTPResponse[CommandResultEnvelope]:
        return cast("BeeOSHTTPResponse[CommandResultEnvelope]", await self._client._execute(_OPERATIONS["runSandboxCommand"], {"sandbox_id": sandbox_id}, body, options))

    async def get(self, sandbox_id: str, command_id: str, options: GetSandboxCommandOptions | None = None) -> BeeOSHTTPResponse[CommandResultEnvelope]:
        return cast("BeeOSHTTPResponse[CommandResultEnvelope]", await self._client._execute(_OPERATIONS["getSandboxCommand"], {"sandbox_id": sandbox_id, "command_id": command_id}, None, options))

    async def cancel(self, sandbox_id: str, command_id: str, options: CancelSandboxCommandOptions | None = None) -> BeeOSHTTPResponse[CommandResultEnvelope]:
        return cast("BeeOSHTTPResponse[CommandResultEnvelope]", await self._client._execute(_OPERATIONS["cancelSandboxCommand"], {"sandbox_id": sandbox_id, "command_id": command_id}, None, options))

    async def events(self, sandbox_id: str, command_id: str, options: StreamSandboxCommandEventsOptions | None = None) -> AsyncEventStream[CommandEvent]:
        return cast("AsyncEventStream[CommandEvent]", await self._client._execute(_OPERATIONS["streamSandboxCommandEvents"], {"sandbox_id": sandbox_id, "command_id": command_id}, None, options))


class AsyncNativeSandboxesFilesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def write(self, sandbox_id: str, body: bytes, options: WriteSandboxFileOptions) -> BeeOSHTTPResponse[FileWriteResultResult]:
        return cast("BeeOSHTTPResponse[FileWriteResultResult]", await self._client._execute(_OPERATIONS["writeSandboxFile"], {"sandbox_id": sandbox_id}, body, options))

    async def read(self, sandbox_id: str, options: ReadSandboxFileOptions) -> BeeOSHTTPResponse[bytes]:
        return cast("BeeOSHTTPResponse[bytes]", await self._client._execute(_OPERATIONS["readSandboxFile"], {"sandbox_id": sandbox_id}, None, options))


class AsyncNativeSandboxesCommandsArtifactsResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def download(self, sandbox_id: str, command_id: str, artifact_id: str, options: DownloadCommandArtifactOptions | None = None) -> BeeOSHTTPResponse[bytes]:
        return cast("BeeOSHTTPResponse[bytes]", await self._client._execute(_OPERATIONS["downloadCommandArtifact"], {"sandbox_id": sandbox_id, "command_id": command_id, "artifact_id": artifact_id}, None, options))


class AsyncNativeAgentsResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client
        self.memory = AsyncNativeAgentsMemoryResource(client)

    async def create(self, body: NativeAgentCreate, options: CreateNativeAgentOptions | None = None) -> BeeOSHTTPResponse[NativeAgentResult]:
        return cast("BeeOSHTTPResponse[NativeAgentResult]", await self._client._execute(_OPERATIONS["createNativeAgent"], {}, body, options))

    async def list(self, options: ListNativeAgentsOptions | None = None) -> BeeOSHTTPResponse[NativeAgentPage]:
        return cast("BeeOSHTTPResponse[NativeAgentPage]", await self._client._execute(_OPERATIONS["listNativeAgents"], {}, None, options))

    async def get(self, agent_id: str, options: GetNativeAgentOptions | None = None) -> BeeOSHTTPResponse[NativeAgentResult]:
        return cast("BeeOSHTTPResponse[NativeAgentResult]", await self._client._execute(_OPERATIONS["getNativeAgent"], {"agent_id": agent_id}, None, options))

    async def update(self, agent_id: str, body: NativeAgentPatch, options: UpdateNativeAgentOptions) -> BeeOSHTTPResponse[NativeAgentResult]:
        return cast("BeeOSHTTPResponse[NativeAgentResult]", await self._client._execute(_OPERATIONS["updateNativeAgent"], {"agent_id": agent_id}, body, options))

    async def delete(self, agent_id: str, options: DeleteNativeAgentOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", await self._client._execute(_OPERATIONS["deleteNativeAgent"], {"agent_id": agent_id}, None, options))

    async def list_models(self, agent_id: str, options: ListNativeAgentModelsOptions | None = None) -> BeeOSHTTPResponse[ModelAvailabilityPage]:
        return cast("BeeOSHTTPResponse[ModelAvailabilityPage]", await self._client._execute(_OPERATIONS["listNativeAgentModels"], {"agent_id": agent_id}, None, options))

    async def get_skill_files(self, agent_id: str, skill_id: str, options: GetNativeAgentSkillFilesOptions | None = None) -> BeeOSHTTPResponse[SkillFilesResult]:
        return cast("BeeOSHTTPResponse[SkillFilesResult]", await self._client._execute(_OPERATIONS["getNativeAgentSkillFiles"], {"agent_id": agent_id, "skill_id": skill_id}, None, options))

    async def revoke_authorizations(self, agent_id: str, body: AuthorizationRevoke, options: RevokeNativeAgentAuthorizationsOptions | None = None) -> BeeOSHTTPResponse[AuthorizationEnforcementResult]:
        return cast("BeeOSHTTPResponse[AuthorizationEnforcementResult]", await self._client._execute(_OPERATIONS["revokeNativeAgentAuthorizations"], {"agent_id": agent_id}, body, options))


class AsyncNativeModelsResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def list(self, options: ListNativeModelsOptions | None = None) -> BeeOSHTTPResponse[ModelAvailabilityPage]:
        return cast("BeeOSHTTPResponse[ModelAvailabilityPage]", await self._client._execute(_OPERATIONS["listNativeModels"], {}, None, options))


class AsyncNativeSessionsResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client
        self.canvas = AsyncNativeSessionsCanvasResource(client)

    async def create(self, body: NativeSessionCreate, options: CreateNativeSessionOptions | None = None) -> BeeOSHTTPResponse[NativeSessionResult]:
        return cast("BeeOSHTTPResponse[NativeSessionResult]", await self._client._execute(_OPERATIONS["createNativeSession"], {}, body, options))

    async def list(self, options: ListNativeSessionsOptions | None = None) -> BeeOSHTTPResponse[NativeSessionPage]:
        return cast("BeeOSHTTPResponse[NativeSessionPage]", await self._client._execute(_OPERATIONS["listNativeSessions"], {}, None, options))

    async def get(self, session_id: str, options: GetNativeSessionOptions | None = None) -> BeeOSHTTPResponse[NativeSessionResult]:
        return cast("BeeOSHTTPResponse[NativeSessionResult]", await self._client._execute(_OPERATIONS["getNativeSession"], {"session_id": session_id}, None, options))

    async def update(self, session_id: str, body: NativeSessionPatch, options: UpdateNativeSessionOptions) -> BeeOSHTTPResponse[NativeSessionResult]:
        return cast("BeeOSHTTPResponse[NativeSessionResult]", await self._client._execute(_OPERATIONS["updateNativeSession"], {"session_id": session_id}, body, options))

    async def delete(self, session_id: str, options: DeleteNativeSessionOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", await self._client._execute(_OPERATIONS["deleteNativeSession"], {"session_id": session_id}, None, options))

    async def list_files(self, session_id: str, options: ListNativeSessionFilesOptions | None = None) -> BeeOSHTTPResponse[FileMetadataPage]:
        return cast("BeeOSHTTPResponse[FileMetadataPage]", await self._client._execute(_OPERATIONS["listNativeSessionFiles"], {"session_id": session_id}, None, options))

    async def list_responses(self, session_id: str, options: ListNativeSessionResponsesOptions | None = None) -> BeeOSHTTPResponse[NativeResponsePage]:
        return cast("BeeOSHTTPResponse[NativeResponsePage]", await self._client._execute(_OPERATIONS["listNativeSessionResponses"], {"session_id": session_id}, None, options))


class AsyncNativeResponsesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def create(self, body: NativeResponseCreate, options: CreateNativeResponseOptions | None = None) -> BeeOSHTTPResponse[NativeResponseResult]:
        return cast("BeeOSHTTPResponse[NativeResponseResult]", await self._client._execute(_OPERATIONS["createNativeResponse"], {}, body, options))

    async def get(self, response_id: str, options: GetNativeResponseOptions | None = None) -> BeeOSHTTPResponse[NativeResponseResult]:
        return cast("BeeOSHTTPResponse[NativeResponseResult]", await self._client._execute(_OPERATIONS["getNativeResponse"], {"response_id": response_id}, None, options))

    async def delete(self, response_id: str, options: DeleteNativeResponseOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", await self._client._execute(_OPERATIONS["deleteNativeResponse"], {"response_id": response_id}, None, options))

    async def cancel(self, response_id: str, options: CancelNativeResponseOptions | None = None) -> BeeOSHTTPResponse[NativeResponseResult]:
        return cast("BeeOSHTTPResponse[NativeResponseResult]", await self._client._execute(_OPERATIONS["cancelNativeResponse"], {"response_id": response_id}, None, options))

    async def events(self, response_id: str, options: StreamNativeResponseEventsOptions | None = None) -> AsyncEventStream[NativeResponseEvent]:
        return cast("AsyncEventStream[NativeResponseEvent]", await self._client._execute(_OPERATIONS["streamNativeResponseEvents"], {"response_id": response_id}, None, options, _NATIVE_RESPONSE_EVENT_TYPES))

    async def list_input_items(self, response_id: str, options: ListNativeResponseInputItemsOptions | None = None) -> BeeOSHTTPResponse[ResponseInputPage]:
        return cast("BeeOSHTTPResponse[ResponseInputPage]", await self._client._execute(_OPERATIONS["listNativeResponseInputItems"], {"response_id": response_id}, None, options))

    async def reply_interaction(self, response_id: str, interaction_id: str, body: InteractionReply, options: ReplyNativeInteractionOptions | None = None) -> BeeOSHTTPResponse[InteractionReplyResultResult]:
        return cast("BeeOSHTTPResponse[InteractionReplyResultResult]", await self._client._execute(_OPERATIONS["replyNativeInteraction"], {"response_id": response_id, "interaction_id": interaction_id}, body, options))

    async def create_stream(self, body: NativeResponseCreate, options: CreateNativeResponseOptions | None = None) -> AsyncResponseStream:
        accepted = await self.create(body, options)
        response_id = accepted.body["data"]["id"]
        try:
            events = await self.events(response_id, _event_options(options))
        except SDKTransportError as error:
            raise type(error)(cast(OperationContext, accepted.operation_context)) from error
        except BeeOSAPIError as error:
            error.acceptance = accepted.acceptance
            error.operation_context = accepted.operation_context
            raise
        return AsyncResponseStream(response_id, events, accepted)


class AsyncNativeFilesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def create(self, body: bytes, options: CreateNativeFileOptions) -> BeeOSHTTPResponse[FileMetadataResult]:
        return cast("BeeOSHTTPResponse[FileMetadataResult]", await self._client._execute(_OPERATIONS["createNativeFile"], {}, body, options))

    async def get(self, file_id: str, options: GetNativeFileOptions | None = None) -> BeeOSHTTPResponse[FileMetadataResult]:
        return cast("BeeOSHTTPResponse[FileMetadataResult]", await self._client._execute(_OPERATIONS["getNativeFile"], {"file_id": file_id}, None, options))

    async def delete(self, file_id: str, options: DeleteNativeFileOptions | None = None) -> BeeOSHTTPResponse[DeletedResultResult]:
        return cast("BeeOSHTTPResponse[DeletedResultResult]", await self._client._execute(_OPERATIONS["deleteNativeFile"], {"file_id": file_id}, None, options))

    async def download(self, file_id: str, options: DownloadNativeFileOptions | None = None) -> BeeOSHTTPResponse[bytes]:
        return cast("BeeOSHTTPResponse[bytes]", await self._client._execute(_OPERATIONS["downloadNativeFile"], {"file_id": file_id}, None, options))


class AsyncNativeCapabilitiesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def get(self, options: GetNativeCapabilitiesOptions | None = None) -> BeeOSHTTPResponse[NativeCapabilitiesResult]:
        return cast("BeeOSHTTPResponse[NativeCapabilitiesResult]", await self._client._execute(_OPERATIONS["getNativeCapabilities"], {}, None, options))


class AsyncNativeAgentsMemoryResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def remember(self, agent_id: str, body: NativeMemoryRemember, options: RememberNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", await self._client._execute(_OPERATIONS["rememberNativeMemory"], {"agent_id": agent_id}, body, options))

    async def recall(self, agent_id: str, body: NativeMemoryRecall, options: RecallNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryRecallResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryRecallResult]", await self._client._execute(_OPERATIONS["recallNativeMemory"], {"agent_id": agent_id}, body, options))

    async def correct(self, agent_id: str, record_id: str, body: NativeMemoryCorrect, options: CorrectNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", await self._client._execute(_OPERATIONS["correctNativeMemory"], {"agent_id": agent_id, "record_id": record_id}, body, options))

    async def forget(self, agent_id: str, record_id: str, body: NativeMemoryForget, options: ForgetNativeMemoryOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", await self._client._execute(_OPERATIONS["forgetNativeMemory"], {"agent_id": agent_id, "record_id": record_id}, body, options))

    async def get_receipt(self, agent_id: str, receipt_id: str, options: GetNativeMemoryReceiptOptions | None = None) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
        return cast("BeeOSHTTPResponse[NativeMemoryReceiptResult]", await self._client._execute(_OPERATIONS["getNativeMemoryReceipt"], {"agent_id": agent_id, "receipt_id": receipt_id}, None, options))


class AsyncNativeSessionsCanvasResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def get(self, session_id: str, options: GetNativeSessionCanvasOptions | None = None) -> BeeOSHTTPResponse[CanvasLinkResult]:
        return cast("BeeOSHTTPResponse[CanvasLinkResult]", await self._client._execute(_OPERATIONS["getNativeSessionCanvas"], {"session_id": session_id}, None, options))

    async def create_ticket(self, session_id: str, body: CanvasTicketCreate | None = None, options: CreateNativeCanvasTicketOptions | None = None) -> BeeOSHTTPResponse[CanvasTicketResult]:
        return cast("BeeOSHTTPResponse[CanvasTicketResult]", await self._client._execute(_OPERATIONS["createNativeCanvasTicket"], {"session_id": session_id}, body, options))


class AsyncNativeCanvasesResource:
    def __init__(self, client: AsyncNativeBeeOSClient) -> None:
        self._client = client

    async def get_share(self, canvas_id: str, options: GetNativeCanvasShareOptions | None = None) -> BeeOSHTTPResponse[CanvasShareResult]:
        return cast("BeeOSHTTPResponse[CanvasShareResult]", await self._client._execute(_OPERATIONS["getNativeCanvasShare"], {"canvas_id": canvas_id}, None, options))

    async def share(self, canvas_id: str, body: CanvasShareCreate, options: CreateNativeCanvasShareOptions | None = None) -> BeeOSHTTPResponse[CanvasShareResult]:
        return cast("BeeOSHTTPResponse[CanvasShareResult]", await self._client._execute(_OPERATIONS["createNativeCanvasShare"], {"canvas_id": canvas_id}, body, options))

    async def unshare(self, canvas_id: str, options: DeleteNativeCanvasShareOptions | None = None) -> BeeOSHTTPResponse[None]:
        return cast("BeeOSHTTPResponse[None]", await self._client._execute(_OPERATIONS["deleteNativeCanvasShare"], {"canvas_id": canvas_id}, None, options))

    async def list_snapshots(self, canvas_id: str, options: ListNativeCanvasSnapshotsOptions | None = None) -> BeeOSHTTPResponse[CanvasSnapshotPage]:
        return cast("BeeOSHTTPResponse[CanvasSnapshotPage]", await self._client._execute(_OPERATIONS["listNativeCanvasSnapshots"], {"canvas_id": canvas_id}, None, options))

    async def restore_snapshot(self, canvas_id: str, snapshot_id: str, options: RestoreNativeCanvasSnapshotOptions | None = None) -> BeeOSHTTPResponse[CanvasRestoreResult]:
        return cast("BeeOSHTTPResponse[CanvasRestoreResult]", await self._client._execute(_OPERATIONS["restoreNativeCanvasSnapshot"], {"canvas_id": canvas_id, "snapshot_id": snapshot_id}, None, options))

