# Generated from spec/server.openapi.json; do not edit.
from __future__ import annotations

import json
from collections.abc import Callable, Iterator
from typing import Literal, NotRequired, Required, TypeAlias, TypedDict, cast
from http.client import HTTPResponse
from urllib.error import HTTPError
from urllib.parse import quote, urlencode, urlsplit, urlunsplit
from urllib.request import Request as URLRequest, urlopen
from uuid import uuid4

JSONValue: TypeAlias = None | bool | int | float | str | list["JSONValue"] | dict[str, "JSONValue"]

ExternalUserID: TypeAlias = "str"

ClientSessionInput = TypedDict("ClientSessionInput", {
    "client_type": "Required[Literal[\"web\", \"native\"]]",
    "requested_capabilities": "Required[list[str]]",
    "origin": "NotRequired[str]",
    "device_attestation": "NotRequired[ClientSessionInputDeviceAttestation]",
    "ttl_seconds": "NotRequired[int]",
})

Binding = TypedDict("Binding", {
    "client_type": "Required[Literal[\"web\", \"native\"]]",
    "origin": "NotRequired[str]",
    "cnf_jkt": "NotRequired[str]",
})

ClientSessionResponse = TypedDict("ClientSessionResponse", {
    "access_token": "Required[str]",
    "client_api_url": "Required[Literal[\"https://client-api.cloud.beeos.ai/v1\"]]",
    "expires_at": "Required[str]",
    "session_id": "Required[str]",
    "app_id": "Required[str]",
    "external_user_id": "Required[ExternalUserID]",
    "capabilities": "Required[list[str]]",
    "binding": "Required[Binding]",
})

DeletionAccepted = TypedDict("DeletionAccepted", {
    "deletion_id": "Required[str]",
    "status": "Required[Literal[\"pending\", \"processing\", \"failed\", \"completed\"]]",
})

Deletion = TypedDict("Deletion", {
    "id": "Required[str]",
    "status": "Required[str]",
    "deleted_resources": "Required[dict[str, int]]",
})

Provider = TypedDict("Provider", {
    "id": "Required[str]",
    "name": "Required[str]",
    "description": "NotRequired[str]",
    "capabilities": "NotRequired[ProviderCapabilities]",
})

DeployRegion = TypedDict("DeployRegion", {
    "id": "Required[str]",
    "name": "Required[str]",
    "available": "Required[bool]",
})

DeployModel = TypedDict("DeployModel", {
    "id": "Required[str]",
    "name": "Required[str]",
    "tier": "NotRequired[str]",
    "reasoning": "NotRequired[bool]",
    "input": "NotRequired[list[str]]",
    "context_window": "NotRequired[int]",
})

InstanceTemplate = TypedDict("InstanceTemplate", {
    "id": "Required[str]",
    "name": "Required[str]",
    "description": "NotRequired[str]",
    "logo_url": "NotRequired[str]",
    "sort_order": "NotRequired[int]",
    "agent_framework": "NotRequired[str]",
    "provider_id": "NotRequired[str]",
    "specs": "NotRequired[list[CatalogSpec]]",
    "variants": "NotRequired[list[CatalogVariant]]",
})

ProviderPage = TypedDict("ProviderPage", {
    "data": "Required[list[Provider]]",
    "total": "Required[int]",
})

RegionPage = TypedDict("RegionPage", {
    "data": "Required[list[DeployRegion]]",
    "total": "Required[int]",
})

ModelPage = TypedDict("ModelPage", {
    "data": "Required[list[DeployModel]]",
    "total": "Required[int]",
})

InstanceSummary = TypedDict("InstanceSummary", {
    "id": "Required[str]",
    "organization_id": "Required[str]",
    "app_id": "Required[str]",
    "developer_id": "Required[str]",
    "name": "Required[str]",
    "agent_framework": "Required[str]",
    "provider_id": "Required[str]",
    "region": "Required[str]",
    "os_type": "Required[str]",
    "status": "Required[str]",
    "desired_status": "Required[str]",
    "connectivity": "Required[str]",
    "ms_connection_status": "Required[str]",
    "created_at": "Required[str]",
    "updated_at": "Required[str]",
    "resource_version": "Required[int]",
})

InstancePage = TypedDict("InstancePage", {
    "data": "Required[list[InstanceSummary]]",
    "total": "Required[int]",
})

ProviderCapabilities = TypedDict("ProviderCapabilities", {
    "long_running": "Required[bool]",
    "browser_use": "Required[bool]",
    "code_exec": "Required[bool]",
    "file_system": "Required[bool]",
    "custom_image": "Required[bool]",
    "device": "Required[bool]",
    "max_duration_sec": "Required[int]",
    "cost_model": "Required[str]",
})

CatalogSpecValue = TypedDict("CatalogSpecValue", {
    "id": "Required[str]",
    "name": "Required[str]",
    "label": "Required[str]",
    "sort_order": "Required[int]",
})

CatalogSpec = TypedDict("CatalogSpec", {
    "id": "Required[str]",
    "name": "Required[str]",
    "label": "Required[str]",
    "values": "Required[list[CatalogSpecValue]]",
})

CatalogVariant = TypedDict("CatalogVariant", {
    "id": "Required[str]",
    "spec_value_ids": "Required[list[str]]",
    "sort_order": "Required[int]",
})

InstanceTemplatePage = TypedDict("InstanceTemplatePage", {
    "data": "Required[list[InstanceTemplate]]",
    "total": "Required[int]",
})

AgentSnapshot = TypedDict("AgentSnapshot", {
    "id": "Required[str]",
    "instance_id": "Required[str]",
    "name": "Required[str]",
    "display_name": "NotRequired[str]",
    "description": "Required[str]",
    "status": "Required[str]",
    "visibility": "Required[str]",
    "conversation_transport": "Required[str]",
    "resource_version": "Required[int]",
    "mcp_enabled": "Required[bool]",
    "a2a_enabled": "Required[bool]",
    "capabilities": "Required[dict[str, bool]]",
    "skills": "Required[list[AgentSkill]]",
    "created_at": "Required[str]",
    "updated_at": "Required[str]",
})

AgentSkill = TypedDict("AgentSkill", {
    "id": "Required[str]",
    "name": "Required[str]",
    "description": "Required[str]",
    "tags": "Required[list[str]]",
    "enabled": "Required[bool]",
})

AgentPatch = TypedDict("AgentPatch", {
    "visibility": "NotRequired[Literal[\"private\", \"unlisted\", \"org\", \"public\", \"marketplace\"]]",
    "mcp_enabled": "NotRequired[bool]",
    "a2a_enabled": "NotRequired[bool]",
})

AgentResponse = TypedDict("AgentResponse", {
    "data": "Required[AgentSnapshot]",
})

AgentPage = TypedDict("AgentPage", {
    "data": "Required[list[AgentAgent]]",
    "total": "Required[int]",
})

CreateConversationInput = TypedDict("CreateConversationInput", {
    "title": "NotRequired[str]",
})

Conversation = TypedDict("Conversation", {
    "id": "Required[str]",
    "agent_id": "Required[str]",
    "instance_id": "Required[str]",
    "title": "Required[str]",
    "state": "Required[Literal[\"open\", \"closed\"]]",
    "metadata_version": "Required[int]",
    "history_generation": "Required[int]",
    "created_at": "Required[str]",
    "last_activity_at": "NotRequired[str]",
    "closed_at": "NotRequired[str]",
    "resource_version": "Required[int]",
    "model_override_id": "NotRequired[str]",
    "effective_model_id": "NotRequired[str]",
})

ConversationResponse = TypedDict("ConversationResponse", {
    "data": "Required[Conversation]",
})

ConversationPage = TypedDict("ConversationPage", {
    "conversations": "Required[list[Conversation]]",
    "next_cursor": "NotRequired[str]",
    "has_more": "Required[bool]",
})

Message = TypedDict("Message", {
    "id": "Required[str]",
    "conversation_id": "Required[str]",
    "type": "Required[str]",
    "content": "Required[JSONValue]",
    "sender": "Required[str]",
    "reply_to": "NotRequired[str]",
    "created_at": "Required[str]",
    "offset": "Required[int]",
    "history_generation": "Required[int]",
    "state": "NotRequired[str]",
    "stop_reason": "NotRequired[str]",
    "body": "NotRequired[str]",
    "parts": "NotRequired[list[dict[str, JSONValue]]]",
    "updated_at": "NotRequired[str]",
    "runtime_dispatch": "NotRequired[dict[str, JSONValue]]",
    "realtime_publish_status": "NotRequired[Literal[\"published\", \"unconfirmed\", \"not_republished\"]]",
})

MessagePage = TypedDict("MessagePage", {
    "messages": "Required[list[Message]]",
    "next_cursor": "NotRequired[str]",
    "has_more": "Required[bool]",
    "latest_offset": "Required[int]",
    "history_generation": "Required[int]",
    "history_boundary_offset": "Required[int]",
})

MessageEnvelope = TypedDict("MessageEnvelope", {
    "id": "Required[str]",
    "conversation_id": "Required[str]",
    "type": "Required[str]",
    "sender": "Required[str]",
    "reply_to": "NotRequired[str]",
    "body": "Required[str]",
    "parts": "NotRequired[list[dict[str, JSONValue]]]",
    "state": "Required[str]",
    "stop_reason": "NotRequired[str]",
    "content": "NotRequired[JSONValue]",
    "created_at": "NotRequired[str]",
    "updated_at": "NotRequired[str]",
})

MessageEnvelopeResponse = TypedDict("MessageEnvelopeResponse", {
    "data": "Required[MessageEnvelope]",
})

UpdateConversationInput = TypedDict("UpdateConversationInput", {
    "title": "Required[str]",
})

CancelConversationInput = TypedDict("CancelConversationInput", {
    "target_message_id": "Required[str]",
    "reason": "NotRequired[str]",
})

SetConversationModelInput = TypedDict("SetConversationModelInput", {
    "model_override_id": "Required[str | None]",
})

CommandReceipt = TypedDict("CommandReceipt", {
    "request_id": "Required[str]",
    "status": "Required[str]",
})

CommandReceiptResponse = TypedDict("CommandReceiptResponse", {
    "data": "Required[CommandReceipt]",
})

ClearConversationReceipt = TypedDict("ClearConversationReceipt", {
    "request_id": "Required[str]",
    "conversation_id": "Required[str]",
    "current_generation": "Required[int]",
    "status": "Required[str]",
})

ClearConversationReceiptResponse = TypedDict("ClearConversationReceiptResponse", {
    "data": "Required[ClearConversationReceipt]",
})

CreateTaskInput = TypedDict("CreateTaskInput", {
    "message": "Required[str]",
    "context_id": "NotRequired[str]",
    "deadline_ms": "NotRequired[int]",
    "metadata": "NotRequired[dict[str, str]]",
    "attachments": "NotRequired[list[JSONValue]]",
})

CreateTaskResult = TypedDict("CreateTaskResult", {
    "task_id": "Required[str]",
    "agent_id": "Required[str]",
    "status": "Required[str]",
    "created_at": "Required[str]",
})

CreateTaskResponse = TypedDict("CreateTaskResponse", {
    "data": "Required[CreateTaskResult]",
})

Task = TypedDict("Task", {
    "task_id": "Required[str]",
    "organization_id": "NotRequired[str]",
    "app_id": "NotRequired[str]",
    "instance_id": "NotRequired[str]",
    "agent_id": "Required[str]",
    "conversation_id": "NotRequired[str]",
    "status": "Required[str]",
    "result": "NotRequired[JSONValue]",
    "error": "NotRequired[str]",
    "metadata": "NotRequired[dict[str, str]]",
    "resource_version": "NotRequired[int]",
    "created_at": "Required[str]",
    "started_at": "NotRequired[str]",
    "completed_at": "NotRequired[str]",
    "deadline_at": "NotRequired[str]",
    "truncated": "NotRequired[bool]",
    "history_generation": "Required[int]",
    "latest_offset": "Required[int]",
})

TaskResponse = TypedDict("TaskResponse", {
    "data": "Required[Task]",
})

TaskPage = TypedDict("TaskPage", {
    "tasks": "Required[list[Task]]",
    "next_since": "NotRequired[str]",
    "has_more": "Required[bool]",
})

CancelTaskInput = TypedDict("CancelTaskInput", {
    "reason": "NotRequired[str]",
})

ContinueTaskInput = TypedDict("ContinueTaskInput", {
    "input": "NotRequired[JSONValue]",
    "auth_grant": "NotRequired[bool]",
})

ErrorResponse = TypedDict("ErrorResponse", {
    "code": "Required[str]",
    "message": "Required[str]",
    "request_id": "Required[str]",
})

UHPDiscovery = TypedDict("UHPDiscovery", {
    "object": "Required[Literal[\"uhp.discovery\"]]",
    "protocol": "Required[Literal[\"uhp\"]]",
    "versions": "Required[list[str]]",
    "default_version": "Required[str]",
    "conformance_class": "Required[Literal[\"core\", \"extended\", \"full\"]]",
    "capabilities": "Required[UHPCapabilities]",
    "plugin_schemas": "NotRequired[list[str]]",
    "implementation": "NotRequired[UHPDiscoveryImplementation]",
})

UHPCapabilities = TypedDict("UHPCapabilities", {
    "streaming": "NotRequired[bool]",
    "sessions": "NotRequired[bool]",
    "cancellation": "NotRequired[bool]",
    "files_input": "NotRequired[bool]",
    "files_output": "NotRequired[bool]",
    "session_listing": "NotRequired[bool]",
    "harness_management": "NotRequired[bool]",
    "session_sharing": "NotRequired[bool]",
    "idempotency": "NotRequired[bool]",
    "plugins": "NotRequired[bool]",
    "environments": "NotRequired[bool]",
    "memories": "NotRequired[bool]",
})

UHPHarness = TypedDict("UHPHarness", {
    "id": "Required[str]",
    "object": "NotRequired[Literal[\"harness\"]]",
    "name": "Required[str]",
    "base": "Required[str]",
    "baseLabel": "NotRequired[str]",
    "defaultModel": "NotRequired[str]",
    "systemPrompt": "NotRequired[str]",
    "mcpServers": "NotRequired[list[UHPMcpServer]]",
    "skills": "NotRequired[list[UHPSkill]]",
    "plugins": "NotRequired[list[UHPPlugin]]",
    "environment": "NotRequired[str]",
    "disabledTools": "NotRequired[list[str]]",
    "maxStep": "NotRequired[int | None]",
    "timeoutSeconds": "NotRequired[int | None]",
    "createdAt": "NotRequired[int]",
})

UHPMcpServer = TypedDict("UHPMcpServer", {
    "name": "Required[str]",
    "url": "Required[str]",
    "transport": "NotRequired[Literal[\"http\", \"sse\"]]",
    "enabled": "NotRequired[bool]",
    "headers": "NotRequired[dict[str, str]]",
    "auth": "NotRequired[str]",
    "expires_at": "NotRequired[str]",
})

