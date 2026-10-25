// Code generated from spec/native.openapi.json. DO NOT EDIT.
package native

import (
	"encoding/json"
	"fmt"
)

type Schema0 struct {
	Kind string `json:"kind"`
}

type CanvasID string

type CanvasLink struct {
	CanvasID  CanvasID      `json:"canvas_id"`
	SessionID OpaqueID      `json:"session_id"`
	AgentID   NativeAgentID `json:"agent_id"`
	LinkedAt  string        `json:"linked_at"`
	Role      string        `json:"role"`
}

type CanvasLinkResult struct {
	Data *CanvasLink `json:"data"`
}

type CanvasTicketCreate struct {
	CanvasID *CanvasID `json:"canvas_id,omitempty"`
}

type CanvasTicket struct {
	CanvasID        CanvasID `json:"canvas_id"`
	SessionID       OpaqueID `json:"session_id"`
	Role            string   `json:"role"`
	RelayURL        string   `json:"relay_url"`
	OpenURL         string   `json:"open_url"`
	Profile         string   `json:"profile"`
	Ticket          string   `json:"ticket"`
	ExpiresAt       string   `json:"expires_at"`
	ProtocolVersion float64  `json:"protocol_version"`
}

type CanvasTicketResult struct {
	Data CanvasTicket `json:"data"`
}

type CanvasShareCreate struct {
	Mode             string  `json:"mode"`
	Password         *string `json:"password,omitempty"`
	AllowInteraction *bool   `json:"allow_interaction,omitempty"`
}

type CanvasShare struct {
	ID               CanvasID `json:"id"`
	CanvasID         CanvasID `json:"canvas_id"`
	Slug             string   `json:"slug"`
	URL              string   `json:"url"`
	Mode             string   `json:"mode"`
	AllowInteraction bool     `json:"allow_interaction"`
	ExpiresAt        *string  `json:"expires_at"`
	CreatedAt        string   `json:"created_at"`
}

type CanvasShareResult struct {
	Data *CanvasShare `json:"data"`
}

type CanvasSnapshot struct {
	ID          CanvasID `json:"id"`
	CanvasID    CanvasID `json:"canvas_id"`
	Version     int64    `json:"version"`
	ActorType   string   `json:"actor_type"`
	Description *string  `json:"description"`
	CreatedAt   string   `json:"created_at"`
}

type CanvasSnapshotPage struct {
	Data       []CanvasSnapshot `json:"data"`
	NextCursor *string          `json:"next_cursor"`
	HasMore    bool             `json:"has_more"`
}

type CanvasRestoreResult struct {
	Data struct {
		SnapshotID CanvasID `json:"snapshot_id"`
		Version    int64    `json:"version"`
	} `json:"data"`
}

type OpaqueID = OwnerOpaqueID

type ResourceVersion = OwnerResourceVersion

type NativeErrorEnvelope = OwnerError

type ErrorResponse = OwnerErrorResponse

type ResolvedResources struct {
	Vcpu      int64 `json:"vcpu"`
	MemoryMib int64 `json:"memory_mib"`
	DiskGib   int64 `json:"disk_gib"`
}

type SandboxCreate struct {
	Template       string             `json:"template"`
	TimeoutSeconds *int64             `json:"timeout_seconds,omitempty"`
	OnTimeout      *string            `json:"on_timeout,omitempty"`
	Labels         *map[string]string `json:"labels,omitempty"`
	Name           *string            `json:"name,omitempty"`
}

type SandboxPatch struct {
	Labels map[string]string `json:"labels"`
}

type ResolvedTemplate struct {
	ID                 string                `json:"id"`
	BuildID            OpaqueID              `json:"build_id"`
	Digest             string                `json:"digest"`
	RuntimeArtifactSet RuntimeArtifactSetRef `json:"runtime_artifact_set"`
}

type ResolvedHarness struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

type Sandbox struct {
	ID               OpaqueID             `json:"id"`
	Template         ResolvedTemplate     `json:"template"`
	Harness          *ResolvedHarness     `json:"harness"`
	AgentID          *AgentID             `json:"agent_id"`
	Status           string               `json:"status"`
	TimeoutSeconds   int64                `json:"timeout_seconds"`
	OnTimeout        string               `json:"on_timeout"`
	ExpiresAt        *string              `json:"expires_at"`
	Labels           map[string]string    `json:"labels"`
	Resources        ResolvedResources    `json:"resources"`
	CreatedAt        string               `json:"created_at"`
	LastError        *NativeErrorEnvelope `json:"last_error"`
	ResourceVersion  ResourceVersion      `json:"resource_version"`
	PausedMode       *string              `json:"paused_mode"`
	Name             *string              `json:"name"`
	ManagementSource string               `json:"management_source"`
}

type PauseRequest struct {
	Mode *string `json:"mode,omitempty"`
}

type ResumeRequest struct {
	Mode *string `json:"mode,omitempty"`
}

type TemplateInfrastructure struct {
	Os           string   `json:"os"`
	Architecture string   `json:"architecture"`
	PauseModes   []string `json:"pause_modes"`
	VerifiedAt   *string  `json:"verified_at"`
}

type TemplateGuestDaemon struct {
	Version  string   `json:"version"`
	Features []string `json:"features"`
}

type TemplateBuild struct {
	ID                 OpaqueID                  `json:"id"`
	Digest             string                    `json:"digest"`
	Infrastructure     TemplateInfrastructure    `json:"infrastructure"`
	GuestDaemon        TemplateGuestDaemon       `json:"guest_daemon"`
	BaseImageDigest    string                    `json:"base_image_digest"`
	RuntimeArtifactSet RuntimeArtifactSetRef     `json:"runtime_artifact_set"`
	HarnessArtifacts   []TemplateHarnessArtifact `json:"harness_artifacts"`
}

type Template struct {
	ID                 string            `json:"id"`
	Name               string            `json:"name"`
	Description        string            `json:"description"`
	Surface            string            `json:"surface"`
	SupportedHarnesses []string          `json:"supported_harnesses"`
	Resources          ResolvedResources `json:"resources"`
	Prewarmed          bool              `json:"prewarmed"`
	DefaultBuild       TemplateBuild     `json:"default_build"`
	Region             string            `json:"region"`
}

type AccessTicketCreate struct {
	Purpose string  `json:"purpose"`
	Cols    *int64  `json:"cols,omitempty"`
	Rows    *int64  `json:"rows,omitempty"`
	PtyID   *string `json:"pty_id,omitempty"`
	Origin  *string `json:"origin,omitempty"`
	Role    *string `json:"role,omitempty"`
}

