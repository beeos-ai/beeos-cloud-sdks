// Generated from spec/native.openapi.json by generator/native-typescript.mjs.
export type Schema0 = { "kind": "explicit"; };
export type CanvasId = string;
export type CanvasLink = { "canvas_id": CanvasId; "session_id": OpaqueId; "agent_id": NativeAgentId; "linked_at": string; "role": "viewer" | "editor"; };
export type CanvasLinkResult = { "data": CanvasLink | null; };
export type CanvasTicketCreate = { "canvas_id"?: CanvasId; };
export type CanvasTicket = { "canvas_id": CanvasId; "session_id": OpaqueId; "role": "viewer" | "editor"; "relay_url": string; "open_url": string; "profile": "beeos-canvas-v1"; "ticket": string; "expires_at": string; "protocol_version": 1; };
export type CanvasTicketResult = { "data": CanvasTicket; };
export type CanvasShareCreate = { "mode": "link" | "password"; "password"?: string; "allow_interaction"?: boolean; };
export type CanvasShare = { "id": CanvasId; "canvas_id": CanvasId; "slug": string; "url": string; "mode": "link" | "password"; "allow_interaction": boolean; "expires_at": string | null; "created_at": string; };
export type CanvasShareResult = { "data": CanvasShare | null; };
export type CanvasSnapshot = { "id": CanvasId; "canvas_id": CanvasId; "version": number; "actor_type": string; "description": string | null; "created_at": string; };
export type CanvasSnapshotPage = { "data": (CanvasSnapshot)[]; "next_cursor": string | null; "has_more": boolean; };
export type CanvasRestoreResult = { "data": { "snapshot_id": CanvasId; "version": number; }; };
export type OpaqueId = OwnerOpaqueId;
export type ResourceVersion = OwnerResourceVersion;
export type NativeErrorEnvelope = OwnerError;
export type ErrorResponse = OwnerErrorResponse;
export type ResolvedResources = { "vcpu": number; "memory_mib": number; "disk_gib": number; };
export type SandboxCreate = { "template": string; "timeout_seconds"?: number; "on_timeout"?: "pause" | "terminate"; "labels"?: { [key: string]: string; }; "name"?: string; };
export type SandboxPatch = { "labels": { [key: string]: string; }; };
export type ResolvedTemplate = { "id": string; "build_id": OpaqueId; "digest": string; "runtime_artifact_set": RuntimeArtifactSetRef; };
export type ResolvedHarness = { "name": string; "version": string; };
export type Sandbox = { "id": OpaqueId; "template": ResolvedTemplate; readonly "harness": ResolvedHarness | null; readonly "agent_id": AgentId | null; "status": "pending" | "provisioning" | "running" | "pausing" | "paused" | "resuming" | "error" | "unknown"; "timeout_seconds": number; "on_timeout": "pause" | "terminate"; "expires_at": string | null; "labels": { [key: string]: string; }; readonly "resources": ResolvedResources; "created_at": string; "last_error": NativeErrorEnvelope | null; "resource_version": ResourceVersion; readonly "paused_mode": "filesystem" | "full_state" | null; readonly "name": string | null; readonly "management_source": "explicit" | "agent"; };
export type PauseRequest = { "mode"?: "filesystem" | "full_state"; };
export type ResumeRequest = { "mode"?: "filesystem" | "full_state"; };
export type TemplateInfrastructure = { "os": "linux" | "windows"; "architecture": "amd64" | "arm64"; "pause_modes": ("filesystem" | "full_state")[]; "verified_at": string | null; };
export type TemplateGuestDaemon = { "version": string; "features": ("desktop" | "pty")[]; };
export type TemplateBuild = { "id": OpaqueId; "digest": string; "infrastructure": TemplateInfrastructure; "guest_daemon": TemplateGuestDaemon; "base_image_digest": string; "runtime_artifact_set": RuntimeArtifactSetRef; "harness_artifacts": (TemplateHarnessArtifact)[]; };
export type Template = { "id": string; "name": string; "description": string; "surface": "headless" | "desktop"; "supported_harnesses": (string)[]; "resources": ResolvedResources; "prewarmed": boolean; "default_build": TemplateBuild; readonly "region": string; };
export type AccessTicketCreate = { "purpose": "desktop" | "pty"; "cols"?: number; "rows"?: number; "pty_id"?: string; "origin"?: string; };
export type AccessTicket = { "id": OpaqueId; "sandbox_id": OpaqueId; "purpose": "desktop" | "pty"; "ticket": string; "connect_url": string; "expires_at": string; "resource_version": ResourceVersion; "transport": "websocket" | "webrtc"; "protocol_version": 1; readonly "pty_id"?: string; "reconnect_window_seconds"?: number; readonly "profile": "beeos-terminal-v2" | "beeos-desktop-v1"; readonly "client_id": string; };
export type SandboxResult = { "data": Sandbox; };
export type SandboxGetResult = { "data": Sandbox; };
export type TemplateResult = { "data": Template; };
export type AccessTicketResult = { "data": AccessTicket; };
export type SandboxPage = { "data": (Sandbox)[]; "next_cursor": string | null; "has_more": boolean; };
export type TemplatePage = { "data": (Template)[]; "next_cursor": string | null; "has_more": boolean; };
export type NativeAgentId = AgentId;
export type Revision = revision;
export type SkillSelection = { "skill_id": OpaqueId; "version": revision; "digest": string; "enabled": boolean; };
export type MCPSelection = { "server_ref": OpaqueId; "enabled": boolean; "required": boolean; "credential_slot"?: string; };
export type ComponentObservation = { "component": "model" | "persona" | "tools" | "skills" | "mcp" | "credentials" | "target"; "scope": "agent" | "binding" | "session" | "response"; "scope_id": OpaqueId | null; "revision": revision | null; "state": "accepted" | "prepared" | "loaded" | "not_applied" | "deferred" | "failed" | "unknown"; "observed_at": string | null; "error": NativeErrorEnvelope | null; };
export type Publication = { "accepted_config_revision": revision; "changed_components": ("model" | "persona" | "tools" | "skills" | "mcp" | "credentials" | "target")[]; "state": "accepted" | "preparing" | "ready" | "deferred" | "failed" | "partial" | "unknown" | "superseded"; "components": (ComponentObservation)[]; };
export type AgentBindingObservation = { "binding_id": OpaqueId; "sandbox_id": OpaqueId; "state": string; "prepared_config_revision": revision | null; "credential_activation_revision": revision | null; "credential_status": CredentialBindingStatus; "persona_scope": "session" | "binding" | "unknown"; "components": (ComponentObservation)[]; "error": NativeErrorEnvelope | null; };
export type NativeAgentCreate = { "name"?: string; "engine": string; "instructions"?: string; "model_id"?: OpaqueId | null; "skills"?: (SkillSelection)[]; "mcp_servers"?: (MCPSelection)[]; "disabled_tools"?: (string)[]; "run_timeout_seconds"?: number; "target"?: BeeosTarget; "credentials"?: CredentialBindings; };
export type NativeAgentPatch = { "name"?: string; "instructions"?: string; "model_id"?: OpaqueId | null; "skills"?: (SkillSelection)[]; "mcp_servers"?: (MCPSelection)[]; "disabled_tools"?: (string)[]; "run_timeout_seconds"?: number; "target"?: BeeosTarget; "credentials"?: CredentialBindings; };
export type NativeAgentConfiguration = { "name": string; "engine": string; "instructions": string; "model_id": OpaqueId | null; "skills": (SkillSelection)[]; "mcp_servers": (MCPSelection)[]; "disabled_tools": (string)[]; "run_timeout_seconds": number; "target": BeeosTarget; "credential_status": CredentialBindingStatus; };
export type AuthorizationEnforcement = { "authorization_revision": revision; "state": "enforcing" | "enforced" | "partial" | "unknown"; "affected_scopes": ({ "kind": "tool" | "mcp" | "credential" | "session" | "binding" | "sandbox"; "id": OpaqueId; "state": "pending" | "enforced" | "failed" | "unknown"; })[]; "error": NativeErrorEnvelope | null; };
export type NativeAgent = { "id": NativeAgentId; "configuration": NativeAgentConfiguration; "desired_config_revision": Revision; "resource_version": ResourceVersion; "binding": AgentBindingObservation | null; "publication": Publication; "authorization": AuthorizationEnforcement; "default_model_id": OpaqueId; "created_at": string; "updated_at": string; };
export type AuthorizationRevoke = { "all": true; } | { "tool_ids"?: (OpaqueId)[]; "mcp_server_refs"?: (OpaqueId)[]; "credential_slots"?: (string)[]; };
export type DeletedResult = { "id": OpaqueId; "deleted": true; "cleanup": "pending" | "complete"; "scope": string; };
export type ModelAvailability = { "id": OpaqueId; "provider_id": OpaqueId; "model_id": string; "endpoint_ref": OpaqueId | null; "engine_support": (string)[]; "availability": "available" | "unavailable" | "unknown"; "reason": string | null; "observed_at": string | null; "default": boolean; };
export type SkillFile = { "path": string; "file_id": OpaqueId; "size_bytes": number; "sha256": string; "media_type": string; };
export type SkillFiles = { "skill_id": OpaqueId; "version": revision; "digest": string; "files": (SkillFile)[]; };
export type FileMetadata = { "id": OpaqueId; "filename": string; "media_type": string; "size_bytes": number; "sha256": string; "status": "ready" | "deleted" | "revoked"; "owner_scope": "org" | "session" | "command"; "owner_id": OpaqueId | null; "created_at": string; "expires_at": string | null; };
export type FileInput = { "type": "input_file" | "input_image"; "file_id": OpaqueId; "sha256": string; };
export type TextInput = { "type": "input_text"; "text": string; };
export type ResponseInput = TextInput | FileInput;
export type ResponseInputItem = { readonly "id": OpaqueId; "content": ResponseInput; };
export type NativeMetadata = { [key: string]: string; };
export type NativeSessionCreate = { "agent_id": NativeAgentId; "name"?: string; "metadata"?: { [key: string]: string; }; };
export type NativeSessionPatch = { "name": string; };
export type SessionConfigurationObservation = { "persona_revision": revision | null; "persona_policy": "session_start" | "binding_next_turn" | "unknown"; "last_loaded_execution_revision": revision | null; "last_response_id": OpaqueId | null; "components": (ComponentObservation)[]; };
export type NativeSession = { "id": OpaqueId; "agent_id": NativeAgentId; "state": "active" | "agent_deleted" | "deleting"; "read_only": boolean; "name": string; "metadata": { [key: string]: string; }; "configuration": SessionConfigurationObservation; "head_response_id": OpaqueId | null; "resource_version": ResourceVersion; "created_at": string; "updated_at": string; "last_activity_at": string; "continuation_available": boolean; "continuation_unavailable_reason": "agent_deleted" | "session_deleting" | "history_source_deleted" | "native_continuity_unproven" | null; };
export type NativeResponseCreate = { "session_id": OpaqueId; "input": (ResponseInput)[]; "model_id"?: OpaqueId; "previous_response_id"?: OpaqueId; "timeout_seconds"?: number; "metadata"?: NativeMetadata; };
export type EffectiveConfiguration = { "config_revision": revision; "persona_revision": revision | null; "resolved_request_hash": string; "requested_model_id": OpaqueId | null; "loaded_model_id": OpaqueId | null; "actual_provider_id": OpaqueId | null; "actual_model_id": OpaqueId | null; "endpoint_ref": OpaqueId | null; "api_mode": string | null; "reasoning": string | null; "fallback_used": boolean | null; "skills_digest": string | null; "tool_schema_digest": string | null; "credential_activation_revision": revision | null; "authorization_revision_at_admission": AuthorizationRevision; "observation": "selected" | "loaded" | "executed" | "partial" | "unknown"; "components": (ComponentObservation)[]; "memory_read_watermark": OpaqueId | null; "memory_observation": "not_read" | "read" | "unavailable" | "unknown"; };
export type ResponseOutputItem = { "type": "output_text"; "text": string; } | { "type": "output_file"; "file": FileMetadata; } | { "type": "tool_summary"; "tool_call_id": OpaqueId; "tool_name": string; "outcome": "succeeded" | "failed" | "unknown"; "summary": string; };
export type InteractionOption = { "id": OpaqueId; "label": string; };
export type InteractionQuestion = { "id": OpaqueId; "prompt": string; "kind": "text" | "single_choice" | "multiple_choice"; "options": (InteractionOption)[]; };
export type Interaction = { "id": OpaqueId; "response_id": OpaqueId; "attempt_ref": OpaqueId; "revision": ResourceVersion; "kind": "approval" | "question" | "resume"; "state": "pending" | "resolved" | "expired" | "cancelled"; "expires_at": string; "tool_call_id": OpaqueId | null; "tool_name": string | null; "arguments_digest": string | null; "summary": string; "options": (InteractionOption)[]; "questions": (InteractionQuestion)[]; "pause_sequence": number | null; };
export type InteractionReply = { "attempt_ref": OpaqueId; "interaction_revision": ResourceVersion; "kind": "approval"; "option_id": OpaqueId; } | { "attempt_ref": OpaqueId; "interaction_revision": ResourceVersion; "kind": "question"; "answers": ({ "question_id": OpaqueId; "value": string | (string)[]; })[]; } | { "attempt_ref": OpaqueId; "interaction_revision": ResourceVersion; "kind": "resume"; "pause_sequence": number; };
export type InteractionReplyResult = { "response_id": OpaqueId; "interaction_id": OpaqueId; "decision_id": OpaqueId; "accepted": true; "duplicate": boolean; };
export type NativeResponse = { "id": OpaqueId; "session_id": OpaqueId; "sandbox_id": OpaqueId | null; "agent_id": NativeAgentId; "status": "queued" | "in_progress" | "waiting_input" | "cancelling" | "completed" | "failed" | "incomplete" | "cancelled"; "phase": "accepted" | "preparing_compute" | "loading_session" | "executing" | "waiting_input" | "finished"; "terminal": boolean; "effective_configuration": EffectiveConfiguration | null; "output": (ResponseOutputItem)[]; "input": (ResponseInputItem)[]; "metadata": NativeMetadata; "pending_interactions": (Interaction)[]; "error": NativeErrorEnvelope | null; "usage": { "input_tokens"?: number; "output_tokens"?: number; "source": "provider" | "native" | "estimated"; "actual_model_id"?: OpaqueId | null; } | null; "stop_observation": "not_requested" | "requested" | "proven_stopped" | "fenced" | "unknown"; "checkpoint": { "state": "not_requested" | "pending" | "committed" | "failed" | "unknown"; "source_revision": revision | null; }; "resource_version": ResourceVersion; "created_at": string; "completed_at": string | null; "previous_response_id": OpaqueId | null; };
export type NativeResponseEvent = { "type": "response.phase"; "response_id": OpaqueId; "sequence": number; "phase": "accepted" | "preparing_compute" | "loading_session" | "executing" | "waiting_input" | "finished"; } | { "type": "response.output"; "response_id": OpaqueId; "sequence": number; "item": ResponseOutputItem; } | { "type": "response.interaction"; "response_id": OpaqueId; "sequence": number; "interaction": Interaction; } | { "type": "response.completed" | "response.failed" | "response.incomplete" | "response.cancelled" | "response.unknown"; "response_id": OpaqueId; "sequence": number; "response": NativeResponse; };
export type CommandCreate = { "argv": (string)[]; "cwd"?: string; "env"?: { [key: string]: string; }; "timeout_seconds"?: number; "result_path"?: string; "artifact_paths"?: (string)[]; };
export type CommandArtifact = { "id": OpaqueId; "filename": string; "media_type": string; "size_bytes": number; "sha256": string; "published_at": string; "expires_at": string; };
export type Command = { "id": OpaqueId; "sandbox_id": OpaqueId; "state": "queued" | "running" | "stopping" | "collecting" | "completed" | "unknown"; "process_outcome": "pending" | "exited" | "cancelled" | "timed_out" | "start_failed" | "lost" | "unknown"; "exit_code": number | null; "signal": string | null; "stop_proven": boolean; "capture_status": "not_requested" | "pending" | "complete" | "partial" | "failed" | "unknown"; "result": StructuredCommandResult | null; "artifacts": (CommandArtifact)[]; "logs": { "first_sequence": number; "last_sequence": number; "persisted_bytes": number; "truncated": boolean; "error": NativeErrorEnvelope | null; }; "error": NativeErrorEnvelope | null; "resource_version": ResourceVersion; "created_at": string; "completed_at": string | null; "expires_at": string | null; };
export type CommandEvent = { "type": "stdout" | "stderr"; "command_id": OpaqueId; "sequence": number; "data": string; "decoded_bytes": number; } | { "type": "status" | "truncated" | "complete"; "command_id": OpaqueId; "sequence": number; "command": Command; };
export type FileWriteResult = { "path": string; "size_bytes": number; "sha256": string; "etag": string; };
export type CredentialInputCapabilities = { "version": 1; "modes": ("reference" | "sealed")[]; "discovery_path": "/uhp/v1/uhp"; };
export type NativeCapabilities = { "credential_input": CredentialInputCapabilities; "api_version": "2"; "features": { [key: string]: "supported" | "unsupported" | "proposed" | "conditional" | "unknown"; }; "limits": { [key: string]: number; }; "engines": ({ "id": string; "available": boolean; "persona_scope": "session" | "binding" | "unknown"; "reason": string | null; })[]; };
export type NativeAgentResult = { "data": NativeAgent; };
export type AuthorizationEnforcementResult = { "data": AuthorizationEnforcement; };
export type DeletedResultResult = { "data": DeletedResult; };
export type SkillFilesResult = { "data": SkillFiles; };
export type FileMetadataResult = { "data": FileMetadata; };
export type NativeSessionResult = { "data": NativeSession; };
export type NativeResponseResult = { "data": NativeResponse; };
export type InteractionReplyResultResult = { "data": InteractionReplyResult; };
export type FileWriteResultResult = { "data": FileWriteResult; };
export type NativeCapabilitiesResult = { "data": NativeCapabilities; };
export type NativeAgentPage = { "data": (NativeAgent)[]; "next_cursor": string | null; "has_more": boolean; };
export type ModelAvailabilityPage = { "data": (ModelAvailability)[]; "next_cursor": string | null; "has_more": boolean; };
export type FileMetadataPage = { "data": (FileMetadata)[]; "next_cursor": string | null; "has_more": boolean; };
export type ResponseInputPage = { "data": (ResponseInputItem)[]; "metadata": NativeMetadata; "next_cursor": string | null; "has_more": boolean; };
export type NativeSessionPage = { "data": (NativeSession)[]; "next_cursor": string | null; "has_more": boolean; };
export type CommandResultEnvelope = { "data": Command; };
export type StructuredCommandResult = { "status": "not_requested" | "ready" | "failed"; "value": unknown; "sha256": string | null; "error": NativeErrorEnvelope | null; };
export type NativeResponsePage = { "data": (NativeResponse)[]; "next_cursor": string | null; "has_more": boolean; };
export type TemplateHarnessArtifact = RuntimeHarnessArtifact;
export type NativeMemorySource = Schema0 | { "kind": "response"; "response_id": OpaqueId; "item_id": OpaqueId; };
export type NativeMemoryRemember = { "content": string; "kind": "core" | "semantic" | "episodic" | "procedural"; "source": NativeMemorySource; "valid_from"?: string | null; "valid_to"?: string | null; };
export type NativeMemoryRecall = { "query": string; "kinds": ("core" | "semantic" | "episodic" | "procedural")[]; "token_budget"?: number; "page_size"?: number; "cursor"?: string; "min_read_watermark"?: OpaqueId; };
export type NativeMemoryCorrect = { "expected_revision": RecordRevision; "content": string; "reason": string; "source": NativeMemorySource; };
export type NativeMemoryForget = { "expected_revision": RecordRevision; "reason": string; };
export type NativeMemoryJobObservation = { "id": OpaqueId; "state": state; "next_attempt_at": nextattemptat; "error": NativeErrorEnvelope | null; };
export type NativeMemoryErasureObservation = { "barrier_committed": boolean; "state": "pending" | "complete" | "blocked" | "failed" | "unknown"; "coverage": ({ "component": "canonical" | "index" | "cache" | "object_versions" | "native_snapshots" | "backup_barrier"; "state": "pending" | "complete" | "blocked" | "failed" | "unknown"; })[]; "error": NativeErrorEnvelope | null; };
export type NativeMemoryReceiptObservation = { "receipt": Receipt; "completion": "accepted" | "durable" | "recallable" | "erasure_barrier" | "erased" | "blocked" | "failed" | "unknown"; "job": NativeMemoryJobObservation | null; "erasure": NativeMemoryErasureObservation | null; "redacted": boolean; };
export type NativeMemoryReceiptResult = { "data": NativeMemoryReceiptObservation; };
export type NativeMemoryRecallResult = { "data": RecallPage; };
export type OwnerOpaqueId = string;
export type OwnerResourceVersion = number;
export type OwnerError = { "code": string; "message": string; "request_id": RequestId; "details"?: ErrorDetails; "retry_after"?: RetryAfterSeconds; };
export type RequestId = string;
export type ErrorDetails = { "reason"?: string; "fields"?: ({ "field": string; "reason": string; })[]; "related_resource"?: { "id": OwnerOpaqueId; "resource_version": OwnerResourceVersion; "expires_at": string | null; }; [key: string]: unknown; };
export type RetryAfterSeconds = number;
export type OwnerErrorResponse = OwnerError;
export type RuntimeArtifactSetRef = ArtifactRef & { "schema_id"?: "urn:beeos:internal:sandbox-runtime:proposal:1#/$defs/RuntimeArtifactSetManifest"; "schema_version"?: "1"; };
export type ArtifactRef = { "manifest_id": ExternalOpaqueRef; "manifest_digest": string; "schema_id": string; "schema_version": OwnerOpaqueId2; };
export type ExternalOpaqueRef = string;
export type OwnerOpaqueId2 = string;
export type AgentId = string;
export type harnessartifacts = (RuntimeHarnessArtifact)[];
export type RuntimeHarnessArtifact = { "harness": "openclaw" | "hermes"; "version": ExternalOpaqueRef; "artifact_digest": string; "dependency_lock_digest": string; "preparation_recipe": HarnessPreparationRecipeRef; };
export type HarnessPreparationRecipeRef = ArtifactRef & { "schema_id"?: "urn:beeos:internal:sandbox-runtime:proposal:1#/$defs/HarnessPreparationRecipe"; "schema_version"?: "1"; };
export type revision = OwnerOpaqueId2;
export type CredentialPublicStatus = { "slot": string; "configured": boolean; };
export type CredentialBindingStatus = { "slots": (CredentialPublicStatus)[]; };
export type BeeosTarget = BeeosRecipeTarget | BeeosManagedTarget;
export type BeeosRecipeTarget = { "kind": "recipe"; "template"?: "beeos/base" | "beeos/base-4c8g"; "timeout_seconds"?: number; "on_timeout"?: "terminate"; };
export type BeeosManagedTarget = { "kind": "managed"; "sandbox_id": Id; };
export type Id = OwnerOpaqueId2;
export type CredentialBindings = (CredentialBinding)[];
export type CredentialBinding = { "slot": string; "source": CredentialReference | SealedCredential; };
export type CredentialReference = { "kind": "reference"; "ref": string; };
export type SealedCredential = { "kind": "sealed"; "jwe": string; };
export type AuthorizationRevision = number;
export type RecordRevision = number;
export type state = "queued" | "running" | "retry_wait" | "blocked" | "succeeded" | "failed" | "cancelled";
export type nextattemptat = string | null;
export type Receipt = { "receipt_id": OwnerOpaqueId2; "request_id": OwnerOpaqueId2; "operation": "observe" | "remember" | "recall" | "revise" | "forget" | "consolidate" | "export" | "import"; "disposition": "accepted" | "committed" | "duplicate"; "observation_ids": (OwnerOpaqueId2)[]; "record_refs": (RecordRef)[]; "job_ref": OwnerOpaqueId2 | null; "committed_at": string | null; "read_watermark": OwnerOpaqueId2 | null; "index_watermark": OwnerOpaqueId2 | null; "source_refs": (Source)[]; };
export type RecordRef = { "record_id": OwnerOpaqueId2; "revision": OwnerRecordRevision; };
export type OwnerRecordRevision = number;
export type Source = MessageSource | AssertionSource;
export type MessageSource = { "kind": "message"; "source_id": OwnerOpaqueId2; "history_generation": string; "source_revision": OwnerOpaqueId2; "origin": "user_input" | "tool_result" | "assistant_result" | "memory_recall" | "import"; "capture_kind": "turn_finished" | "explicit_remember" | "source_revision" | "import"; };
export type AssertionSource = { "kind": "assertion"; "assertion_id": OwnerOpaqueId2; "assertion_revision": AssertionRevision; };
export type AssertionRevision = number;
export type RecallPage = { "items": ({ "record": MemoryRecord; "score": number; "token_count": number; "truncated": boolean; })[]; "next_cursor": string | null; "read_watermark": OwnerOpaqueId2; "index_watermark": OwnerOpaqueId2; "memory_status": "available"; };
export type MemoryRecord = { "record_id": OwnerOpaqueId2; "revision": OwnerRecordRevision; "scope_ref": OwnerOpaqueId2; "kind": "core" | "semantic" | "episodic" | "procedural"; "content": string; "source_refs": (Source)[]; "trust": "operator_approved" | "user_asserted" | "tool_observed" | "model_inferred" | "imported_unverified"; "event_time": string | null; "valid_from": string | null; "valid_to": string | null; "recorded_at": string; "status": "active" | "superseded" | "invalidated" | "conflicted"; "supersedes": (RecordRef)[]; "conflict_group": OwnerOpaqueId2 | null; "erasure_epoch": ErasureEpoch; };
export type ErasureEpoch = number;
export interface CreateSandboxOptions extends NativeRequestOptions {}
export interface ListSandboxesOptions extends NativeRequestOptions {limit?: number; cursor?: string; status?: "pending" | "provisioning" | "running" | "pausing" | "paused" | "resuming" | "error" | "unknown"; label?: (string)[];}
export interface GetSandboxOptions extends NativeRequestOptions {}
export interface PatchSandboxOptions extends NativeRequestOptions {ifMatch: string;}
export interface TerminateSandboxOptions extends NativeRequestOptions {ifMatch: string;}
export interface PauseSandboxOptions extends NativeRequestOptions {ifMatch: string;}
export interface ResumeSandboxOptions extends NativeRequestOptions {ifMatch: string;}
export interface ListSandboxTemplatesOptions extends NativeRequestOptions {limit?: number; cursor?: string;}
export interface GetSandboxTemplateOptions extends NativeRequestOptions {}
export interface CreateSandboxAccessTicketOptions extends NativeRequestOptions {}
export interface RevokeSandboxAccessTicketOptions extends NativeRequestOptions {ifMatch: string;}
export interface RunSandboxCommandOptions extends NativeRequestOptions {}
export interface GetSandboxCommandOptions extends NativeRequestOptions {}
export interface CancelSandboxCommandOptions extends NativeRequestOptions {}
export interface StreamSandboxCommandEventsOptions extends NativeRequestOptions {lastEventId?: string;}
export interface WriteSandboxFileOptions extends NativeRequestOptions {path: string; contentLength: number; contentSha256: string; ifMatch?: string; ifNoneMatch?: "*";}
export interface ReadSandboxFileOptions extends NativeRequestOptions {path: string; ifMatch?: string;}
export interface DownloadCommandArtifactOptions extends NativeRequestOptions {}
export interface CreateNativeAgentOptions extends NativeRequestOptions {}
export interface ListNativeAgentsOptions extends NativeRequestOptions {limit?: number; cursor?: string;}
export interface GetNativeAgentOptions extends NativeRequestOptions {}
export interface UpdateNativeAgentOptions extends NativeRequestOptions {ifMatch: string;}
export interface DeleteNativeAgentOptions extends NativeRequestOptions {}
export interface ListNativeAgentModelsOptions extends NativeRequestOptions {limit?: number; cursor?: string;}
export interface GetNativeAgentSkillFilesOptions extends NativeRequestOptions {}
export interface RevokeNativeAgentAuthorizationsOptions extends NativeRequestOptions {}
export interface ListNativeModelsOptions extends NativeRequestOptions {limit?: number; cursor?: string;}
export interface CreateNativeSessionOptions extends NativeRequestOptions {}
export interface ListNativeSessionsOptions extends NativeRequestOptions {limit?: number; cursor?: string; agentId?: NativeAgentId; order?: "asc" | "desc"; state?: "active" | "agent_deleted" | "deleting";}
export interface GetNativeSessionOptions extends NativeRequestOptions {}
export interface UpdateNativeSessionOptions extends NativeRequestOptions {ifMatch: string;}
export interface DeleteNativeSessionOptions extends NativeRequestOptions {}
export interface ListNativeSessionFilesOptions extends NativeRequestOptions {limit?: number; cursor?: string;}
export interface ListNativeSessionResponsesOptions extends NativeRequestOptions {limit?: number; cursor?: string; order?: "asc" | "desc";}
export interface CreateNativeResponseOptions extends NativeRequestOptions {}
export interface GetNativeResponseOptions extends NativeRequestOptions {}
export interface DeleteNativeResponseOptions extends NativeRequestOptions {}
export interface CancelNativeResponseOptions extends NativeRequestOptions {}
export interface StreamNativeResponseEventsOptions extends NativeRequestOptions {lastEventId?: string;}
export interface ListNativeResponseInputItemsOptions extends NativeRequestOptions {limit?: number; cursor?: string;}
export interface ReplyNativeInteractionOptions extends NativeRequestOptions {}
export interface CreateNativeFileOptions extends NativeRequestOptions {filename: string; mediaType: string; contentLength: number; contentSha256: string;}
export interface GetNativeFileOptions extends NativeRequestOptions {}
export interface DeleteNativeFileOptions extends NativeRequestOptions {}
export interface DownloadNativeFileOptions extends NativeRequestOptions {}
export interface GetNativeCapabilitiesOptions extends NativeRequestOptions {}
export interface RememberNativeMemoryOptions extends NativeRequestOptions {}
export interface RecallNativeMemoryOptions extends NativeRequestOptions {}
export interface CorrectNativeMemoryOptions extends NativeRequestOptions {}
export interface ForgetNativeMemoryOptions extends NativeRequestOptions {}
export interface GetNativeMemoryReceiptOptions extends NativeRequestOptions {}
export interface GetNativeSessionCanvasOptions extends NativeRequestOptions {}
export interface CreateNativeCanvasTicketOptions extends NativeRequestOptions {}
export interface GetNativeCanvasShareOptions extends NativeRequestOptions {}
export interface CreateNativeCanvasShareOptions extends NativeRequestOptions {}
export interface DeleteNativeCanvasShareOptions extends NativeRequestOptions {}
export interface ListNativeCanvasSnapshotsOptions extends NativeRequestOptions {}
export interface RestoreNativeCanvasSnapshotOptions extends NativeRequestOptions {}