UHPPluginMcpServer = TypedDict("UHPPluginMcpServer", {
    "name": "Required[str]",
    "transport": "NotRequired[Literal[\"http\", \"sse\", \"stdio\"]]",
    "url": "NotRequired[str]",
    "headers": "NotRequired[dict[str, str]]",
    "command": "NotRequired[str]",
    "args": "NotRequired[list[str]]",
    "env": "NotRequired[dict[str, str]]",
    "cwd": "NotRequired[str]",
    "enabled": "NotRequired[bool]",
})

UHPSkill = TypedDict("UHPSkill", {
    "name": "Required[str]",
    "enabled": "NotRequired[bool]",
    "files": "NotRequired[list[UHPSkillFile]]",
    "content": "NotRequired[str]",
    "blob": "NotRequired[str]",
    "sha256": "NotRequired[str]",
    "size_bytes": "NotRequired[str]",
})

UHPSkillFile = TypedDict("UHPSkillFile", {
    "path": "Required[str]",
    "content": "NotRequired[str]",
    "content_b64": "NotRequired[str]",
})

UHPPlugin = TypedDict("UHPPlugin", {
    "name": "Required[str]",
    "enabled": "NotRequired[bool]",
    "files": "NotRequired[list[UHPSkillFile]]",
    "blob": "NotRequired[str]",
    "manifest": "NotRequired[UHPPluginManifest]",
    "mcpServers": "NotRequired[list[UHPPluginMcpServer]]",
    "skills": "NotRequired[list[UHPPluginSkill]]",
    "skipped": "NotRequired[list[UHPPluginSkipped]]",
})

UHPPluginManifest = TypedDict("UHPPluginManifest", {
    "$schema": "Required[str]",
    "name": "Required[str]",
    "version": "NotRequired[str]",
    "description": "NotRequired[str]",
    "author": "NotRequired[UHPPluginManifestAuthor]",
    "homepage": "NotRequired[str]",
    "repository": "NotRequired[str]",
    "license": "NotRequired[str]",
    "keywords": "NotRequired[list[str]]",
    "extensions": "NotRequired[dict[str, dict[str, JSONValue]]]",
})

UHPPluginSkill = TypedDict("UHPPluginSkill", {
    "name": "Required[str]",
    "description": "NotRequired[str]",
})

UHPPluginSkipped = TypedDict("UHPPluginSkipped", {
    "path": "Required[str]",
    "reason": "Required[str]",
})

UHPModelCatalog = TypedDict("UHPModelCatalog", {
    "backends": "Required[dict[str, UHPModelCatalogBackendsValue]]",
})

UHPHarnessModels = TypedDict("UHPHarnessModels", {
    "harness_id": "NotRequired[str]",
    "backend": "NotRequired[str]",
    "default": "NotRequired[str]",
    "fallback": "NotRequired[str]",
    "models": "Required[list[UHPModel]]",
})

UHPModel = TypedDict("UHPModel", {
    "id": "Required[str]",
    "label": "NotRequired[str]",
    "backend": "NotRequired[str]",
    "available": "Required[bool]",
    "default": "NotRequired[bool]",
})

UHPCreateResponseRequest = TypedDict("UHPCreateResponseRequest", {
    "input": "Required[str | list[dict[str, JSONValue]]]",
    "model": "NotRequired[str]",
    "metadata": "NotRequired[UHPCreateResponseRequestMetadata]",
    "stream": "NotRequired[bool]",
    "previous_response_id": "NotRequired[str | None]",
    "instructions": "NotRequired[str]",
    "store": "NotRequired[bool]",
    "max_output_tokens": "NotRequired[int | None]",
    "max_step": "NotRequired[int | None]",
    "timeout_seconds": "NotRequired[int | None]",
    "tools": "NotRequired[list[dict[str, JSONValue]]]",
    "include": "NotRequired[list[str]]",
    "background": "NotRequired[bool]",
})

UHPResponse = TypedDict("UHPResponse", {
    "id": "Required[str]",
    "object": "Required[Literal[\"response\"]]",
    "created_at": "Required[int]",
    "status": "Required[UHPResponseStatus]",
    "error": "NotRequired[None | UHPError]",
    "incomplete_details": "NotRequired[dict[str, JSONValue] | None]",
    "previous_response_id": "NotRequired[str | None]",
    "model": "Required[str]",
    "output": "Required[list[UHPOutputItem]]",
    "store": "NotRequired[bool]",
    "usage": "NotRequired[None | UHPUsage]",
    "metadata": "NotRequired[UHPResponseMetadata]",
})

UHPResponseStatus: TypeAlias = "Literal[\"in_progress\", \"completed\", \"failed\", \"incomplete\", \"cancelled\"]"

UHPOutputItem = TypedDict("UHPOutputItem", {
    "id": "NotRequired[str]",
    "type": "Required[str]",
    "status": "NotRequired[str]",
    "role": "NotRequired[str]",
    "content": "NotRequired[list[UHPContentPart]]",
    "summary": "NotRequired[list[dict[str, JSONValue]]]",
    "call_id": "NotRequired[str]",
    "name": "NotRequired[str]",
    "arguments": "NotRequired[str]",
    "output": "NotRequired[str]",
})

UHPContentPart = TypedDict("UHPContentPart", {
    "type": "Required[str]",
    "text": "NotRequired[str]",
    "annotations": "NotRequired[list[UHPAnnotation]]",
})

UHPAnnotation = TypedDict("UHPAnnotation", {
    "type": "Required[Literal[\"container_file_citation\"]]",
    "container_id": "NotRequired[str]",
    "file_id": "NotRequired[str]",
    "filename": "NotRequired[str]",
    "download_url": "NotRequired[str]",
    "start_index": "NotRequired[int]",
    "end_index": "NotRequired[int]",
})

UHPUsage = TypedDict("UHPUsage", {
    "input_tokens": "NotRequired[int]",
    "output_tokens": "NotRequired[int]",
    "total_tokens": "NotRequired[int]",
    "cache_read_tokens": "NotRequired[int]",
    "cache_write_tokens": "NotRequired[int]",
})

UHPErrorEnvelope = TypedDict("UHPErrorEnvelope", {
    "error": "Required[UHPError]",
    "detail": "NotRequired[str]",
})

UHPError = TypedDict("UHPError", {
    "type": "Required[Literal[\"invalid_request_error\", \"authentication_error\", \"permission_error\", \"rate_limit_error\", \"harness_error\", \"server_error\"]]",
    "code": "Required[str]",
    "message": "Required[str]",
    "param": "NotRequired[str | None]",
    "detail": "NotRequired[dict[str, JSONValue] | None]",
})

UHPEvent = TypedDict("UHPEvent", {
    "type": "Required[str]",
    "sequence_number": "Required[int]",
    "response": "NotRequired[UHPResponse]",
    "item": "NotRequired[UHPOutputItem]",
    "part": "NotRequired[UHPContentPart]",
    "annotation": "NotRequired[UHPAnnotation]",
    "delta": "NotRequired[str]",
    "text": "NotRequired[str]",
    "arguments": "NotRequired[str]",
    "item_id": "NotRequired[str]",
    "output_index": "NotRequired[int]",
    "content_index": "NotRequired[int]",
    "summary_index": "NotRequired[int]",
    "annotation_index": "NotRequired[int]",
    "code": "NotRequired[str]",
    "message": "NotRequired[str]",
    "param": "NotRequired[str | None]",
})

RuntimeInstanceSummary = TypedDict("RuntimeInstanceSummary", {
    "id": "Required[str]",
    "organization_id": "Required[str]",
    "app_id": "Required[str]",
    "developer_id": "Required[str]",
    "name": "Required[str]",
    "agent_framework": "Required[str]",
    "provider_id": "Required[str]",
    "region": "Required[str]",
    "os_type": "Required[str]",
    "status": "Required[str]",
    "desired_status": "Required[str]",
    "connectivity": "Required[str]",
    "error_code": "NotRequired[str]",
    "ms_connection_status": "Required[str]",
    "image_id": "NotRequired[str]",
    "image_version_id": "NotRequired[str]",
    "image_version": "NotRequired[str]",
    "image_ref": "NotRequired[str]",
    "model_primary": "NotRequired[str]",
    "models": "NotRequired[list[str]]",
    "llm": "NotRequired[RuntimeLLMView | None]",
    "hosting_type": "NotRequired[str]",
    "cloud_provider": "NotRequired[str]",
    "resource_version": "Required[int]",
    "created_at": "Required[str]",
    "updated_at": "Required[str]",
    "capabilities": "Required[RuntimeInstanceSummaryCapabilities]",
})

RuntimeUpgradeJob = TypedDict("RuntimeUpgradeJob", {
    "job_id": "Required[str]",
    "instance_id": "Required[str]",
    "status": "Required[str]",
    "target": "Required[str]",
    "created_at": "Required[str]",
    "completed_at": "NotRequired[str | None]",
    "error": "NotRequired[str | None]",
})

RuntimeLLM = TypedDict("RuntimeLLM", {
    "providers": "Required[list[RuntimeLLMProvider]]",
    "models": "Required[list[RuntimeLLMModel]]",
})

RuntimeLLMView = TypedDict("RuntimeLLMView", {
    "providers": "Required[list[RuntimeLLMProviderView]]",
    "models": "Required[list[RuntimeLLMModel]]",
})

RuntimeLLMProvider = TypedDict("RuntimeLLMProvider", {
    "id": "Required[str]",
    "protocol": "Required[Literal[\"openai\", \"anthropic\"]]",
    "base_url": "Required[str]",
    "api_key": "NotRequired[str]",
})

RuntimeLLMProviderView = TypedDict("RuntimeLLMProviderView", {
    "id": "Required[str]",
    "protocol": "Required[str]",
    "base_url": "Required[str]",
})

RuntimeLLMModel = TypedDict("RuntimeLLMModel", {
    "provider_id": "Required[str]",
    "model": "Required[str]",
    "role": "Required[str]",
    "order": "Required[int]",
})

RuntimeOperationSummary = TypedDict("RuntimeOperationSummary", {
    "id": "Required[str]",
    "kind": "Required[str]",
    "phase": "Required[str]",
    "error_code": "NotRequired[str]",
})

RuntimeInstanceResult = TypedDict("RuntimeInstanceResult", {
    "data": "Required[RuntimeInstanceSummary]",
    "operation": "Required[RuntimeOperationSummary]",
})

RuntimeExecResult = TypedDict("RuntimeExecResult", {
    "exit_code": "Required[int]",
    "stdout": "Required[str]",
    "stderr": "Required[str]",
    "truncated": "Required[bool]",
})

FileFile = TypedDict("FileFile", {
    "file_id": "Required[str]",
    "filename": "Required[str]",
    "content_type": "Required[str]",
    "size_bytes": "Required[int]",
    "checksum_sha256": "NotRequired[str]",
    "status": "Required[str]",
    "resource_version": "Required[int]",
    "updated_at": "Required[str]",
    "title": "NotRequired[str]",
    "file_type": "Required[str]",
    "created_at": "Required[str]",
    "confirmed_at": "NotRequired[str | None]",
    "origin": "NotRequired[FileOrigin | None]",
})

FileOrigin = TypedDict("FileOrigin", {
    "source": "Required[str]",
    "instance_id": "NotRequired[str]",
    "agent_id": "NotRequired[str]",
    "operation_id": "NotRequired[str]",
    "instance_name": "NotRequired[str]",
    "agent_name": "NotRequired[str]",
    "avatar_url": "NotRequired[str]",
    "agent_framework": "NotRequired[str]",
    "destroyed": "NotRequired[bool]",
})

FileTransferDescriptor = TypedDict("FileTransferDescriptor", {
    "direction": "Required[str]",
    "file_id": "Required[str]",
    "url": "Required[str]",
    "http_method": "Required[str]",
    "required_headers": "Required[dict[str, str]]",
    "expires_at": "Required[str]",
    "content_type": "Required[str]",
    "size_bytes": "Required[int]",
    "checksum_sha256": "NotRequired[str]",
})

FileChatUploadContext = TypedDict("FileChatUploadContext", {
    "instance_id": "Required[str]",
    "agent_id": "NotRequired[str]",
})

FilePrepareUploadInput = TypedDict("FilePrepareUploadInput", {
    "upload_context": "NotRequired[FileChatUploadContext | None]",
    "filename": "Required[str]",
    "content_type": "Required[str]",
    "size_bytes": "Required[int]",
    "checksum_sha256": "NotRequired[str]",
})

FileConfirmInput = TypedDict("FileConfirmInput", {
    "checksum_sha256": "NotRequired[str]",
})

FilePage = TypedDict("FilePage", {
    "data": "Required[list[FileFile]]",
    "total": "Required[int]",
    "next_since": "NotRequired[str]",
})

FileResolution = TypedDict("FileResolution", {
    "file": "Required[FileFile]",
    "download": "Required[FileTransferDescriptor]",
})

FileSummary = TypedDict("FileSummary", {
    "file_count": "Required[int]",
    "storage_file_count": "Required[int]",
    "used_bytes": "Required[int]",
    "image_count": "Required[int]",
    "video_count": "Required[int]",
    "document_count": "Required[int]",
    "instances": "Required[list[FileSummaryInstancesItem]]",
})

AgentAgent = TypedDict("AgentAgent", {
    "id": "Required[str]",
    "instance_id": "Required[str]",
    "name": "Required[str]",
    "avatar_url": "NotRequired[str]",
    "display_name": "NotRequired[str]",
    "description": "Required[str]",
    "resource_version": "Required[int]",
    "status": "Required[str]",
    "visibility": "Required[str]",
    "mcp_enabled": "Required[bool]",
    "a2a_enabled": "Required[bool]",
    "capabilities": "Required[dict[str, bool]]",
    "skills": "Required[list[AgentSkill]]",
    "conversation_transport": "Required[str]",
    "created_at": "Required[str]",
    "updated_at": "Required[str]",
})

AgentAttachment = TypedDict("AgentAttachment", {
    "file_id": "Required[str]",
})

AgentInvokeInput = TypedDict("AgentInvokeInput", {
    "message": "Required[str]",
    "context_id": "NotRequired[str]",
    "timeout_ms": "NotRequired[int]",
    "metadata": "NotRequired[dict[str, str]]",
    "attachments": "NotRequired[list[AgentAttachment]]",
})

AgentInvokeResult = TypedDict("AgentInvokeResult", {
    "operation_id": "NotRequired[str]",
    "text": "Required[str]",
    "context_id": "Required[str]",
    "is_error": "Required[bool]",
})

A2AMessage = TypedDict("A2AMessage", {
    "messageId": "Required[str]",
    "role": "Required[str]",
    "parts": "Required[list[A2AOutputPart]]",
    "contextId": "NotRequired[str]",
    "taskId": "NotRequired[str]",
    "referenceTaskIds": "NotRequired[list[str]]",
    "metadata": "NotRequired[dict[str, JSONValue]]",
})