type AccessTicket struct {
	ID                     OpaqueID        `json:"id"`
	SandboxID              OpaqueID        `json:"sandbox_id"`
	Purpose                string          `json:"purpose"`
	Ticket                 string          `json:"ticket"`
	ConnectURL             string          `json:"connect_url"`
	ExpiresAt              string          `json:"expires_at"`
	ResourceVersion        ResourceVersion `json:"resource_version"`
	Transport              string          `json:"transport"`
	ProtocolVersion        int64           `json:"protocol_version"`
	PtyID                  *string         `json:"pty_id,omitempty"`
	ReconnectWindowSeconds *int64          `json:"reconnect_window_seconds,omitempty"`
	Profile                string          `json:"profile"`
	ClientID               string          `json:"client_id"`
	Role                   *string         `json:"role,omitempty"`
}

type SandboxResult struct {
	Data Sandbox `json:"data"`
}

type SandboxGetResult struct {
	Data Sandbox `json:"data"`
}

type TemplateResult struct {
	Data Template `json:"data"`
}

type AccessTicketResult struct {
	Data AccessTicket `json:"data"`
}

type SandboxPage struct {
	Data       []Sandbox `json:"data"`
	NextCursor *string   `json:"next_cursor"`
	HasMore    bool      `json:"has_more"`
}

type TemplatePage struct {
	Data       []Template `json:"data"`
	NextCursor *string    `json:"next_cursor"`
	HasMore    bool       `json:"has_more"`
}

type NativeAgentID = AgentID

type Revision = OwnerRevision

type SkillSelection struct {
	SkillID OpaqueID      `json:"skill_id"`
	Version OwnerRevision `json:"version"`
	Digest  string        `json:"digest"`
	Enabled bool          `json:"enabled"`
}

type MCPSelection struct {
	ServerRef      OpaqueID `json:"server_ref"`
	Enabled        bool     `json:"enabled"`
	Required       bool     `json:"required"`
	CredentialSlot *string  `json:"credential_slot,omitempty"`
}

type ComponentObservation struct {
	Component  string               `json:"component"`
	Scope      string               `json:"scope"`
	ScopeID    *OpaqueID            `json:"scope_id"`
	Revision   *OwnerRevision       `json:"revision"`
	State      string               `json:"state"`
	ObservedAt *string              `json:"observed_at"`
	Error      *NativeErrorEnvelope `json:"error"`
}

type Publication struct {
	AcceptedConfigRevision OwnerRevision          `json:"accepted_config_revision"`
	ChangedComponents      []string               `json:"changed_components"`
	State                  string                 `json:"state"`
	Components             []ComponentObservation `json:"components"`
}

type AgentBindingObservation struct {
	BindingID                    OpaqueID                `json:"binding_id"`
	SandboxID                    OpaqueID                `json:"sandbox_id"`
	State                        string                  `json:"state"`
	PreparedConfigRevision       *OwnerRevision          `json:"prepared_config_revision"`
	CredentialActivationRevision *OwnerRevision          `json:"credential_activation_revision"`
	CredentialStatus             CredentialBindingStatus `json:"credential_status"`
	PersonaScope                 string                  `json:"persona_scope"`
	Components                   []ComponentObservation  `json:"components"`
	Error                        *NativeErrorEnvelope    `json:"error"`
}

type NativeAgentCreate struct {
	Name              *string             `json:"name,omitempty"`
	Engine            string              `json:"engine"`
	Instructions      *string             `json:"instructions,omitempty"`
	ModelID           *Nullable[OpaqueID] `json:"model_id,omitempty"`
	Skills            *[]SkillSelection   `json:"skills,omitempty"`
	MCPServers        *[]MCPSelection     `json:"mcp_servers,omitempty"`
	DisabledTools     *[]string           `json:"disabled_tools,omitempty"`
	RunTimeoutSeconds *int64              `json:"run_timeout_seconds,omitempty"`
	Target            *BeeosTarget        `json:"target,omitempty"`
	Credentials       *CredentialBindings `json:"credentials,omitempty"`
}

type NativeAgentPatch struct {
	Name              *string             `json:"name,omitempty"`
	Instructions      *string             `json:"instructions,omitempty"`
	ModelID           *Nullable[OpaqueID] `json:"model_id,omitempty"`
	Skills            *[]SkillSelection   `json:"skills,omitempty"`
	MCPServers        *[]MCPSelection     `json:"mcp_servers,omitempty"`
	DisabledTools     *[]string           `json:"disabled_tools,omitempty"`
	RunTimeoutSeconds *int64              `json:"run_timeout_seconds,omitempty"`
	Target            *BeeosTarget        `json:"target,omitempty"`
	Credentials       *CredentialBindings `json:"credentials,omitempty"`
}

type NativeAgentConfiguration struct {
	Name              string                  `json:"name"`
	Engine            string                  `json:"engine"`
	Instructions      string                  `json:"instructions"`
	ModelID           *OpaqueID               `json:"model_id"`
	Skills            []SkillSelection        `json:"skills"`
	MCPServers        []MCPSelection          `json:"mcp_servers"`
	DisabledTools     []string                `json:"disabled_tools"`
	RunTimeoutSeconds int64                   `json:"run_timeout_seconds"`
	Target            BeeosTarget             `json:"target"`
	CredentialStatus  CredentialBindingStatus `json:"credential_status"`
}

type AuthorizationEnforcement struct {
	AuthorizationRevision OwnerRevision `json:"authorization_revision"`
	State                 string        `json:"state"`
	AffectedScopes        []struct {
		Kind  string   `json:"kind"`
		ID    OpaqueID `json:"id"`
		State string   `json:"state"`
	} `json:"affected_scopes"`
	Error *NativeErrorEnvelope `json:"error"`
}

type NativeAgent struct {
	ID                    NativeAgentID            `json:"id"`
	Configuration         NativeAgentConfiguration `json:"configuration"`
	DesiredConfigRevision Revision                 `json:"desired_config_revision"`
	ResourceVersion       ResourceVersion          `json:"resource_version"`
	Binding               *AgentBindingObservation `json:"binding"`
	Publication           Publication              `json:"publication"`
	Authorization         AuthorizationEnforcement `json:"authorization"`
	DefaultModelID        OpaqueID                 `json:"default_model_id"`
	CreatedAt             string                   `json:"created_at"`
	UpdatedAt             string                   `json:"updated_at"`
}

type AuthorizationRevokeVariant1 struct {
	All bool `json:"all"`
}

type AuthorizationRevokeVariant2 struct {
	ToolIds         *[]OpaqueID `json:"tool_ids,omitempty"`
	MCPServerRefs   *[]OpaqueID `json:"mcp_server_refs,omitempty"`
	CredentialSlots *[]string   `json:"credential_slots,omitempty"`
}

type AuthorizationRevoke struct {
	AuthorizationRevokeVariant1 *AuthorizationRevokeVariant1 `json:"-"`
	AuthorizationRevokeVariant2 *AuthorizationRevokeVariant2 `json:"-"`
}