import { parseNativeSSE } from "./native-sse.js";

/** Modeled NativeResponseEvent type set; unknown future types are skipped, never fatal. */
const NATIVE_RESPONSE_EVENT_TYPES: ReadonlySet<string> = new Set(["response.phase", "response.output", "response.interaction", "response.completed", "response.failed", "response.incomplete", "response.cancelled", "response.unknown"]);

export interface BeeOSHTTPHeaders {
  request_id?: string; etag?: string; location?: string; should_retry?: boolean; retry_after?: string;
  raw: Headers;
}
export interface NativeAcceptance {
  status: number | null; resource_id: string | null; etag: string | null; request_id: string | null; idempotency_key: string;
}
export interface BeeOSHTTPResponse<T> {
  status: number; body: T; headers: BeeOSHTTPHeaders; acceptance?: NativeAcceptance;
}
export class NativeBeeOSAPIError extends Error {
  readonly name = "BeeOSAPIError";
  constructor(readonly http_status: number, readonly code: string, message: string,
    readonly reason: string | undefined, readonly should_retry: boolean | undefined,
    readonly retry_after: string | number | undefined, readonly request_id: string | undefined,
    readonly raw_envelope: unknown, readonly headers: BeeOSHTTPHeaders,
    readonly acceptance?: NativeAcceptance) { super(message); }
  get status(): number { return this.http_status; }
}
export class SDKWaitTimeout extends Error {
  readonly name: string = "SDKWaitTimeout";
  constructor(message: string, readonly acceptance?: NativeAcceptance,
    readonly last_response?: BeeOSHTTPResponse<unknown>) { super(message); }
}
export class SDKRequestTimeout extends SDKWaitTimeout { override readonly name = "SDKRequestTimeout"; }
export class SDKCancelled extends SDKWaitTimeout { override readonly name = "SDKCancelled"; }
export class SDKPublicationSuperseded extends SDKWaitTimeout { override readonly name = "SDKPublicationSuperseded"; }
export class SDKOperationFailed extends SDKWaitTimeout { override readonly name = "SDKOperationFailed"; }
export class SDKTransportError extends SDKWaitTimeout {
  override readonly name = "SDKTransportError";
  constructor(message: string, acceptance: NativeAcceptance | undefined, last: BeeOSHTTPResponse<unknown> | undefined, override readonly cause: unknown) { super(message, acceptance, last); }
}
export class SDKConnectionError extends Error {
  override readonly name = "SDKConnectionError";
  constructor(readonly ticket: Omit<AccessTicket, "ticket">, readonly acceptance: NativeAcceptance | undefined, override readonly cause: unknown) { super("Connection admission failed"); }
}
export type BinaryStream = Uint8Array | Blob | ReadableStream<Uint8Array>;
export interface NativeRequestOptions {
  idempotencyKey?: string; signal?: AbortSignal; wait?: boolean;
  requestTimeoutSeconds?: number; waitTimeoutSeconds?: number; pollIntervalSeconds?: number;
  onProgress?: (observation: BeeOSHTTPResponse<unknown>) => void;
}
export interface NativeClientOptions {
  baseURL: string; apiKey: string | (() => string); fetch?: typeof fetch;
  webSocketFactory?: (url: string, profile: string) => NativeWebSocket;
}
export function createNativeIdempotencyKey(): string { return globalThis.crypto.randomUUID(); }
interface NativeParameter { name: string; in: string; required?: boolean; option: string; }
interface NativeOperation {
  id: string; method: string; path: string; parameters: NativeParameter[];
  contentType?: string; responseType: "json" | "bytes" | "sse" | "void"; wait: boolean;
}
interface OperationContext {
  key?: string; acceptance?: NativeAcceptance; last?: BeeOSHTTPResponse<unknown>; deadline?: number;
}
function nativeHeaders(raw: Headers): BeeOSHTTPHeaders {
  const retry = raw.get("Should-Retry") ?? raw.get("X-Should-Retry");
  return { request_id: raw.get("X-Request-ID") ?? undefined, etag: raw.get("ETag") ?? undefined,
    location: raw.get("Location") ?? undefined, should_retry: retry === null ? undefined : retry === "true",
    retry_after: raw.get("Retry-After") ?? undefined, raw };
}
function resourceId(body: unknown): string | null {
  const data = (body as {data?: {id?: string; receipt?: {receipt_id?: string}}} | undefined)?.data;
  return data?.id ?? data?.receipt?.receipt_id ?? null;
}
function retryMilliseconds(value?: string | number): number | undefined {
  if (value === undefined) return undefined;
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric * 1000;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? Math.max(0, parsed - Date.now()) : undefined;
}
function abortError(ctx: OperationContext, signal?: AbortSignal): SDKWaitTimeout {
  return signal?.aborted ? new SDKCancelled("Local operation cancelled", ctx.acceptance, ctx.last)
    : new SDKWaitTimeout("Local wait deadline exceeded", ctx.acceptance, ctx.last);
}
function ensureLocal(ctx: OperationContext, options: NativeRequestOptions): void {
  if (options.signal?.aborted || (ctx.deadline !== undefined && Date.now() >= ctx.deadline)) throw abortError(ctx, options.signal);
}
async function waitDelay(ms: number, ctx: OperationContext, options: NativeRequestOptions): Promise<void> {
  ensureLocal(ctx, options);
  const remaining = ctx.deadline === undefined ? ms : Math.min(ms, Math.max(0, ctx.deadline - Date.now()));
  await new Promise<void>((resolve, reject) => {
    const done = (): void => { clearTimeout(timer); options.signal?.removeEventListener("abort", cancelled); resolve(); };
    const cancelled = (): void => { clearTimeout(timer); options.signal?.removeEventListener("abort", cancelled); reject(abortError(ctx, options.signal)); };
    const timer = setTimeout(done, remaining);
    options.signal?.addEventListener("abort", cancelled, {once: true});
  });
  ensureLocal(ctx, options);
}