A2ATaskStatus = TypedDict("A2ATaskStatus", {
    "state": "Required[str]",
    "message": "NotRequired[A2AMessage | None]",
    "timestamp": "NotRequired[str]",
})

A2AArtifact = TypedDict("A2AArtifact", {
    "artifactId": "Required[str]",
    "name": "NotRequired[str]",
    "description": "NotRequired[str]",
    "parts": "Required[list[A2AOutputPart]]",
    "metadata": "NotRequired[dict[str, JSONValue]]",
    "extensions": "NotRequired[list[str]]",
})

A2ATextPartOut = TypedDict("A2ATextPartOut", {
    "text": "Required[str]",
    "metadata": "NotRequired[dict[str, JSONValue]]",
})

A2AFilePartOut = TypedDict("A2AFilePartOut", {
    "url": "NotRequired[str]",
    "filename": "NotRequired[str]",
    "mediaType": "NotRequired[str]",
    "metadata": "NotRequired[dict[str, JSONValue]]",
})

A2ADataPartOut = TypedDict("A2ADataPartOut", {
    "data": "Required[JSONValue]",
    "metadata": "NotRequired[dict[str, JSONValue]]",
})

agentBindWire = TypedDict("agentBindWire", {
    "status": "Required[str]",
    "bind_id": "NotRequired[str]",
    "instance_id": "NotRequired[str]",
    "public_key": "NotRequired[str]",
    "hostname": "NotRequired[str]",
    "expires_at": "NotRequired[int]",
    "runtime_binding": "NotRequired[bindRuntimeWire | None]",
})

bindRuntimeWire = TypedDict("bindRuntimeWire", {
    "instance_id": "Required[str]",
    "agent_gateway_url": "Required[str]",
    "message_service_url": "Required[str]",
})

agentBindDetailsWire = TypedDict("agentBindDetailsWire", {
    "bind_id": "Required[str]",
    "hostname": "Required[str]",
    "fingerprint_short": "Required[str]",
    "agent_framework": "Required[str]",
    "os_type": "NotRequired[str]",
    "expires_at": "Required[int]",
    "status": "Required[str]",
    "server_time": "Required[int]",
})

portalBindWire = TypedDict("portalBindWire", {
    "provider_id": "NotRequired[str]",
    "bind_id": "Required[str]",
    "short_code": "Required[str]",
    "status": "Required[str]",
    "instance_id": "NotRequired[str]",
    "expires_at": "Required[int]",
    "name": "Required[str]",
    "qr_payload": "NotRequired[str]",
    "api_base_url": "NotRequired[str]",
    "relay_url": "NotRequired[str]",
    "desired_status": "NotRequired[str]",
    "connectivity": "NotRequired[str]",
    "resource_version": "NotRequired[int]",
})

agentTemplateCatalogView = TypedDict("agentTemplateCatalogView", {
    "id": "Required[str]",
    "display_name": "Required[str]",
    "summary": "Required[str]",
    "description": "Required[str]",
    "category": "Required[str]",
    "vibe": "Required[str]",
    "icon_url": "Required[str]",
    "banner_url": "Required[str]",
    "default_model": "Required[str]",
    "tags": "Required[list[str]]",
    "agent_framework": "Required[str]",
    "template_version": "Required[str]",
})

a2aTaskView = TypedDict("a2aTaskView", {
    "id": "Required[str]",
    "contextId": "Required[str]",
    "status": "Required[A2ATaskStatus]",
    "artifacts": "NotRequired[list[A2AArtifact]]",
    "history": "NotRequired[list[A2AMessage]]",
    "metadata": "NotRequired[dict[str, JSONValue]]",
    "caller_principal_id": "Required[str]",
    "caller_agent_id": "Required[str]",
    "caller_owner_id": "Required[str]",
    "target_principal_id": "Required[str]",
    "target_agent_id": "Required[str]",
    "target_owner_id": "Required[str]",
    "channel_id": "NotRequired[str]",
    "created_at": "NotRequired[str]",
    "updated_at": "NotRequired[str]",
    "completed_at": "NotRequired[str]",
})

CreateServerInstanceInput = TypedDict("CreateServerInstanceInput", {
    "name": "Required[str]",
    "variant_id": "NotRequired[str]",
    "agent_framework": "NotRequired[Literal[\"openclaw\"]]",
    "llm": "NotRequired[RuntimeLLM | None]",
})

ServerUsageSummary = TypedDict("ServerUsageSummary", {
    "total_bc": "Required[str]",
    "total_records": "Required[int]",
    "by_category": "Required[dict[str, str]]",
    "by_app": "NotRequired[dict[str, str]]",
    "category_counts": "Required[dict[str, int]]",
})

RuntimeInstanceStatusResult = TypedDict("RuntimeInstanceStatusResult", {
    "data": "Required[RuntimeInstanceStatusResultData]",
    "operation": "Required[RuntimeOperationSummary]",
})

UpdateServerInstanceInput = TypedDict("UpdateServerInstanceInput", {
    "name": "NotRequired[str]",
    "llm": "NotRequired[RuntimeLLM]",
})

FileShareResponse = TypedDict("FileShareResponse", {
    "file_id": "Required[str]",
    "slug": "Required[str]",
    "filename": "Required[str]",
    "content_type": "Required[str]",
    "size_bytes": "Required[int]",
    "revoked": "Required[bool]",
})

ReplyShareResponse = TypedDict("ReplyShareResponse", {
    "data": "Required[ReplyShareResponseData]",
})

ConnectURLResponse = TypedDict("ConnectURLResponse", {
    "data": "Required[ConnectURLResponseData]",
})

ProtoAutomationRule = TypedDict("ProtoAutomationRule", {
    "id": "NotRequired[str]",
    "name": "NotRequired[str]",
    "prompt": "NotRequired[str]",
    "target": "NotRequired[ProtoAutomationTarget]",
    "schedule": "NotRequired[ProtoAutomationSchedule]",
    "session": "NotRequired[ProtoAutomationSession]",
    "validFrom": "NotRequired[str]",
    "validUntil": "NotRequired[str]",
    "status": "NotRequired[str]",
    "nextFireAt": "NotRequired[str]",
    "createdInConversationId": "NotRequired[str]",
    "createdAt": "NotRequired[str]",
    "updatedAt": "NotRequired[str]",
    "triggerKind": "NotRequired[str]",
    "hookId": "NotRequired[str]",
    "source": "NotRequired[str]",
    "eventFilter": "NotRequired[str]",
    "mailbox": "NotRequired[str]",
})

ProtoAutomationTarget = TypedDict("ProtoAutomationTarget", {
    "instanceId": "NotRequired[str]",
    "agentId": "NotRequired[str]",
})

ProtoAutomationSchedule = TypedDict("ProtoAutomationSchedule", {
    "kind": "NotRequired[str]",
    "tz": "NotRequired[str]",
    "at": "NotRequired[str]",
    "intervalSeconds": "NotRequired[str]",
    "anchorAt": "NotRequired[str]",
    "expression": "NotRequired[str]",
})

ProtoAutomationSession = TypedDict("ProtoAutomationSession", {
    "mode": "NotRequired[str]",
    "boundConversationId": "NotRequired[str]",
})

ProtoAutomationInput = TypedDict("ProtoAutomationInput", {
    "name": "NotRequired[str]",
    "prompt": "NotRequired[str]",
    "target": "NotRequired[ProtoAutomationTarget]",
    "schedule": "NotRequired[ProtoAutomationSchedule]",
    "session": "NotRequired[ProtoAutomationSession]",
    "validFrom": "NotRequired[str]",
    "validUntil": "NotRequired[str]",
    "createdInConversationId": "NotRequired[str]",
})

ProtoListAutomationsResponse = TypedDict("ProtoListAutomationsResponse", {
    "items": "NotRequired[list[ProtoAutomationRule]]",
    "nextCursor": "NotRequired[str]",
})

ProtoAutomationPatch = TypedDict("ProtoAutomationPatch", {
    "name": "NotRequired[str]",
    "prompt": "NotRequired[str]",
    "target": "NotRequired[ProtoAutomationTarget]",
    "schedule": "NotRequired[ProtoAutomationSchedule]",
    "session": "NotRequired[ProtoAutomationSession]",
    "validFrom": "NotRequired[str]",
    "validUntil": "NotRequired[str]",
    "clearValidFrom": "NotRequired[bool]",
    "clearValidUntil": "NotRequired[bool]",
})

ProtoAutomationRun = TypedDict("ProtoAutomationRun", {
    "id": "NotRequired[str]",
    "automationId": "NotRequired[str]",
    "triggerType": "NotRequired[str]",
    "scheduledAt": "NotRequired[str]",
    "createdAt": "NotRequired[str]",
    "status": "NotRequired[str]",
    "target": "NotRequired[ProtoAutomationTarget]",
    "session": "NotRequired[ProtoAutomationSession]",
    "conversationId": "NotRequired[str]",
    "wakeMessageId": "NotRequired[str]",
    "sourceRunId": "NotRequired[str]",
    "rerunSessionMode": "NotRequired[str]",
    "reasonCode": "NotRequired[str]",
    "dispatchedAt": "NotRequired[str]",
})

ProtoAutomationRunInput = TypedDict("ProtoAutomationRunInput", {
    "sourceRunId": "NotRequired[str]",
    "rerunSessionMode": "NotRequired[str]",
})

ProtoListAutomationRunsResponse = TypedDict("ProtoListAutomationRunsResponse", {
    "items": "NotRequired[list[ProtoAutomationRun]]",
    "nextCursor": "NotRequired[str]",
})

ProtoAutomationWebhookInput = TypedDict("ProtoAutomationWebhookInput", {
    "name": "NotRequired[str]",
    "prompt": "NotRequired[str]",
    "target": "NotRequired[ProtoAutomationTarget]",
    "session": "NotRequired[ProtoAutomationSession]",
    "validFrom": "NotRequired[str]",
    "validUntil": "NotRequired[str]",
    "createdInConversationId": "NotRequired[str]",
    "source": "NotRequired[str]",
    "events": "NotRequired[list[str]]",
    "repoOwner": "NotRequired[str]",
    "repoName": "NotRequired[str]",
    "eventFilter": "NotRequired[str]",
    "mailbox": "NotRequired[str]",
})

RuntimeMethodResponse = TypedDict("RuntimeMethodResponse", {
    "jsonrpc": "Required[Literal[\"2.0\"]]",
    "id": "Required[str | int | None]",
    "result": "NotRequired[JSONValue]",
    "error": "NotRequired[RuntimeMethodResponseError]",
})

CanvasShare = TypedDict("CanvasShare", {
    "id": "Required[str]",
    "canvasId": "Required[str]",
    "slug": "Required[str]",
    "mode": "Required[str]",
    "allowInteraction": "Required[bool]",
    "expiresAt": "NotRequired[str]",
    "createdAt": "Required[str]",
})

CanvasSnapshot = TypedDict("CanvasSnapshot", {
    "id": "Required[str]",
    "canvasId": "Required[str]",
    "componentsSnapshot": "NotRequired[str]",
    "actorType": "Required[str]",
    "actorId": "Required[str]",
    "description": "NotRequired[str]",
    "version": "Required[int]",
    "createdAt": "Required[str]",
})

A2AAgentCard = TypedDict("A2AAgentCard", {
    "name": "Required[str]",
    "description": "Required[str]",
    "url": "NotRequired[str]",
    "version": "Required[str]",
    "protocolVersion": "NotRequired[str]",
    "defaultInputModes": "Required[list[str]]",
    "defaultOutputModes": "Required[list[str]]",
    "supportedInterfaces": "NotRequired[list[A2AAgentCardSupportedInterfacesItem]]",
})

A2AOutputPart: TypeAlias = "A2ATextPartOut | A2AFilePartOut | A2ADataPartOut"

RealtimeTicketHeader = TypedDict("RealtimeTicketHeader", {
    "alg": "Required[str]",
    "typ": "Required[str]",
    "kid": "Required[str]",
})

TerminalTicketClaims = TypedDict("TerminalTicketClaims", {
    "iss": "Required[str]",
    "aud": "Required[str]",
    "sub": "Required[str]",
    "jti": "Required[str]",
    "instance_id": "Required[str]",
    "platform_agent_id": "Required[str]",
    "client_id": "Required[str]",
    "conversation_id": "NotRequired[str]",
    "resume_terminal_id": "NotRequired[str]",
    "iat": "Required[int]",
    "exp": "Required[int]",
})

CanvasTicketClaims = TypedDict("CanvasTicketClaims", {
    "iss": "Required[str]",
    "sub": "Required[str]",
    "jti": "Required[str]",
    "purpose": "Required[str]",
    "instance_id": "Required[str]",
    "platform_agent_id": "Required[str]",
    "client_id": "Required[str]",
    "conversation_id": "Required[str]",
    "canvas_id": "Required[str]",
    "role": "Required[str]",
    "session_id": "Required[str]",
    "aud": "Required[list[str]]",
    "iat": "Required[int]",
    "exp": "Required[int]",
})

TerminalSessionDocument = TypedDict("TerminalSessionDocument", {
    "transport": "Required[str]",
    "protocolVersion": "Required[int]",
    "header": "Required[RealtimeTicketHeader]",
    "websocketUrl": "Required[str]",
    "ticket": "Required[str]",
    "issuedAt": "Required[str]",
    "expiresAt": "Required[str]",
    "claims": "Required[TerminalTicketClaims]",
})

CanvasSessionDocument = TypedDict("CanvasSessionDocument", {
    "transport": "Required[str]",
    "protocolVersion": "Required[int]",
    "header": "Required[RealtimeTicketHeader]",
    "relayUrl": "Required[str]",
    "ticket": "Required[str]",
    "issuedAt": "Required[str]",
    "expiresAt": "Required[str]",
    "claims": "Required[CanvasTicketClaims]",
})

DeviceBindingErrorResponse = TypedDict("DeviceBindingErrorResponse", {
    "error": "Required[str]",
    "message": "Required[str]",
})

UHPHarnessCreate = TypedDict("UHPHarnessCreate", {
    "name": "NotRequired[str]",
    "base": "Required[str]",
    "default_model": "NotRequired[str]",
    "system_prompt": "NotRequired[str]",
    "mcp_servers": "NotRequired[list[UHPMcpServer]]",
    "skills": "NotRequired[list[UHPSkill]]",
    "plugins": "NotRequired[list[UHPPlugin]]",
    "environment": "NotRequired[str]",
    "disabled_tools": "NotRequired[list[str]]",
    "max_step": "NotRequired[int | None]",
    "timeout_seconds": "NotRequired[int | None]",
    "instance_id": "NotRequired[str]",
    "template_id": "NotRequired[str]",
})