func (value AuthorizationRevoke) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.AuthorizationRevokeVariant1 != nil {
		selected = value.AuthorizationRevokeVariant1
		count++
	}
	if value.AuthorizationRevokeVariant2 != nil {
		selected = value.AuthorizationRevokeVariant2
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("AuthorizationRevoke requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *AuthorizationRevoke) UnmarshalJSON(data []byte) error {
	*value = AuthorizationRevoke{}
	if matchesNativeVariant(data, "object", []string{"all"}, []string{"all"}, "{\"all\":true}") {
		var candidate AuthorizationRevokeVariant1
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.AuthorizationRevokeVariant1 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{}, []string{"tool_ids", "mcp_server_refs", "credential_slots"}, "{}") {
		var candidate AuthorizationRevokeVariant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.AuthorizationRevokeVariant2 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid AuthorizationRevoke variant")
}

type DeletedResult struct {
	ID      OpaqueID `json:"id"`
	Deleted bool     `json:"deleted"`
	Cleanup string   `json:"cleanup"`
	Scope   string   `json:"scope"`
}

type ModelAvailability struct {
	ID            OpaqueID  `json:"id"`
	ProviderID    OpaqueID  `json:"provider_id"`
	ModelID       string    `json:"model_id"`
	EndpointRef   *OpaqueID `json:"endpoint_ref"`
	EngineSupport []string  `json:"engine_support"`
	Availability  string    `json:"availability"`
	Reason        *string   `json:"reason"`
	ObservedAt    *string   `json:"observed_at"`
	Default       bool      `json:"default"`
}

type SkillFile struct {
	Path      string   `json:"path"`
	FileID    OpaqueID `json:"file_id"`
	SizeBytes int64    `json:"size_bytes"`
	SHA256    string   `json:"sha256"`
	MediaType string   `json:"media_type"`
}

type SkillFiles struct {
	SkillID OpaqueID      `json:"skill_id"`
	Version OwnerRevision `json:"version"`
	Digest  string        `json:"digest"`
	Files   []SkillFile   `json:"files"`
}

type FileMetadata struct {
	ID         OpaqueID  `json:"id"`
	Filename   string    `json:"filename"`
	MediaType  string    `json:"media_type"`
	SizeBytes  int64     `json:"size_bytes"`
	SHA256     string    `json:"sha256"`
	Status     string    `json:"status"`
	OwnerScope string    `json:"owner_scope"`
	OwnerID    *OpaqueID `json:"owner_id"`
	CreatedAt  string    `json:"created_at"`
	ExpiresAt  *string   `json:"expires_at"`
}

type FileInput struct {
	Type   string   `json:"type"`
	FileID OpaqueID `json:"file_id"`
	SHA256 string   `json:"sha256"`
}

type TextInput struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ResponseInput struct {
	TextInput *TextInput `json:"-"`
	FileInput *FileInput `json:"-"`
}

func (value ResponseInput) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.TextInput != nil {
		selected = value.TextInput
		count++
	}
	if value.FileInput != nil {
		selected = value.FileInput
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("ResponseInput requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *ResponseInput) UnmarshalJSON(data []byte) error {
	*value = ResponseInput{}
	if matchesNativeVariant(data, "object", []string{"type", "text"}, []string{"type", "text"}, "{\"type\":\"input_text\"}") {
		var candidate TextInput
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.TextInput = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "file_id", "sha256"}, []string{"type", "file_id", "sha256"}, "{}") {
		var candidate FileInput
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.FileInput = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid ResponseInput variant")
}

type ResponseInputItem struct {
	ID      OpaqueID      `json:"id"`
	Content ResponseInput `json:"content"`
}

type NativeMetadata map[string]string

type NativeSessionCreate struct {
	AgentID  NativeAgentID      `json:"agent_id"`
	Name     *string            `json:"name,omitempty"`
	Metadata *map[string]string `json:"metadata,omitempty"`
}

type NativeSessionPatch struct {
	Name string `json:"name"`
}

type SessionConfigurationObservation struct {
	PersonaRevision             *OwnerRevision         `json:"persona_revision"`
	PersonaPolicy               string                 `json:"persona_policy"`
	LastLoadedExecutionRevision *OwnerRevision         `json:"last_loaded_execution_revision"`
	LastResponseID              *OpaqueID              `json:"last_response_id"`
	Components                  []ComponentObservation `json:"components"`
}

type NativeSession struct {
	ID                            OpaqueID                        `json:"id"`
	AgentID                       NativeAgentID                   `json:"agent_id"`
	State                         string                          `json:"state"`
	ReadOnly                      bool                            `json:"read_only"`
	Name                          string                          `json:"name"`
	Metadata                      map[string]string               `json:"metadata"`
	Configuration                 SessionConfigurationObservation `json:"configuration"`
	HeadResponseID                *OpaqueID                       `json:"head_response_id"`
	ResourceVersion               ResourceVersion                 `json:"resource_version"`
	CreatedAt                     string                          `json:"created_at"`
	UpdatedAt                     string                          `json:"updated_at"`
	LastActivityAt                string                          `json:"last_activity_at"`
	ContinuationAvailable         bool                            `json:"continuation_available"`
	ContinuationUnavailableReason *string                         `json:"continuation_unavailable_reason"`
}

type NativeResponseCreate struct {
	SessionID          OpaqueID        `json:"session_id"`
	Input              []ResponseInput `json:"input"`
	ModelID            *OpaqueID       `json:"model_id,omitempty"`
	PreviousResponseID *OpaqueID       `json:"previous_response_id,omitempty"`
	TimeoutSeconds     *int64          `json:"timeout_seconds,omitempty"`
	Metadata           *NativeMetadata `json:"metadata,omitempty"`
}

type EffectiveConfiguration struct {
	ConfigRevision                   OwnerRevision          `json:"config_revision"`
	PersonaRevision                  *OwnerRevision         `json:"persona_revision"`
	ResolvedRequestHash              string                 `json:"resolved_request_hash"`
	RequestedModelID                 *OpaqueID              `json:"requested_model_id"`
	LoadedModelID                    *OpaqueID              `json:"loaded_model_id"`
	ActualProviderID                 *OpaqueID              `json:"actual_provider_id"`
	ActualModelID                    *OpaqueID              `json:"actual_model_id"`
	EndpointRef                      *OpaqueID              `json:"endpoint_ref"`
	ApiMode                          *string                `json:"api_mode"`
	Reasoning                        *string                `json:"reasoning"`
	FallbackUsed                     *bool                  `json:"fallback_used"`
	SkillsDigest                     *string                `json:"skills_digest"`
	ToolSchemaDigest                 *string                `json:"tool_schema_digest"`
	CredentialActivationRevision     *OwnerRevision         `json:"credential_activation_revision"`
	AuthorizationRevisionAtAdmission AuthorizationRevision  `json:"authorization_revision_at_admission"`
	Observation                      string                 `json:"observation"`
	Components                       []ComponentObservation `json:"components"`
	MemoryReadWatermark              *OpaqueID              `json:"memory_read_watermark"`
	MemoryObservation                string                 `json:"memory_observation"`
}

type ResponseOutputItemVariant1 struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ResponseOutputItemVariant2 struct {
	Type string       `json:"type"`
	File FileMetadata `json:"file"`
}

type ResponseOutputItemVariant3 struct {
	Type       string   `json:"type"`
	ToolCallID OpaqueID `json:"tool_call_id"`
	ToolName   string   `json:"tool_name"`
	Outcome    string   `json:"outcome"`
	Summary    string   `json:"summary"`
}

type ResponseOutputItem struct {
	ResponseOutputItemVariant1 *ResponseOutputItemVariant1 `json:"-"`
	ResponseOutputItemVariant2 *ResponseOutputItemVariant2 `json:"-"`
	ResponseOutputItemVariant3 *ResponseOutputItemVariant3 `json:"-"`
}

func (value ResponseOutputItem) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.ResponseOutputItemVariant1 != nil {
		selected = value.ResponseOutputItemVariant1
		count++
	}
	if value.ResponseOutputItemVariant2 != nil {
		selected = value.ResponseOutputItemVariant2
		count++
	}
	if value.ResponseOutputItemVariant3 != nil {
		selected = value.ResponseOutputItemVariant3
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("ResponseOutputItem requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *ResponseOutputItem) UnmarshalJSON(data []byte) error {
	*value = ResponseOutputItem{}
	if matchesNativeVariant(data, "object", []string{"type", "text"}, []string{"type", "text"}, "{\"type\":\"output_text\"}") {
		var candidate ResponseOutputItemVariant1
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.ResponseOutputItemVariant1 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "file"}, []string{"type", "file"}, "{\"type\":\"output_file\"}") {
		var candidate ResponseOutputItemVariant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.ResponseOutputItemVariant2 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "tool_call_id", "tool_name", "outcome", "summary"}, []string{"type", "tool_call_id", "tool_name", "outcome", "summary"}, "{\"type\":\"tool_summary\"}") {
		var candidate ResponseOutputItemVariant3
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.ResponseOutputItemVariant3 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid ResponseOutputItem variant")
}

type InteractionOption struct {
	ID    OpaqueID `json:"id"`
	Label string   `json:"label"`
}

type InteractionQuestion struct {
	ID      OpaqueID            `json:"id"`
	Prompt  string              `json:"prompt"`
	Kind    string              `json:"kind"`
	Options []InteractionOption `json:"options"`
}

type Interaction struct {
	ID              OpaqueID              `json:"id"`
	ResponseID      OpaqueID              `json:"response_id"`
	AttemptRef      OpaqueID              `json:"attempt_ref"`
	Revision        ResourceVersion       `json:"revision"`
	Kind            string                `json:"kind"`
	State           string                `json:"state"`
	ExpiresAt       string                `json:"expires_at"`
	ToolCallID      *OpaqueID             `json:"tool_call_id"`
	ToolName        *string               `json:"tool_name"`
	ArgumentsDigest *string               `json:"arguments_digest"`
	Summary         string                `json:"summary"`
	Options         []InteractionOption   `json:"options"`
	Questions       []InteractionQuestion `json:"questions"`
	PauseSequence   *int64                `json:"pause_sequence"`
}

type InteractionReplyVariant1 struct {
	AttemptRef          OpaqueID        `json:"attempt_ref"`
	InteractionRevision ResourceVersion `json:"interaction_revision"`
	Kind                string          `json:"kind"`
	OptionID            OpaqueID        `json:"option_id"`
}

type InteractionReplyVariant2AnswersItemValueUnion1Variant1 string

type InteractionReplyVariant2AnswersItemValueUnion1Variant2 []string

type InteractionReplyVariant2AnswersItemValueUnion1 struct {
	InteractionReplyVariant2AnswersItemValueUnion1Variant1 *InteractionReplyVariant2AnswersItemValueUnion1Variant1 `json:"-"`
	InteractionReplyVariant2AnswersItemValueUnion1Variant2 *InteractionReplyVariant2AnswersItemValueUnion1Variant2 `json:"-"`
}

func (value InteractionReplyVariant2AnswersItemValueUnion1) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.InteractionReplyVariant2AnswersItemValueUnion1Variant1 != nil {
		selected = value.InteractionReplyVariant2AnswersItemValueUnion1Variant1
		count++
	}
	if value.InteractionReplyVariant2AnswersItemValueUnion1Variant2 != nil {
		selected = value.InteractionReplyVariant2AnswersItemValueUnion1Variant2
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("InteractionReplyVariant2AnswersItemValueUnion1 requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *InteractionReplyVariant2AnswersItemValueUnion1) UnmarshalJSON(data []byte) error {
	*value = InteractionReplyVariant2AnswersItemValueUnion1{}
	if matchesNativeVariant(data, "string", []string{}, nil, "{}") {
		var candidate InteractionReplyVariant2AnswersItemValueUnion1Variant1
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.InteractionReplyVariant2AnswersItemValueUnion1Variant1 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "array", []string{}, nil, "{}") {
		var candidate InteractionReplyVariant2AnswersItemValueUnion1Variant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.InteractionReplyVariant2AnswersItemValueUnion1Variant2 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid InteractionReplyVariant2AnswersItemValueUnion1 variant")
}

type InteractionReplyVariant2 struct {
	AttemptRef          OpaqueID        `json:"attempt_ref"`
	InteractionRevision ResourceVersion `json:"interaction_revision"`
	Kind                string          `json:"kind"`
	Answers             []struct {
		QuestionID OpaqueID                                       `json:"question_id"`
		Value      InteractionReplyVariant2AnswersItemValueUnion1 `json:"value"`
	} `json:"answers"`
}

type InteractionReplyVariant3 struct {
	AttemptRef          OpaqueID        `json:"attempt_ref"`
	InteractionRevision ResourceVersion `json:"interaction_revision"`
	Kind                string          `json:"kind"`
	PauseSequence       int64           `json:"pause_sequence"`
}

type InteractionReply struct {
	InteractionReplyVariant1 *InteractionReplyVariant1 `json:"-"`
	InteractionReplyVariant2 *InteractionReplyVariant2 `json:"-"`
	InteractionReplyVariant3 *InteractionReplyVariant3 `json:"-"`
}

func (value InteractionReply) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.InteractionReplyVariant1 != nil {
		selected = value.InteractionReplyVariant1
		count++
	}
	if value.InteractionReplyVariant2 != nil {
		selected = value.InteractionReplyVariant2
		count++
	}
	if value.InteractionReplyVariant3 != nil {
		selected = value.InteractionReplyVariant3
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("InteractionReply requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *InteractionReply) UnmarshalJSON(data []byte) error {
	*value = InteractionReply{}
	if matchesNativeVariant(data, "object", []string{"attempt_ref", "interaction_revision", "kind", "option_id"}, []string{"attempt_ref", "interaction_revision", "kind", "option_id"}, "{\"kind\":\"approval\"}") {
		var candidate InteractionReplyVariant1
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.InteractionReplyVariant1 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"attempt_ref", "interaction_revision", "kind", "answers"}, []string{"attempt_ref", "interaction_revision", "kind", "answers"}, "{\"kind\":\"question\"}") {
		var candidate InteractionReplyVariant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.InteractionReplyVariant2 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"attempt_ref", "interaction_revision", "kind", "pause_sequence"}, []string{"attempt_ref", "interaction_revision", "kind", "pause_sequence"}, "{\"kind\":\"resume\"}") {
		var candidate InteractionReplyVariant3
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.InteractionReplyVariant3 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid InteractionReply variant")
}

type InteractionReplyResult struct {
	ResponseID    OpaqueID `json:"response_id"`
	InteractionID OpaqueID `json:"interaction_id"`
	DecisionID    OpaqueID `json:"decision_id"`
	Accepted      bool     `json:"accepted"`
	Duplicate     bool     `json:"duplicate"`
}

type NativeResponse struct {
	ID                     OpaqueID                `json:"id"`
	SessionID              OpaqueID                `json:"session_id"`
	SandboxID              *OpaqueID               `json:"sandbox_id"`
	AgentID                NativeAgentID           `json:"agent_id"`
	Status                 string                  `json:"status"`
	Phase                  string                  `json:"phase"`
	Terminal               bool                    `json:"terminal"`
	EffectiveConfiguration *EffectiveConfiguration `json:"effective_configuration"`
	Output                 []ResponseOutputItem    `json:"output"`
	Input                  []ResponseInputItem     `json:"input"`
	Metadata               NativeMetadata          `json:"metadata"`
	PendingInteractions    []Interaction           `json:"pending_interactions"`
	Error                  *NativeErrorEnvelope    `json:"error"`
	Usage                  *struct {
		InputTokens   *int64              `json:"input_tokens,omitempty"`
		OutputTokens  *int64              `json:"output_tokens,omitempty"`
		Source        string              `json:"source"`
		ActualModelID *Nullable[OpaqueID] `json:"actual_model_id,omitempty"`
	} `json:"usage"`
	StopObservation string `json:"stop_observation"`
	Checkpoint      struct {
		State          string         `json:"state"`
		SourceRevision *OwnerRevision `json:"source_revision"`
	} `json:"checkpoint"`
	ResourceVersion    ResourceVersion `json:"resource_version"`
	CreatedAt          string          `json:"created_at"`
	CompletedAt        *string         `json:"completed_at"`
	PreviousResponseID *OpaqueID       `json:"previous_response_id"`
}

type NativeResponseEventVariant1 struct {
	Type       string   `json:"type"`
	ResponseID OpaqueID `json:"response_id"`
	Sequence   int64    `json:"sequence"`
	Phase      string   `json:"phase"`
}

type NativeResponseEventVariant2 struct {
	Type       string             `json:"type"`
	ResponseID OpaqueID           `json:"response_id"`
	Sequence   int64              `json:"sequence"`
	Item       ResponseOutputItem `json:"item"`
}

type NativeResponseEventVariant3 struct {
	Type        string      `json:"type"`
	ResponseID  OpaqueID    `json:"response_id"`
	Sequence    int64       `json:"sequence"`
	Interaction Interaction `json:"interaction"`
}

type NativeResponseEventVariant4 struct {
	Type       string         `json:"type"`
	ResponseID OpaqueID       `json:"response_id"`
	Sequence   int64          `json:"sequence"`
	Response   NativeResponse `json:"response"`
}

type NativeResponseEventVariant5 struct {
	Type         string   `json:"type"`
	ResponseID   OpaqueID `json:"response_id"`
	ItemID       string   `json:"item_id"`
	OutputIndex  int64    `json:"output_index"`
	ContentIndex int64    `json:"content_index"`
	Delta        string   `json:"delta"`
}

type NativeResponseEvent struct {
	NativeResponseEventVariant1 *NativeResponseEventVariant1 `json:"-"`
	NativeResponseEventVariant2 *NativeResponseEventVariant2 `json:"-"`
	NativeResponseEventVariant3 *NativeResponseEventVariant3 `json:"-"`
	NativeResponseEventVariant4 *NativeResponseEventVariant4 `json:"-"`
	NativeResponseEventVariant5 *NativeResponseEventVariant5 `json:"-"`
}

func (value NativeResponseEvent) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.NativeResponseEventVariant1 != nil {
		selected = value.NativeResponseEventVariant1
		count++
	}
	if value.NativeResponseEventVariant2 != nil {
		selected = value.NativeResponseEventVariant2
		count++
	}
	if value.NativeResponseEventVariant3 != nil {
		selected = value.NativeResponseEventVariant3
		count++
	}
	if value.NativeResponseEventVariant4 != nil {
		selected = value.NativeResponseEventVariant4
		count++
	}
	if value.NativeResponseEventVariant5 != nil {
		selected = value.NativeResponseEventVariant5
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("NativeResponseEvent requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *NativeResponseEvent) UnmarshalJSON(data []byte) error {
	*value = NativeResponseEvent{}
	if matchesNativeVariant(data, "object", []string{"type", "response_id", "sequence", "phase"}, []string{"type", "response_id", "sequence", "phase"}, "{\"type\":\"response.phase\"}") {
		var candidate NativeResponseEventVariant1
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.NativeResponseEventVariant1 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "response_id", "sequence", "item"}, []string{"type", "response_id", "sequence", "item"}, "{\"type\":\"response.output\"}") {
		var candidate NativeResponseEventVariant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.NativeResponseEventVariant2 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "response_id", "sequence", "interaction"}, []string{"type", "response_id", "sequence", "interaction"}, "{\"type\":\"response.interaction\"}") {
		var candidate NativeResponseEventVariant3
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.NativeResponseEventVariant3 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "response_id", "sequence", "response"}, []string{"type", "response_id", "sequence", "response"}, "{}") {
		var candidate NativeResponseEventVariant4
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.NativeResponseEventVariant4 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "response_id", "item_id", "output_index", "content_index", "delta"}, []string{"type", "response_id", "item_id", "output_index", "content_index", "delta"}, "{\"type\":\"response.output_text.delta\"}") {
		var candidate NativeResponseEventVariant5
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.NativeResponseEventVariant5 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid NativeResponseEvent variant")
}

type CommandCreate struct {
	Argv           []string           `json:"argv"`
	Cwd            *string            `json:"cwd,omitempty"`
	Env            *map[string]string `json:"env,omitempty"`
	TimeoutSeconds *int64             `json:"timeout_seconds,omitempty"`
	ResultPath     *string            `json:"result_path,omitempty"`
	ArtifactPaths  *[]string          `json:"artifact_paths,omitempty"`
}

type CommandArtifact struct {
	ID          OpaqueID `json:"id"`
	Filename    string   `json:"filename"`
	MediaType   string   `json:"media_type"`
	SizeBytes   int64    `json:"size_bytes"`
	SHA256      string   `json:"sha256"`
	PublishedAt string   `json:"published_at"`
	ExpiresAt   string   `json:"expires_at"`
}

type Command struct {
	ID             OpaqueID                 `json:"id"`
	SandboxID      OpaqueID                 `json:"sandbox_id"`
	State          string                   `json:"state"`
	ProcessOutcome string                   `json:"process_outcome"`
	ExitCode       *int64                   `json:"exit_code"`
	Signal         *string                  `json:"signal"`
	StopProven     bool                     `json:"stop_proven"`
	CaptureStatus  string                   `json:"capture_status"`
	Result         *StructuredCommandResult `json:"result"`
	Artifacts      []CommandArtifact        `json:"artifacts"`
	Logs           struct {
		FirstSequence  int64                `json:"first_sequence"`
		LastSequence   int64                `json:"last_sequence"`
		PersistedBytes int64                `json:"persisted_bytes"`
		Truncated      bool                 `json:"truncated"`
		Error          *NativeErrorEnvelope `json:"error"`
	} `json:"logs"`
	Error           *NativeErrorEnvelope `json:"error"`
	ResourceVersion ResourceVersion      `json:"resource_version"`
	CreatedAt       string               `json:"created_at"`
	CompletedAt     *string              `json:"completed_at"`
	ExpiresAt       *string              `json:"expires_at"`
}

type CommandEventVariant1 struct {
	Type         string   `json:"type"`
	CommandID    OpaqueID `json:"command_id"`
	Sequence     int64    `json:"sequence"`
	Data         string   `json:"data"`
	DecodedBytes int64    `json:"decoded_bytes"`
}

type CommandEventVariant2 struct {
	Type      string   `json:"type"`
	CommandID OpaqueID `json:"command_id"`
	Sequence  int64    `json:"sequence"`
	Command   Command  `json:"command"`
}

type CommandEvent struct {
	CommandEventVariant1 *CommandEventVariant1 `json:"-"`
	CommandEventVariant2 *CommandEventVariant2 `json:"-"`
}

func (value CommandEvent) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.CommandEventVariant1 != nil {
		selected = value.CommandEventVariant1
		count++
	}
	if value.CommandEventVariant2 != nil {
		selected = value.CommandEventVariant2
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("CommandEvent requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *CommandEvent) UnmarshalJSON(data []byte) error {
	*value = CommandEvent{}
	if matchesNativeVariant(data, "object", []string{"type", "command_id", "sequence", "data", "decoded_bytes"}, []string{"type", "command_id", "sequence", "data", "decoded_bytes"}, "{}") {
		var candidate CommandEventVariant1
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.CommandEventVariant1 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"type", "command_id", "sequence", "command"}, []string{"type", "command_id", "sequence", "command"}, "{}") {
		var candidate CommandEventVariant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.CommandEventVariant2 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid CommandEvent variant")
}

type FileWriteResult struct {
	Path      string `json:"path"`
	SizeBytes int64  `json:"size_bytes"`
	SHA256    string `json:"sha256"`
	Etag      string `json:"etag"`
}

type CredentialInputCapabilities struct {
	Version       int64    `json:"version"`
	Modes         []string `json:"modes"`
	DiscoveryPath string   `json:"discovery_path"`
}

type NativeCapabilities struct {
	CredentialInput CredentialInputCapabilities `json:"credential_input"`
	ApiVersion      string                      `json:"api_version"`
	Features        map[string]string           `json:"features"`
	Limits          map[string]int64            `json:"limits"`
	Engines         []struct {
		ID           string  `json:"id"`
		Available    bool    `json:"available"`
		PersonaScope string  `json:"persona_scope"`
		Reason       *string `json:"reason"`
	} `json:"engines"`
}

type NativeAgentResult struct {
	Data NativeAgent `json:"data"`
}

type AuthorizationEnforcementResult struct {
	Data AuthorizationEnforcement `json:"data"`
}

type DeletedResultResult struct {
	Data DeletedResult `json:"data"`
}

type SkillFilesResult struct {
	Data SkillFiles `json:"data"`
}

type FileMetadataResult struct {
	Data FileMetadata `json:"data"`
}

type NativeSessionResult struct {
	Data NativeSession `json:"data"`
}

type NativeResponseResult struct {
	Data NativeResponse `json:"data"`
}

type InteractionReplyResultResult struct {
	Data InteractionReplyResult `json:"data"`
}

type FileWriteResultResult struct {
	Data FileWriteResult `json:"data"`
}

type NativeCapabilitiesResult struct {
	Data NativeCapabilities `json:"data"`
}

type NativeAgentPage struct {
	Data       []NativeAgent `json:"data"`
	NextCursor *string       `json:"next_cursor"`
	HasMore    bool          `json:"has_more"`
}

type ModelAvailabilityPage struct {
	Data       []ModelAvailability `json:"data"`
	NextCursor *string             `json:"next_cursor"`
	HasMore    bool                `json:"has_more"`
}

type FileMetadataPage struct {
	Data       []FileMetadata `json:"data"`
	NextCursor *string        `json:"next_cursor"`
	HasMore    bool           `json:"has_more"`
}

type ResponseInputPage struct {
	Data       []ResponseInputItem `json:"data"`
	Metadata   NativeMetadata      `json:"metadata"`
	NextCursor *string             `json:"next_cursor"`
	HasMore    bool                `json:"has_more"`
}

type NativeSessionPage struct {
	Data       []NativeSession `json:"data"`
	NextCursor *string         `json:"next_cursor"`
	HasMore    bool            `json:"has_more"`
}

type CommandResultEnvelope struct {
	Data Command `json:"data"`
}

type StructuredCommandResult struct {
	Status string               `json:"status"`
	Value  json.RawMessage      `json:"value"`
	SHA256 *string              `json:"sha256"`
	Error  *NativeErrorEnvelope `json:"error"`
}

type NativeResponsePage struct {
	Data       []NativeResponse `json:"data"`
	NextCursor *string          `json:"next_cursor"`
	HasMore    bool             `json:"has_more"`
}

type TemplateHarnessArtifact = RuntimeHarnessArtifact

type NativeMemorySourceVariant2 struct {
	Kind       string   `json:"kind"`
	ResponseID OpaqueID `json:"response_id"`
	ItemID     OpaqueID `json:"item_id"`
}

type NativeMemorySource struct {
	Schema0                    *Schema0                    `json:"-"`
	NativeMemorySourceVariant2 *NativeMemorySourceVariant2 `json:"-"`
}

func (value NativeMemorySource) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.Schema0 != nil {
		selected = value.Schema0
		count++
	}
	if value.NativeMemorySourceVariant2 != nil {
		selected = value.NativeMemorySourceVariant2
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("NativeMemorySource requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *NativeMemorySource) UnmarshalJSON(data []byte) error {
	*value = NativeMemorySource{}
	if matchesNativeVariant(data, "object", []string{"kind"}, []string{"kind"}, "{\"kind\":\"explicit\"}") {
		var candidate Schema0
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.Schema0 = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"kind", "response_id", "item_id"}, []string{"kind", "response_id", "item_id"}, "{\"kind\":\"response\"}") {
		var candidate NativeMemorySourceVariant2
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.NativeMemorySourceVariant2 = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid NativeMemorySource variant")
}

type NativeMemoryRemember struct {
	Content   string             `json:"content"`
	Kind      string             `json:"kind"`
	Source    NativeMemorySource `json:"source"`
	ValidFrom *Nullable[string]  `json:"valid_from,omitempty"`
	ValidTo   *Nullable[string]  `json:"valid_to,omitempty"`
}

type NativeMemoryRecall struct {
	Query            string    `json:"query"`
	Kinds            []string  `json:"kinds"`
	TokenBudget      *int64    `json:"token_budget,omitempty"`
	PageSize         *int64    `json:"page_size,omitempty"`
	Cursor           *string   `json:"cursor,omitempty"`
	MinReadWatermark *OpaqueID `json:"min_read_watermark,omitempty"`
}

type NativeMemoryCorrect struct {
	ExpectedRevision RecordRevision     `json:"expected_revision"`
	Content          string             `json:"content"`
	Reason           string             `json:"reason"`
	Source           NativeMemorySource `json:"source"`
}

type NativeMemoryForget struct {
	ExpectedRevision RecordRevision `json:"expected_revision"`
	Reason           string         `json:"reason"`
}

type NativeMemoryJobObservation struct {
	ID            OpaqueID             `json:"id"`
	State         State                `json:"state"`
	NextAttemptAt Nextattemptat        `json:"next_attempt_at"`
	Error         *NativeErrorEnvelope `json:"error"`
}

type NativeMemoryErasureObservation struct {
	BarrierCommitted bool   `json:"barrier_committed"`
	State            string `json:"state"`
	Coverage         []struct {
		Component string `json:"component"`
		State     string `json:"state"`
	} `json:"coverage"`
	Error *NativeErrorEnvelope `json:"error"`
}

type NativeMemoryReceiptObservation struct {
	Receipt    Receipt                         `json:"receipt"`
	Completion string                          `json:"completion"`
	Job        *NativeMemoryJobObservation     `json:"job"`
	Erasure    *NativeMemoryErasureObservation `json:"erasure"`
	Redacted   bool                            `json:"redacted"`
}

type NativeMemoryReceiptResult struct {
	Data NativeMemoryReceiptObservation `json:"data"`
}

type NativeMemoryRecallResult struct {
	Data RecallPage `json:"data"`
}

type OwnerOpaqueID string

type OwnerResourceVersion int64

type OwnerError struct {
	Code       string             `json:"code"`
	Message    string             `json:"message"`
	RequestID  RequestID          `json:"request_id"`
	Details    *ErrorDetails      `json:"details,omitempty"`
	RetryAfter *RetryAfterSeconds `json:"retry_after,omitempty"`
}

type RequestID string

type ErrorDetails struct {
	Reason *string `json:"reason,omitempty"`
	Fields *[]struct {
		Field  string `json:"field"`
		Reason string `json:"reason"`
	} `json:"fields,omitempty"`
	RelatedResource *struct {
		ID              OwnerOpaqueID        `json:"id"`
		ResourceVersion OwnerResourceVersion `json:"resource_version"`
		ExpiresAt       *string              `json:"expires_at"`
	} `json:"related_resource,omitempty"`
	Additional map[string]json.RawMessage `json:"-"`
}

func (value ErrorDetails) MarshalJSON() ([]byte, error) {
	type plain ErrorDetails
	declared, err := json.Marshal(plain(value))
	if err != nil || len(value.Additional) == 0 {
		return declared, err
	}
	merged := map[string]json.RawMessage{}
	if err := json.Unmarshal(declared, &merged); err != nil {
		return nil, err
	}
	for key, raw := range value.Additional {
		if _, ok := merged[key]; !ok {
			merged[key] = raw
		}
	}
	return json.Marshal(merged)
}
func (value *ErrorDetails) UnmarshalJSON(data []byte) error {
	type plain ErrorDetails
	var declared plain
	if err := json.Unmarshal(data, &declared); err != nil {
		return err
	}
	var all map[string]json.RawMessage
	if err := json.Unmarshal(data, &all); err != nil {
		return err
	}
	for _, key := range []string{"reason", "fields", "related_resource"} {
		delete(all, key)
	}
	declared.Additional = nil
	if len(all) > 0 {
		declared.Additional = all
	}
	*value = ErrorDetails(declared)
	return nil
}

type RetryAfterSeconds int64

type OwnerErrorResponse = OwnerError

type RuntimeArtifactSetRef struct {
	ManifestID     ExternalOpaqueRef `json:"manifest_id"`
	ManifestDigest string            `json:"manifest_digest"`
	SchemaID       string            `json:"schema_id"`
	SchemaVersion  string            `json:"schema_version"`
}

type ArtifactRef struct {
	ManifestID     ExternalOpaqueRef `json:"manifest_id"`
	ManifestDigest string            `json:"manifest_digest"`
	SchemaID       string            `json:"schema_id"`
	SchemaVersion  OwnerOpaqueId2    `json:"schema_version"`
}

type ExternalOpaqueRef string

type OwnerOpaqueId2 string

type AgentID string

type Harnessartifacts []RuntimeHarnessArtifact

type RuntimeHarnessArtifact struct {
	Harness              string                      `json:"harness"`
	Version              ExternalOpaqueRef           `json:"version"`
	ArtifactDigest       string                      `json:"artifact_digest"`
	DependencyLockDigest string                      `json:"dependency_lock_digest"`
	PreparationRecipe    HarnessPreparationRecipeRef `json:"preparation_recipe"`
}

type HarnessPreparationRecipeRef struct {
	ManifestID     ExternalOpaqueRef `json:"manifest_id"`
	ManifestDigest string            `json:"manifest_digest"`
	SchemaID       string            `json:"schema_id"`
	SchemaVersion  string            `json:"schema_version"`
}

type OwnerRevision = OwnerOpaqueId2

type CredentialPublicStatus struct {
	Slot       string `json:"slot"`
	Configured bool   `json:"configured"`
}

type CredentialBindingStatus struct {
	Slots []CredentialPublicStatus `json:"slots"`
}

type BeeosTarget struct {
	BeeosRecipeTarget  *BeeosRecipeTarget  `json:"-"`
	BeeosManagedTarget *BeeosManagedTarget `json:"-"`
}

func (value BeeosTarget) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.BeeosRecipeTarget != nil {
		selected = value.BeeosRecipeTarget
		count++
	}
	if value.BeeosManagedTarget != nil {
		selected = value.BeeosManagedTarget
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("BeeosTarget requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *BeeosTarget) UnmarshalJSON(data []byte) error {
	*value = BeeosTarget{}
	if matchesNativeVariant(data, "object", []string{"kind"}, []string{"kind", "template", "timeout_seconds", "on_timeout"}, "{\"kind\":\"recipe\",\"on_timeout\":\"terminate\"}") {
		var candidate BeeosRecipeTarget
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.BeeosRecipeTarget = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"kind", "sandbox_id"}, []string{"kind", "sandbox_id"}, "{\"kind\":\"managed\"}") {
		var candidate BeeosManagedTarget
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.BeeosManagedTarget = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid BeeosTarget variant")
}

type BeeosRecipeTarget struct {
	Kind           string  `json:"kind"`
	Template       *string `json:"template,omitempty"`
	TimeoutSeconds *int64  `json:"timeout_seconds,omitempty"`
	OnTimeout      *string `json:"on_timeout,omitempty"`
}

type BeeosManagedTarget struct {
	Kind      string `json:"kind"`
	SandboxID ID     `json:"sandbox_id"`
}

type ID = OwnerOpaqueId2

type CredentialBindings []CredentialBinding

type CredentialBindingSourceUnion2 struct {
	CredentialReference *CredentialReference `json:"-"`
	SealedCredential    *SealedCredential    `json:"-"`
}

func (value CredentialBindingSourceUnion2) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.CredentialReference != nil {
		selected = value.CredentialReference
		count++
	}
	if value.SealedCredential != nil {
		selected = value.SealedCredential
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("CredentialBindingSourceUnion2 requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *CredentialBindingSourceUnion2) UnmarshalJSON(data []byte) error {
	*value = CredentialBindingSourceUnion2{}
	if matchesNativeVariant(data, "object", []string{"kind", "ref"}, []string{"kind", "ref"}, "{\"kind\":\"reference\"}") {
		var candidate CredentialReference
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.CredentialReference = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"kind", "jwe"}, []string{"kind", "jwe"}, "{\"kind\":\"sealed\"}") {
		var candidate SealedCredential
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.SealedCredential = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid CredentialBindingSourceUnion2 variant")
}

type CredentialBinding struct {
	Slot   string                        `json:"slot"`
	Source CredentialBindingSourceUnion2 `json:"source"`
}

type CredentialReference struct {
	Kind string `json:"kind"`
	Ref  string `json:"ref"`
}

type SealedCredential struct {
	Kind string `json:"kind"`
	Jwe  string `json:"jwe"`
}

type AuthorizationRevision int64

type RecordRevision int64

type State string

type Nextattemptat *string

type Receipt struct {
	ReceiptID      OwnerOpaqueId2   `json:"receipt_id"`
	RequestID      OwnerOpaqueId2   `json:"request_id"`
	Operation      string           `json:"operation"`
	Disposition    string           `json:"disposition"`
	ObservationIds []OwnerOpaqueId2 `json:"observation_ids"`
	RecordRefs     []RecordRef      `json:"record_refs"`
	JobRef         *OwnerOpaqueId2  `json:"job_ref"`
	CommittedAt    *string          `json:"committed_at"`
	ReadWatermark  *OwnerOpaqueId2  `json:"read_watermark"`
	IndexWatermark *OwnerOpaqueId2  `json:"index_watermark"`
	SourceRefs     []Source         `json:"source_refs"`
}

type RecordRef struct {
	RecordID OwnerOpaqueId2      `json:"record_id"`
	Revision OwnerRecordRevision `json:"revision"`
}

type OwnerRecordRevision int64

type Source struct {
	MessageSource   *MessageSource   `json:"-"`
	AssertionSource *AssertionSource `json:"-"`
}

func (value Source) MarshalJSON() ([]byte, error) {
	var selected any
	count := 0
	if value.MessageSource != nil {
		selected = value.MessageSource
		count++
	}
	if value.AssertionSource != nil {
		selected = value.AssertionSource
		count++
	}
	if count != 1 {
		return nil, fmt.Errorf("Source requires exactly one variant")
	}
	return json.Marshal(selected)
}
func (value *Source) UnmarshalJSON(data []byte) error {
	*value = Source{}
	if matchesNativeVariant(data, "object", []string{"kind", "source_id", "history_generation", "source_revision", "origin", "capture_kind"}, []string{"kind", "source_id", "history_generation", "source_revision", "origin", "capture_kind"}, "{\"kind\":\"message\"}") {
		var candidate MessageSource
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.MessageSource = &candidate
			return nil
		}
	}
	if matchesNativeVariant(data, "object", []string{"kind", "assertion_id", "assertion_revision"}, []string{"kind", "assertion_id", "assertion_revision"}, "{\"kind\":\"assertion\"}") {
		var candidate AssertionSource
		if err := json.Unmarshal(data, &candidate); err == nil {
			value.AssertionSource = &candidate
			return nil
		}
	}
	return fmt.Errorf("invalid Source variant")
}

type MessageSource struct {
	Kind              string         `json:"kind"`
	SourceID          OwnerOpaqueId2 `json:"source_id"`
	HistoryGeneration string         `json:"history_generation"`
	SourceRevision    OwnerOpaqueId2 `json:"source_revision"`
	Origin            string         `json:"origin"`
	CaptureKind       string         `json:"capture_kind"`
}

type AssertionSource struct {
	Kind              string            `json:"kind"`
	AssertionID       OwnerOpaqueId2    `json:"assertion_id"`
	AssertionRevision AssertionRevision `json:"assertion_revision"`
}

type AssertionRevision int64

type RecallPage struct {
	Items []struct {
		Record     Record  `json:"record"`
		Score      float64 `json:"score"`
		TokenCount int64   `json:"token_count"`
		Truncated  bool    `json:"truncated"`
	} `json:"items"`
	NextCursor     *string        `json:"next_cursor"`
	ReadWatermark  OwnerOpaqueId2 `json:"read_watermark"`
	IndexWatermark OwnerOpaqueId2 `json:"index_watermark"`
	MemoryStatus   string         `json:"memory_status"`
}

type Record struct {
	RecordID      OwnerOpaqueId2      `json:"record_id"`
	Revision      OwnerRecordRevision `json:"revision"`
	ScopeRef      OwnerOpaqueId2      `json:"scope_ref"`
	Kind          string              `json:"kind"`
	Content       string              `json:"content"`
	SourceRefs    []Source            `json:"source_refs"`
	Trust         string              `json:"trust"`
	EventTime     *string             `json:"event_time"`
	ValidFrom     *string             `json:"valid_from"`
	ValidTo       *string             `json:"valid_to"`
	RecordedAt    string              `json:"recorded_at"`
	Status        string              `json:"status"`
	Supersedes    []RecordRef         `json:"supersedes"`
	ConflictGroup *OwnerOpaqueId2     `json:"conflict_group"`
	ErasureEpoch  ErasureEpoch        `json:"erasure_epoch"`
}

type ErasureEpoch int64