export class NativeBeeOSClient {
  readonly sandboxes: NativeSandboxesModule;
  readonly templates: NativeTemplatesModule;
  readonly accessTickets: NativeAccessTicketsModule;
  readonly agents: NativeAgentsModule;
  readonly models: NativeModelsModule;
  readonly sessions: NativeSessionsModule;
  readonly responses: NativeResponsesModule;
  readonly files: NativeFilesModule;
  readonly capabilities: NativeCapabilitiesModule;
  readonly canvases: NativeCanvasesModule;
  constructor(readonly options: NativeClientOptions) {
    const url = new URL(options.baseURL);
    if (!options.apiKey || !["https:", "http:"].includes(url.protocol)) throw new Error("baseURL and server API key are required");
    this.sandboxes = new NativeSandboxesModule(this);
    this.templates = new NativeTemplatesModule(this);
    this.accessTickets = new NativeAccessTicketsModule(this);
    this.agents = new NativeAgentsModule(this);
    this.models = new NativeModelsModule(this);
    this.sessions = new NativeSessionsModule(this);
    this.responses = new NativeResponsesModule(this);
    this.files = new NativeFilesModule(this);
    this.capabilities = new NativeCapabilitiesModule(this);
    this.canvases = new NativeCanvasesModule(this);
  }
  async call<T>(op: NativeOperation, path: Record<string, string>, body: unknown, options: NativeRequestOptions): Promise<BeeOSHTTPResponse<T>> {
    const ctx = this.context(op, options);
    let result = await this.request<T>(op, path, body, options, ctx);
    if (op.wait && options.wait !== false) result = await this.observe(op, path, result, options, ctx);
    return result;
  }
  private context(op: NativeOperation, options: NativeRequestOptions): OperationContext {
    const keyed = op.parameters.some(p => p.name === "Idempotency-Key");
    const key = keyed ? options.idempotencyKey ?? createNativeIdempotencyKey() : undefined;
    if (key !== undefined && (!key.length || key.length > 256)) throw new Error("Idempotency-Key must contain 1–256 characters");
    for (const seconds of [options.requestTimeoutSeconds, options.waitTimeoutSeconds, options.pollIntervalSeconds]) {
      if (seconds !== undefined && (!Number.isFinite(seconds) || seconds <= 0)) throw new Error("Local timeout and polling values must be positive");
    }
    return {key, acceptance: key === undefined ? undefined : {status: null, resource_id: null, etag: null, request_id: null, idempotency_key: key},
      deadline: op.wait && options.wait !== false ? Date.now() + (options.waitTimeoutSeconds ?? 300) * 1000 : undefined};
  }
  private async open(op: NativeOperation, path: Record<string, string>, body: unknown, options: NativeRequestOptions, ctx: OperationContext): Promise<{response: Response; release: () => void; controller: AbortController}> {
    ensureLocal(ctx, options);
    let target = op.path;
    for (const [key, value] of Object.entries(path)) target = target.replace("{" + key + "}", encodeURIComponent(value));
    const url = new URL(target, new URL(this.options.baseURL).origin);
    const headers = new Headers({Authorization: "Bearer " + (typeof this.options.apiKey === "function" ? this.options.apiKey() : this.options.apiKey), Accept: op.responseType === "sse" ? "text/event-stream" : op.responseType === "bytes" ? "application/octet-stream" : "application/json"});
    const values = options as NativeRequestOptions & Record<string, unknown>;
    for (const parameter of op.parameters) {
      if (parameter.in === "path") continue;
      const value = parameter.name === "Idempotency-Key" ? ctx.key : values[parameter.option];
      if (value === undefined) {
        if (parameter.required) throw new Error("Missing required option: " + parameter.option);
        continue;
      }
      if (parameter.name === "If-Match" && (typeof value !== "string" || !/^"[^"\r\n]+"$/.test(value))) throw new Error("ifMatch must be a strong quoted ETag");
      if (parameter.in === "header") headers.set(parameter.name, String(value));
      else if (parameter.in === "query") for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(parameter.name, String(item));
    }
    if (op.contentType) headers.set("Content-Type", op.contentType);
    const controller = new AbortController();
    const abort = (): void => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", abort, {once: true});
    let requestExpired = false;
    const limit = Math.min((options.requestTimeoutSeconds ?? 30) * 1000, ctx.deadline === undefined ? Infinity : Math.max(0, ctx.deadline - Date.now()));
    const timer = setTimeout(() => {requestExpired = true; controller.abort();}, limit);
    const release = (): void => {clearTimeout(timer); options.signal?.removeEventListener("abort", abort);};
    try {
      const init: RequestInit & {duplex?: "half"} = {method: op.method, headers, signal: controller.signal};
      if (body !== undefined) init.body = op.contentType === "application/json" ? JSON.stringify(body) : body as BodyInit;
      if (body instanceof ReadableStream) init.duplex = "half";
      const response = await (this.options.fetch ?? globalThis.fetch)(url, init);
      if (!response.ok) {
        const responseHeaders = nativeHeaders(response.headers);
        const text = await response.text();
        let envelope: unknown = text;
        try { envelope = JSON.parse(text); } catch (error) { if (!(error instanceof SyntaxError)) throw error; }
        const flat = typeof envelope === "object" && envelope !== null ? envelope as Record<string, unknown> : {};
        const payload = typeof flat.error === "object" && flat.error !== null ? flat.error as Record<string, unknown> : flat;
        const details = typeof payload.details === "object" && payload.details !== null ? payload.details as Record<string, unknown> : {};
        throw new NativeBeeOSAPIError(response.status, typeof payload.code === "string" ? payload.code : "invalid_response",
          typeof payload.message === "string" ? payload.message : response.statusText,
          typeof payload.reason === "string" ? payload.reason : typeof details.reason === "string" ? details.reason : undefined,
          responseHeaders.should_retry ?? (typeof payload.should_retry === "boolean" ? payload.should_retry : undefined),
          responseHeaders.retry_after ?? (typeof payload.retry_after === "number" ? payload.retry_after : undefined),
          responseHeaders.request_id ?? (typeof payload.request_id === "string" ? payload.request_id : undefined), envelope, responseHeaders, ctx.acceptance);
      }
      return {response, release, controller};
    } catch (error) {
      release();
      if (options.signal?.aborted) throw new SDKCancelled("Local operation cancelled", ctx.acceptance, ctx.last);
      if (ctx.deadline !== undefined && Date.now() >= ctx.deadline) throw new SDKWaitTimeout("Local wait deadline exceeded", ctx.acceptance, ctx.last);
      if (requestExpired) throw new SDKRequestTimeout("HTTP request deadline exceeded", ctx.acceptance, ctx.last);
      if (error instanceof NativeBeeOSAPIError || error instanceof SDKWaitTimeout) throw error;
      throw new SDKTransportError("HTTP transport failed", ctx.acceptance, ctx.last, error);
    }
  }
  private async request<T>(op: NativeOperation, path: Record<string, string>, body: unknown, options: NativeRequestOptions, ctx: OperationContext): Promise<BeeOSHTTPResponse<T>> {
    const opened = await this.open(op, path, body, options, ctx);
    try {
      const response = opened.response;
      const value = response.status === 204 ? undefined : op.responseType === "bytes" ? new Uint8Array(await response.arrayBuffer()) : await response.json();
      const result: BeeOSHTTPResponse<T> = {status: response.status, body: value as T, headers: nativeHeaders(response.headers)};
      if (ctx.key && ctx.acceptance?.status === null) ctx.acceptance = {status: result.status, resource_id: resourceId(value), etag: result.headers.etag ?? null, request_id: result.headers.request_id ?? null, idempotency_key: ctx.key};
      if (ctx.acceptance) result.acceptance = ctx.acceptance;
      ctx.last = result;
      return result;
    } catch (error) {
      if (opened.controller.signal.aborted) {
        if (options.signal?.aborted) throw new SDKCancelled("Local operation cancelled", ctx.acceptance, ctx.last);
        if (ctx.deadline !== undefined && Date.now() >= ctx.deadline) throw new SDKWaitTimeout("Local wait deadline exceeded", ctx.acceptance, ctx.last);
        throw new SDKRequestTimeout("HTTP response deadline exceeded", ctx.acceptance, ctx.last);
      }
      throw error;
    } finally { opened.release(); }
  }
  private async observe<T>(op: NativeOperation, path: Record<string, string>, initial: BeeOSHTTPResponse<T>, options: NativeRequestOptions, ctx: OperationContext): Promise<BeeOSHTTPResponse<T>> {
    let result = initial;
    let previous: string | undefined;
    const revision = op.id === "createNativeAgent" || op.id === "updateNativeAgent" ? (initial.body as NativeAgentResult).data.publication.accepted_config_revision : undefined;
    const target = revision === undefined ? undefined : (initial.body as NativeAgentResult).data.configuration.target;
    for (;;) {
      ensureLocal(ctx, options);
      const observation = JSON.stringify([result.status, result.headers.etag, result.body]);
      if (observation !== previous) {
        previous = observation;
        try {options.onProgress?.(result);} catch (error) {
          if (error instanceof Error && Object.isExtensible(error)) Object.assign(error, {acceptance: ctx.acceptance, last_response: ctx.last});
          throw error;
        }
      }
      let poll: NativeOperation; let args: Record<string, string>;
      if (op.id === "createSandbox" || op.id === "resumeSandbox") {
        const sandbox = (result.body as SandboxResult).data;
        if (sandbox.status === "running") return result;
        if (sandbox.status === "error" || sandbox.status === "unknown") throw new SDKOperationFailed("Sandbox preparation requires inspection", ctx.acceptance, result);
        poll = nativeOperations.getSandbox; args = {sandbox_id: sandbox.id};
      } else if (revision !== undefined) {
        const agent = (result.body as NativeAgentResult).data;
        if (agent.desired_config_revision !== revision || agent.publication.accepted_config_revision !== revision || agent.publication.state === "superseded") throw new SDKPublicationSuperseded("Agent publication was superseded", ctx.acceptance, result);
        if (agent.publication.state === "deferred" || target?.kind === "recipe" || agent.publication.changed_components.length === 0) return result;
        if (["failed", "partial", "unknown"].includes(agent.publication.state)) throw new SDKOperationFailed("Agent publication requires inspection", ctx.acceptance, result);
        if (agent.publication.state === "ready" && agent.binding?.prepared_config_revision === revision && target?.kind === "managed" && agent.binding.sandbox_id === target.sandbox_id) return result;
        poll = nativeOperations.getNativeAgent; args = {agent_id: agent.id};
      } else if (op.id === "runSandboxCommand") {
        const command = (result.body as CommandResultEnvelope).data;
        if (command.state === "completed" || command.state === "unknown") return result;
        poll = nativeOperations.getSandboxCommand; args = {sandbox_id: path.sandbox_id, command_id: command.id};
      } else {
        const memory = (result.body as NativeMemoryReceiptResult).data;
        if (["durable", "recallable"].includes(memory.completion) && ["committed", "duplicate"].includes(memory.receipt.disposition) && memory.receipt.committed_at !== null && memory.receipt.read_watermark !== null) return result;
        if (["failed", "blocked", "unknown"].includes(memory.completion)) throw new SDKOperationFailed("Memory durability requires inspection", ctx.acceptance, result);
        poll = nativeOperations.getNativeMemoryReceipt; args = {agent_id: path.agent_id, receipt_id: memory.receipt.receipt_id};
      }
      await waitDelay(retryMilliseconds(result.headers.retry_after) ?? (options.pollIntervalSeconds ?? .25) * 1000, ctx, options);
      for (;;) {
        try { result = await this.request<T>(poll, args, undefined, options, ctx); break; }
        catch (error) {
          if (!(error instanceof NativeBeeOSAPIError) || error.should_retry !== true || [401,403,409,412].includes(error.status)) throw error;
          await waitDelay(retryMilliseconds(error.retry_after) ?? (options.pollIntervalSeconds ?? .25) * 1000, ctx, options);
        }
      }
    }
  }
  async stream<T>(op: NativeOperation, path: Record<string, string>, options: NativeRequestOptions & {lastEventId?: string}): Promise<NativeEventStream<T>> {
    const ctx = this.context(op, options);
    const opened = await this.open(op, path, undefined, options, ctx);
    opened.release();
    if (!opened.response.headers.get("Content-Type")?.toLowerCase().startsWith("text/event-stream") || !opened.response.body) {
      opened.controller.abort(); throw new Error("Expected a text/event-stream response body");
    }
    return new NativeEventStream<T>(opened.response, opened.controller, options.signal, options.lastEventId,
      op.id === "streamNativeResponseEvents" ? NATIVE_RESPONSE_EVENT_TYPES : undefined);
  }
}
export class NativeEventStream<T> implements AsyncIterable<T> {
  readonly status: number; readonly headers: BeeOSHTTPHeaders; lastEventId?: string;
  private started = false;
  private readonly abort: () => void;
  constructor(private readonly response: Response, private readonly controller: AbortController, private readonly signal?: AbortSignal, lastEventId?: string,
    private readonly eventTypes?: ReadonlySet<string>) {
    this.status = response.status; this.headers = nativeHeaders(response.headers); this.lastEventId = lastEventId;
    this.abort = () => this.controller.abort(this.signal?.reason);
    signal?.addEventListener("abort", this.abort, {once: true});
    if (signal?.aborted) this.abort();
  }
  close(): void { this.controller.abort(); this.signal?.removeEventListener("abort", this.abort); }
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    if (this.started) throw new Error("An event stream can only be consumed once");
    this.started = true;
    try {
      for await (const event of parseNativeSSE(this.response.body!, {signal: this.controller.signal, maxEventBytes: 1024 * 1024})) {
        const value = JSON.parse(event.data) as T;
        if (event.id !== undefined) this.lastEventId = event.id;
        // A newer producer may emit an event type this SDK does not model yet;
        // skip it and keep the durable stream open at the last seen ID.
        if (this.eventTypes && (typeof (value as {type?: unknown}).type !== "string" || !this.eventTypes.has((value as {type: string}).type))) continue;
        yield value;
      }
    } finally { this.close(); }
  }
}
export interface NativeResponseStream { response_id: string; response: BeeOSHTTPResponse<NativeResponseResult>; events: NativeEventStream<NativeResponseEvent>; }
export interface NativeWebSocket {
  readonly readyState: number; readonly bufferedAmount: number; readonly protocol: string; binaryType?: string;
  send(data: string | Uint8Array): void; close(code?: number, reason?: string): void;
  addEventListener(type: string, listener: (event: {data?: unknown}) => void, options?: {once?: boolean}): void;
  removeEventListener(type: string, listener: (event: {data?: unknown}) => void): void;
}
export interface TerminalServerFrame {
  type: "terminal.opened" | "terminal.output" | "terminal.exit" | "terminal.error" | "terminal.pong";
  protocolVersion: 1; clientId: string; terminalId: string; sequence: string;
  resumed?: boolean; columns?: number; rows?: number; data?: string; encoding?: "utf8" | "base64";
  truncated?: boolean; exitCode?: number; code?: string; message?: string;
}
export interface DesktopServerFrame {
  type: "desktop_ready" | "answer" | "ice_candidate" | "fallback_ready" | "error";
  transport_generation?: 1 | 2; protocol_version?: 1; connection_id?: string;
  ice_transport_policy?: "relay"; ice_servers?: {urls: string[]; username: string; credential: string}[];
  rfb_profile?: "beeos-rfb-3.8-v1"; sdp?: string; candidate?: string;
  sdp_mid?: string | null; sdp_mline_index?: number | null; code?: string; message?: string;
}
export interface NativeConnectOptions extends NativeRequestOptions {
  lastServerSequence?: string; command?: string; args?: string[]; env?: Record<string, string>; cwd?: string;
}
/** A disconnect closes only the local socket. terminal.close is an explicit remote process-stop intent. */
export class NativeSocketConnection implements AsyncIterable<TerminalServerFrame | DesktopServerFrame | Uint8Array> {
  private queue: (TerminalServerFrame | DesktopServerFrame | Uint8Array)[] = [];
  private queuedBytes = 0;
  private pending?: {resolve: (value: IteratorResult<TerminalServerFrame | DesktopServerFrame | Uint8Array>) => void; reject: (error: unknown) => void};
  private ended = false; private failure?: Error; private sequence = 0n; private desktopGeneration = 1; lastServerSequence = "0"; private readonly abort: () => void;
  private readonly onMessage: (event: {data?: unknown}) => void;
  private readonly onClose: () => void;
  private readonly onError: () => void;
  private readonly encoder = new TextEncoder();
  constructor(readonly socket: NativeWebSocket, readonly ticket: Omit<AccessTicket, "ticket">, private readonly signal?: AbortSignal) {
    this.abort = () => {this.finish(new SDKCancelled("Local connection cancelled")); socket.close();};
    this.onMessage = event => {
      try {
        const value = typeof event.data === "string" ? JSON.parse(event.data) as TerminalServerFrame | DesktopServerFrame : event.data instanceof ArrayBuffer ? new Uint8Array(event.data) : event.data instanceof Uint8Array ? event.data : undefined;
        if (value === undefined) throw new Error("Unsupported WebSocket message type");
        if (value instanceof Uint8Array) {
          if (this.ticket.purpose !== "desktop" || this.desktopGeneration !== 2) throw new Error("WSS desktop fallback is not admitted");
        } else if (value.type === "fallback_ready" && value.transport_generation === 2) this.desktopGeneration = 2;
        else if (value.type.startsWith("terminal.")) {
          const terminal = value as TerminalServerFrame;
          if (this.ticket.purpose !== "pty" || terminal.protocolVersion !== 1 || terminal.clientId !== this.ticket.client_id || terminal.terminalId !== this.ticket.pty_id || !/^[1-9][0-9]{0,19}$/.test(terminal.sequence) || BigInt(terminal.sequence) > 18446744073709551615n) throw new Error("Terminal frame identity or sequence mismatch");
          if (terminal.type === "terminal.output" && BigInt(terminal.sequence) <= BigInt(this.lastServerSequence)) return;
          if (BigInt(terminal.sequence) > BigInt(this.lastServerSequence)) this.lastServerSequence = terminal.sequence;
        }
        const bytes = value instanceof Uint8Array ? value.byteLength : this.encoder.encode(JSON.stringify(value)).byteLength;
        if (bytes > 1024 * 1024 || this.queuedBytes + bytes > 1024 * 1024) throw new Error("WebSocket receive queue exceeded 1 MiB");
        if (this.pending) {const pending = this.pending; this.pending = undefined; pending.resolve({value, done: false});}
        else {this.queue.push(value); this.queuedBytes += bytes;}
      } catch (error) {this.finish(error instanceof Error ? error : new Error(String(error))); socket.close();}
    };
    this.onClose = () => this.finish();
    this.onError = () => this.finish(new Error("WebSocket connection failed"));
    socket.addEventListener("message", this.onMessage);
    socket.addEventListener("close", this.onClose);
    socket.addEventListener("error", this.onError);
    signal?.addEventListener("abort", this.abort, {once: true});
    if (signal?.aborted) this.abort();
  }
  private finish(error?: Error): void {
    this.ended = true; this.failure = error;
    if (this.pending) { const pending = this.pending; this.pending = undefined; if (error) pending.reject(error); else pending.resolve({done: true, value: undefined}); }
    this.signal?.removeEventListener("abort", this.abort);
    this.socket.removeEventListener("message", this.onMessage);
    this.socket.removeEventListener("close", this.onClose);
    this.socket.removeEventListener("error", this.onError);
  }
  private send(value: object | Uint8Array): void {
    if (this.ended || this.socket.readyState !== 1) throw this.failure ?? new Error("Connection is closed");
    const data = value instanceof Uint8Array ? value : JSON.stringify(value);
    const bytes = typeof data === "string" ? this.encoder.encode(data).byteLength : data.byteLength;
    if (bytes > 1024 * 1024 || this.socket.bufferedAmount + bytes > 1024 * 1024) throw new Error("WebSocket send queue exceeded 1 MiB");
    this.socket.send(data);
  }
  private terminal(type: string, fields: object = {}): void {
    if (this.ticket.purpose !== "pty" || !this.ticket.pty_id) throw new Error("This connection is not a PTY");
    this.sequence += 1n;
    if (this.sequence > 18446744073709551615n) throw new Error("Terminal client sequence exhausted");
    this.send({protocolVersion: 1, clientId: this.ticket.client_id, terminalId: this.ticket.pty_id, clientSequence: this.sequence.toString(), type, ...fields});
  }
  /** Sending input proves local send only. Unacknowledged input is never replayed. */
  write(data: string, encoding: "utf8" | "base64" = "utf8"): void {
    const bytes = encoding === "utf8" ? this.encoder.encode(data).byteLength : Uint8Array.from(atob(data), c => c.charCodeAt(0)).byteLength;
    if (bytes > 16384) throw new Error("Terminal input exceeds 16 KiB");
    this.terminal("terminal.input", {data, encoding});
  }
  resize(columns: number, rows: number): void {
    if (![columns, rows].every(value => Number.isInteger(value) && value >= 1 && value <= 1000)) throw new Error("Terminal dimensions must be 1–1000");
    this.terminal("terminal.resize", {columns, rows});
  }
  ping(): void { this.terminal("terminal.ping"); }
  closeTerminal(): void { this.terminal("terminal.close"); }
  disconnect(): void {this.finish(); this.socket.close(1000);}
  private desktop(value: object): void { if (this.ticket.purpose !== "desktop") throw new Error("Connection is not desktop"); this.send(value); }
  offer(sdp: string): void { this.desktop({type: "offer", protocol_version: 1, sdp, transport_generation: 1}); }
  ice(candidate: string, sdp_mid: string | null, sdp_mline_index: number | null): void { this.desktop({type: "ice_candidate", candidate, sdp_mid, sdp_mline_index, transport_generation: 1}); }
  startDesktop(): void { this.desktop({type: "desktop_start", transport: "webrtc", transport_generation: 1}); }
  /** Call after the negotiated WebRTC DataChannel opens to start the generation-1 stream. */
  startDesktopStream(): void { this.desktop({type: "start", transport_generation: 1}); }
  fallback(): void { this.desktop({type: "fallback", transport: "websocket", protocol: "rfb-3.8", transport_generation: 2}); }
  sendDesktopBytes(data: Uint8Array): void { if (this.ticket.purpose !== "desktop" || this.desktopGeneration !== 2) throw new Error("WSS desktop fallback is not admitted"); this.send(data); }
  openTerminal(body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions): void {
    if (body.pty_id) this.terminal("terminal.resume", {lastServerSequence: options.lastServerSequence ?? "0"});
    else this.terminal("terminal.open", {columns: body.cols, rows: body.rows, command: options.command, args: options.args, env: options.env, cwd: options.cwd});
  }
  async next(): Promise<IteratorResult<TerminalServerFrame | DesktopServerFrame | Uint8Array>> {
    if (this.queue.length) { const value = this.queue.shift()!; this.queuedBytes -= value instanceof Uint8Array ? value.byteLength : this.encoder.encode(JSON.stringify(value)).byteLength; return {value, done: false}; }
    if (this.failure) throw this.failure;
    if (this.ended) return {value: undefined, done: true};
    if (this.pending) throw new Error("Only one WebSocket reader is allowed");
    return new Promise((resolve, reject) => {this.pending = {resolve, reject};});
  }
  async *[Symbol.asyncIterator](): AsyncIterator<TerminalServerFrame | DesktopServerFrame | Uint8Array> {
    try { for (;;) {const item = await this.next(); if (item.done) return; yield item.value;} }
    finally {this.disconnect();}
  }
}
async function connectNativeSocket(client: NativeBeeOSClient, sandboxId: string, purpose: "pty" | "desktop", body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions): Promise<NativeSocketConnection> {
  const accepted = await client.accessTickets.create(sandboxId, {...body, purpose}, options);
  const ticket = accepted.body.data;
  const {ticket: secret, ...metadata} = ticket;
  try {
  const url = new URL(ticket.connect_url);
  if (url.protocol !== "wss:" || url.search || url.username || url.password || url.hash) throw new Error("Access ticket connect_url must be an exact WSS URL without query credentials");
  const expected = purpose === "pty" ? "beeos-terminal-v2" : "beeos-desktop-v1";
  if (ticket.profile !== expected || ticket.purpose !== purpose || ticket.sandbox_id !== sandboxId) throw new Error("Access ticket profile or target mismatch");
  const factory = client.options.webSocketFactory ?? ((endpoint: string, profile: string) => new WebSocket(endpoint, profile) as unknown as NativeWebSocket);
  const socket = factory(ticket.connect_url, expected);
  socket.binaryType = "arraybuffer";
  const connection = new NativeSocketConnection(socket, metadata, options.signal);
  connection.lastServerSequence = options.lastServerSequence ?? "0";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.min(5000, (options.requestTimeoutSeconds ?? 30) * 1000));
  const cancel = (): void => controller.abort();
  options.signal?.addEventListener("abort", cancel, {once: true});
  const closeOnAbort = (): void => connection.disconnect();
  controller.signal.addEventListener("abort", closeOnAbort, {once: true});
  try {
    await new Promise<void>((resolve, reject) => {
      const clean = (): void => {socket.removeEventListener("open", opened); socket.removeEventListener("error", failed); socket.removeEventListener("close", failed); controller.signal.removeEventListener("abort", failed);};
      const opened = (): void => {clean(); resolve();};
      const failed = (): void => {clean(); reject(new Error("WebSocket admission failed"));};
      socket.addEventListener("open", opened, {once: true}); socket.addEventListener("error", failed, {once: true}); socket.addEventListener("close", failed, {once: true}); controller.signal.addEventListener("abort", failed, {once: true});
      if (socket.readyState === 1) opened();
    });
    if (socket.protocol !== expected) throw new Error("WebSocket subprotocol mismatch");
    socket.send(JSON.stringify({type: "authenticate", profile: expected, ticket: secret}));
    const auth = await connection.next();
    const value = auth.value as unknown as {type?: string; profile?: string; client_id?: string; sandbox_id?: string; terminal_id?: string};
    if (auth.done || value.type !== "authenticated" || value.profile !== expected || value.client_id !== ticket.client_id || value.sandbox_id !== sandboxId || (purpose === "pty" && value.terminal_id !== ticket.pty_id)) throw new Error("WebSocket authenticated identity mismatch");
    if (purpose === "pty") {
      connection.openTerminal(body, options);
      const opened = await connection.next();
      const frame = opened.value as TerminalServerFrame;
      if (opened.done || frame.type !== "terminal.opened" || frame.terminalId !== ticket.pty_id || frame.clientId !== ticket.client_id || frame.resumed !== Boolean(body.pty_id)) throw new Error("PTY did not open or resume the requested terminal");
    }
    return connection;
  } catch (error) {connection.disconnect(); throw error;}
  finally {clearTimeout(timeout); options.signal?.removeEventListener("abort", cancel); controller.signal.removeEventListener("abort", closeOnAbort);}
  } catch (error) {throw new SDKConnectionError(metadata, accepted.acceptance, error);}
}