UHPCreateResponseJSONRequest = TypedDict("UHPCreateResponseJSONRequest", {
    "input": "Required[str | list[dict[str, JSONValue]]]",
    "model": "NotRequired[str]",
    "metadata": "NotRequired[UHPCreateResponseJSONRequestMetadata | UHPCreateResponseJSONRequestMetadataOpen]",
    "stream": "NotRequired[Literal[False]]",
    "previous_response_id": "NotRequired[str | None]",
    "instructions": "NotRequired[str]",
    "store": "NotRequired[bool]",
    "max_output_tokens": "NotRequired[int | None]",
    "max_step": "NotRequired[int | None]",
    "timeout_seconds": "NotRequired[int | None]",
    "tools": "NotRequired[list[dict[str, JSONValue]]]",
    "include": "NotRequired[list[str]]",
    "background": "NotRequired[bool]",
})

CreateClientSessionOptions = TypedDict("CreateClientSessionOptions", {
    "Idempotency-Key": "Required[str]",
})

RefreshClientSessionRequest = TypedDict("RefreshClientSessionRequest", {
    "requested_capabilities": "NotRequired[list[str]]",
    "ttl_seconds": "NotRequired[int]",
})

RefreshClientSessionOptions = TypedDict("RefreshClientSessionOptions", {
    "Idempotency-Key": "Required[str]",
})

RevokeClientSessionOptions = TypedDict("RevokeClientSessionOptions", {
    "Idempotency-Key": "Required[str]",
})

DeleteExternalUserOptions = TypedDict("DeleteExternalUserOptions", {
    "Idempotency-Key": "Required[str]",
})

ListProvidersOptions = TypedDict("ListProvidersOptions", {
    "capability": "NotRequired[str]",
})

ListDeployRegionsOptions = TypedDict("ListDeployRegionsOptions", {
    "provider_id": "NotRequired[str]",
    "available": "NotRequired[bool]",
})

ListDeployModelsOptions = TypedDict("ListDeployModelsOptions", {
    "agent_framework": "NotRequired[str]",
    "search": "NotRequired[str]",
})

ListInstanceTemplatesOptions = TypedDict("ListInstanceTemplatesOptions", {
    "page": "NotRequired[int]",
    "page_size": "NotRequired[int]",
    "agent_framework": "NotRequired[str]",
    "provider_id": "NotRequired[str]",
    "search": "NotRequired[str]",
})

ListAgentTemplatesResponse = TypedDict("ListAgentTemplatesResponse", {
    "data": "Required[list[agentTemplateCatalogView]]",
    "total": "Required[int]",
})

ListAgentTemplatesOptions = TypedDict("ListAgentTemplatesOptions", {
    "category": "NotRequired[str]",
    "search": "NotRequired[str]",
    "page": "NotRequired[int]",
    "page_size": "NotRequired[int]",
})

ListInstancesOptions = TypedDict("ListInstancesOptions", {
    "page": "NotRequired[int]",
    "page_size": "NotRequired[int]",
    "status": "NotRequired[str]",
    "provider_id": "NotRequired[str]",
    "agent_framework": "NotRequired[str]",
    "cluster_id": "NotRequired[str]",
    "search": "NotRequired[str]",
})

InstanceCreateOptions = TypedDict("InstanceCreateOptions", {
    "Idempotency-Key": "Required[str]",
})

UpdateInstanceMetadataResponse = TypedDict("UpdateInstanceMetadataResponse", {
    "data": "Required[RuntimeInstanceSummary]",
})

UpdateInstanceMetadataOptions = TypedDict("UpdateInstanceMetadataOptions", {
    "If-Match": "Required[str]",
})

DeleteInstanceOptions = TypedDict("DeleteInstanceOptions", {
    "Idempotency-Key": "Required[str]",
    "If-Match": "Required[str]",
})

StartInstanceOptions = TypedDict("StartInstanceOptions", {
    "Idempotency-Key": "Required[str]",
    "If-Match": "Required[str]",
})

StopInstanceOptions = TypedDict("StopInstanceOptions", {
    "Idempotency-Key": "Required[str]",
    "If-Match": "Required[str]",
})

UpgradeInstanceRequest = TypedDict("UpgradeInstanceRequest", {
    "image_id": "NotRequired[str]",
    "image_ref": "NotRequired[str]",
    "target_version": "NotRequired[str]",
})

UpgradeInstanceOptions = TypedDict("UpgradeInstanceOptions", {
    "Idempotency-Key": "Required[str]",
})

ListAgentsOptions = TypedDict("ListAgentsOptions", {
    "instance_id": "NotRequired[str]",
    "status": "NotRequired[str]",
    "visibility": "NotRequired[str]",
    "search": "NotRequired[str]",
    "page": "NotRequired[int]",
    "page_size": "NotRequired[int]",
})

UpdateAgentOptions = TypedDict("UpdateAgentOptions", {
    "If-Match": "Required[str]",
})

CreateAgentConversationOptions = TypedDict("CreateAgentConversationOptions", {
    "Idempotency-Key": "Required[str]",
})

ListAgentConversationsOptions = TypedDict("ListAgentConversationsOptions", {
    "cursor": "NotRequired[str]",
    "limit": "NotRequired[int]",
    "state": "NotRequired[Literal[\"open\", \"closed\", \"all\"]]",
})

UpdateConversationOptions = TypedDict("UpdateConversationOptions", {
    "If-Match": "Required[str]",
})

DeleteConversationOptions = TypedDict("DeleteConversationOptions", {
    "Idempotency-Key": "Required[str]",
})

ListConversationMessagesOptions = TypedDict("ListConversationMessagesOptions", {
    "cursor": "NotRequired[str]",
    "limit": "NotRequired[int]",
})

CancelConversationOptions = TypedDict("CancelConversationOptions", {
    "Idempotency-Key": "Required[str]",
})

ClearConversationOptions = TypedDict("ClearConversationOptions", {
    "Idempotency-Key": "Required[str]",
})

SetConversationModelOptions = TypedDict("SetConversationModelOptions", {
    "If-Match": "Required[str]",
})

CreateAgentTaskOptions = TypedDict("CreateAgentTaskOptions", {
    "Idempotency-Key": "Required[str]",
})

ListAgentTasksOptions = TypedDict("ListAgentTasksOptions", {
    "cursor": "NotRequired[str]",
    "since": "NotRequired[str]",
    "limit": "NotRequired[int]",
    "state": "NotRequired[Literal[\"all\", \"queued\", \"running\", \"input_required\", \"auth_required\", \"completed\", \"failed\", \"canceled\", \"timeout\", \"rejected\"]]",
})

ListAgentTaskMessagesOptions = TypedDict("ListAgentTaskMessagesOptions", {
    "cursor": "NotRequired[str]",
    "since": "NotRequired[str]",
    "limit": "NotRequired[int]",
})

CancelAgentTaskOptions = TypedDict("CancelAgentTaskOptions", {
    "Idempotency-Key": "Required[str]",
})

ContinueAgentTaskOptions = TypedDict("ContinueAgentTaskOptions", {
    "Idempotency-Key": "Required[str]",
})

InvokeAgentOptions = TypedDict("InvokeAgentOptions", {
    "Idempotency-Key": "Required[str]",
})

GetUsageSummaryOptions = TypedDict("GetUsageSummaryOptions", {
    "period": "NotRequired[Literal[\"day\", \"week\", \"month\"]]",
    "external_user_id": "NotRequired[str]",
    "category": "NotRequired[str]",
})

CreateTerminalSessionRequest = TypedDict("CreateTerminalSessionRequest", {
    "platformAgentId": "Required[str]",
    "conversationId": "NotRequired[str]",
    "resumeTerminalId": "NotRequired[str]",
})

CreateCanvasSessionRequest = TypedDict("CreateCanvasSessionRequest", {
    "platformAgentId": "Required[str]",
    "conversationId": "Required[str]",
    "canvasId": "NotRequired[str]",
})

ExecInstanceRequest = TypedDict("ExecInstanceRequest", {
    "argv": "Required[list[str]]",
    "timeout_seconds": "NotRequired[int]",
})

PresignFileUploadOptions = TypedDict("PresignFileUploadOptions", {
    "Idempotency-Key": "Required[str]",
})

ConfirmFileUploadOptions = TypedDict("ConfirmFileUploadOptions", {
    "Idempotency-Key": "Required[str]",
})

ListFilesOptions = TypedDict("ListFilesOptions", {
    "content_type": "NotRequired[str]",
    "since": "NotRequired[str]",
    "status": "NotRequired[str]",
    "file_type": "NotRequired[str]",
    "category": "NotRequired[str]",
    "source": "NotRequired[str]",
    "q": "NotRequired[str]",
    "instance_id": "NotRequired[str]",
    "agent_id": "NotRequired[str]",
    "sort": "NotRequired[str]",
    "sort_dir": "NotRequired[str]",
    "limit": "NotRequired[int]",
    "offset": "NotRequired[int]",
})

RenameFileRequest = TypedDict("RenameFileRequest", {
    "title": "Required[str]",
})

DeleteFileOptions = TypedDict("DeleteFileOptions", {
    "Idempotency-Key": "Required[str]",
})

CreateShareFileShareOptions = TypedDict("CreateShareFileShareOptions", {
    "Idempotency-Key": "Required[str]",
})

ResolveFileShareResponse = TypedDict("ResolveFileShareResponse", {
    "file_id": "Required[str]",
    "slug": "Required[str]",
    "filename": "Required[str]",
    "content_type": "Required[str]",
    "size_bytes": "Required[int]",
    "download": "Required[FileTransferDescriptor]",
})

CreateShareReplyResponse = TypedDict("CreateShareReplyResponse", {
    "data": "Required[CreateShareReplyResponseData]",
})

GetShareReplyResponse = TypedDict("GetShareReplyResponse", {
    "data": "Required[GetShareReplyResponseData]",
})

GetInstanceConnectURLOptions = TypedDict("GetInstanceConnectURLOptions", {
    "service": "NotRequired[str]",
    "client_id": "NotRequired[str]",
    "role": "NotRequired[str]",
    "generation": "NotRequired[str]",
})

GetInstanceStreamURLResponse = TypedDict("GetInstanceStreamURLResponse", {
    "data": "Required[JSONValue]",
})

GetInstanceStreamURLOptions = TypedDict("GetInstanceStreamURLOptions", {
    "viewportWidth": "NotRequired[int]",
    "viewportHeight": "NotRequired[int]",
    "dpr": "NotRequired[float]",
})

ResumeConversationResponse = TypedDict("ResumeConversationResponse", {
    "data": "Required[ResumeConversationResponseData]",
})

ResumeConversationOptions = TypedDict("ResumeConversationOptions", {
    "Idempotency-Key": "Required[str]",
})

CreateAutomationResponse = TypedDict("CreateAutomationResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoAutomationRule]",
})

ListAutomationsResponse = TypedDict("ListAutomationsResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoListAutomationsResponse]",
})

ListAutomationsOptions = TypedDict("ListAutomationsOptions", {
    "status": "NotRequired[str]",
    "cursor": "NotRequired[str]",
    "limit": "NotRequired[int]",
})

GetAutomationResponse = TypedDict("GetAutomationResponse", {
    "success": "Required[bool]",
    "data": "Required[JSONValue]",
})

UpdateAutomationResponse = TypedDict("UpdateAutomationResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoAutomationRule]",
})

PauseAutomationResponse = TypedDict("PauseAutomationResponse", {
    "success": "Required[bool]",
    "data": "Required[JSONValue]",
})

ResumeAutomationResponse = TypedDict("ResumeAutomationResponse", {
    "success": "Required[bool]",
    "data": "Required[JSONValue]",
})

CreateAutomationRunResponse = TypedDict("CreateAutomationRunResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoAutomationRun]",
})

CreateAutomationRunOptions = TypedDict("CreateAutomationRunOptions", {
    "Idempotency-Key": "Required[str]",
})

ListAutomationRunsResponse = TypedDict("ListAutomationRunsResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoListAutomationRunsResponse]",
})

ListAutomationRunsOptions = TypedDict("ListAutomationRunsOptions", {
    "status": "NotRequired[str]",
    "cursor": "NotRequired[str]",
    "limit": "NotRequired[int]",
})

GetAutomationRunResponse = TypedDict("GetAutomationRunResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoAutomationRun]",
})

CreateWebhookAutomationResponse = TypedDict("CreateWebhookAutomationResponse", {
    "success": "Required[bool]",
    "data": "Required[ProtoAutomationRule]",
})

TranscribeAudioRequest = TypedDict("TranscribeAudioRequest", {
    "file": "Required[bytes]",
})

TranscribeAudioResponse = TypedDict("TranscribeAudioResponse", {
    "success": "Required[bool]",
    "data": "Required[TranscribeAudioResponseData]",
})

GetShareCanvasResponse = TypedDict("GetShareCanvasResponse", {
    "success": "Required[bool]",
    "data": "Required[CanvasShare | None]",
})

GetShareCanvasOptions = TypedDict("GetShareCanvasOptions", {
    "X-BeeOS-Conversation-ID": "Required[str]",
    "X-BeeOS-Platform-Agent-ID": "Required[str]",
})

CreateShareCanvasRequest = TypedDict("CreateShareCanvasRequest", {
    "mode": "Required[str]",
    "password": "NotRequired[str]",
    "allowInteraction": "NotRequired[bool]",
})

CreateShareCanvasResponse = TypedDict("CreateShareCanvasResponse", {
    "success": "Required[bool]",
    "data": "Required[CanvasShare | None]",
})

CreateShareCanvasOptions = TypedDict("CreateShareCanvasOptions", {
    "X-BeeOS-Conversation-ID": "Required[str]",
    "X-BeeOS-Platform-Agent-ID": "Required[str]",
})

DeleteShareCanvasOptions = TypedDict("DeleteShareCanvasOptions", {
    "X-BeeOS-Conversation-ID": "Required[str]",
    "X-BeeOS-Platform-Agent-ID": "Required[str]",
})

ListCanvasSnapshotsResponse = TypedDict("ListCanvasSnapshotsResponse", {
    "success": "Required[bool]",
    "data": "Required[list[CanvasSnapshot]]",
})

ListCanvasSnapshotsOptions = TypedDict("ListCanvasSnapshotsOptions", {
    "X-BeeOS-Conversation-ID": "Required[str]",
    "X-BeeOS-Platform-Agent-ID": "Required[str]",
})

RestoreCanvasSnapshotResponse = TypedDict("RestoreCanvasSnapshotResponse", {
    "success": "Required[bool]",
    "data": "Required[RestoreCanvasSnapshotResponseData]",
})

RestoreCanvasSnapshotOptions = TypedDict("RestoreCanvasSnapshotOptions", {
    "X-BeeOS-Conversation-ID": "Required[str]",
    "X-BeeOS-Platform-Agent-ID": "Required[str]",
})

GetCanvasSessionResponse = TypedDict("GetCanvasSessionResponse", {
    "success": "Required[bool]",
    "data": "Required[GetCanvasSessionResponseDataVariant1 | None]",
})

GetCanvasSessionOptions = TypedDict("GetCanvasSessionOptions", {
    "X-BeeOS-Conversation-ID": "Required[str]",
    "X-BeeOS-Platform-Agent-ID": "Required[str]",
})

GetAgentBindDetailsResponse = TypedDict("GetAgentBindDetailsResponse", {
    "success": "Required[bool]",
    "data": "Required[agentBindDetailsWire]",
})

ConfirmAgentBindRequest = TypedDict("ConfirmAgentBindRequest", {
    "name": "NotRequired[str]",
    "modelPrimary": "NotRequired[str]",
    "model_primary": "NotRequired[str]",
})

ConfirmAgentBindResponse = TypedDict("ConfirmAgentBindResponse", {
    "success": "Required[bool]",
    "data": "Required[agentBindWire]",
})

CreatePortalBindRequest = TypedDict("CreatePortalBindRequest", {
    "name": "NotRequired[str]",
})

CreatePortalBindResponse = TypedDict("CreatePortalBindResponse", {
    "success": "Required[bool]",
    "data": "Required[portalBindWire]",
})

GetPortalBindResponse = TypedDict("GetPortalBindResponse", {
    "success": "Required[bool]",
    "data": "Required[portalBindWire]",
})

RevokePortalBindResponse = TypedDict("RevokePortalBindResponse", {
    "success": "Required[bool]",
    "data": "Required[portalBindWire]",
})

ResolvePortalBindRequest = TypedDict("ResolvePortalBindRequest", {
    "decision": "Required[Literal[\"recover\", \"create\"]]",
    "instance_id": "NotRequired[str]",
})

ResolvePortalBindResponse = TypedDict("ResolvePortalBindResponse", {
    "success": "Required[bool]",
    "data": "Required[portalBindWire]",
})

InvokeA2ARequest = TypedDict("InvokeA2ARequest", {
    "jsonrpc": "Required[Literal[\"2.0\"]]",
    "id": "NotRequired[str]",
    "method": "Required[str]",
    "params": "NotRequired[JSONValue]",
})

ListA2ATasksResponse = TypedDict("ListA2ATasksResponse", {
    "tasks": "Required[list[a2aTaskView]]",
    "total": "Required[int]",
    "next_cursor": "Required[str]",
    "has_more": "Required[bool]",
})

ListA2ATasksOptions = TypedDict("ListA2ATasksOptions", {
    "direction": "NotRequired[str]",
    "agent_id": "NotRequired[str]",
    "cursor": "NotRequired[str]",
    "limit": "NotRequired[int]",
})

GetA2ATaskOptions = TypedDict("GetA2ATaskOptions", {
    "history_length": "NotRequired[int]",
})

ListHarnessesResponse = TypedDict("ListHarnessesResponse", {
    "harnesses": "Required[list[UHPHarness]]",
})

DeleteHarnessResponse = TypedDict("DeleteHarnessResponse", {
    "id": "Required[str]",
    "deleted": "Required[bool]",
})

CreateResponseOptions = TypedDict("CreateResponseOptions", {
    "Idempotency-Key": "NotRequired[str]",
    "UHP-Version": "NotRequired[str]",
})

DeleteResponseResponse = TypedDict("DeleteResponseResponse", {
    "id": "NotRequired[str]",
    "deleted": "NotRequired[bool]",
})

GetResponseInputItemsResponse = TypedDict("GetResponseInputItemsResponse", {
    "object": "NotRequired[Literal[\"list\"]]",
    "data": "NotRequired[list[dict[str, JSONValue]]]",
})

GetResponseEventsOptions = TypedDict("GetResponseEventsOptions", {
    "Last-Event-ID": "NotRequired[str]",
    "UHP-Version": "NotRequired[str]",
})

ClientSessionInputDeviceAttestation = TypedDict("ClientSessionInputDeviceAttestation", {
    "jkt": "Required[str]",
})

UHPDiscoveryImplementation = TypedDict("UHPDiscoveryImplementation", {
    "name": "NotRequired[str]",
    "version": "NotRequired[str]",
})

UHPPluginManifestAuthor = TypedDict("UHPPluginManifestAuthor", {
    "name": "NotRequired[str]",
    "email": "NotRequired[str]",
    "url": "NotRequired[str]",
})

UHPModelCatalogBackendsValue = TypedDict("UHPModelCatalogBackendsValue", {
    "default": "Required[str]",
    "models": "Required[list[UHPModel]]",
})

UHPCreateResponseRequestMetadata = TypedDict("UHPCreateResponseRequestMetadata", {
    "harness_id": "NotRequired[str]",
    "environment": "NotRequired[str]",
})

UHPResponseMetadata = TypedDict("UHPResponseMetadata", {
    "session_id": "NotRequired[str]",
    "environment": "NotRequired[str]",
    "requested_model": "NotRequired[str]",
    "model_fallback": "NotRequired[bool]",
    "model_fallback_reason": "NotRequired[str]",
    "ignored_fields": "NotRequired[list[str]]",
})

RuntimeInstanceSummaryCapabilities = TypedDict("RuntimeInstanceSummaryCapabilities", {
    "computer": "NotRequired[bool]",
    "mobile": "NotRequired[bool]",
    "device": "NotRequired[bool]",
    "terminal": "NotRequired[bool]",
})

FileSummaryInstancesItem = TypedDict("FileSummaryInstancesItem", {
    "source": "Required[str]",
    "instance_id": "NotRequired[str]",
    "agent_id": "NotRequired[str]",
    "operation_id": "NotRequired[str]",
    "instance_name": "NotRequired[str]",
    "agent_name": "NotRequired[str]",
    "avatar_url": "NotRequired[str]",
    "agent_framework": "NotRequired[str]",
    "destroyed": "NotRequired[bool]",
    "count": "Required[int]",
})

RuntimeInstanceStatusResultData = TypedDict("RuntimeInstanceStatusResultData", {
    "id": "Required[str]",
    "name": "Required[str]",
    "status": "Required[str]",
    "desired_status": "Required[str]",
    "connectivity": "Required[str]",
})

ReplyShareResponseData = TypedDict("ReplyShareResponseData", {
    "slug": "Required[str]",
    "created_at": "Required[str]",
    "agent": "Required[ReplyShareResponseDataAgent]",
    "reply": "Required[ReplyShareResponseDataReply]",
    "sources": "Required[list[ReplyShareResponseDataSourcesItem]]",
    "files": "Required[list[ReplyShareResponseDataFilesItem]]",
})

ConnectURLResponseData = TypedDict("ConnectURLResponseData", {
    "url": "Required[str]",
    "mode": "Required[str]",
    "token": "Required[str]",
    "service": "Required[str]",
    "connectivity": "Required[str]",
    "stream_session_id": "Required[str]",
    "browser": "NotRequired[ConnectURLResponseDataBrowser]",
})

RuntimeMethodResponseError = TypedDict("RuntimeMethodResponseError", {
    "code": "Required[int]",
    "message": "Required[str]",
    "data": "NotRequired[JSONValue]",
})

A2AAgentCardSupportedInterfacesItem = TypedDict("A2AAgentCardSupportedInterfacesItem", {
    "url": "Required[str]",
    "protocolBinding": "Required[str]",
    "protocolVersion": "Required[str]",
})

UHPCreateResponseJSONRequestMetadata = TypedDict("UHPCreateResponseJSONRequestMetadata", {
    "harness_id": "NotRequired[str]",
    "environment": "NotRequired[str]",
})

CreateShareReplyResponseData = TypedDict("CreateShareReplyResponseData", {
    "slug": "Required[str]",
    "created_at": "Required[str]",
})

GetShareReplyResponseData = TypedDict("GetShareReplyResponseData", {
    "slug": "Required[str]",
    "created_at": "Required[str]",
})

ResumeConversationResponseData = TypedDict("ResumeConversationResponseData", {
    "request_id": "Required[str]",
    "status": "Required[str]",
})

TranscribeAudioResponseData = TypedDict("TranscribeAudioResponseData", {
    "text": "Required[str]",
    "duration_seconds": "Required[float]",
})

RestoreCanvasSnapshotResponseData = TypedDict("RestoreCanvasSnapshotResponseData", {
    "snapshotId": "Required[str]",
    "canvasId": "Required[str]",
    "restored": "Required[bool]",
    "version": "Required[int]",
})

GetCanvasSessionResponseDataVariant1 = TypedDict("GetCanvasSessionResponseDataVariant1", {
    "canvasId": "Required[str]",
    "sessionId": "Required[str]",
    "instanceId": "Required[str]",
    "linkedAt": "Required[str]",
    "role": "Required[str]",
})

ReplyShareResponseDataAgent = TypedDict("ReplyShareResponseDataAgent", {
    "name": "Required[str]",
    "avatar_url": "Required[str]",
    "framework": "Required[str]",
})

ReplyShareResponseDataReply = TypedDict("ReplyShareResponseDataReply", {
    "parts": "Required[list[ReplyShareResponseDataReplyPartsItem]]",
    "created_at": "Required[str]",
})

ReplyShareResponseDataSourcesItem = TypedDict("ReplyShareResponseDataSourcesItem", {
    "url": "NotRequired[str]",
    "title": "NotRequired[str]",
})

ReplyShareResponseDataFilesItem = TypedDict("ReplyShareResponseDataFilesItem", {
    "file_id": "NotRequired[str]",
    "filename": "NotRequired[str]",
    "content_type": "NotRequired[str]",
    "size_bytes": "NotRequired[int]",
})

ConnectURLResponseDataBrowser = TypedDict("ConnectURLResponseDataBrowser", {
    "grant_id": "Required[str]",
    "generation": "Required[str]",
    "expires_at": "Required[str]",
    "role": "Required[str]",
})

ReplyShareResponseDataReplyPartsItem = TypedDict("ReplyShareResponseDataReplyPartsItem", {
    "type": "Required[str]",
    "text": "Required[str]",
})

class UHPCreateResponseJSONRequestMetadataOpen(dict[str, JSONValue]):
    def __init__(self, *, harness_id: str | None = None, environment: str | None = None, **extensions: JSONValue) -> None:
        super().__init__(extensions)
        if harness_id is not None:
            self["harness_id"] = harness_id
        if environment is not None:
            self["environment"] = environment


class InvalidResponseBody(TypedDict):
    code: Literal["invalid_response"]
    content_type: str
    body: str
    raw_body: bytes
    reason: str