export type TerminalConnection = NativeSocketConnection;
export type DesktopSignalingConnection = NativeSocketConnection;

const nativeOperations = {
  "createSandbox": {
    "id": "createSandbox",
    "method": "POST",
    "path": "/v1/sandboxes",
    "parameters": [
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "listSandboxes": {
    "id": "listSandboxes",
    "method": "GET",
    "path": "/v1/sandboxes",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      },
      {
        "name": "status",
        "in": "query",
        "required": false,
        "option": "status"
      },
      {
        "name": "label",
        "in": "query",
        "required": false,
        "option": "label"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getSandbox": {
    "id": "getSandbox",
    "method": "GET",
    "path": "/v1/sandboxes/{sandbox_id}",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "patchSandbox": {
    "id": "patchSandbox",
    "method": "PATCH",
    "path": "/v1/sandboxes/{sandbox_id}",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "terminateSandbox": {
    "id": "terminateSandbox",
    "method": "POST",
    "path": "/v1/sandboxes/{sandbox_id}/terminate",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      }
    ],
    "responseType": "void",
    "wait": false
  },
  "pauseSandbox": {
    "id": "pauseSandbox",
    "method": "POST",
    "path": "/v1/sandboxes/{sandbox_id}/pause",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "resumeSandbox": {
    "id": "resumeSandbox",
    "method": "POST",
    "path": "/v1/sandboxes/{sandbox_id}/resume",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "listSandboxTemplates": {
    "id": "listSandboxTemplates",
    "method": "GET",
    "path": "/v1/sandbox-templates",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getSandboxTemplate": {
    "id": "getSandboxTemplate",
    "method": "GET",
    "path": "/v1/sandbox-templates/{template_id}",
    "parameters": [
      {
        "name": "template_id",
        "in": "path",
        "required": true,
        "option": "templateId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "createSandboxAccessTicket": {
    "id": "createSandboxAccessTicket",
    "method": "POST",
    "path": "/v1/sandboxes/{sandbox_id}/access-tickets",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "revokeSandboxAccessTicket": {
    "id": "revokeSandboxAccessTicket",
    "method": "DELETE",
    "path": "/v1/sandboxes/{sandbox_id}/access-tickets/{ticket_id}",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "ticket_id",
        "in": "path",
        "required": true,
        "option": "ticketId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      }
    ],
    "responseType": "void",
    "wait": false
  },
  "runSandboxCommand": {
    "id": "runSandboxCommand",
    "method": "POST",
    "path": "/v1/sandboxes/{sandbox_id}/commands",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "getSandboxCommand": {
    "id": "getSandboxCommand",
    "method": "GET",
    "path": "/v1/sandboxes/{sandbox_id}/commands/{command_id}",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "command_id",
        "in": "path",
        "required": true,
        "option": "commandId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "cancelSandboxCommand": {
    "id": "cancelSandboxCommand",
    "method": "POST",
    "path": "/v1/sandboxes/{sandbox_id}/commands/{command_id}/cancel",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "command_id",
        "in": "path",
        "required": true,
        "option": "commandId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "streamSandboxCommandEvents": {
    "id": "streamSandboxCommandEvents",
    "method": "GET",
    "path": "/v1/sandboxes/{sandbox_id}/commands/{command_id}/events",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "command_id",
        "in": "path",
        "required": true,
        "option": "commandId"
      },
      {
        "name": "Last-Event-ID",
        "in": "header",
        "required": false,
        "option": "lastEventId"
      }
    ],
    "responseType": "sse",
    "wait": false
  },
  "writeSandboxFile": {
    "id": "writeSandboxFile",
    "method": "PUT",
    "path": "/v1/sandboxes/{sandbox_id}/files",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "path",
        "in": "query",
        "required": true,
        "option": "path"
      },
      {
        "name": "Content-Length",
        "in": "header",
        "required": true,
        "option": "contentLength"
      },
      {
        "name": "Content-SHA256",
        "in": "header",
        "required": true,
        "option": "contentSha256"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": false,
        "option": "ifMatch"
      },
      {
        "name": "If-None-Match",
        "in": "header",
        "required": false,
        "option": "ifNoneMatch"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/octet-stream",
    "responseType": "json",
    "wait": false
  },
  "readSandboxFile": {
    "id": "readSandboxFile",
    "method": "GET",
    "path": "/v1/sandboxes/{sandbox_id}/files",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "path",
        "in": "query",
        "required": true,
        "option": "path"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": false,
        "option": "ifMatch"
      }
    ],
    "responseType": "bytes",
    "wait": false
  },
  "downloadCommandArtifact": {
    "id": "downloadCommandArtifact",
    "method": "GET",
    "path": "/v1/sandboxes/{sandbox_id}/commands/{command_id}/artifacts/{artifact_id}",
    "parameters": [
      {
        "name": "sandbox_id",
        "in": "path",
        "required": true,
        "option": "sandboxId"
      },
      {
        "name": "command_id",
        "in": "path",
        "required": true,
        "option": "commandId"
      },
      {
        "name": "artifact_id",
        "in": "path",
        "required": true,
        "option": "artifactId"
      }
    ],
    "responseType": "bytes",
    "wait": false
  },
  "createNativeAgent": {
    "id": "createNativeAgent",
    "method": "POST",
    "path": "/v2/agents",
    "parameters": [
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "listNativeAgents": {
    "id": "listNativeAgents",
    "method": "GET",
    "path": "/v2/agents",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getNativeAgent": {
    "id": "getNativeAgent",
    "method": "GET",
    "path": "/v2/agents/{agent_id}",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "updateNativeAgent": {
    "id": "updateNativeAgent",
    "method": "PATCH",
    "path": "/v2/agents/{agent_id}",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "deleteNativeAgent": {
    "id": "deleteNativeAgent",
    "method": "DELETE",
    "path": "/v2/agents/{agent_id}",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "listNativeModels": {
    "id": "listNativeModels",
    "method": "GET",
    "path": "/v2/models",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "listNativeAgentModels": {
    "id": "listNativeAgentModels",
    "method": "GET",
    "path": "/v2/agents/{agent_id}/models",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getNativeAgentSkillFiles": {
    "id": "getNativeAgentSkillFiles",
    "method": "GET",
    "path": "/v2/agents/{agent_id}/skills/{skill_id}/files",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "skill_id",
        "in": "path",
        "required": true,
        "option": "skillId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "revokeNativeAgentAuthorizations": {
    "id": "revokeNativeAgentAuthorizations",
    "method": "POST",
    "path": "/v2/agents/{agent_id}/authorizations/revoke",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "createNativeSession": {
    "id": "createNativeSession",
    "method": "POST",
    "path": "/v2/sessions",
    "parameters": [
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "listNativeSessions": {
    "id": "listNativeSessions",
    "method": "GET",
    "path": "/v2/sessions",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      },
      {
        "name": "agent_id",
        "in": "query",
        "required": false,
        "option": "agentId"
      },
      {
        "name": "order",
        "in": "query",
        "required": false,
        "option": "order"
      },
      {
        "name": "state",
        "in": "query",
        "required": false,
        "option": "state"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getNativeSession": {
    "id": "getNativeSession",
    "method": "GET",
    "path": "/v2/sessions/{session_id}",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "updateNativeSession": {
    "id": "updateNativeSession",
    "method": "PATCH",
    "path": "/v2/sessions/{session_id}",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      },
      {
        "name": "If-Match",
        "in": "header",
        "required": true,
        "option": "ifMatch"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "deleteNativeSession": {
    "id": "deleteNativeSession",
    "method": "DELETE",
    "path": "/v2/sessions/{session_id}",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "createNativeResponse": {
    "id": "createNativeResponse",
    "method": "POST",
    "path": "/v2/responses",
    "parameters": [
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "getNativeResponse": {
    "id": "getNativeResponse",
    "method": "GET",
    "path": "/v2/responses/{response_id}",
    "parameters": [
      {
        "name": "response_id",
        "in": "path",
        "required": true,
        "option": "responseId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "deleteNativeResponse": {
    "id": "deleteNativeResponse",
    "method": "DELETE",
    "path": "/v2/responses/{response_id}",
    "parameters": [
      {
        "name": "response_id",
        "in": "path",
        "required": true,
        "option": "responseId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "cancelNativeResponse": {
    "id": "cancelNativeResponse",
    "method": "POST",
    "path": "/v2/responses/{response_id}/cancel",
    "parameters": [
      {
        "name": "response_id",
        "in": "path",
        "required": true,
        "option": "responseId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "streamNativeResponseEvents": {
    "id": "streamNativeResponseEvents",
    "method": "GET",
    "path": "/v2/responses/{response_id}/events",
    "parameters": [
      {
        "name": "response_id",
        "in": "path",
        "required": true,
        "option": "responseId"
      },
      {
        "name": "Last-Event-ID",
        "in": "header",
        "required": false,
        "option": "lastEventId"
      }
    ],
    "responseType": "sse",
    "wait": false
  },
  "listNativeResponseInputItems": {
    "id": "listNativeResponseInputItems",
    "method": "GET",
    "path": "/v2/responses/{response_id}/input-items",
    "parameters": [
      {
        "name": "response_id",
        "in": "path",
        "required": true,
        "option": "responseId"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "replyNativeInteraction": {
    "id": "replyNativeInteraction",
    "method": "POST",
    "path": "/v2/responses/{response_id}/interactions/{interaction_id}/reply",
    "parameters": [
      {
        "name": "response_id",
        "in": "path",
        "required": true,
        "option": "responseId"
      },
      {
        "name": "interaction_id",
        "in": "path",
        "required": true,
        "option": "interactionId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "createNativeFile": {
    "id": "createNativeFile",
    "method": "POST",
    "path": "/v2/files",
    "parameters": [
      {
        "name": "filename",
        "in": "query",
        "required": true,
        "option": "filename"
      },
      {
        "name": "media_type",
        "in": "query",
        "required": true,
        "option": "mediaType"
      },
      {
        "name": "Content-Length",
        "in": "header",
        "required": true,
        "option": "contentLength"
      },
      {
        "name": "Content-SHA256",
        "in": "header",
        "required": true,
        "option": "contentSha256"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/octet-stream",
    "responseType": "json",
    "wait": false
  },
  "getNativeFile": {
    "id": "getNativeFile",
    "method": "GET",
    "path": "/v2/files/{file_id}",
    "parameters": [
      {
        "name": "file_id",
        "in": "path",
        "required": true,
        "option": "fileId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "deleteNativeFile": {
    "id": "deleteNativeFile",
    "method": "DELETE",
    "path": "/v2/files/{file_id}",
    "parameters": [
      {
        "name": "file_id",
        "in": "path",
        "required": true,
        "option": "fileId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "downloadNativeFile": {
    "id": "downloadNativeFile",
    "method": "GET",
    "path": "/v2/files/{file_id}/content",
    "parameters": [
      {
        "name": "file_id",
        "in": "path",
        "required": true,
        "option": "fileId"
      }
    ],
    "responseType": "bytes",
    "wait": false
  },
  "listNativeSessionFiles": {
    "id": "listNativeSessionFiles",
    "method": "GET",
    "path": "/v2/sessions/{session_id}/files",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getNativeCapabilities": {
    "id": "getNativeCapabilities",
    "method": "GET",
    "path": "/v2/capabilities",
    "parameters": [],
    "responseType": "json",
    "wait": false
  },
  "listNativeSessionResponses": {
    "id": "listNativeSessionResponses",
    "method": "GET",
    "path": "/v2/sessions/{session_id}/responses",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "option": "limit"
      },
      {
        "name": "cursor",
        "in": "query",
        "required": false,
        "option": "cursor"
      },
      {
        "name": "order",
        "in": "query",
        "required": false,
        "option": "order"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "rememberNativeMemory": {
    "id": "rememberNativeMemory",
    "method": "POST",
    "path": "/v2/agents/{agent_id}/memory/remember",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "recallNativeMemory": {
    "id": "recallNativeMemory",
    "method": "POST",
    "path": "/v2/agents/{agent_id}/memory/recall",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "correctNativeMemory": {
    "id": "correctNativeMemory",
    "method": "POST",
    "path": "/v2/agents/{agent_id}/memory/records/{record_id}/correct",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "record_id",
        "in": "path",
        "required": true,
        "option": "recordId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": true
  },
  "forgetNativeMemory": {
    "id": "forgetNativeMemory",
    "method": "POST",
    "path": "/v2/agents/{agent_id}/memory/records/{record_id}/forget",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "record_id",
        "in": "path",
        "required": true,
        "option": "recordId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "getNativeMemoryReceipt": {
    "id": "getNativeMemoryReceipt",
    "method": "GET",
    "path": "/v2/agents/{agent_id}/memory/receipts/{receipt_id}",
    "parameters": [
      {
        "name": "agent_id",
        "in": "path",
        "required": true,
        "option": "agentId"
      },
      {
        "name": "receipt_id",
        "in": "path",
        "required": true,
        "option": "receiptId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "getNativeSessionCanvas": {
    "id": "getNativeSessionCanvas",
    "method": "GET",
    "path": "/v2/sessions/{session_id}/canvas",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "createNativeCanvasTicket": {
    "id": "createNativeCanvasTicket",
    "method": "POST",
    "path": "/v2/sessions/{session_id}/canvas-tickets",
    "parameters": [
      {
        "name": "session_id",
        "in": "path",
        "required": true,
        "option": "sessionId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "getNativeCanvasShare": {
    "id": "getNativeCanvasShare",
    "method": "GET",
    "path": "/v2/canvases/{canvas_id}/share",
    "parameters": [
      {
        "name": "canvas_id",
        "in": "path",
        "required": true,
        "option": "canvasId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "createNativeCanvasShare": {
    "id": "createNativeCanvasShare",
    "method": "POST",
    "path": "/v2/canvases/{canvas_id}/share",
    "parameters": [
      {
        "name": "canvas_id",
        "in": "path",
        "required": true,
        "option": "canvasId"
      }
    ],
    "contentType": "application/json",
    "responseType": "json",
    "wait": false
  },
  "deleteNativeCanvasShare": {
    "id": "deleteNativeCanvasShare",
    "method": "DELETE",
    "path": "/v2/canvases/{canvas_id}/share",
    "parameters": [
      {
        "name": "canvas_id",
        "in": "path",
        "required": true,
        "option": "canvasId"
      }
    ],
    "responseType": "void",
    "wait": false
  },
  "listNativeCanvasSnapshots": {
    "id": "listNativeCanvasSnapshots",
    "method": "GET",
    "path": "/v2/canvases/{canvas_id}/snapshots",
    "parameters": [
      {
        "name": "canvas_id",
        "in": "path",
        "required": true,
        "option": "canvasId"
      }
    ],
    "responseType": "json",
    "wait": false
  },
  "restoreNativeCanvasSnapshot": {
    "id": "restoreNativeCanvasSnapshot",
    "method": "POST",
    "path": "/v2/canvases/{canvas_id}/snapshots/{snapshot_id}/restore",
    "parameters": [
      {
        "name": "canvas_id",
        "in": "path",
        "required": true,
        "option": "canvasId"
      },
      {
        "name": "snapshot_id",
        "in": "path",
        "required": true,
        "option": "snapshotId"
      },
      {
        "name": "Idempotency-Key",
        "in": "header",
        "required": true,
        "option": "idempotencyKey"
      }
    ],
    "responseType": "json",
    "wait": false
  }
} satisfies Record<string, NativeOperation>;

export class NativeSandboxesModule {
  readonly commands: NativeSandboxesCommandsModule;
  readonly files: NativeSandboxesFilesModule;
  readonly pty: NativeSandboxesPtyModule;
  readonly desktop: NativeSandboxesDesktopModule;
  constructor(private readonly client: NativeBeeOSClient) {this.commands = new NativeSandboxesCommandsModule(client); this.files = new NativeSandboxesFilesModule(client); this.pty = new NativeSandboxesPtyModule(client); this.desktop = new NativeSandboxesDesktopModule(client);}
  create(body: SandboxCreate, options: CreateSandboxOptions = {}): Promise<BeeOSHTTPResponse<SandboxResult>> { return this.client.call<SandboxResult>(nativeOperations.createSandbox, {}, body, options); }
  list(options: ListSandboxesOptions = {}): Promise<BeeOSHTTPResponse<SandboxPage>> { return this.client.call<SandboxPage>(nativeOperations.listSandboxes, {}, undefined, options); }
  get(sandboxId: string, options: GetSandboxOptions = {}): Promise<BeeOSHTTPResponse<SandboxGetResult>> { return this.client.call<SandboxGetResult>(nativeOperations.getSandbox, {"sandbox_id": sandboxId}, undefined, options); }
  update(sandboxId: string, body: SandboxPatch, options: PatchSandboxOptions): Promise<BeeOSHTTPResponse<SandboxGetResult>> { return this.client.call<SandboxGetResult>(nativeOperations.patchSandbox, {"sandbox_id": sandboxId}, body, options); }
  terminate(sandboxId: string, options: TerminateSandboxOptions): Promise<BeeOSHTTPResponse<void>> { return this.client.call<void>(nativeOperations.terminateSandbox, {"sandbox_id": sandboxId}, undefined, options); }
  pause(sandboxId: string, body: PauseRequest, options: PauseSandboxOptions): Promise<BeeOSHTTPResponse<SandboxResult>> { return this.client.call<SandboxResult>(nativeOperations.pauseSandbox, {"sandbox_id": sandboxId}, body, options); }
  resume(sandboxId: string, body: ResumeRequest, options: ResumeSandboxOptions): Promise<BeeOSHTTPResponse<SandboxResult>> { return this.client.call<SandboxResult>(nativeOperations.resumeSandbox, {"sandbox_id": sandboxId}, body, options); }
}

export class NativeTemplatesModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  list(options: ListSandboxTemplatesOptions = {}): Promise<BeeOSHTTPResponse<TemplatePage>> { return this.client.call<TemplatePage>(nativeOperations.listSandboxTemplates, {}, undefined, options); }
  get(templateId: string, options: GetSandboxTemplateOptions = {}): Promise<BeeOSHTTPResponse<TemplateResult>> { return this.client.call<TemplateResult>(nativeOperations.getSandboxTemplate, {"template_id": templateId}, undefined, options); }
}

export class NativeAccessTicketsModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  create(sandboxId: string, body: AccessTicketCreate, options: CreateSandboxAccessTicketOptions = {}): Promise<BeeOSHTTPResponse<AccessTicketResult>> { return this.client.call<AccessTicketResult>(nativeOperations.createSandboxAccessTicket, {"sandbox_id": sandboxId}, body, options); }
  revoke(sandboxId: string, ticketId: string, options: RevokeSandboxAccessTicketOptions): Promise<BeeOSHTTPResponse<void>> { return this.client.call<void>(nativeOperations.revokeSandboxAccessTicket, {"sandbox_id": sandboxId, "ticket_id": ticketId}, undefined, options); }
}

export class NativeSandboxesCommandsModule {
  readonly artifacts: NativeSandboxesCommandsArtifactsModule;
  constructor(private readonly client: NativeBeeOSClient) {this.artifacts = new NativeSandboxesCommandsArtifactsModule(client);}
  run(sandboxId: string, body: CommandCreate, options: RunSandboxCommandOptions = {}): Promise<BeeOSHTTPResponse<CommandResultEnvelope>> { return this.client.call<CommandResultEnvelope>(nativeOperations.runSandboxCommand, {"sandbox_id": sandboxId}, body, options); }
  get(sandboxId: string, commandId: string, options: GetSandboxCommandOptions = {}): Promise<BeeOSHTTPResponse<CommandResultEnvelope>> { return this.client.call<CommandResultEnvelope>(nativeOperations.getSandboxCommand, {"sandbox_id": sandboxId, "command_id": commandId}, undefined, options); }
  cancel(sandboxId: string, commandId: string, options: CancelSandboxCommandOptions = {}): Promise<BeeOSHTTPResponse<CommandResultEnvelope>> { return this.client.call<CommandResultEnvelope>(nativeOperations.cancelSandboxCommand, {"sandbox_id": sandboxId, "command_id": commandId}, undefined, options); }
  events(sandboxId: string, commandId: string, options: StreamSandboxCommandEventsOptions = {}): Promise<NativeEventStream<CommandEvent>> { return this.client.stream<CommandEvent>(nativeOperations.streamSandboxCommandEvents, {"sandbox_id": sandboxId, "command_id": commandId}, options); }
}

export class NativeSandboxesFilesModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  write(sandboxId: string, body: BinaryStream, options: WriteSandboxFileOptions): Promise<BeeOSHTTPResponse<FileWriteResultResult>> { return this.client.call<FileWriteResultResult>(nativeOperations.writeSandboxFile, {"sandbox_id": sandboxId}, body, options); }
  read(sandboxId: string, options: ReadSandboxFileOptions): Promise<BeeOSHTTPResponse<Uint8Array>> { return this.client.call<Uint8Array>(nativeOperations.readSandboxFile, {"sandbox_id": sandboxId}, undefined, options); }
}

export class NativeSandboxesCommandsArtifactsModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  download(sandboxId: string, commandId: string, artifactId: string, options: DownloadCommandArtifactOptions = {}): Promise<BeeOSHTTPResponse<Uint8Array>> { return this.client.call<Uint8Array>(nativeOperations.downloadCommandArtifact, {"sandbox_id": sandboxId, "command_id": commandId, "artifact_id": artifactId}, undefined, options); }
}

export class NativeAgentsModule {
  readonly memory: NativeAgentsMemoryModule;
  constructor(private readonly client: NativeBeeOSClient) {this.memory = new NativeAgentsMemoryModule(client);}
  create(body: NativeAgentCreate, options: CreateNativeAgentOptions = {}): Promise<BeeOSHTTPResponse<NativeAgentResult>> { return this.client.call<NativeAgentResult>(nativeOperations.createNativeAgent, {}, body, options); }
  list(options: ListNativeAgentsOptions = {}): Promise<BeeOSHTTPResponse<NativeAgentPage>> { return this.client.call<NativeAgentPage>(nativeOperations.listNativeAgents, {}, undefined, options); }
  get(agentId: string, options: GetNativeAgentOptions = {}): Promise<BeeOSHTTPResponse<NativeAgentResult>> { return this.client.call<NativeAgentResult>(nativeOperations.getNativeAgent, {"agent_id": agentId}, undefined, options); }
  update(agentId: string, body: NativeAgentPatch, options: UpdateNativeAgentOptions): Promise<BeeOSHTTPResponse<NativeAgentResult>> { return this.client.call<NativeAgentResult>(nativeOperations.updateNativeAgent, {"agent_id": agentId}, body, options); }
  delete(agentId: string, options: DeleteNativeAgentOptions = {}): Promise<BeeOSHTTPResponse<DeletedResultResult>> { return this.client.call<DeletedResultResult>(nativeOperations.deleteNativeAgent, {"agent_id": agentId}, undefined, options); }
  listModels(agentId: string, options: ListNativeAgentModelsOptions = {}): Promise<BeeOSHTTPResponse<ModelAvailabilityPage>> { return this.client.call<ModelAvailabilityPage>(nativeOperations.listNativeAgentModels, {"agent_id": agentId}, undefined, options); }
  getSkillFiles(agentId: string, skillId: string, options: GetNativeAgentSkillFilesOptions = {}): Promise<BeeOSHTTPResponse<SkillFilesResult>> { return this.client.call<SkillFilesResult>(nativeOperations.getNativeAgentSkillFiles, {"agent_id": agentId, "skill_id": skillId}, undefined, options); }
  revokeAuthorizations(agentId: string, body: AuthorizationRevoke, options: RevokeNativeAgentAuthorizationsOptions = {}): Promise<BeeOSHTTPResponse<AuthorizationEnforcementResult>> { return this.client.call<AuthorizationEnforcementResult>(nativeOperations.revokeNativeAgentAuthorizations, {"agent_id": agentId}, body, options); }
}

export class NativeModelsModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  list(options: ListNativeModelsOptions = {}): Promise<BeeOSHTTPResponse<ModelAvailabilityPage>> { return this.client.call<ModelAvailabilityPage>(nativeOperations.listNativeModels, {}, undefined, options); }
}

export class NativeSessionsModule {
  readonly canvas: NativeSessionsCanvasModule;
  constructor(private readonly client: NativeBeeOSClient) {this.canvas = new NativeSessionsCanvasModule(client);}
  create(body: NativeSessionCreate, options: CreateNativeSessionOptions = {}): Promise<BeeOSHTTPResponse<NativeSessionResult>> { return this.client.call<NativeSessionResult>(nativeOperations.createNativeSession, {}, body, options); }
  list(options: ListNativeSessionsOptions = {}): Promise<BeeOSHTTPResponse<NativeSessionPage>> { return this.client.call<NativeSessionPage>(nativeOperations.listNativeSessions, {}, undefined, options); }
  get(sessionId: string, options: GetNativeSessionOptions = {}): Promise<BeeOSHTTPResponse<NativeSessionResult>> { return this.client.call<NativeSessionResult>(nativeOperations.getNativeSession, {"session_id": sessionId}, undefined, options); }
  update(sessionId: string, body: NativeSessionPatch, options: UpdateNativeSessionOptions): Promise<BeeOSHTTPResponse<NativeSessionResult>> { return this.client.call<NativeSessionResult>(nativeOperations.updateNativeSession, {"session_id": sessionId}, body, options); }
  delete(sessionId: string, options: DeleteNativeSessionOptions = {}): Promise<BeeOSHTTPResponse<DeletedResultResult>> { return this.client.call<DeletedResultResult>(nativeOperations.deleteNativeSession, {"session_id": sessionId}, undefined, options); }
  listFiles(sessionId: string, options: ListNativeSessionFilesOptions = {}): Promise<BeeOSHTTPResponse<FileMetadataPage>> { return this.client.call<FileMetadataPage>(nativeOperations.listNativeSessionFiles, {"session_id": sessionId}, undefined, options); }
  listResponses(sessionId: string, options: ListNativeSessionResponsesOptions = {}): Promise<BeeOSHTTPResponse<NativeResponsePage>> { return this.client.call<NativeResponsePage>(nativeOperations.listNativeSessionResponses, {"session_id": sessionId}, undefined, options); }
}

export class NativeResponsesModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  create(body: NativeResponseCreate, options: CreateNativeResponseOptions = {}): Promise<BeeOSHTTPResponse<NativeResponseResult>> { return this.client.call<NativeResponseResult>(nativeOperations.createNativeResponse, {}, body, options); }
  get(responseId: string, options: GetNativeResponseOptions = {}): Promise<BeeOSHTTPResponse<NativeResponseResult>> { return this.client.call<NativeResponseResult>(nativeOperations.getNativeResponse, {"response_id": responseId}, undefined, options); }
  delete(responseId: string, options: DeleteNativeResponseOptions = {}): Promise<BeeOSHTTPResponse<DeletedResultResult>> { return this.client.call<DeletedResultResult>(nativeOperations.deleteNativeResponse, {"response_id": responseId}, undefined, options); }
  cancel(responseId: string, options: CancelNativeResponseOptions = {}): Promise<BeeOSHTTPResponse<NativeResponseResult>> { return this.client.call<NativeResponseResult>(nativeOperations.cancelNativeResponse, {"response_id": responseId}, undefined, options); }
  events(responseId: string, options: StreamNativeResponseEventsOptions = {}): Promise<NativeEventStream<NativeResponseEvent>> { return this.client.stream<NativeResponseEvent>(nativeOperations.streamNativeResponseEvents, {"response_id": responseId}, options); }
  listInputItems(responseId: string, options: ListNativeResponseInputItemsOptions = {}): Promise<BeeOSHTTPResponse<ResponseInputPage>> { return this.client.call<ResponseInputPage>(nativeOperations.listNativeResponseInputItems, {"response_id": responseId}, undefined, options); }
  replyInteraction(responseId: string, interactionId: string, body: InteractionReply, options: ReplyNativeInteractionOptions = {}): Promise<BeeOSHTTPResponse<InteractionReplyResultResult>> { return this.client.call<InteractionReplyResultResult>(nativeOperations.replyNativeInteraction, {"response_id": responseId, "interaction_id": interactionId}, body, options); }
  async createStream(body: NativeResponseCreate, options: CreateNativeResponseOptions & {lastEventId?: string} = {}): Promise<NativeResponseStream> { const response = await this.create(body, options); const response_id = response.body.data.id; try { const events = await this.events(response_id, options); return {response_id, response, events}; } catch (error) { if (error instanceof Error && Object.isExtensible(error)) Object.assign(error, {acceptance: response.acceptance, last_response: response, response_id}); throw error; } }
}

export class NativeFilesModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  create(body: BinaryStream, options: CreateNativeFileOptions): Promise<BeeOSHTTPResponse<FileMetadataResult>> { return this.client.call<FileMetadataResult>(nativeOperations.createNativeFile, {}, body, options); }
  get(fileId: string, options: GetNativeFileOptions = {}): Promise<BeeOSHTTPResponse<FileMetadataResult>> { return this.client.call<FileMetadataResult>(nativeOperations.getNativeFile, {"file_id": fileId}, undefined, options); }
  delete(fileId: string, options: DeleteNativeFileOptions = {}): Promise<BeeOSHTTPResponse<DeletedResultResult>> { return this.client.call<DeletedResultResult>(nativeOperations.deleteNativeFile, {"file_id": fileId}, undefined, options); }
  download(fileId: string, options: DownloadNativeFileOptions = {}): Promise<BeeOSHTTPResponse<Uint8Array>> { return this.client.call<Uint8Array>(nativeOperations.downloadNativeFile, {"file_id": fileId}, undefined, options); }
}

export class NativeCapabilitiesModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  get(options: GetNativeCapabilitiesOptions = {}): Promise<BeeOSHTTPResponse<NativeCapabilitiesResult>> { return this.client.call<NativeCapabilitiesResult>(nativeOperations.getNativeCapabilities, {}, undefined, options); }
}

export class NativeAgentsMemoryModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  remember(agentId: string, body: NativeMemoryRemember, options: RememberNativeMemoryOptions = {}): Promise<BeeOSHTTPResponse<NativeMemoryReceiptResult>> { return this.client.call<NativeMemoryReceiptResult>(nativeOperations.rememberNativeMemory, {"agent_id": agentId}, body, options); }
  recall(agentId: string, body: NativeMemoryRecall, options: RecallNativeMemoryOptions = {}): Promise<BeeOSHTTPResponse<NativeMemoryRecallResult>> { return this.client.call<NativeMemoryRecallResult>(nativeOperations.recallNativeMemory, {"agent_id": agentId}, body, options); }
  correct(agentId: string, recordId: string, body: NativeMemoryCorrect, options: CorrectNativeMemoryOptions = {}): Promise<BeeOSHTTPResponse<NativeMemoryReceiptResult>> { return this.client.call<NativeMemoryReceiptResult>(nativeOperations.correctNativeMemory, {"agent_id": agentId, "record_id": recordId}, body, options); }
  forget(agentId: string, recordId: string, body: NativeMemoryForget, options: ForgetNativeMemoryOptions = {}): Promise<BeeOSHTTPResponse<NativeMemoryReceiptResult>> { return this.client.call<NativeMemoryReceiptResult>(nativeOperations.forgetNativeMemory, {"agent_id": agentId, "record_id": recordId}, body, options); }
  getReceipt(agentId: string, receiptId: string, options: GetNativeMemoryReceiptOptions = {}): Promise<BeeOSHTTPResponse<NativeMemoryReceiptResult>> { return this.client.call<NativeMemoryReceiptResult>(nativeOperations.getNativeMemoryReceipt, {"agent_id": agentId, "receipt_id": receiptId}, undefined, options); }
}

export class NativeSessionsCanvasModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  get(sessionId: string, options: GetNativeSessionCanvasOptions = {}): Promise<BeeOSHTTPResponse<CanvasLinkResult>> { return this.client.call<CanvasLinkResult>(nativeOperations.getNativeSessionCanvas, {"session_id": sessionId}, undefined, options); }
  createTicket(sessionId: string, body: CanvasTicketCreate, options: CreateNativeCanvasTicketOptions = {}): Promise<BeeOSHTTPResponse<CanvasTicketResult>> { return this.client.call<CanvasTicketResult>(nativeOperations.createNativeCanvasTicket, {"session_id": sessionId}, body, options); }
}

export class NativeCanvasesModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  getShare(canvasId: string, options: GetNativeCanvasShareOptions = {}): Promise<BeeOSHTTPResponse<CanvasShareResult>> { return this.client.call<CanvasShareResult>(nativeOperations.getNativeCanvasShare, {"canvas_id": canvasId}, undefined, options); }
  share(canvasId: string, body: CanvasShareCreate, options: CreateNativeCanvasShareOptions = {}): Promise<BeeOSHTTPResponse<CanvasShareResult>> { return this.client.call<CanvasShareResult>(nativeOperations.createNativeCanvasShare, {"canvas_id": canvasId}, body, options); }
  unshare(canvasId: string, options: DeleteNativeCanvasShareOptions = {}): Promise<BeeOSHTTPResponse<void>> { return this.client.call<void>(nativeOperations.deleteNativeCanvasShare, {"canvas_id": canvasId}, undefined, options); }
  listSnapshots(canvasId: string, options: ListNativeCanvasSnapshotsOptions = {}): Promise<BeeOSHTTPResponse<CanvasSnapshotPage>> { return this.client.call<CanvasSnapshotPage>(nativeOperations.listNativeCanvasSnapshots, {"canvas_id": canvasId}, undefined, options); }
  restoreSnapshot(canvasId: string, snapshotId: string, options: RestoreNativeCanvasSnapshotOptions = {}): Promise<BeeOSHTTPResponse<CanvasRestoreResult>> { return this.client.call<CanvasRestoreResult>(nativeOperations.restoreNativeCanvasSnapshot, {"canvas_id": canvasId, "snapshot_id": snapshotId}, undefined, options); }
}

export class NativeSandboxesPtyModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  connect(sandboxId: string, body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions = {}): Promise<NativeSocketConnection> { return connectNativeSocket(this.client, sandboxId, "pty", body, options); }
}

export class NativeSandboxesDesktopModule {
  constructor(private readonly client: NativeBeeOSClient) {}
  connect(sandboxId: string, body: Omit<AccessTicketCreate, "purpose">, options: NativeConnectOptions = {}): Promise<NativeSocketConnection> { return connectNativeSocket(this.client, sandboxId, "desktop", body, options); }
}