_ERROR_SCHEMAS: dict[str, dict[str, str]] = {"createClientSession":{"default":"ErrorResponse"},"refreshClientSession":{"default":"ErrorResponse"},"revokeClientSession":{"default":"ErrorResponse"},"deleteExternalUser":{"default":"ErrorResponse"},"getExternalUserDeletion":{"default":"ErrorResponse"},"listProviders":{"default":"ErrorResponse"},"listDeployRegions":{"default":"ErrorResponse"},"listDeployModels":{"default":"ErrorResponse"},"listInstanceTemplates":{"default":"ErrorResponse"},"getInstanceTemplate":{"default":"ErrorResponse"},"listAgentTemplates":{"default":"ErrorResponse"},"listInstances":{"default":"ErrorResponse"},"instanceCreate":{"default":"ErrorResponse"},"getInstance":{"default":"ErrorResponse"},"updateInstanceMetadata":{"default":"ErrorResponse"},"deleteInstance":{"default":"ErrorResponse"},"getInstanceStatus":{"default":"ErrorResponse"},"startInstance":{"default":"ErrorResponse"},"stopInstance":{"default":"ErrorResponse"},"upgradeInstance":{"default":"ErrorResponse"},"getInstanceUpgrade":{"default":"ErrorResponse"},"listAgents":{"default":"ErrorResponse"},"getAgent":{"default":"ErrorResponse"},"updateAgent":{"default":"ErrorResponse"},"createAgentConversation":{"default":"ErrorResponse"},"listAgentConversations":{"default":"ErrorResponse"},"getConversation":{"default":"ErrorResponse"},"updateConversation":{"default":"ErrorResponse"},"deleteConversation":{"default":"ErrorResponse"},"listConversationMessages":{"default":"ErrorResponse"},"getConversationMessage":{"default":"ErrorResponse"},"cancelConversation":{"default":"ErrorResponse"},"clearConversation":{"default":"ErrorResponse"},"setConversationModel":{"default":"ErrorResponse"},"createAgentTask":{"default":"ErrorResponse"},"listAgentTasks":{"default":"ErrorResponse"},"getAgentTask":{"default":"ErrorResponse"},"listAgentTaskMessages":{"default":"ErrorResponse"},"cancelAgentTask":{"default":"ErrorResponse"},"continueAgentTask":{"default":"ErrorResponse"},"invokeAgent":{"default":"ErrorResponse"},"getUsageSummary":{"default":"ErrorResponse"},"createTerminalSession":{"400":"ErrorResponse","401":"ErrorResponse","404":"ErrorResponse","429":"ErrorResponse","5XX":"ErrorResponse","default":"ErrorResponse"},"createCanvasSession":{"400":"ErrorResponse","401":"ErrorResponse","404":"ErrorResponse","429":"ErrorResponse","5XX":"ErrorResponse","default":"ErrorResponse"},"execInstance":{"default":"ErrorResponse"},"presignFileUpload":{"default":"ErrorResponse"},"confirmFileUpload":{"default":"ErrorResponse"},"listFiles":{"default":"ErrorResponse"},"getFile":{"default":"ErrorResponse"},"renameFile":{"default":"ErrorResponse"},"deleteFile":{"default":"ErrorResponse"},"getAgentTemplate":{"default":"ErrorResponse"},"createShareFileShare":{"default":"ErrorResponse"},"getShareFileShare":{"default":"ErrorResponse"},"revokeShareFileShare":{"default":"ErrorResponse"},"resolveFileShare":{"default":"ErrorResponse"},"getFilesSummary":{"default":"ErrorResponse"},"createShareReply":{"default":"ErrorResponse"},"getShareReply":{"default":"ErrorResponse"},"revokeShareReply":{"default":"ErrorResponse"},"resolveReplyShare":{"default":"ErrorResponse"},"getInstanceConnectURL":{"default":"ErrorResponse"},"getInstanceStreamURL":{"default":"ErrorResponse"},"resumeConversation":{"default":"ErrorResponse"},"createAutomation":{"default":"ErrorResponse"},"listAutomations":{"default":"ErrorResponse"},"getAutomation":{"default":"ErrorResponse"},"updateAutomation":{"default":"ErrorResponse"},"deleteAutomation":{"default":"ErrorResponse"},"pauseAutomation":{"default":"ErrorResponse"},"resumeAutomation":{"default":"ErrorResponse"},"createAutomationRun":{"default":"ErrorResponse"},"listAutomationRuns":{"default":"ErrorResponse"},"getAutomationRun":{"default":"ErrorResponse"},"createWebhookAutomation":{"default":"ErrorResponse"},"transcribeAudio":{"default":"ErrorResponse"},"getShareCanvas":{"default":"ErrorResponse"},"createShareCanvas":{"default":"ErrorResponse"},"deleteShareCanvas":{"default":"ErrorResponse"},"listCanvasSnapshots":{"default":"ErrorResponse"},"restoreCanvasSnapshot":{"default":"ErrorResponse"},"getCanvasSession":{"default":"ErrorResponse"},"getAgentBindDetails":{"default":"DeviceBindingErrorResponse"},"confirmAgentBind":{"default":"DeviceBindingErrorResponse"},"createPortalBind":{"default":"DeviceBindingErrorResponse"},"getPortalBind":{"default":"DeviceBindingErrorResponse"},"revokePortalBind":{"default":"DeviceBindingErrorResponse"},"resolvePortalBind":{"default":"DeviceBindingErrorResponse"},"invokeA2A":{"default":"ErrorResponse"},"getA2AAgentCard":{"default":"ErrorResponse"},"getA2AAgentCardLegacy":{"default":"ErrorResponse"},"listA2ATasks":{"default":"ErrorResponse"},"getA2ATask":{"default":"ErrorResponse"},"cancelA2ATask":{"default":"ErrorResponse"},"getDiscovery":{"default":"UHPErrorEnvelope"},"listHarnesses":{"401":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"createHarness":{"422":"UHPErrorEnvelope","502":"UHPErrorEnvelope","503":"UHPErrorEnvelope","504":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"getHarness":{"404":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"updateHarness":{"404":"UHPErrorEnvelope","422":"UHPErrorEnvelope","502":"UHPErrorEnvelope","503":"UHPErrorEnvelope","504":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"deleteHarness":{"404":"UHPErrorEnvelope","422":"UHPErrorEnvelope","502":"UHPErrorEnvelope","503":"UHPErrorEnvelope","504":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"listModels":{"401":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"listHarnessModels":{"404":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"createResponse":{"400":"UHPErrorEnvelope","401":"UHPErrorEnvelope","404":"UHPErrorEnvelope","409":"UHPErrorEnvelope","422":"UHPErrorEnvelope","429":"UHPErrorEnvelope","503":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"getResponse":{"404":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"deleteResponse":{"404":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"getResponseInputItems":{"404":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"cancelResponse":{"404":"UHPErrorEnvelope","default":"UHPErrorEnvelope"},"getResponseEvents":{"default":"UHPErrorEnvelope"}}

def _matches_error_body(schema: str | None, value: JSONValue) -> bool:
    if not isinstance(value, dict):
        return False
    if schema == "UHPErrorEnvelope":
        nested = value.get("error")
        return isinstance(nested, dict) and isinstance(nested.get("code"), str) and nested.get("code") != "" and isinstance(nested.get("message"), str)
    if schema == "DeviceBindingErrorResponse":
        return isinstance(value.get("error"), str) and value.get("error") != "" and isinstance(value.get("message"), str)
    return schema == "ErrorResponse" and isinstance(value.get("code"), str) and value.get("code") != "" and isinstance(value.get("message"), str)

class APIError(Exception):
    def __init__(self, status: int, body: ErrorResponse | DeviceBindingErrorResponse | UHPErrorEnvelope | InvalidResponseBody) -> None:
        self.status = status
        self.body = body
        super().__init__(f"BeeOS API returned HTTP {status}")

class BeeOSClient:
    def __init__(self, base_url: str, api_key: str | Callable[[], str], *, external_user_id: str | None = None, timeout: float = 30.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.external_user_id = external_user_id
        self.timeout = timeout
        self.identity = IdentityResource(self)
        self.catalog = CatalogResource(self)
        self.instances = InstancesResource(self)
        self.agents = AgentsResource(self)
        self.conversations = ConversationsResource(self)
        self.messages = MessagesResource(self)
        self.tasks = TasksResource(self)
        self.usage = UsageResource(self)
        self.files = FilesResource(self)
        self.automations = AutomationsResource(self)
        self.audio = AudioResource(self)
        self.canvases = CanvasesResource(self)
        self.device_bindings = DeviceBindingsResource(self)
        self.a2a = A2aResource(self)
        self.harnesses = HarnessesResource(self)
        self.responses = ResponsesResource(self)

    def with_external_user(self, external_user_id: str) -> BeeOSClient:
        return BeeOSClient(self.base_url, self.api_key, external_user_id=external_user_id, timeout=self.timeout)

    def _request(self, operation: str, method: str, path: str, base_path: str, query: dict[str, str], headers: dict[str, str], body: bytes | None, content_type: str) -> bytes:
        base = self.base_url
        if base_path:
            parts = urlsplit(base)
            base = urlunsplit((parts.scheme, parts.netloc, base_path, "", ""))
        target = base + path
        if query:
            target += "?" + urlencode(query)
        key = self.api_key() if callable(self.api_key) else self.api_key
        headers["Authorization"] = "Bearer " + key
        if self.external_user_id is not None:
            headers["X-BeeOS-External-User-ID"] = self.external_user_id
        if content_type:
            headers["Content-Type"] = content_type
        request = URLRequest(target, data=body, headers=headers, method=method)
        with self._open(request, operation) as response:
            return response.read()

    def _open(self, request: URLRequest, operation: str) -> HTTPResponse:
        try:
            return cast(HTTPResponse, urlopen(request, timeout=self.timeout))
        except HTTPError as error:
            with error:
                payload = error.read()
                content_type = error.headers.get("Content-Type", "")
                media_type = content_type.split(";", 1)[0].strip().lower()
                invalid = InvalidResponseBody(code="invalid_response", content_type=content_type, body=payload.decode("utf-8", errors="replace"), raw_body=payload, reason="non_json_error")
                body: ErrorResponse | DeviceBindingErrorResponse | UHPErrorEnvelope | InvalidResponseBody = invalid
                if media_type == "application/json" or media_type.endswith("+json"):
                    try:
                        candidate = cast(JSONValue, json.loads(payload))
                    except (json.JSONDecodeError, UnicodeDecodeError):
                        invalid["reason"] = "invalid_json_error"
                    else:
                        schemas = _ERROR_SCHEMAS[operation]
                        schema = schemas.get(str(error.code), schemas.get(f"{error.code // 100}XX", schemas.get("default")))
                        if _matches_error_body(schema, candidate):
                            body = cast("ErrorResponse | DeviceBindingErrorResponse | UHPErrorEnvelope | InvalidResponseBody", candidate)
                        else:
                            invalid["reason"] = "invalid_error_shape"
            raise APIError(error.code, body) from error

    @staticmethod
    def _multipart(file: bytes) -> tuple[bytes, str]:
        boundary = uuid4().hex
        prefix = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio"\r\nContent-Type: application/octet-stream\r\n\r\n').encode()
        suffix = f"\r\n--{boundary}--\r\n".encode()
        return prefix + file + suffix, f"multipart/form-data; boundary={boundary}"

    def _stream(self, operation: str, method: str, path: str, base_path: str, query: dict[str, str], headers: dict[str, str], body: bytes | None, content_type: str) -> Iterator[JSONValue]:
        parts = urlsplit(self.base_url)
        target = urlunsplit((parts.scheme, parts.netloc, (base_path or parts.path.rstrip("/")) + path, urlencode(query), ""))
        key = self.api_key() if callable(self.api_key) else self.api_key
        headers["Authorization"] = "Bearer " + key
        if content_type:
            headers["Content-Type"] = content_type
        if self.external_user_id is not None:
            headers["X-BeeOS-External-User-ID"] = self.external_user_id
        request = URLRequest(target, data=body, headers=headers, method=method)
        with self._open(request, operation) as response:
            data: list[str] = []
            for raw in response:
                line = raw.decode().rstrip("\r\n")
                if line == "":
                    if data:
                        yield cast(JSONValue, json.loads("\n".join(data)))
                        data = []
                elif line.startswith("data:"):
                    data.append(line[5:].removeprefix(" "))
            if data:
                yield cast(JSONValue, json.loads("\n".join(data)))

class IdentityResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def create_client_session(self, input: ClientSessionInput, options: CreateClientSessionOptions) -> ClientSessionResponse:
        path = f"/client-sessions"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("createClientSession", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("ClientSessionResponse", json.loads(payload))

    def refresh_client_session(self, session_id: str, input: RefreshClientSessionRequest | None = None, *, options: RefreshClientSessionOptions) -> ClientSessionResponse:
        path = f"/client-sessions/{quote(str(session_id), safe='')}/refresh"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("refreshClientSession", "POST", path, "", query, headers, json.dumps(input).encode() if input is not None else None, "application/json")
        return cast("ClientSessionResponse", json.loads(payload))

    def revoke_client_session(self, session_id: str, options: RevokeClientSessionOptions) -> None:
        path = f"/client-sessions/{quote(str(session_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("revokeClientSession", "DELETE", path, "", query, headers, None, "")
        return None

    def delete_external_user(self, external_user_id: ExternalUserID, options: DeleteExternalUserOptions) -> DeletionAccepted:
        path = f"/external-users/{quote(str(external_user_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("deleteExternalUser", "DELETE", path, "", query, headers, None, "")
        return cast("DeletionAccepted", json.loads(payload))

    def get_external_user_deletion(self, external_user_id: ExternalUserID, deletion_id: str) -> Deletion:
        path = f"/external-users/{quote(str(external_user_id), safe='')}/deletions/{quote(str(deletion_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getExternalUserDeletion", "GET", path, "", query, headers, None, "")
        return cast("Deletion", json.loads(payload))


class CatalogResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def list_providers(self, options: ListProvidersOptions | None = None) -> ProviderPage:
        path = f"/providers"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "capability" in opts:
            query["capability"] = str(opts["capability"])
        payload = self._client._request("listProviders", "GET", path, "", query, headers, None, "")
        return cast("ProviderPage", json.loads(payload))

    def list_regions(self, options: ListDeployRegionsOptions | None = None) -> RegionPage:
        path = f"/deploy/regions"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "provider_id" in opts:
            query["provider_id"] = str(opts["provider_id"])
        if "available" in opts:
            query["available"] = str(opts["available"]).lower()
        payload = self._client._request("listDeployRegions", "GET", path, "", query, headers, None, "")
        return cast("RegionPage", json.loads(payload))

    def list_models(self, options: ListDeployModelsOptions | None = None) -> ModelPage:
        path = f"/deploy/models"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "agent_framework" in opts:
            query["agent_framework"] = str(opts["agent_framework"])
        if "search" in opts:
            query["search"] = str(opts["search"])
        payload = self._client._request("listDeployModels", "GET", path, "", query, headers, None, "")
        return cast("ModelPage", json.loads(payload))

    def list_instance_templates(self, options: ListInstanceTemplatesOptions | None = None) -> InstanceTemplatePage:
        path = f"/instance-templates"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "page" in opts:
            query["page"] = str(opts["page"])
        if "page_size" in opts:
            query["page_size"] = str(opts["page_size"])
        if "agent_framework" in opts:
            query["agent_framework"] = str(opts["agent_framework"])
        if "provider_id" in opts:
            query["provider_id"] = str(opts["provider_id"])
        if "search" in opts:
            query["search"] = str(opts["search"])
        payload = self._client._request("listInstanceTemplates", "GET", path, "", query, headers, None, "")
        return cast("InstanceTemplatePage", json.loads(payload))

    def get_instance_template(self, template_id: str) -> InstanceTemplate:
        path = f"/instance-templates/{quote(str(template_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getInstanceTemplate", "GET", path, "", query, headers, None, "")
        return cast("InstanceTemplate", json.loads(payload))

    def list_agent_templates(self, options: ListAgentTemplatesOptions | None = None) -> ListAgentTemplatesResponse:
        path = f"/agent-templates"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "category" in opts:
            query["category"] = str(opts["category"])
        if "search" in opts:
            query["search"] = str(opts["search"])
        if "page" in opts:
            query["page"] = str(opts["page"])
        if "page_size" in opts:
            query["page_size"] = str(opts["page_size"])
        payload = self._client._request("listAgentTemplates", "GET", path, "", query, headers, None, "")
        return cast("ListAgentTemplatesResponse", json.loads(payload))

    def get_agent_template(self, id: str) -> agentTemplateCatalogView:
        path = f"/agent-templates/{quote(str(id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getAgentTemplate", "GET", path, "", query, headers, None, "")
        return cast("agentTemplateCatalogView", json.loads(payload))

    def get_discovery(self) -> UHPDiscovery:
        path = f"/uhp"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getDiscovery", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("UHPDiscovery", json.loads(payload))


class InstancesResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def list(self, options: ListInstancesOptions | None = None) -> InstancePage:
        path = f"/instances"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "page" in opts:
            query["page"] = str(opts["page"])
        if "page_size" in opts:
            query["page_size"] = str(opts["page_size"])
        if "status" in opts:
            query["status"] = str(opts["status"])
        if "provider_id" in opts:
            query["provider_id"] = str(opts["provider_id"])
        if "agent_framework" in opts:
            query["agent_framework"] = str(opts["agent_framework"])
        if "cluster_id" in opts:
            query["cluster_id"] = str(opts["cluster_id"])
        if "search" in opts:
            query["search"] = str(opts["search"])
        payload = self._client._request("listInstances", "GET", path, "", query, headers, None, "")
        return cast("InstancePage", json.loads(payload))

    def create(self, input: CreateServerInstanceInput, options: InstanceCreateOptions) -> RuntimeInstanceResult:
        path = f"/instances"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("instanceCreate", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("RuntimeInstanceResult", json.loads(payload))

    def get(self, instance_id: str) -> RuntimeInstanceResult:
        path = f"/instances/{quote(str(instance_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getInstance", "GET", path, "", query, headers, None, "")
        return cast("RuntimeInstanceResult", json.loads(payload))

    def update(self, instance_id: str, input: UpdateServerInstanceInput, options: UpdateInstanceMetadataOptions) -> UpdateInstanceMetadataResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("updateInstanceMetadata", "PATCH", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("UpdateInstanceMetadataResponse", json.loads(payload))

    def delete(self, instance_id: str, options: DeleteInstanceOptions) -> RuntimeInstanceResult:
        path = f"/instances/{quote(str(instance_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("deleteInstance", "DELETE", path, "", query, headers, None, "")
        return cast("RuntimeInstanceResult", json.loads(payload))

    def get_status(self, instance_id: str) -> RuntimeInstanceStatusResult:
        path = f"/instances/{quote(str(instance_id), safe='')}/status"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getInstanceStatus", "GET", path, "", query, headers, None, "")
        return cast("RuntimeInstanceStatusResult", json.loads(payload))

    def start(self, instance_id: str, options: StartInstanceOptions) -> RuntimeInstanceResult:
        path = f"/instances/{quote(str(instance_id), safe='')}/start"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("startInstance", "POST", path, "", query, headers, None, "")
        return cast("RuntimeInstanceResult", json.loads(payload))

    def stop(self, instance_id: str, options: StopInstanceOptions) -> RuntimeInstanceResult:
        path = f"/instances/{quote(str(instance_id), safe='')}/stop"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("stopInstance", "POST", path, "", query, headers, None, "")
        return cast("RuntimeInstanceResult", json.loads(payload))

    def upgrade(self, instance_id: str, input: UpgradeInstanceRequest, options: UpgradeInstanceOptions) -> RuntimeUpgradeJob:
        path = f"/instances/{quote(str(instance_id), safe='')}/upgrade"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("upgradeInstance", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("RuntimeUpgradeJob", json.loads(payload))

    def get_upgrade(self, instance_id: str, job_id: str) -> RuntimeUpgradeJob:
        path = f"/instances/{quote(str(instance_id), safe='')}/upgrades/{quote(str(job_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getInstanceUpgrade", "GET", path, "", query, headers, None, "")
        return cast("RuntimeUpgradeJob", json.loads(payload))

    def create_terminal_session(self, instance_id: str, input: CreateTerminalSessionRequest) -> TerminalSessionDocument:
        path = f"/instances/{quote(str(instance_id), safe='')}/terminal-sessions"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createTerminalSession", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("TerminalSessionDocument", json.loads(payload))

    def create_canvas_session(self, instance_id: str, input: CreateCanvasSessionRequest) -> CanvasSessionDocument:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvas-sessions"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createCanvasSession", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CanvasSessionDocument", json.loads(payload))

    def exec(self, instance_id: str, input: ExecInstanceRequest) -> RuntimeExecResult:
        path = f"/instances/{quote(str(instance_id), safe='')}/exec"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("execInstance", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("RuntimeExecResult", json.loads(payload))

    def get_connect_url(self, instance_id: str, options: GetInstanceConnectURLOptions | None = None) -> ConnectURLResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/connect-url"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "service" in opts:
            query["service"] = str(opts["service"])
        if "client_id" in opts:
            query["client_id"] = str(opts["client_id"])
        if "role" in opts:
            query["role"] = str(opts["role"])
        if "generation" in opts:
            query["generation"] = str(opts["generation"])
        payload = self._client._request("getInstanceConnectURL", "GET", path, "", query, headers, None, "")
        return cast("ConnectURLResponse", json.loads(payload))

    def get_stream_url(self, instance_id: str, options: GetInstanceStreamURLOptions | None = None) -> GetInstanceStreamURLResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/stream-url"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "viewportWidth" in opts:
            query["viewportWidth"] = str(opts["viewportWidth"])
        if "viewportHeight" in opts:
            query["viewportHeight"] = str(opts["viewportHeight"])
        if "dpr" in opts:
            query["dpr"] = str(opts["dpr"])
        payload = self._client._request("getInstanceStreamURL", "GET", path, "", query, headers, None, "")
        return cast("GetInstanceStreamURLResponse", json.loads(payload))


class AgentsResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def list(self, options: ListAgentsOptions | None = None) -> AgentPage:
        path = f"/agents"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "instance_id" in opts:
            query["instance_id"] = str(opts["instance_id"])
        if "status" in opts:
            query["status"] = str(opts["status"])
        if "visibility" in opts:
            query["visibility"] = str(opts["visibility"])
        if "search" in opts:
            query["search"] = str(opts["search"])
        if "page" in opts:
            query["page"] = str(opts["page"])
        if "page_size" in opts:
            query["page_size"] = str(opts["page_size"])
        payload = self._client._request("listAgents", "GET", path, "", query, headers, None, "")
        return cast("AgentPage", json.loads(payload))

    def get(self, agent_id: str) -> AgentResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getAgent", "GET", path, "", query, headers, None, "")
        return cast("AgentResponse", json.loads(payload))

    def update(self, agent_id: str, input: AgentPatch, options: UpdateAgentOptions) -> AgentResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("updateAgent", "PATCH", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("AgentResponse", json.loads(payload))

    def invoke(self, agent_id: str, input: AgentInvokeInput, options: InvokeAgentOptions) -> AgentInvokeResult:
        path = f"/agents/{quote(str(agent_id), safe='')}/invoke"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("invokeAgent", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("AgentInvokeResult", json.loads(payload))


class ConversationsResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def create(self, agent_id: str, input: CreateConversationInput, options: CreateAgentConversationOptions) -> ConversationResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("createAgentConversation", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("ConversationResponse", json.loads(payload))

    def list(self, agent_id: str, options: ListAgentConversationsOptions | None = None) -> ConversationPage:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        if "state" in opts:
            query["state"] = str(opts["state"])
        payload = self._client._request("listAgentConversations", "GET", path, "", query, headers, None, "")
        return cast("ConversationPage", json.loads(payload))

    def get(self, agent_id: str, conversation_id: str) -> ConversationResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getConversation", "GET", path, "", query, headers, None, "")
        return cast("ConversationResponse", json.loads(payload))

    def update(self, agent_id: str, conversation_id: str, input: UpdateConversationInput, options: UpdateConversationOptions) -> ConversationResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("updateConversation", "PATCH", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("ConversationResponse", json.loads(payload))

    def delete(self, agent_id: str, conversation_id: str, options: DeleteConversationOptions) -> None:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("deleteConversation", "DELETE", path, "", query, headers, None, "")
        return None

    def cancel(self, agent_id: str, conversation_id: str, input: CancelConversationInput, options: CancelConversationOptions) -> CommandReceiptResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/cancel"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("cancelConversation", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CommandReceiptResponse", json.loads(payload))

    def clear(self, agent_id: str, conversation_id: str, options: ClearConversationOptions) -> ClearConversationReceiptResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/clear"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("clearConversation", "POST", path, "", query, headers, None, "")
        return cast("ClearConversationReceiptResponse", json.loads(payload))

    def set_model(self, agent_id: str, conversation_id: str, input: SetConversationModelInput, options: SetConversationModelOptions) -> CommandReceiptResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/model"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "If-Match" in opts:
            headers["If-Match"] = str(opts["If-Match"])
        payload = self._client._request("setConversationModel", "PUT", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CommandReceiptResponse", json.loads(payload))

    def resume(self, agent_id: str, conversation_id: str, options: ResumeConversationOptions) -> ResumeConversationResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/resume"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("resumeConversation", "POST", path, "", query, headers, None, "")
        return cast("ResumeConversationResponse", json.loads(payload))


class MessagesResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def list(self, agent_id: str, conversation_id: str, options: ListConversationMessagesOptions | None = None) -> MessagePage:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/messages"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        payload = self._client._request("listConversationMessages", "GET", path, "", query, headers, None, "")
        return cast("MessagePage", json.loads(payload))

    def get(self, agent_id: str, conversation_id: str, message_id: str) -> MessageEnvelopeResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/messages/{quote(str(message_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getConversationMessage", "GET", path, "", query, headers, None, "")
        return cast("MessageEnvelopeResponse", json.loads(payload))

    def create_share(self, agent_id: str, conversation_id: str, message_id: str) -> CreateShareReplyResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/messages/{quote(str(message_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createShareReply", "POST", path, "", query, headers, None, "")
        return cast("CreateShareReplyResponse", json.loads(payload))

    def get_share(self, agent_id: str, conversation_id: str, message_id: str) -> GetShareReplyResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/messages/{quote(str(message_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getShareReply", "GET", path, "", query, headers, None, "")
        return cast("GetShareReplyResponse", json.loads(payload))

    def revoke_share(self, agent_id: str, conversation_id: str, message_id: str) -> None:
        path = f"/agents/{quote(str(agent_id), safe='')}/conversations/{quote(str(conversation_id), safe='')}/messages/{quote(str(message_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("revokeShareReply", "DELETE", path, "", query, headers, None, "")
        return None

    def resolve_share(self, slug: str) -> ReplyShareResponse:
        path = f"/reply-shares/{quote(str(slug), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("resolveReplyShare", "GET", path, "", query, headers, None, "")
        return cast("ReplyShareResponse", json.loads(payload))


class TasksResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def create(self, agent_id: str, input: CreateTaskInput, options: CreateAgentTaskOptions) -> CreateTaskResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/tasks"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("createAgentTask", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CreateTaskResponse", json.loads(payload))

    def list(self, agent_id: str, options: ListAgentTasksOptions | None = None) -> TaskPage:
        path = f"/agents/{quote(str(agent_id), safe='')}/tasks"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "since" in opts:
            query["since"] = str(opts["since"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        if "state" in opts:
            query["state"] = str(opts["state"])
        payload = self._client._request("listAgentTasks", "GET", path, "", query, headers, None, "")
        return cast("TaskPage", json.loads(payload))

    def get(self, agent_id: str, task_id: str) -> TaskResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/tasks/{quote(str(task_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getAgentTask", "GET", path, "", query, headers, None, "")
        return cast("TaskResponse", json.loads(payload))

    def list_messages(self, agent_id: str, task_id: str, options: ListAgentTaskMessagesOptions | None = None) -> MessagePage:
        path = f"/agents/{quote(str(agent_id), safe='')}/tasks/{quote(str(task_id), safe='')}/messages"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "since" in opts:
            query["since"] = str(opts["since"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        payload = self._client._request("listAgentTaskMessages", "GET", path, "", query, headers, None, "")
        return cast("MessagePage", json.loads(payload))

    def cancel(self, agent_id: str, task_id: str, input: CancelTaskInput | None = None, *, options: CancelAgentTaskOptions) -> CommandReceiptResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/tasks/{quote(str(task_id), safe='')}/cancel"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("cancelAgentTask", "POST", path, "", query, headers, json.dumps(input).encode() if input is not None else None, "application/json")
        return cast("CommandReceiptResponse", json.loads(payload))

    def continue_task(self, agent_id: str, task_id: str, input: ContinueTaskInput | None = None, *, options: ContinueAgentTaskOptions) -> CommandReceiptResponse:
        path = f"/agents/{quote(str(agent_id), safe='')}/tasks/{quote(str(task_id), safe='')}/continue"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("continueAgentTask", "POST", path, "", query, headers, json.dumps(input).encode() if input is not None else None, "application/json")
        return cast("CommandReceiptResponse", json.loads(payload))


class UsageResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def get_summary(self, options: GetUsageSummaryOptions | None = None) -> ServerUsageSummary:
        path = f"/usage/summary"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "period" in opts:
            query["period"] = str(opts["period"])
        if "external_user_id" in opts:
            query["external_user_id"] = str(opts["external_user_id"])
        if "category" in opts:
            query["category"] = str(opts["category"])
        payload = self._client._request("getUsageSummary", "GET", path, "", query, headers, None, "")
        return cast("ServerUsageSummary", json.loads(payload))


class FilesResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def prepare_upload(self, input: FilePrepareUploadInput, options: PresignFileUploadOptions) -> FileTransferDescriptor:
        path = f"/files/presign-upload"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("presignFileUpload", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("FileTransferDescriptor", json.loads(payload))

    def confirm_upload(self, file_id: str, input: FileConfirmInput, options: ConfirmFileUploadOptions) -> FileFile:
        path = f"/files/{quote(str(file_id), safe='')}/confirm"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("confirmFileUpload", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("FileFile", json.loads(payload))

    def list(self, options: ListFilesOptions | None = None) -> FilePage:
        path = f"/files"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "content_type" in opts:
            query["content_type"] = str(opts["content_type"])
        if "since" in opts:
            query["since"] = str(opts["since"])
        if "status" in opts:
            query["status"] = str(opts["status"])
        if "file_type" in opts:
            query["file_type"] = str(opts["file_type"])
        if "category" in opts:
            query["category"] = str(opts["category"])
        if "source" in opts:
            query["source"] = str(opts["source"])
        if "q" in opts:
            query["q"] = str(opts["q"])
        if "instance_id" in opts:
            query["instance_id"] = str(opts["instance_id"])
        if "agent_id" in opts:
            query["agent_id"] = str(opts["agent_id"])
        if "sort" in opts:
            query["sort"] = str(opts["sort"])
        if "sort_dir" in opts:
            query["sort_dir"] = str(opts["sort_dir"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        if "offset" in opts:
            query["offset"] = str(opts["offset"])
        payload = self._client._request("listFiles", "GET", path, "", query, headers, None, "")
        return cast("FilePage", json.loads(payload))

    def get(self, file_id: str) -> FileResolution:
        path = f"/files/{quote(str(file_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getFile", "GET", path, "", query, headers, None, "")
        return cast("FileResolution", json.loads(payload))

    def rename(self, file_id: str, input: RenameFileRequest) -> FileFile:
        path = f"/files/{quote(str(file_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("renameFile", "PATCH", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("FileFile", json.loads(payload))

    def delete(self, file_id: str, options: DeleteFileOptions) -> None:
        path = f"/files/{quote(str(file_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("deleteFile", "DELETE", path, "", query, headers, None, "")
        return None

    def create_share(self, file_id: str, options: CreateShareFileShareOptions) -> FileShareResponse:
        path = f"/files/{quote(str(file_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("createShareFileShare", "POST", path, "", query, headers, None, "")
        return cast("FileShareResponse", json.loads(payload))

    def get_share(self, file_id: str) -> FileShareResponse:
        path = f"/files/{quote(str(file_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getShareFileShare", "GET", path, "", query, headers, None, "")
        return cast("FileShareResponse", json.loads(payload))

    def revoke_share(self, file_id: str) -> None:
        path = f"/files/{quote(str(file_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("revokeShareFileShare", "DELETE", path, "", query, headers, None, "")
        return None

    def resolve_share(self, slug: str) -> ResolveFileShareResponse:
        path = f"/file-shares/{quote(str(slug), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("resolveFileShare", "GET", path, "", query, headers, None, "")
        return cast("ResolveFileShareResponse", json.loads(payload))

    def get_summary(self) -> FileSummary:
        path = f"/files/summary"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getFilesSummary", "GET", path, "", query, headers, None, "")
        return cast("FileSummary", json.loads(payload))


class AutomationsResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def create(self, input: ProtoAutomationInput) -> CreateAutomationResponse:
        path = f"/automations"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createAutomation", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CreateAutomationResponse", json.loads(payload))

    def list(self, options: ListAutomationsOptions | None = None) -> ListAutomationsResponse:
        path = f"/automations"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "status" in opts:
            query["status"] = str(opts["status"])
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        payload = self._client._request("listAutomations", "GET", path, "", query, headers, None, "")
        return cast("ListAutomationsResponse", json.loads(payload))

    def get(self, automation_id: str) -> GetAutomationResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getAutomation", "GET", path, "", query, headers, None, "")
        return cast("GetAutomationResponse", json.loads(payload))

    def update(self, automation_id: str, input: ProtoAutomationPatch) -> UpdateAutomationResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("updateAutomation", "PATCH", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("UpdateAutomationResponse", json.loads(payload))

    def delete(self, automation_id: str) -> None:
        path = f"/automations/{quote(str(automation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("deleteAutomation", "DELETE", path, "", query, headers, None, "")
        return None

    def pause(self, automation_id: str) -> PauseAutomationResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}/pause"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("pauseAutomation", "POST", path, "", query, headers, None, "")
        return cast("PauseAutomationResponse", json.loads(payload))

    def resume(self, automation_id: str) -> ResumeAutomationResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}/resume"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("resumeAutomation", "POST", path, "", query, headers, None, "")
        return cast("ResumeAutomationResponse", json.loads(payload))

    def create_run(self, automation_id: str, input: ProtoAutomationRunInput, options: CreateAutomationRunOptions) -> CreateAutomationRunResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}/runs"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        payload = self._client._request("createAutomationRun", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CreateAutomationRunResponse", json.loads(payload))

    def list_runs(self, automation_id: str, options: ListAutomationRunsOptions | None = None) -> ListAutomationRunsResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}/runs"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "status" in opts:
            query["status"] = str(opts["status"])
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        payload = self._client._request("listAutomationRuns", "GET", path, "", query, headers, None, "")
        return cast("ListAutomationRunsResponse", json.loads(payload))

    def get_run(self, automation_id: str, run_id: str) -> GetAutomationRunResponse:
        path = f"/automations/{quote(str(automation_id), safe='')}/runs/{quote(str(run_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getAutomationRun", "GET", path, "", query, headers, None, "")
        return cast("GetAutomationRunResponse", json.loads(payload))

    def create_webhook(self, input: ProtoAutomationWebhookInput) -> CreateWebhookAutomationResponse:
        path = f"/automations/webhooks"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createWebhookAutomation", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CreateWebhookAutomationResponse", json.loads(payload))


class AudioResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def transcribe(self, input: TranscribeAudioRequest) -> TranscribeAudioResponse:
        path = f"/audio/transcribe"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        multipart_body, content_type = self._client._multipart(input["file"])
        payload = self._client._request("transcribeAudio", "POST", path, "", query, headers, multipart_body, content_type)
        return cast("TranscribeAudioResponse", json.loads(payload))


class CanvasesResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def get_share(self, instance_id: str, canvas_id: str, options: GetShareCanvasOptions) -> GetShareCanvasResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvases/{quote(str(canvas_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "X-BeeOS-Conversation-ID" in opts:
            headers["X-BeeOS-Conversation-ID"] = str(opts["X-BeeOS-Conversation-ID"])
        if "X-BeeOS-Platform-Agent-ID" in opts:
            headers["X-BeeOS-Platform-Agent-ID"] = str(opts["X-BeeOS-Platform-Agent-ID"])
        payload = self._client._request("getShareCanvas", "GET", path, "", query, headers, None, "")
        return cast("GetShareCanvasResponse", json.loads(payload))

    def create_share(self, instance_id: str, canvas_id: str, input: CreateShareCanvasRequest, options: CreateShareCanvasOptions) -> CreateShareCanvasResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvases/{quote(str(canvas_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "X-BeeOS-Conversation-ID" in opts:
            headers["X-BeeOS-Conversation-ID"] = str(opts["X-BeeOS-Conversation-ID"])
        if "X-BeeOS-Platform-Agent-ID" in opts:
            headers["X-BeeOS-Platform-Agent-ID"] = str(opts["X-BeeOS-Platform-Agent-ID"])
        payload = self._client._request("createShareCanvas", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CreateShareCanvasResponse", json.loads(payload))

    def delete_share(self, instance_id: str, canvas_id: str, options: DeleteShareCanvasOptions) -> None:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvases/{quote(str(canvas_id), safe='')}/share"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "X-BeeOS-Conversation-ID" in opts:
            headers["X-BeeOS-Conversation-ID"] = str(opts["X-BeeOS-Conversation-ID"])
        if "X-BeeOS-Platform-Agent-ID" in opts:
            headers["X-BeeOS-Platform-Agent-ID"] = str(opts["X-BeeOS-Platform-Agent-ID"])
        payload = self._client._request("deleteShareCanvas", "DELETE", path, "", query, headers, None, "")
        return None

    def list_snapshots(self, instance_id: str, canvas_id: str, options: ListCanvasSnapshotsOptions) -> ListCanvasSnapshotsResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvases/{quote(str(canvas_id), safe='')}/snapshots"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "X-BeeOS-Conversation-ID" in opts:
            headers["X-BeeOS-Conversation-ID"] = str(opts["X-BeeOS-Conversation-ID"])
        if "X-BeeOS-Platform-Agent-ID" in opts:
            headers["X-BeeOS-Platform-Agent-ID"] = str(opts["X-BeeOS-Platform-Agent-ID"])
        payload = self._client._request("listCanvasSnapshots", "GET", path, "", query, headers, None, "")
        return cast("ListCanvasSnapshotsResponse", json.loads(payload))

    def restore_snapshot(self, instance_id: str, canvas_id: str, snapshot_id: str, options: RestoreCanvasSnapshotOptions) -> RestoreCanvasSnapshotResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvases/{quote(str(canvas_id), safe='')}/snapshots/{quote(str(snapshot_id), safe='')}/restore"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "X-BeeOS-Conversation-ID" in opts:
            headers["X-BeeOS-Conversation-ID"] = str(opts["X-BeeOS-Conversation-ID"])
        if "X-BeeOS-Platform-Agent-ID" in opts:
            headers["X-BeeOS-Platform-Agent-ID"] = str(opts["X-BeeOS-Platform-Agent-ID"])
        payload = self._client._request("restoreCanvasSnapshot", "POST", path, "", query, headers, None, "")
        return cast("RestoreCanvasSnapshotResponse", json.loads(payload))

    def get_session(self, instance_id: str, conversation_id: str, options: GetCanvasSessionOptions) -> GetCanvasSessionResponse:
        path = f"/instances/{quote(str(instance_id), safe='')}/canvas-sessions/{quote(str(conversation_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options
        if "X-BeeOS-Conversation-ID" in opts:
            headers["X-BeeOS-Conversation-ID"] = str(opts["X-BeeOS-Conversation-ID"])
        if "X-BeeOS-Platform-Agent-ID" in opts:
            headers["X-BeeOS-Platform-Agent-ID"] = str(opts["X-BeeOS-Platform-Agent-ID"])
        payload = self._client._request("getCanvasSession", "GET", path, "", query, headers, None, "")
        return cast("GetCanvasSessionResponse", json.loads(payload))


class DeviceBindingsResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def get_details(self, id: str) -> GetAgentBindDetailsResponse:
        path = f"/agent/bind/{quote(str(id), safe='')}/details"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getAgentBindDetails", "GET", path, "", query, headers, None, "")
        return cast("GetAgentBindDetailsResponse", json.loads(payload))

    def confirm(self, id: str, input: ConfirmAgentBindRequest) -> ConfirmAgentBindResponse:
        path = f"/agent/bind/{quote(str(id), safe='')}/confirm"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("confirmAgentBind", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("ConfirmAgentBindResponse", json.loads(payload))

    def create_portal(self, input: CreatePortalBindRequest) -> CreatePortalBindResponse:
        path = f"/agent/portal/bind-sessions"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createPortalBind", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("CreatePortalBindResponse", json.loads(payload))

    def get_portal(self, id: str) -> GetPortalBindResponse:
        path = f"/agent/portal/bind-sessions/{quote(str(id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getPortalBind", "GET", path, "", query, headers, None, "")
        return cast("GetPortalBindResponse", json.loads(payload))

    def revoke_portal(self, id: str) -> RevokePortalBindResponse:
        path = f"/agent/portal/bind-sessions/{quote(str(id), safe='')}/revoke"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("revokePortalBind", "POST", path, "", query, headers, None, "")
        return cast("RevokePortalBindResponse", json.loads(payload))

    def resolve_portal(self, id: str, input: ResolvePortalBindRequest) -> ResolvePortalBindResponse:
        path = f"/agent/portal/bind-sessions/{quote(str(id), safe='')}/resolve"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("resolvePortalBind", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("ResolvePortalBindResponse", json.loads(payload))


class A2aResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def invoke(self, agent_id: str, input: InvokeA2ARequest) -> RuntimeMethodResponse:
        path = f"/a2a/{quote(str(agent_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("invokeA2A", "POST", path, "", query, headers, json.dumps(input).encode(), "application/json")
        return cast("RuntimeMethodResponse", json.loads(payload))

    def get_agent_card(self, agent_id: str) -> A2AAgentCard:
        path = f"/a2a/{quote(str(agent_id), safe='')}/.well-known/agent-card.json"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getA2AAgentCard", "GET", path, "", query, headers, None, "")
        return cast("A2AAgentCard", json.loads(payload))

    def get_agent_card_legacy(self, agent_id: str) -> A2AAgentCard:
        path = f"/a2a/{quote(str(agent_id), safe='')}/.well-known/agent.json"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getA2AAgentCardLegacy", "GET", path, "", query, headers, None, "")
        return cast("A2AAgentCard", json.loads(payload))

    def list_tasks(self, agent_id: str, options: ListA2ATasksOptions | None = None) -> ListA2ATasksResponse:
        path = f"/a2a/{quote(str(agent_id), safe='')}/tasks"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "direction" in opts:
            query["direction"] = str(opts["direction"])
        if "agent_id" in opts:
            query["agent_id"] = str(opts["agent_id"])
        if "cursor" in opts:
            query["cursor"] = str(opts["cursor"])
        if "limit" in opts:
            query["limit"] = str(opts["limit"])
        payload = self._client._request("listA2ATasks", "GET", path, "", query, headers, None, "")
        return cast("ListA2ATasksResponse", json.loads(payload))

    def get_task(self, agent_id: str, task_id: str, options: GetA2ATaskOptions | None = None) -> a2aTaskView:
        path = f"/a2a/{quote(str(agent_id), safe='')}/tasks/{quote(str(task_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "history_length" in opts:
            query["history_length"] = str(opts["history_length"])
        payload = self._client._request("getA2ATask", "GET", path, "", query, headers, None, "")
        return cast("a2aTaskView", json.loads(payload))

    def cancel_task(self, agent_id: str, task_id: str) -> a2aTaskView:
        path = f"/a2a/{quote(str(agent_id), safe='')}/tasks/{quote(str(task_id), safe='')}/cancel"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("cancelA2ATask", "POST", path, "", query, headers, None, "")
        return cast("a2aTaskView", json.loads(payload))


class HarnessesResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def list(self) -> ListHarnessesResponse:
        path = f"/harnesses"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("listHarnesses", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("ListHarnessesResponse", json.loads(payload))

    def create(self, input: UHPHarnessCreate) -> UHPHarness:
        path = f"/harnesses"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("createHarness", "POST", path, "/uhp/v1", query, headers, json.dumps(input).encode(), "application/json")
        return cast("UHPHarness", json.loads(payload))

    def get(self, harness_id: str) -> UHPHarness:
        path = f"/harnesses/{quote(str(harness_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getHarness", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("UHPHarness", json.loads(payload))

    def update(self, harness_id: str, input: UHPHarnessCreate) -> UHPHarness:
        path = f"/harnesses/{quote(str(harness_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("updateHarness", "PUT", path, "/uhp/v1", query, headers, json.dumps(input).encode(), "application/json")
        return cast("UHPHarness", json.loads(payload))

    def delete(self, harness_id: str) -> DeleteHarnessResponse:
        path = f"/harnesses/{quote(str(harness_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("deleteHarness", "DELETE", path, "/uhp/v1", query, headers, None, "")
        return cast("DeleteHarnessResponse", json.loads(payload))

    def list_all_models(self) -> UHPModelCatalog:
        path = f"/models"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("listModels", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("UHPModelCatalog", json.loads(payload))

    def list_models(self, harness_id: str) -> UHPHarnessModels:
        path = f"/harnesses/{quote(str(harness_id), safe='')}/models"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("listHarnessModels", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("UHPHarnessModels", json.loads(payload))


class ResponsesResource:
    def __init__(self, client: BeeOSClient) -> None:
        self._client = client

    def create(self, input: UHPCreateResponseJSONRequest, options: CreateResponseOptions | None = None) -> UHPResponse:
        path = f"/responses"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "Idempotency-Key" in opts:
            headers["Idempotency-Key"] = str(opts["Idempotency-Key"])
        if "UHP-Version" in opts:
            headers["UHP-Version"] = str(opts["UHP-Version"])
        payload = self._client._request("createResponse", "POST", path, "/uhp/v1", query, headers, json.dumps(input).encode(), "application/json")
        return cast("UHPResponse", json.loads(payload))

    def get(self, response_id: str) -> UHPResponse:
        path = f"/responses/{quote(str(response_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getResponse", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("UHPResponse", json.loads(payload))

    def delete(self, response_id: str) -> DeleteResponseResponse:
        path = f"/responses/{quote(str(response_id), safe='')}"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("deleteResponse", "DELETE", path, "/uhp/v1", query, headers, None, "")
        return cast("DeleteResponseResponse", json.loads(payload))

    def get_input_items(self, response_id: str) -> GetResponseInputItemsResponse:
        path = f"/responses/{quote(str(response_id), safe='')}/input_items"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("getResponseInputItems", "GET", path, "/uhp/v1", query, headers, None, "")
        return cast("GetResponseInputItemsResponse", json.loads(payload))

    def cancel(self, response_id: str) -> UHPResponse:
        path = f"/responses/{quote(str(response_id), safe='')}/cancel"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        payload = self._client._request("cancelResponse", "POST", path, "/uhp/v1", query, headers, None, "")
        return cast("UHPResponse", json.loads(payload))

    def get_events(self, response_id: str, options: GetResponseEventsOptions | None = None) -> Iterator[UHPEvent]:
        path = f"/responses/{quote(str(response_id), safe='')}/events"
        query: dict[str, str] = {}
        headers: dict[str, str] = {}
        opts = options if options is not None else {}
        if "Last-Event-ID" in opts:
            headers["Last-Event-ID"] = str(opts["Last-Event-ID"])
        if "UHP-Version" in opts:
            headers["UHP-Version"] = str(opts["UHP-Version"])
        return cast("Iterator[UHPEvent]", self._client._stream("getResponseEvents", "GET", path, "/uhp/v1", query, headers, None, ""))

    def create_stream(self, input: UHPCreateResponseRequest, options: CreateResponseOptions | None = None) -> Iterator[UHPEvent]:
        body: UHPCreateResponseRequest = {**input, "stream": True}
        headers: dict[str, str] = {}
        if options is not None:
            headers.update({key: str(value) for key, value in options.items()})
        return cast(Iterator[UHPEvent], self._client._stream("createResponse", "POST", "/responses", "/uhp/v1", {}, headers, json.dumps(body).encode(), "application/json"))

