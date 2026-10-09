// Code generated from spec/server.openapi.json; DO NOT EDIT.
package beeoscloudsdk

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"strings"
)

type ExternalUserID string

type ClientSessionInput struct {
	ClientType            ClientSessionInputClientType         `json:"client_type"`
	RequestedCapabilities []string                             `json:"requested_capabilities"`
	Origin                *string                              `json:"origin,omitempty"`
	DeviceAttestation     *ClientSessionInputDeviceAttestation `json:"device_attestation,omitempty"`
	TtlSeconds            *int64                               `json:"ttl_seconds,omitempty"`
}

type Binding struct {
	ClientType BindingClientType `json:"client_type"`
	Origin     *string           `json:"origin,omitempty"`
	CnfJkt     *string           `json:"cnf_jkt,omitempty"`
}

type ClientSessionResponse struct {
	AccessToken    string                            `json:"access_token"`
	ClientAPIURL   ClientSessionResponseClientAPIURL `json:"client_api_url"`
	ExpiresAt      string                            `json:"expires_at"`
	SessionID      string                            `json:"session_id"`
	AppID          string                            `json:"app_id"`
	ExternalUserID ExternalUserID                    `json:"external_user_id"`
	Capabilities   []string                          `json:"capabilities"`
	Binding        Binding                           `json:"binding"`
}

type DeletionAccepted struct {
	DeletionID string                 `json:"deletion_id"`
	Status     DeletionAcceptedStatus `json:"status"`
}

type Deletion struct {
	ID               string           `json:"id"`
	Status           string           `json:"status"`
	DeletedResources map[string]int64 `json:"deleted_resources"`
}

type Provider struct {
	ID           string                `json:"id"`
	Name         string                `json:"name"`
	Description  *string               `json:"description,omitempty"`
	Capabilities *ProviderCapabilities `json:"capabilities,omitempty"`
}

type DeployRegion struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Available bool   `json:"available"`
}

type DeployModel struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Tier          *string  `json:"tier,omitempty"`
	Reasoning     *bool    `json:"reasoning,omitempty"`
	Input         []string `json:"input,omitempty"`
	ContextWindow *int64   `json:"context_window,omitempty"`
}

type InstanceTemplate struct {
	ID             string           `json:"id"`
	Name           string           `json:"name"`
	Description    *string          `json:"description,omitempty"`
	LogoURL        *string          `json:"logo_url,omitempty"`
	SortOrder      *int64           `json:"sort_order,omitempty"`
	AgentFramework *string          `json:"agent_framework,omitempty"`
	ProviderID     *string          `json:"provider_id,omitempty"`
	Specs          []CatalogSpec    `json:"specs,omitempty"`
	Variants       []CatalogVariant `json:"variants,omitempty"`
}

type ProviderPage struct {
	Data  []Provider `json:"data"`
	Total int64      `json:"total"`
}

type RegionPage struct {
	Data  []DeployRegion `json:"data"`
	Total int64          `json:"total"`
}

type ModelPage struct {
	Data  []DeployModel `json:"data"`
	Total int64         `json:"total"`
}

type InstanceSummary struct {
	ID                 string `json:"id"`
	OrganizationID     string `json:"organization_id"`
	AppID              string `json:"app_id"`
	DeveloperID        string `json:"developer_id"`
	Name               string `json:"name"`
	AgentFramework     string `json:"agent_framework"`
	ProviderID         string `json:"provider_id"`
	Region             string `json:"region"`
	OsType             string `json:"os_type"`
	Status             string `json:"status"`
	DesiredStatus      string `json:"desired_status"`
	Connectivity       string `json:"connectivity"`
	MsConnectionStatus string `json:"ms_connection_status"`
	CreatedAt          string `json:"created_at"`
	UpdatedAt          string `json:"updated_at"`
	ResourceVersion    int64  `json:"resource_version"`
}

type InstancePage struct {
	Data  []InstanceSummary `json:"data"`
	Total int64             `json:"total"`
}

type ProviderCapabilities struct {
	LongRunning    bool   `json:"long_running"`
	BrowserUse     bool   `json:"browser_use"`
	CodeExec       bool   `json:"code_exec"`
	FileSystem     bool   `json:"file_system"`
	CustomImage    bool   `json:"custom_image"`
	Device         bool   `json:"device"`
	MaxDurationSec int64  `json:"max_duration_sec"`
	CostModel      string `json:"cost_model"`
}

type CatalogSpecValue struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Label     string `json:"label"`
	SortOrder int64  `json:"sort_order"`
}

type CatalogSpec struct {
	ID     string             `json:"id"`
	Name   string             `json:"name"`
	Label  string             `json:"label"`
	Values []CatalogSpecValue `json:"values"`
}

type CatalogVariant struct {
	ID           string   `json:"id"`
	SpecValueIds []string `json:"spec_value_ids"`
	SortOrder    int64    `json:"sort_order"`
}

type InstanceTemplatePage struct {
	Data  []InstanceTemplate `json:"data"`
	Total int64              `json:"total"`
}

type AgentSnapshot struct {
	ID                    string          `json:"id"`
	InstanceID            string          `json:"instance_id"`
	Name                  string          `json:"name"`
	DisplayName           *string         `json:"display_name,omitempty"`
	Description           string          `json:"description"`
	Status                string          `json:"status"`
	Visibility            string          `json:"visibility"`
	ConversationTransport string          `json:"conversation_transport"`
	ResourceVersion       int64           `json:"resource_version"`
	McpEnabled            bool            `json:"mcp_enabled"`
	A2aEnabled            bool            `json:"a2a_enabled"`
	Capabilities          map[string]bool `json:"capabilities"`
	Skills                []AgentSkill    `json:"skills"`
	CreatedAt             string          `json:"created_at"`
	UpdatedAt             string          `json:"updated_at"`
}

type AgentSkill struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
	Enabled     bool     `json:"enabled"`
}

type AgentPatch struct {
	Visibility *AgentPatchVisibility `json:"visibility,omitempty"`
	McpEnabled *bool                 `json:"mcp_enabled,omitempty"`
	A2aEnabled *bool                 `json:"a2a_enabled,omitempty"`
}

type AgentResponse struct {
	Data AgentSnapshot `json:"data"`
}

type AgentPage struct {
	Data  []AgentAgent `json:"data"`
	Total int64        `json:"total"`
}

type CreateConversationInput struct {
	Title *string `json:"title,omitempty"`
}

type Conversation struct {
	ID                string            `json:"id"`
	AgentID           string            `json:"agent_id"`
	InstanceID        string            `json:"instance_id"`
	Title             string            `json:"title"`
	State             ConversationState `json:"state"`
	MetadataVersion   int64             `json:"metadata_version"`
	HistoryGeneration int64             `json:"history_generation"`
	CreatedAt         string            `json:"created_at"`
	LastActivityAt    *string           `json:"last_activity_at,omitempty"`
	ClosedAt          *string           `json:"closed_at,omitempty"`
	ResourceVersion   int64             `json:"resource_version"`
	ModelOverrideID   *string           `json:"model_override_id,omitempty"`
	EffectiveModelID  *string           `json:"effective_model_id,omitempty"`
}

type ConversationResponse struct {
	Data Conversation `json:"data"`
}

type ConversationPage struct {
	Conversations []Conversation `json:"conversations"`
	NextCursor    *string        `json:"next_cursor,omitempty"`
	HasMore       bool           `json:"has_more"`
}

type Message struct {
	ID                    string                        `json:"id"`
	ConversationID        string                        `json:"conversation_id"`
	Type                  string                        `json:"type"`
	Content               json.RawMessage               `json:"content"`
	Sender                string                        `json:"sender"`
	ReplyTo               *string                       `json:"reply_to,omitempty"`
	CreatedAt             string                        `json:"created_at"`
	Offset                int64                         `json:"offset"`
	HistoryGeneration     int64                         `json:"history_generation"`
	State                 *string                       `json:"state,omitempty"`
	StopReason            *string                       `json:"stop_reason,omitempty"`
	Body                  *string                       `json:"body,omitempty"`
	Parts                 []map[string]JSONValue        `json:"parts,omitempty"`
	UpdatedAt             *string                       `json:"updated_at,omitempty"`
	RuntimeDispatch       map[string]JSONValue          `json:"runtime_dispatch,omitempty"`
	RealtimePublishStatus *MessageRealtimePublishStatus `json:"realtime_publish_status,omitempty"`
}

type MessagePage struct {
	Messages              []Message `json:"messages"`
	NextCursor            *string   `json:"next_cursor,omitempty"`
	HasMore               bool      `json:"has_more"`
	LatestOffset          int64     `json:"latest_offset"`
	HistoryGeneration     int64     `json:"history_generation"`
	HistoryBoundaryOffset int64     `json:"history_boundary_offset"`
}

type MessageEnvelope struct {
	ID             string                 `json:"id"`
	ConversationID string                 `json:"conversation_id"`
	Type           string                 `json:"type"`
	Sender         string                 `json:"sender"`
	ReplyTo        *string                `json:"reply_to,omitempty"`
	Body           string                 `json:"body"`
	Parts          []map[string]JSONValue `json:"parts,omitempty"`
	State          string                 `json:"state"`
	StopReason     *string                `json:"stop_reason,omitempty"`
	Content        json.RawMessage        `json:"content,omitempty"`
	CreatedAt      *string                `json:"created_at,omitempty"`
	UpdatedAt      *string                `json:"updated_at,omitempty"`
}

type MessageEnvelopeResponse struct {
	Data MessageEnvelope `json:"data"`
}

type UpdateConversationInput struct {
	Title string `json:"title"`
}

type CancelConversationInput struct {
	TargetMessageID string  `json:"target_message_id"`
	Reason          *string `json:"reason,omitempty"`
}

type SetConversationModelInput struct {
	ModelOverrideID *string `json:"model_override_id"`
}

type CommandReceipt struct {
	RequestID string `json:"request_id"`
	Status    string `json:"status"`
}

type CommandReceiptResponse struct {
	Data CommandReceipt `json:"data"`
}

type ClearConversationReceipt struct {
	RequestID         string `json:"request_id"`
	ConversationID    string `json:"conversation_id"`
	CurrentGeneration int64  `json:"current_generation"`
	Status            string `json:"status"`
}

type ClearConversationReceiptResponse struct {
	Data ClearConversationReceipt `json:"data"`
}

type CreateTaskInput struct {
	Message     string            `json:"message"`
	ContextID   *string           `json:"context_id,omitempty"`
	DeadlineMs  *int64            `json:"deadline_ms,omitempty"`
	Metadata    map[string]string `json:"metadata,omitempty"`
	Attachments []json.RawMessage `json:"attachments,omitempty"`
}

type CreateTaskResult struct {
	TaskID    string `json:"task_id"`
	AgentID   string `json:"agent_id"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

type CreateTaskResponse struct {
	Data CreateTaskResult `json:"data"`
}

type Task struct {
	TaskID            string            `json:"task_id"`
	OrganizationID    *string           `json:"organization_id,omitempty"`
	AppID             *string           `json:"app_id,omitempty"`
	InstanceID        *string           `json:"instance_id,omitempty"`
	AgentID           string            `json:"agent_id"`
	ConversationID    *string           `json:"conversation_id,omitempty"`
	Status            string            `json:"status"`
	Result            json.RawMessage   `json:"result,omitempty"`
	Error             *string           `json:"error,omitempty"`
	Metadata          map[string]string `json:"metadata,omitempty"`
	ResourceVersion   *int64            `json:"resource_version,omitempty"`
	CreatedAt         string            `json:"created_at"`
	StartedAt         *string           `json:"started_at,omitempty"`
	CompletedAt       *string           `json:"completed_at,omitempty"`
	DeadlineAt        *string           `json:"deadline_at,omitempty"`
	Truncated         *bool             `json:"truncated,omitempty"`
	HistoryGeneration int64             `json:"history_generation"`
	LatestOffset      int64             `json:"latest_offset"`
}

type TaskResponse struct {
	Data Task `json:"data"`
}

type TaskPage struct {
	Tasks     []Task  `json:"tasks"`
	NextSince *string `json:"next_since,omitempty"`
	HasMore   bool    `json:"has_more"`
}

type CancelTaskInput struct {
	Reason *string `json:"reason,omitempty"`
}

type ContinueTaskInput struct {
	Input     json.RawMessage `json:"input,omitempty"`
	AuthGrant *bool           `json:"auth_grant,omitempty"`
}

type ErrorResponse struct {
	Code      string `json:"code"`
	Message   string `json:"message"`
	RequestID string `json:"request_id"`
}

type UHPDiscovery struct {
	Object               UHPDiscoveryObject           `json:"object"`
	Protocol             UHPDiscoveryProtocol         `json:"protocol"`
	Versions             []string                     `json:"versions"`
	DefaultVersion       string                       `json:"default_version"`
	ConformanceClass     UHPDiscoveryConformanceClass `json:"conformance_class"`
	Capabilities         UHPCapabilities              `json:"capabilities"`
	PluginSchemas        []string                     `json:"plugin_schemas,omitempty"`
	Implementation       *UHPDiscoveryImplementation  `json:"implementation,omitempty"`
	AdditionalProperties map[string]JSONValue         `json:"-"`
}

func (v UHPDiscovery) MarshalJSON() ([]byte, error) {
	type plain UHPDiscovery
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPDiscovery) UnmarshalJSON(data []byte) error {
	type plain UHPDiscovery
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "object")
	delete(fields, "protocol")
	delete(fields, "versions")
	delete(fields, "default_version")
	delete(fields, "conformance_class")
	delete(fields, "capabilities")
	delete(fields, "plugin_schemas")
	delete(fields, "implementation")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPDiscovery(decoded)
	return nil
}

type UHPCapabilities struct {
	Streaming            *bool           `json:"streaming,omitempty"`
	Sessions             *bool           `json:"sessions,omitempty"`
	Cancellation         *bool           `json:"cancellation,omitempty"`
	FilesInput           *bool           `json:"files_input,omitempty"`
	FilesOutput          *bool           `json:"files_output,omitempty"`
	SessionListing       *bool           `json:"session_listing,omitempty"`
	HarnessManagement    *bool           `json:"harness_management,omitempty"`
	SessionSharing       *bool           `json:"session_sharing,omitempty"`
	Idempotency          *bool           `json:"idempotency,omitempty"`
	Plugins              *bool           `json:"plugins,omitempty"`
	Environments         *bool           `json:"environments,omitempty"`
	Memories             *bool           `json:"memories,omitempty"`
	AdditionalProperties map[string]bool `json:"-"`
}

func (v UHPCapabilities) MarshalJSON() ([]byte, error) {
	type plain UHPCapabilities
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPCapabilities) UnmarshalJSON(data []byte) error {
	type plain UHPCapabilities
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "streaming")
	delete(fields, "sessions")
	delete(fields, "cancellation")
	delete(fields, "files_input")
	delete(fields, "files_output")
	delete(fields, "session_listing")
	delete(fields, "harness_management")
	delete(fields, "session_sharing")
	delete(fields, "idempotency")
	delete(fields, "plugins")
	delete(fields, "environments")
	delete(fields, "memories")
	decoded.AdditionalProperties = map[string]bool{}
	for key, raw := range fields {
		var value bool
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPCapabilities(decoded)
	return nil
}

type UHPHarness struct {
	ID                   string               `json:"id"`
	Object               *UHPHarnessObject    `json:"object,omitempty"`
	Name                 string               `json:"name"`
	Base                 string               `json:"base"`
	BaseLabel            *string              `json:"baseLabel,omitempty"`
	DefaultModel         *string              `json:"defaultModel,omitempty"`
	SystemPrompt         *string              `json:"systemPrompt,omitempty"`
	McpServers           []UHPMcpServer       `json:"mcpServers,omitempty"`
	Skills               []UHPSkill           `json:"skills,omitempty"`
	Plugins              []UHPPlugin          `json:"plugins,omitempty"`
	Environment          *string              `json:"environment,omitempty"`
	DisabledTools        []string             `json:"disabledTools,omitempty"`
	MaxStep              *int64               `json:"maxStep,omitempty"`
	TimeoutSeconds       *int64               `json:"timeoutSeconds,omitempty"`
	CreatedAt            *int64               `json:"createdAt,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPHarness) MarshalJSON() ([]byte, error) {
	type plain UHPHarness
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPHarness) UnmarshalJSON(data []byte) error {
	type plain UHPHarness
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "id")
	delete(fields, "object")
	delete(fields, "name")
	delete(fields, "base")
	delete(fields, "baseLabel")
	delete(fields, "defaultModel")
	delete(fields, "systemPrompt")
	delete(fields, "mcpServers")
	delete(fields, "skills")
	delete(fields, "plugins")
	delete(fields, "environment")
	delete(fields, "disabledTools")
	delete(fields, "maxStep")
	delete(fields, "timeoutSeconds")
	delete(fields, "createdAt")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPHarness(decoded)
	return nil
}

type UHPMcpServer struct {
	Name                 string                 `json:"name"`
	URL                  string                 `json:"url"`
	Transport            *UHPMcpServerTransport `json:"transport,omitempty"`
	Enabled              *bool                  `json:"enabled,omitempty"`
	Headers              map[string]string      `json:"headers,omitempty"`
	Auth                 *string                `json:"auth,omitempty"`
	AdditionalProperties map[string]JSONValue   `json:"-"`
}

func (v UHPMcpServer) MarshalJSON() ([]byte, error) {
	type plain UHPMcpServer
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPMcpServer) UnmarshalJSON(data []byte) error {
	type plain UHPMcpServer
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "url")
	delete(fields, "transport")
	delete(fields, "enabled")
	delete(fields, "headers")
	delete(fields, "auth")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPMcpServer(decoded)
	return nil
}

type UHPPluginMcpServer struct {
	Name                 string                       `json:"name"`
	Transport            *UHPPluginMcpServerTransport `json:"transport,omitempty"`
	URL                  *string                      `json:"url,omitempty"`
	Headers              map[string]string            `json:"headers,omitempty"`
	Command              *string                      `json:"command,omitempty"`
	Args                 []string                     `json:"args,omitempty"`
	Env                  map[string]string            `json:"env,omitempty"`
	Cwd                  *string                      `json:"cwd,omitempty"`
	Enabled              *bool                        `json:"enabled,omitempty"`
	AdditionalProperties map[string]JSONValue         `json:"-"`
}

func (v UHPPluginMcpServer) MarshalJSON() ([]byte, error) {
	type plain UHPPluginMcpServer
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPPluginMcpServer) UnmarshalJSON(data []byte) error {
	type plain UHPPluginMcpServer
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "transport")
	delete(fields, "url")
	delete(fields, "headers")
	delete(fields, "command")
	delete(fields, "args")
	delete(fields, "env")
	delete(fields, "cwd")
	delete(fields, "enabled")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPPluginMcpServer(decoded)
	return nil
}

type UHPSkill struct {
	Name                 string               `json:"name"`
	Enabled              *bool                `json:"enabled,omitempty"`
	Files                []UHPSkillFile       `json:"files,omitempty"`
	Content              *string              `json:"content,omitempty"`
	Blob                 *string              `json:"blob,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPSkill) MarshalJSON() ([]byte, error) {
	type plain UHPSkill
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPSkill) UnmarshalJSON(data []byte) error {
	type plain UHPSkill
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "enabled")
	delete(fields, "files")
	delete(fields, "content")
	delete(fields, "blob")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPSkill(decoded)
	return nil
}

type UHPSkillFile struct {
	Path                 string               `json:"path"`
	Content              *string              `json:"content,omitempty"`
	ContentB64           *string              `json:"content_b64,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPSkillFile) MarshalJSON() ([]byte, error) {
	type plain UHPSkillFile
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPSkillFile) UnmarshalJSON(data []byte) error {
	type plain UHPSkillFile
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "path")
	delete(fields, "content")
	delete(fields, "content_b64")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPSkillFile(decoded)
	return nil
}

type UHPPlugin struct {
	Name                 string               `json:"name"`
	Enabled              *bool                `json:"enabled,omitempty"`
	Files                []UHPSkillFile       `json:"files,omitempty"`
	Blob                 *string              `json:"blob,omitempty"`
	Manifest             *UHPPluginManifest   `json:"manifest,omitempty"`
	McpServers           []UHPPluginMcpServer `json:"mcpServers,omitempty"`
	Skills               []UHPPluginSkill     `json:"skills,omitempty"`
	Skipped              []UHPPluginSkipped   `json:"skipped,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPPlugin) MarshalJSON() ([]byte, error) {
	type plain UHPPlugin
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPPlugin) UnmarshalJSON(data []byte) error {
	type plain UHPPlugin
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "enabled")
	delete(fields, "files")
	delete(fields, "blob")
	delete(fields, "manifest")
	delete(fields, "mcpServers")
	delete(fields, "skills")
	delete(fields, "skipped")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPPlugin(decoded)
	return nil
}

type UHPPluginManifest struct {
	Schema               string                          `json:"$schema"`
	Name                 string                          `json:"name"`
	Version              *string                         `json:"version,omitempty"`
	Description          *string                         `json:"description,omitempty"`
	Author               *UHPPluginManifestAuthor        `json:"author,omitempty"`
	Homepage             *string                         `json:"homepage,omitempty"`
	Repository           *string                         `json:"repository,omitempty"`
	License              *string                         `json:"license,omitempty"`
	Keywords             []string                        `json:"keywords,omitempty"`
	Extensions           map[string]map[string]JSONValue `json:"extensions,omitempty"`
	AdditionalProperties map[string]JSONValue            `json:"-"`
}

func (v UHPPluginManifest) MarshalJSON() ([]byte, error) {
	type plain UHPPluginManifest
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPPluginManifest) UnmarshalJSON(data []byte) error {
	type plain UHPPluginManifest
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "$schema")
	delete(fields, "name")
	delete(fields, "version")
	delete(fields, "description")
	delete(fields, "author")
	delete(fields, "homepage")
	delete(fields, "repository")
	delete(fields, "license")
	delete(fields, "keywords")
	delete(fields, "extensions")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPPluginManifest(decoded)
	return nil
}

type UHPPluginSkill struct {
	Name                 string               `json:"name"`
	Description          *string              `json:"description,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPPluginSkill) MarshalJSON() ([]byte, error) {
	type plain UHPPluginSkill
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPPluginSkill) UnmarshalJSON(data []byte) error {
	type plain UHPPluginSkill
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "description")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPPluginSkill(decoded)
	return nil
}

type UHPPluginSkipped struct {
	Path                 string               `json:"path"`
	Reason               string               `json:"reason"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPPluginSkipped) MarshalJSON() ([]byte, error) {
	type plain UHPPluginSkipped
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPPluginSkipped) UnmarshalJSON(data []byte) error {
	type plain UHPPluginSkipped
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "path")
	delete(fields, "reason")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPPluginSkipped(decoded)
	return nil
}

type UHPModelCatalog struct {
	Backends map[string]UHPModelCatalogBackendsValue `json:"backends"`
}

type UHPHarnessModels struct {
	HarnessID *string    `json:"harness_id,omitempty"`
	Backend   *string    `json:"backend,omitempty"`
	Default   *string    `json:"default,omitempty"`
	Fallback  *string    `json:"fallback,omitempty"`
	Models    []UHPModel `json:"models"`
}

type UHPModel struct {
	ID                   string               `json:"id"`
	Label                *string              `json:"label,omitempty"`
	Backend              *string              `json:"backend,omitempty"`
	Available            bool                 `json:"available"`
	Default              *bool                `json:"default,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPModel) MarshalJSON() ([]byte, error) {
	type plain UHPModel
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPModel) UnmarshalJSON(data []byte) error {
	type plain UHPModel
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "id")
	delete(fields, "label")
	delete(fields, "backend")
	delete(fields, "available")
	delete(fields, "default")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPModel(decoded)
	return nil
}

type UHPCreateResponseRequest struct {
	Input                UHPCreateResponseRequestInput     `json:"input"`
	Model                *string                           `json:"model,omitempty"`
	Metadata             *UHPCreateResponseRequestMetadata `json:"metadata,omitempty"`
	Stream               *bool                             `json:"stream,omitempty"`
	PreviousResponseID   *string                           `json:"previous_response_id,omitempty"`
	Instructions         *string                           `json:"instructions,omitempty"`
	Store                *bool                             `json:"store,omitempty"`
	MaxOutputTokens      *int64                            `json:"max_output_tokens,omitempty"`
	MaxStep              *int64                            `json:"max_step,omitempty"`
	TimeoutSeconds       *int64                            `json:"timeout_seconds,omitempty"`
	Tools                []map[string]JSONValue            `json:"tools,omitempty"`
	Include              []string                          `json:"include,omitempty"`
	Background           *bool                             `json:"background,omitempty"`
	AdditionalProperties map[string]JSONValue              `json:"-"`
}

func (v UHPCreateResponseRequest) MarshalJSON() ([]byte, error) {
	type plain UHPCreateResponseRequest
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPCreateResponseRequest) UnmarshalJSON(data []byte) error {
	type plain UHPCreateResponseRequest
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "input")
	delete(fields, "model")
	delete(fields, "metadata")
	delete(fields, "stream")
	delete(fields, "previous_response_id")
	delete(fields, "instructions")
	delete(fields, "store")
	delete(fields, "max_output_tokens")
	delete(fields, "max_step")
	delete(fields, "timeout_seconds")
	delete(fields, "tools")
	delete(fields, "include")
	delete(fields, "background")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPCreateResponseRequest(decoded)
	return nil
}

type UHPResponse struct {
	ID                   string                `json:"id"`
	Object               UHPResponseObject     `json:"object"`
	CreatedAt            int64                 `json:"created_at"`
	Status               UHPResponseStatus     `json:"status"`
	Error                *UHPError             `json:"error,omitempty"`
	IncompleteDetails    *map[string]JSONValue `json:"incomplete_details,omitempty"`
	PreviousResponseID   *string               `json:"previous_response_id,omitempty"`
	Model                string                `json:"model"`
	Output               []UHPOutputItem       `json:"output"`
	Store                *bool                 `json:"store,omitempty"`
	Usage                *UHPUsage             `json:"usage,omitempty"`
	Metadata             *UHPResponseMetadata  `json:"metadata,omitempty"`
	AdditionalProperties map[string]JSONValue  `json:"-"`
}

func (v UHPResponse) MarshalJSON() ([]byte, error) {
	type plain UHPResponse
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPResponse) UnmarshalJSON(data []byte) error {
	type plain UHPResponse
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "id")
	delete(fields, "object")
	delete(fields, "created_at")
	delete(fields, "status")
	delete(fields, "error")
	delete(fields, "incomplete_details")
	delete(fields, "previous_response_id")
	delete(fields, "model")
	delete(fields, "output")
	delete(fields, "store")
	delete(fields, "usage")
	delete(fields, "metadata")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPResponse(decoded)
	return nil
}

type UHPResponseStatus string

const (
	UHPResponseStatusInProgress UHPResponseStatus = "in_progress"
	UHPResponseStatusCompleted  UHPResponseStatus = "completed"
	UHPResponseStatusFailed     UHPResponseStatus = "failed"
	UHPResponseStatusIncomplete UHPResponseStatus = "incomplete"
	UHPResponseStatusCancelled  UHPResponseStatus = "cancelled"
)

type UHPOutputItem struct {
	ID                   *string                `json:"id,omitempty"`
	Type                 string                 `json:"type"`
	Status               *string                `json:"status,omitempty"`
	Role                 *string                `json:"role,omitempty"`
	Content              []UHPContentPart       `json:"content,omitempty"`
	Summary              []map[string]JSONValue `json:"summary,omitempty"`
	CallID               *string                `json:"call_id,omitempty"`
	Name                 *string                `json:"name,omitempty"`
	Arguments            *string                `json:"arguments,omitempty"`
	Output               *string                `json:"output,omitempty"`
	AdditionalProperties map[string]JSONValue   `json:"-"`
}

func (v UHPOutputItem) MarshalJSON() ([]byte, error) {
	type plain UHPOutputItem
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPOutputItem) UnmarshalJSON(data []byte) error {
	type plain UHPOutputItem
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "id")
	delete(fields, "type")
	delete(fields, "status")
	delete(fields, "role")
	delete(fields, "content")
	delete(fields, "summary")
	delete(fields, "call_id")
	delete(fields, "name")
	delete(fields, "arguments")
	delete(fields, "output")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPOutputItem(decoded)
	return nil
}

type UHPContentPart struct {
	Type                 string               `json:"type"`
	Text                 *string              `json:"text,omitempty"`
	Annotations          []UHPAnnotation      `json:"annotations,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPContentPart) MarshalJSON() ([]byte, error) {
	type plain UHPContentPart
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPContentPart) UnmarshalJSON(data []byte) error {
	type plain UHPContentPart
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "type")
	delete(fields, "text")
	delete(fields, "annotations")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPContentPart(decoded)
	return nil
}

type UHPAnnotation struct {
	Type                 UHPAnnotationType    `json:"type"`
	ContainerID          *string              `json:"container_id,omitempty"`
	FileID               *string              `json:"file_id,omitempty"`
	Filename             *string              `json:"filename,omitempty"`
	DownloadURL          *string              `json:"download_url,omitempty"`
	StartIndex           *int64               `json:"start_index,omitempty"`
	EndIndex             *int64               `json:"end_index,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPAnnotation) MarshalJSON() ([]byte, error) {
	type plain UHPAnnotation
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPAnnotation) UnmarshalJSON(data []byte) error {
	type plain UHPAnnotation
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "type")
	delete(fields, "container_id")
	delete(fields, "file_id")
	delete(fields, "filename")
	delete(fields, "download_url")
	delete(fields, "start_index")
	delete(fields, "end_index")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPAnnotation(decoded)
	return nil
}

type UHPUsage struct {
	InputTokens          *int64               `json:"input_tokens,omitempty"`
	OutputTokens         *int64               `json:"output_tokens,omitempty"`
	TotalTokens          *int64               `json:"total_tokens,omitempty"`
	CacheReadTokens      *int64               `json:"cache_read_tokens,omitempty"`
	CacheWriteTokens     *int64               `json:"cache_write_tokens,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPUsage) MarshalJSON() ([]byte, error) {
	type plain UHPUsage
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPUsage) UnmarshalJSON(data []byte) error {
	type plain UHPUsage
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "input_tokens")
	delete(fields, "output_tokens")
	delete(fields, "total_tokens")
	delete(fields, "cache_read_tokens")
	delete(fields, "cache_write_tokens")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPUsage(decoded)
	return nil
}

type UHPErrorEnvelope struct {
	Error                UHPError             `json:"error"`
	Detail               *string              `json:"detail,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPErrorEnvelope) MarshalJSON() ([]byte, error) {
	type plain UHPErrorEnvelope
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPErrorEnvelope) UnmarshalJSON(data []byte) error {
	type plain UHPErrorEnvelope
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "error")
	delete(fields, "detail")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPErrorEnvelope(decoded)
	return nil
}

type UHPError struct {
	Type                 UHPErrorType          `json:"type"`
	Code                 string                `json:"code"`
	Message              string                `json:"message"`
	Param                *string               `json:"param,omitempty"`
	Detail               *map[string]JSONValue `json:"detail,omitempty"`
	AdditionalProperties map[string]JSONValue  `json:"-"`
}

func (v UHPError) MarshalJSON() ([]byte, error) {
	type plain UHPError
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPError) UnmarshalJSON(data []byte) error {
	type plain UHPError
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "type")
	delete(fields, "code")
	delete(fields, "message")
	delete(fields, "param")
	delete(fields, "detail")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPError(decoded)
	return nil
}

type UHPEvent struct {
	Type                 string               `json:"type"`
	SequenceNumber       int64                `json:"sequence_number"`
	Response             *UHPResponse         `json:"response,omitempty"`
	Item                 *UHPOutputItem       `json:"item,omitempty"`
	Part                 *UHPContentPart      `json:"part,omitempty"`
	Annotation           *UHPAnnotation       `json:"annotation,omitempty"`
	Delta                *string              `json:"delta,omitempty"`
	Text                 *string              `json:"text,omitempty"`
	Arguments            *string              `json:"arguments,omitempty"`
	ItemID               *string              `json:"item_id,omitempty"`
	OutputIndex          *int64               `json:"output_index,omitempty"`
	ContentIndex         *int64               `json:"content_index,omitempty"`
	SummaryIndex         *int64               `json:"summary_index,omitempty"`
	AnnotationIndex      *int64               `json:"annotation_index,omitempty"`
	Code                 *string              `json:"code,omitempty"`
	Message              *string              `json:"message,omitempty"`
	Param                *string              `json:"param,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPEvent) MarshalJSON() ([]byte, error) {
	type plain UHPEvent
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPEvent) UnmarshalJSON(data []byte) error {
	type plain UHPEvent
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "type")
	delete(fields, "sequence_number")
	delete(fields, "response")
	delete(fields, "item")
	delete(fields, "part")
	delete(fields, "annotation")
	delete(fields, "delta")
	delete(fields, "text")
	delete(fields, "arguments")
	delete(fields, "item_id")
	delete(fields, "output_index")
	delete(fields, "content_index")
	delete(fields, "summary_index")
	delete(fields, "annotation_index")
	delete(fields, "code")
	delete(fields, "message")
	delete(fields, "param")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPEvent(decoded)
	return nil
}

type JSONValue = json.RawMessage

type RuntimeInstanceSummary struct {
	ID                 string                             `json:"id"`
	OrganizationID     string                             `json:"organization_id"`
	AppID              string                             `json:"app_id"`
	DeveloperID        string                             `json:"developer_id"`
	Name               string                             `json:"name"`
	AgentFramework     string                             `json:"agent_framework"`
	ProviderID         string                             `json:"provider_id"`
	Region             string                             `json:"region"`
	OsType             string                             `json:"os_type"`
	Status             string                             `json:"status"`
	DesiredStatus      string                             `json:"desired_status"`
	Connectivity       string                             `json:"connectivity"`
	ErrorCode          *string                            `json:"error_code,omitempty"`
	MsConnectionStatus string                             `json:"ms_connection_status"`
	ImageID            *string                            `json:"image_id,omitempty"`
	ImageVersionID     *string                            `json:"image_version_id,omitempty"`
	ImageVersion       *string                            `json:"image_version,omitempty"`
	ImageRef           *string                            `json:"image_ref,omitempty"`
	ModelPrimary       *string                            `json:"model_primary,omitempty"`
	Models             []string                           `json:"models,omitempty"`
	LLM                *RuntimeLLMView                    `json:"llm,omitempty"`
	HostingType        *string                            `json:"hosting_type,omitempty"`
	CloudProvider      *string                            `json:"cloud_provider,omitempty"`
	ResourceVersion    int64                              `json:"resource_version"`
	CreatedAt          string                             `json:"created_at"`
	UpdatedAt          string                             `json:"updated_at"`
	Capabilities       RuntimeInstanceSummaryCapabilities `json:"capabilities"`
}

type RuntimeUpgradeJob struct {
	JobID       string  `json:"job_id"`
	InstanceID  string  `json:"instance_id"`
	Status      string  `json:"status"`
	Target      string  `json:"target"`
	CreatedAt   string  `json:"created_at"`
	CompletedAt *string `json:"completed_at,omitempty"`
	Error       *string `json:"error,omitempty"`
}

type RuntimeLLM struct {
	Providers []RuntimeLLMProvider `json:"providers"`
	Models    []RuntimeLLMModel    `json:"models"`
}

type RuntimeLLMView struct {
	Providers []RuntimeLLMProviderView `json:"providers"`
	Models    []RuntimeLLMModel        `json:"models"`
}

type RuntimeLLMProvider struct {
	ID       string                     `json:"id"`
	Protocol RuntimeLLMProviderProtocol `json:"protocol"`
	BaseURL  string                     `json:"base_url"`
	APIKey   *string                    `json:"api_key,omitempty"`
}

type RuntimeLLMProviderView struct {
	ID       string `json:"id"`
	Protocol string `json:"protocol"`
	BaseURL  string `json:"base_url"`
}

type RuntimeLLMModel struct {
	ProviderID string `json:"provider_id"`
	Model      string `json:"model"`
	Role       string `json:"role"`
	Order      int64  `json:"order"`
}

type RuntimeOperationSummary struct {
	ID        string  `json:"id"`
	Kind      string  `json:"kind"`
	Phase     string  `json:"phase"`
	ErrorCode *string `json:"error_code,omitempty"`
}

type RuntimeInstanceResult struct {
	Data      RuntimeInstanceSummary  `json:"data"`
	Operation RuntimeOperationSummary `json:"operation"`
}

type RuntimeExecResult struct {
	ExitCode  int64  `json:"exit_code"`
	Stdout    string `json:"stdout"`
	Stderr    string `json:"stderr"`
	Truncated bool   `json:"truncated"`
}

type FileFile struct {
	FileID          string      `json:"file_id"`
	Filename        string      `json:"filename"`
	ContentType     string      `json:"content_type"`
	SizeBytes       int64       `json:"size_bytes"`
	ChecksumSha256  *string     `json:"checksum_sha256,omitempty"`
	Status          string      `json:"status"`
	ResourceVersion int64       `json:"resource_version"`
	UpdatedAt       string      `json:"updated_at"`
	Title           *string     `json:"title,omitempty"`
	FileType        string      `json:"file_type"`
	CreatedAt       string      `json:"created_at"`
	ConfirmedAt     *string     `json:"confirmed_at,omitempty"`
	Origin          *FileOrigin `json:"origin,omitempty"`
}

type FileOrigin struct {
	Source         string  `json:"source"`
	InstanceID     *string `json:"instance_id,omitempty"`
	AgentID        *string `json:"agent_id,omitempty"`
	OperationID    *string `json:"operation_id,omitempty"`
	InstanceName   *string `json:"instance_name,omitempty"`
	AgentName      *string `json:"agent_name,omitempty"`
	AvatarURL      *string `json:"avatar_url,omitempty"`
	AgentFramework *string `json:"agent_framework,omitempty"`
	Destroyed      *bool   `json:"destroyed,omitempty"`
}

type FileTransferDescriptor struct {
	Direction       string            `json:"direction"`
	FileID          string            `json:"file_id"`
	URL             string            `json:"url"`
	HTTPMethod      string            `json:"http_method"`
	RequiredHeaders map[string]string `json:"required_headers"`
	ExpiresAt       string            `json:"expires_at"`
	ContentType     string            `json:"content_type"`
	SizeBytes       int64             `json:"size_bytes"`
	ChecksumSha256  *string           `json:"checksum_sha256,omitempty"`
}

type FileChatUploadContext struct {
	InstanceID string  `json:"instance_id"`
	AgentID    *string `json:"agent_id,omitempty"`
}

type FilePrepareUploadInput struct {
	UploadContext  *FileChatUploadContext `json:"upload_context,omitempty"`
	Filename       string                 `json:"filename"`
	ContentType    string                 `json:"content_type"`
	SizeBytes      int64                  `json:"size_bytes"`
	ChecksumSha256 *string                `json:"checksum_sha256,omitempty"`
}

type FileConfirmInput struct {
	ChecksumSha256 *string `json:"checksum_sha256,omitempty"`
}

type FilePage struct {
	Data      []FileFile `json:"data"`
	Total     int64      `json:"total"`
	NextSince *string    `json:"next_since,omitempty"`
}

type FileResolution struct {
	File     FileFile               `json:"file"`
	Download FileTransferDescriptor `json:"download"`
}

type FileSummary struct {
	FileCount        int64                      `json:"file_count"`
	StorageFileCount int64                      `json:"storage_file_count"`
	UsedBytes        int64                      `json:"used_bytes"`
	ImageCount       int64                      `json:"image_count"`
	VideoCount       int64                      `json:"video_count"`
	DocumentCount    int64                      `json:"document_count"`
	Instances        []FileSummaryInstancesItem `json:"instances"`
}

type AgentAgent struct {
	ID                    string          `json:"id"`
	InstanceID            string          `json:"instance_id"`
	Name                  string          `json:"name"`
	AvatarURL             *string         `json:"avatar_url,omitempty"`
	DisplayName           *string         `json:"display_name,omitempty"`
	Description           string          `json:"description"`
	ResourceVersion       int64           `json:"resource_version"`
	Status                string          `json:"status"`
	Visibility            string          `json:"visibility"`
	McpEnabled            bool            `json:"mcp_enabled"`
	A2aEnabled            bool            `json:"a2a_enabled"`
	Capabilities          map[string]bool `json:"capabilities"`
	Skills                []AgentSkill    `json:"skills"`
	ConversationTransport string          `json:"conversation_transport"`
	CreatedAt             string          `json:"created_at"`
	UpdatedAt             string          `json:"updated_at"`
}

type AgentAttachment struct {
	FileID string `json:"file_id"`
}

type AgentInvokeInput struct {
	Message     string            `json:"message"`
	ContextID   *string           `json:"context_id,omitempty"`
	TimeoutMs   *int64            `json:"timeout_ms,omitempty"`
	Metadata    map[string]string `json:"metadata,omitempty"`
	Attachments []AgentAttachment `json:"attachments,omitempty"`
}

type AgentInvokeResult struct {
	OperationID *string `json:"operation_id,omitempty"`
	Text        string  `json:"text"`
	ContextID   string  `json:"context_id"`
	IsError     bool    `json:"is_error"`
}

type A2AMessage struct {
	MessageID        string               `json:"messageId"`
	Role             string               `json:"role"`
	Parts            []A2AOutputPart      `json:"parts"`
	ContextID        *string              `json:"contextId,omitempty"`
	TaskID           *string              `json:"taskId,omitempty"`
	ReferenceTaskIds []string             `json:"referenceTaskIds,omitempty"`
	Metadata         map[string]JSONValue `json:"metadata,omitempty"`
}

type A2ATaskStatus struct {
	State     string      `json:"state"`
	Message   *A2AMessage `json:"message,omitempty"`
	Timestamp *string     `json:"timestamp,omitempty"`
}

type A2AArtifact struct {
	ArtifactID  string               `json:"artifactId"`
	Name        *string              `json:"name,omitempty"`
	Description *string              `json:"description,omitempty"`
	Parts       []A2AOutputPart      `json:"parts"`
	Metadata    map[string]JSONValue `json:"metadata,omitempty"`
	Extensions  []string             `json:"extensions,omitempty"`
}

type A2ATextPartOut struct {
	Text     string               `json:"text"`
	Metadata map[string]JSONValue `json:"metadata,omitempty"`
}

type A2AFilePartOut struct {
	URL       *string              `json:"url,omitempty"`
	Filename  *string              `json:"filename,omitempty"`
	MediaType *string              `json:"mediaType,omitempty"`
	Metadata  map[string]JSONValue `json:"metadata,omitempty"`
}

type A2ADataPartOut struct {
	Data     JSONValue            `json:"data"`
	Metadata map[string]JSONValue `json:"metadata,omitempty"`
}

type Skill struct {
	ID                string            `json:"id"`
	Slug              string            `json:"slug"`
	Name              string            `json:"name"`
	Description       string            `json:"description"`
	Category          string            `json:"category"`
	Tags              []string          `json:"tags"`
	License           string            `json:"license"`
	Status            string            `json:"status"`
	LatestVersion     string            `json:"latest_version"`
	IconURL           string            `json:"icon_url"`
	AuthorDisplayName string            `json:"author_display_name"`
	SourceRepoURL     *string           `json:"source_repo_url,omitempty"`
	LatestVersionInfo *SkillVersionInfo `json:"latest_version_info,omitempty"`
	Files             []SkillDetailFile `json:"files,omitempty"`
	Downloads         int64             `json:"downloads"`
	Stars             int64             `json:"stars"`
	CreatedAt         string            `json:"created_at"`
	UpdatedAt         string            `json:"updated_at"`
}

type SkillVersionInfo struct {
	ID          string  `json:"id"`
	SkillID     string  `json:"skill_id"`
	Version     string  `json:"version"`
	Changelog   string  `json:"changelog"`
	Fingerprint string  `json:"fingerprint"`
	License     string  `json:"license"`
	CreatedAt   string  `json:"created_at"`
	ContentURL  *string `json:"content_url,omitempty"`
}

type SkillDetailFile struct {
	Path        string `json:"path"`
	DownloadURL string `json:"download_url"`
	Sha256      string `json:"sha256"`
	Size        int64  `json:"size"`
}

type SkillPage struct {
	Data       []Skill `json:"data"`
	Total      int64   `json:"total"`
	NextCursor *string `json:"next_cursor,omitempty"`
}

type SkillCategory struct {
	Category string `json:"category"`
	Count    int64  `json:"count"`
}

type skillSetListView struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	DisplayName string `json:"display_name"`
	Summary     string `json:"summary"`
	Scene       string `json:"scene"`
	IconURL     string `json:"icon_url"`
	SkillCount  int64  `json:"skill_count"`
	UpdatedAt   string `json:"updated_at"`
}

type skillSetMemberView struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	Description string `json:"description"`
	IconURL     string `json:"icon_url"`
	Downloads   int64  `json:"downloads"`
	Stars       int64  `json:"stars"`
	Status      string `json:"status"`
}

type skillSetItemView struct {
	StepNote string             `json:"step_note"`
	Skill    skillSetMemberView `json:"skill"`
}

type skillSetDetailView struct {
	ID               string             `json:"id"`
	Slug             string             `json:"slug"`
	DisplayName      string             `json:"display_name"`
	Summary          string             `json:"summary"`
	Content          string             `json:"content"`
	Scene            string             `json:"scene"`
	IconURL          string             `json:"icon_url"`
	Items            []skillSetItemView `json:"items"`
	UnavailableCount int64              `json:"unavailable_count"`
}

type agentBindWire struct {
	Status         string           `json:"status"`
	BindID         *string          `json:"bind_id,omitempty"`
	InstanceID     *string          `json:"instance_id,omitempty"`
	PublicKey      *string          `json:"public_key,omitempty"`
	Hostname       *string          `json:"hostname,omitempty"`
	ExpiresAt      *int64           `json:"expires_at,omitempty"`
	RuntimeBinding *bindRuntimeWire `json:"runtime_binding,omitempty"`
}

type bindRuntimeWire struct {
	InstanceID        string `json:"instance_id"`
	AgentGatewayURL   string `json:"agent_gateway_url"`
	MessageServiceURL string `json:"message_service_url"`
}

type agentBindDetailsWire struct {
	BindID           string  `json:"bind_id"`
	Hostname         string  `json:"hostname"`
	FingerprintShort string  `json:"fingerprint_short"`
	AgentFramework   string  `json:"agent_framework"`
	OsType           *string `json:"os_type,omitempty"`
	ExpiresAt        int64   `json:"expires_at"`
	Status           string  `json:"status"`
	ServerTime       int64   `json:"server_time"`
}

type portalBindWire struct {
	ProviderID      *string `json:"provider_id,omitempty"`
	BindID          string  `json:"bind_id"`
	ShortCode       string  `json:"short_code"`
	Status          string  `json:"status"`
	InstanceID      *string `json:"instance_id,omitempty"`
	ExpiresAt       int64   `json:"expires_at"`
	Name            string  `json:"name"`
	QrPayload       *string `json:"qr_payload,omitempty"`
	APIBaseURL      *string `json:"api_base_url,omitempty"`
	RelayURL        *string `json:"relay_url,omitempty"`
	DesiredStatus   *string `json:"desired_status,omitempty"`
	Connectivity    *string `json:"connectivity,omitempty"`
	ResourceVersion *int64  `json:"resource_version,omitempty"`
}

type agentTemplateCatalogView struct {
	ID              string   `json:"id"`
	DisplayName     string   `json:"display_name"`
	Summary         string   `json:"summary"`
	Description     string   `json:"description"`
	Category        string   `json:"category"`
	Vibe            string   `json:"vibe"`
	IconURL         string   `json:"icon_url"`
	BannerURL       string   `json:"banner_url"`
	DefaultModel    string   `json:"default_model"`
	Tags            []string `json:"tags"`
	AgentFramework  string   `json:"agent_framework"`
	TemplateVersion string   `json:"template_version"`
}

type CloudSkillOperationDetail struct {
	ID                 string                      `json:"id"`
	InstanceID         string                      `json:"instanceId"`
	Target             CloudRuntimeOperationTarget `json:"target"`
	Capability         string                      `json:"capability"`
	Transport          string                      `json:"transport"`
	Sequence           string                      `json:"sequence"`
	Cursor             string                      `json:"cursor"`
	CreatedAt          string                      `json:"createdAt"`
	EffectState        string                      `json:"effectState"`
	OperationID        string                      `json:"operationId"`
	RequestOperationID *string                     `json:"requestOperationId,omitempty"`
	ReplayDefaultKey   *bool                       `json:"replayDefaultKey,omitempty"`
	Method             string                      `json:"method"`
	Status             string                      `json:"status"`
	Terminal           bool                        `json:"terminal"`
	ContractRevision   string                      `json:"contractRevision"`
	CatalogIntent      *CloudSkillInstallIntent    `json:"catalogIntent,omitempty"`
	SkillIntent        *JSONValue                  `json:"skillIntent,omitempty"`
	TemplateIntent     *CloudTemplateIntent        `json:"templateIntent,omitempty"`
	UpdatedAt          string                      `json:"updatedAt"`
	Result             *JSONValue                  `json:"result,omitempty"`
	Error              *JSONValue                  `json:"error,omitempty"`
	ObservationCode    *string                     `json:"observationCode,omitempty"`
}

type CloudRuntimeOperationTarget struct {
	Scope           string  `json:"scope"`
	PlatformAgentID *string `json:"platformAgentId,omitempty"`
	ConversationID  *string `json:"conversationId,omitempty"`
}

type CloudSkillInstallIntent struct {
	PlatformAgentID string  `json:"platformAgentId"`
	Slug            string  `json:"slug"`
	Version         *string `json:"version,omitempty"`
}

type CloudTemplateIntent struct {
	Name            string  `json:"name"`
	TemplateID      string  `json:"templateId"`
	TemplateVersion *string `json:"templateVersion,omitempty"`
}

type MCPServer struct {
	ID                   string                          `json:"id"`
	Slug                 *string                         `json:"slug,omitempty"`
	Status               string                          `json:"status"`
	Installs             int64                           `json:"installs"`
	Install              *JSONValue                      `json:"install,omitempty"`
	Auth                 *JSONValue                      `json:"auth,omitempty"`
	Inputs               *JSONValue                      `json:"inputs,omitempty"`
	Category             *string                         `json:"category,omitempty"`
	Tags                 []string                        `json:"tags"`
	Display              *JSONValue                      `json:"display,omitempty"`
	IconURL              *string                         `json:"iconUrl,omitempty"`
	Info                 *JSONValue                      `json:"info,omitempty"`
	CreatedAt            *string                         `json:"createdAt,omitempty"`
	UpdatedAt            *string                         `json:"updatedAt,omitempty"`
	Kind                 *string                         `json:"kind,omitempty"`
	ConnectorID          *string                         `json:"connectorId,omitempty"`
	AuthorizationOptions []catalogAuthorizationOptionDTO `json:"authorizationOptions,omitempty"`
	ActionCount          *int64                          `json:"actionCount,omitempty"`
	Actions              []catalogActionDTO              `json:"actions,omitempty"`
	AuthMode             *string                         `json:"auth_mode,omitempty"`
	Connected            bool                            `json:"connected"`
}

type catalogCredentialFieldDTO struct {
	Key      string `json:"key"`
	Label    string `json:"label"`
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type catalogAuthorizationOptionDTO struct {
	ConfigurationRequired   bool                        `json:"configurationRequired"`
	Kind                    string                      `json:"kind"`
	CredentialKey           *string                     `json:"credentialKey,omitempty"`
	AuthorizationProfileKey *string                     `json:"authorizationProfileKey,omitempty"`
	Fields                  []catalogCredentialFieldDTO `json:"fields,omitempty"`
}

type catalogActionDTO struct {
	ID             string    `json:"id"`
	ConnectorID    string    `json:"connectorId"`
	Name           string    `json:"name"`
	Description    string    `json:"description"`
	InputSchema    JSONValue `json:"inputSchema"`
	OutputSchema   JSONValue `json:"outputSchema"`
	RequiredScopes []string  `json:"requiredScopes"`
}

type MCPServerResolution struct {
	Name                 string                          `json:"name"`
	Definition           map[string]JSONValue            `json:"definition"`
	ID                   string                          `json:"id"`
	Slug                 *string                         `json:"slug,omitempty"`
	Status               string                          `json:"status"`
	Installs             int64                           `json:"installs"`
	Install              *JSONValue                      `json:"install,omitempty"`
	Auth                 *JSONValue                      `json:"auth,omitempty"`
	Inputs               *JSONValue                      `json:"inputs,omitempty"`
	Category             *string                         `json:"category,omitempty"`
	Tags                 []string                        `json:"tags"`
	Display              *JSONValue                      `json:"display,omitempty"`
	IconURL              *string                         `json:"iconUrl,omitempty"`
	Info                 *JSONValue                      `json:"info,omitempty"`
	CreatedAt            *string                         `json:"createdAt,omitempty"`
	UpdatedAt            *string                         `json:"updatedAt,omitempty"`
	Kind                 *string                         `json:"kind,omitempty"`
	ConnectorID          *string                         `json:"connectorId,omitempty"`
	AuthorizationOptions []catalogAuthorizationOptionDTO `json:"authorizationOptions,omitempty"`
	ActionCount          *int64                          `json:"actionCount,omitempty"`
	Actions              []catalogActionDTO              `json:"actions,omitempty"`
	AuthMode             *string                         `json:"auth_mode,omitempty"`
	Connected            bool                            `json:"connected"`
}

type CloudSkillOperationPage struct {
	Operations []CloudSkillOperationDetail `json:"operations"`
	NextCursor *string                     `json:"nextCursor,omitempty"`
}

type a2aTaskView struct {
	ID                string               `json:"id"`
	ContextID         string               `json:"contextId"`
	Status            A2ATaskStatus        `json:"status"`
	Artifacts         []A2AArtifact        `json:"artifacts,omitempty"`
	History           []A2AMessage         `json:"history,omitempty"`
	Metadata          map[string]JSONValue `json:"metadata,omitempty"`
	CallerPrincipalID string               `json:"caller_principal_id"`
	CallerAgentID     string               `json:"caller_agent_id"`
	CallerOwnerID     string               `json:"caller_owner_id"`
	TargetPrincipalID string               `json:"target_principal_id"`
	TargetAgentID     string               `json:"target_agent_id"`
	TargetOwnerID     string               `json:"target_owner_id"`
	ChannelID         *string              `json:"channel_id,omitempty"`
	CreatedAt         *string              `json:"created_at,omitempty"`
	UpdatedAt         *string              `json:"updated_at,omitempty"`
	CompletedAt       *string              `json:"completed_at,omitempty"`
}

type CreateServerInstanceInput struct {
	Name           string                                   `json:"name"`
	VariantID      *string                                  `json:"variant_id,omitempty"`
	AgentFramework *CreateServerInstanceInputAgentFramework `json:"agent_framework,omitempty"`
	LLM            *RuntimeLLM                              `json:"llm,omitempty"`
}

type ServerUsageSummary struct {
	TotalBc        string            `json:"total_bc"`
	TotalRecords   int64             `json:"total_records"`
	ByCategory     map[string]string `json:"by_category"`
	ByApp          map[string]string `json:"by_app,omitempty"`
	CategoryCounts map[string]int64  `json:"category_counts"`
}

type RuntimeInstanceStatusResult struct {
	Data      RuntimeInstanceStatusResultData `json:"data"`
	Operation RuntimeOperationSummary         `json:"operation"`
}

type UpdateServerInstanceInput struct {
	Name *string     `json:"name,omitempty"`
	LLM  *RuntimeLLM `json:"llm,omitempty"`
}

type FileShareResponse struct {
	FileID      string `json:"file_id"`
	Slug        string `json:"slug"`
	Filename    string `json:"filename"`
	ContentType string `json:"content_type"`
	SizeBytes   int64  `json:"size_bytes"`
	Revoked     bool   `json:"revoked"`
}

type ReplyShareResponse struct {
	Data ReplyShareResponseData `json:"data"`
}

type ConnectURLResponse struct {
	Data ConnectURLResponseData `json:"data"`
}

type ProtoAutomationRule struct {
	ID                      *string                  `json:"id,omitempty"`
	Name                    *string                  `json:"name,omitempty"`
	Prompt                  *string                  `json:"prompt,omitempty"`
	Target                  *ProtoAutomationTarget   `json:"target,omitempty"`
	Schedule                *ProtoAutomationSchedule `json:"schedule,omitempty"`
	Session                 *ProtoAutomationSession  `json:"session,omitempty"`
	ValidFrom               *string                  `json:"validFrom,omitempty"`
	ValidUntil              *string                  `json:"validUntil,omitempty"`
	Status                  *string                  `json:"status,omitempty"`
	NextFireAt              *string                  `json:"nextFireAt,omitempty"`
	CreatedInConversationID *string                  `json:"createdInConversationId,omitempty"`
	CreatedAt               *string                  `json:"createdAt,omitempty"`
	UpdatedAt               *string                  `json:"updatedAt,omitempty"`
	TriggerKind             *string                  `json:"triggerKind,omitempty"`
	HookID                  *string                  `json:"hookId,omitempty"`
	Source                  *string                  `json:"source,omitempty"`
	EventFilter             *string                  `json:"eventFilter,omitempty"`
	Mailbox                 *string                  `json:"mailbox,omitempty"`
}

type ProtoAutomationTarget struct {
	InstanceID *string `json:"instanceId,omitempty"`
	AgentID    *string `json:"agentId,omitempty"`
}

type ProtoAutomationSchedule struct {
	Kind            *string `json:"kind,omitempty"`
	Tz              *string `json:"tz,omitempty"`
	At              *string `json:"at,omitempty"`
	IntervalSeconds *string `json:"intervalSeconds,omitempty"`
	AnchorAt        *string `json:"anchorAt,omitempty"`
	Expression      *string `json:"expression,omitempty"`
}

type ProtoAutomationSession struct {
	Mode                *string `json:"mode,omitempty"`
	BoundConversationID *string `json:"boundConversationId,omitempty"`
}

type ProtoAutomationInput struct {
	Name                    *string                  `json:"name,omitempty"`
	Prompt                  *string                  `json:"prompt,omitempty"`
	Target                  *ProtoAutomationTarget   `json:"target,omitempty"`
	Schedule                *ProtoAutomationSchedule `json:"schedule,omitempty"`
	Session                 *ProtoAutomationSession  `json:"session,omitempty"`
	ValidFrom               *string                  `json:"validFrom,omitempty"`
	ValidUntil              *string                  `json:"validUntil,omitempty"`
	CreatedInConversationID *string                  `json:"createdInConversationId,omitempty"`
}

type ProtoListAutomationsResponse struct {
	Items      []ProtoAutomationRule `json:"items,omitempty"`
	NextCursor *string               `json:"nextCursor,omitempty"`
}

type ProtoAutomationPatch struct {
	Name            *string                  `json:"name,omitempty"`
	Prompt          *string                  `json:"prompt,omitempty"`
	Target          *ProtoAutomationTarget   `json:"target,omitempty"`
	Schedule        *ProtoAutomationSchedule `json:"schedule,omitempty"`
	Session         *ProtoAutomationSession  `json:"session,omitempty"`
	ValidFrom       *string                  `json:"validFrom,omitempty"`
	ValidUntil      *string                  `json:"validUntil,omitempty"`
	ClearValidFrom  *bool                    `json:"clearValidFrom,omitempty"`
	ClearValidUntil *bool                    `json:"clearValidUntil,omitempty"`
}

type ProtoAutomationRun struct {
	ID               *string                 `json:"id,omitempty"`
	AutomationID     *string                 `json:"automationId,omitempty"`
	TriggerType      *string                 `json:"triggerType,omitempty"`
	ScheduledAt      *string                 `json:"scheduledAt,omitempty"`
	CreatedAt        *string                 `json:"createdAt,omitempty"`
	Status           *string                 `json:"status,omitempty"`
	Target           *ProtoAutomationTarget  `json:"target,omitempty"`
	Session          *ProtoAutomationSession `json:"session,omitempty"`
	ConversationID   *string                 `json:"conversationId,omitempty"`
	WakeMessageID    *string                 `json:"wakeMessageId,omitempty"`
	SourceRunID      *string                 `json:"sourceRunId,omitempty"`
	RerunSessionMode *string                 `json:"rerunSessionMode,omitempty"`
	ReasonCode       *string                 `json:"reasonCode,omitempty"`
	DispatchedAt     *string                 `json:"dispatchedAt,omitempty"`
}

type ProtoAutomationRunInput struct {
	SourceRunID      *string `json:"sourceRunId,omitempty"`
	RerunSessionMode *string `json:"rerunSessionMode,omitempty"`
}

type ProtoListAutomationRunsResponse struct {
	Items      []ProtoAutomationRun `json:"items,omitempty"`
	NextCursor *string              `json:"nextCursor,omitempty"`
}

type ProtoAutomationWebhookInput struct {
	Name                    *string                 `json:"name,omitempty"`
	Prompt                  *string                 `json:"prompt,omitempty"`
	Target                  *ProtoAutomationTarget  `json:"target,omitempty"`
	Session                 *ProtoAutomationSession `json:"session,omitempty"`
	ValidFrom               *string                 `json:"validFrom,omitempty"`
	ValidUntil              *string                 `json:"validUntil,omitempty"`
	CreatedInConversationID *string                 `json:"createdInConversationId,omitempty"`
	Source                  *string                 `json:"source,omitempty"`
	Events                  []string                `json:"events,omitempty"`
	RepoOwner               *string                 `json:"repoOwner,omitempty"`
	RepoName                *string                 `json:"repoName,omitempty"`
	EventFilter             *string                 `json:"eventFilter,omitempty"`
	Mailbox                 *string                 `json:"mailbox,omitempty"`
}

type ProtoPutConnectorCredentialResponse struct {
}

type ProtoPutConnectorCredentialRequest struct {
	OrganizationID *string `json:"organizationId,omitempty"`
	AppID          *string `json:"appId,omitempty"`
	CredentialRef  *string `json:"credentialRef,omitempty"`
	CredentialKey  *string `json:"credentialKey,omitempty"`
	AuthKind       *string `json:"authKind,omitempty"`
}

type ProtoDeleteConnectorCredentialResponse struct {
}

type ProtoDeleteConnectorCredentialRequest struct {
	OrganizationID *string `json:"organizationId,omitempty"`
	AppID          *string `json:"appId,omitempty"`
	CredentialRef  *string `json:"credentialRef,omitempty"`
}

type ProtoListInstanceConnectorsResponse struct {
	Connectors []ProtoInstanceConnector `json:"connectors,omitempty"`
	Total      *int64                   `json:"total,omitempty"`
}

type ProtoInstanceConnector struct {
	Catalog          *ProtoMcpServer        `json:"catalog,omitempty"`
	Installed        *bool                  `json:"installed,omitempty"`
	Binding          *ProtoConnectorBinding `json:"binding,omitempty"`
	CredentialStatus *string                `json:"credentialStatus,omitempty"`
}

type ProtoMcpServer struct {
	ID                   *string                           `json:"id,omitempty"`
	Slug                 *string                           `json:"slug,omitempty"`
	Status               *string                           `json:"status,omitempty"`
	Installs             *string                           `json:"installs,omitempty"`
	CreatedAt            *string                           `json:"createdAt,omitempty"`
	UpdatedAt            *string                           `json:"updatedAt,omitempty"`
	Install              *string                           `json:"install,omitempty"`
	Auth                 *string                           `json:"auth,omitempty"`
	Inputs               *string                           `json:"inputs,omitempty"`
	Category             *string                           `json:"category,omitempty"`
	Tags                 []string                          `json:"tags,omitempty"`
	Display              *string                           `json:"display,omitempty"`
	IconURL              *string                           `json:"iconUrl,omitempty"`
	Info                 *string                           `json:"info,omitempty"`
	ConnectorID          *string                           `json:"connectorId,omitempty"`
	Kind                 *string                           `json:"kind,omitempty"`
	AuthorizationOptions []ProtoCatalogAuthorizationOption `json:"authorizationOptions,omitempty"`
	ActionCount          *int64                            `json:"actionCount,omitempty"`
	Actions              []ProtoCatalogAction              `json:"actions,omitempty"`
}

type ProtoCatalogAuthorizationOption struct {
	Kind                    *string                       `json:"kind,omitempty"`
	CredentialKey           *string                       `json:"credentialKey,omitempty"`
	AuthorizationProfileKey *string                       `json:"authorizationProfileKey,omitempty"`
	Fields                  []ProtoCatalogCredentialField `json:"fields,omitempty"`
	ConfigurationRequired   *bool                         `json:"configurationRequired,omitempty"`
}

type ProtoCatalogCredentialField struct {
	Key      *string `json:"key,omitempty"`
	Label    *string `json:"label,omitempty"`
	Type     *string `json:"type,omitempty"`
	Required *bool   `json:"required,omitempty"`
}

type ProtoCatalogAction struct {
	ID             *string  `json:"id,omitempty"`
	ConnectorID    *string  `json:"connectorId,omitempty"`
	Name           *string  `json:"name,omitempty"`
	Description    *string  `json:"description,omitempty"`
	InputSchema    *string  `json:"inputSchema,omitempty"`
	OutputSchema   *string  `json:"outputSchema,omitempty"`
	RequiredScopes []string `json:"requiredScopes,omitempty"`
}

type ProtoConnectorBinding struct {
	ID             *string `json:"id,omitempty"`
	ConnectorID    *string `json:"connectorId,omitempty"`
	CredentialRef  *string `json:"credentialRef,omitempty"`
	Enabled        *bool   `json:"enabled,omitempty"`
	CreatedAt      *string `json:"createdAt,omitempty"`
	UpdatedAt      *string `json:"updatedAt,omitempty"`
	OrganizationID *string `json:"organizationId,omitempty"`
	AppID          *string `json:"appId,omitempty"`
}

type ProtoListInstanceConnectorsRequest struct {
	AgentInstanceID *string  `json:"agentInstanceId,omitempty"`
	InstalledOnly   *bool    `json:"installedOnly,omitempty"`
	Category        *string  `json:"category,omitempty"`
	Tags            []string `json:"tags,omitempty"`
	Query           *string  `json:"query,omitempty"`
	Limit           *int64   `json:"limit,omitempty"`
	Offset          *int64   `json:"offset,omitempty"`
	OrganizationID  *string  `json:"organizationId,omitempty"`
	AppID           *string  `json:"appId,omitempty"`
}

type ProtoInstallManagedConnectorRequest struct {
	AgentInstanceID *string `json:"agentInstanceId,omitempty"`
	MarketEntryID   *string `json:"marketEntryId,omitempty"`
	CredentialRef   *string `json:"credentialRef,omitempty"`
	OrganizationID  *string `json:"organizationId,omitempty"`
	AppID           *string `json:"appId,omitempty"`
}

type ProtoUpdateManagedConnectorRequest struct {
	AgentInstanceID *string `json:"agentInstanceId,omitempty"`
	ConnectorID     *string `json:"connectorId,omitempty"`
	Enabled         *bool   `json:"enabled,omitempty"`
	CredentialRef   *string `json:"credentialRef,omitempty"`
	OrganizationID  *string `json:"organizationId,omitempty"`
	AppID           *string `json:"appId,omitempty"`
}

type ProtoUninstallManagedConnectorResponse struct {
}

type ProtoUninstallManagedConnectorRequest struct {
	AgentInstanceID *string `json:"agentInstanceId,omitempty"`
	ConnectorID     *string `json:"connectorId,omitempty"`
	OrganizationID  *string `json:"organizationId,omitempty"`
	AppID           *string `json:"appId,omitempty"`
}

type ProtoListMcpServersResponse struct {
	Servers []ProtoMcpServer `json:"servers,omitempty"`
	Total   *int64           `json:"total,omitempty"`
}

type ProtoListMcpServersRequest struct {
	Category *string  `json:"category,omitempty"`
	Tags     []string `json:"tags,omitempty"`
	Query    *string  `json:"query,omitempty"`
	Limit    *int64   `json:"limit,omitempty"`
	Offset   *int64   `json:"offset,omitempty"`
}

type ProtoGetMcpServerResponse struct {
	Server *ProtoMcpServer `json:"server,omitempty"`
}

type ProtoGetMcpServerRequest struct {
	ID *string `json:"id,omitempty"`
}

type ProtoListCategoriesResponse struct {
	Categories []ProtoCategoryCount `json:"categories,omitempty"`
}

type ProtoCategoryCount struct {
	Category *string `json:"category,omitempty"`
	Count    *int64  `json:"count,omitempty"`
}

type ProtoMcpListCategoriesRequest struct {
}

type ProtoResolveMcpPreparationRequest struct {
	ID *string `json:"id,omitempty"`
}

type ProtoResolveInstallResponse struct {
	ServerName       *string  `json:"serverName,omitempty"`
	ServerConfigJSON *string  `json:"serverConfigJson,omitempty"`
	AuthMode         *string  `json:"authMode,omitempty"`
	OneClickEligible *bool    `json:"oneClickEligible,omitempty"`
	Warnings         []string `json:"warnings,omitempty"`
}

type ProtoResolveInstallRequest struct {
	ID *string `json:"id,omitempty"`
}

type RuntimeMethodResponse struct {
	JSONrpc RuntimeMethodResponseJSONrpc `json:"jsonrpc"`
	ID      RuntimeMethodResponseID      `json:"id"`
	Result  *JSONValue                   `json:"result,omitempty"`
	Error   *RuntimeMethodResponseError  `json:"error,omitempty"`
}

type CanvasShare struct {
	ID               string  `json:"id"`
	CanvasID         string  `json:"canvasId"`
	Slug             string  `json:"slug"`
	Mode             string  `json:"mode"`
	AllowInteraction bool    `json:"allowInteraction"`
	ExpiresAt        *string `json:"expiresAt,omitempty"`
	CreatedAt        string  `json:"createdAt"`
}

type CanvasSnapshot struct {
	ID                 string  `json:"id"`
	CanvasID           string  `json:"canvasId"`
	ComponentsSnapshot *string `json:"componentsSnapshot,omitempty"`
	ActorType          string  `json:"actorType"`
	ActorID            string  `json:"actorId"`
	Description        *string `json:"description,omitempty"`
	Version            int64   `json:"version"`
	CreatedAt          string  `json:"createdAt"`
}

type A2AAgentCard struct {
	Name                string                                `json:"name"`
	Description         string                                `json:"description"`
	URL                 *string                               `json:"url,omitempty"`
	Version             string                                `json:"version"`
	ProtocolVersion     *string                               `json:"protocolVersion,omitempty"`
	DefaultInputModes   []string                              `json:"defaultInputModes"`
	DefaultOutputModes  []string                              `json:"defaultOutputModes"`
	SupportedInterfaces []A2AAgentCardSupportedInterfacesItem `json:"supportedInterfaces,omitempty"`
}

// A2AOutputPart represents the documented alternatives. Set one variant when encoding.
type A2AOutputPart struct {
	Variant1 *A2ATextPartOut
	Variant2 *A2AFilePartOut
	Variant3 *A2ADataPartOut
}

func (v A2AOutputPart) MarshalJSON() ([]byte, error) {
	if v.Variant1 != nil {
		return json.Marshal(v.Variant1)
	}
	if v.Variant2 != nil {
		return json.Marshal(v.Variant2)
	}
	if v.Variant3 != nil {
		return json.Marshal(v.Variant3)
	}
	return nil, fmt.Errorf("A2AOutputPart: no variant set")
}

func (v *A2AOutputPart) UnmarshalJSON(data []byte) error {
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	{
		if fields["text"] != nil {
			var decoded A2ATextPartOut
			if err := json.Unmarshal(data, &decoded); err != nil {
				return err
			}
			v.Variant1 = &decoded
			return nil
		}
	}
	{
		if fields["data"] != nil {
			var decoded A2ADataPartOut
			if err := json.Unmarshal(data, &decoded); err != nil {
				return err
			}
			v.Variant3 = &decoded
			return nil
		}
	}
	{
		var decoded A2AFilePartOut
		if err := json.Unmarshal(data, &decoded); err != nil {
			return err
		}
		v.Variant2 = &decoded
		return nil

	}
}

type RuntimeMethodAvailability struct {
	Enabled                          bool    `json:"enabled"`
	MinimumRuntimeRpcProtocolVersion int64   `json:"minimumRuntimeRpcProtocolVersion"`
	MinimumRuntimeContractRevision   *string `json:"minimumRuntimeContractRevision,omitempty"`
}

type RuntimeCapabilitySupport struct {
	Service                          bool   `json:"service"`
	MinimumRuntimeRpcProtocolVersion *int64 `json:"minimumRuntimeRpcProtocolVersion,omitempty"`
}

type RuntimeCapabilityDocument struct {
	ManifestID                     string                               `json:"manifestId"`
	ContractRevision               string                               `json:"contractRevision"`
	RuntimeRpcProtocolVersion      int64                                `json:"runtimeRpcProtocolVersion"`
	RuntimeEpoch                   string                               `json:"runtimeEpoch"`
	ServiceMethods                 []string                             `json:"serviceMethods"`
	ConversationMethods            []string                             `json:"conversationMethods"`
	MethodAvailability             map[string]RuntimeMethodAvailability `json:"methodAvailability"`
	ConversationMethodAvailability map[string]RuntimeMethodAvailability `json:"conversationMethodAvailability"`
	Capabilities                   map[string]RuntimeCapabilitySupport  `json:"capabilities"`
	GeneratedAt                    string                               `json:"generatedAt"`
	ExpiresAt                      string                               `json:"expiresAt"`
	TerminalTransport              *string                              `json:"terminalTransport,omitempty"`
	CanvasTransport                *string                              `json:"canvasTransport,omitempty"`
}

type RealtimeTicketHeader struct {
	Alg string `json:"alg"`
	Typ string `json:"typ"`
	Kid string `json:"kid"`
}

type TerminalTicketClaims struct {
	Iss              string  `json:"iss"`
	Aud              string  `json:"aud"`
	Sub              string  `json:"sub"`
	Jti              string  `json:"jti"`
	InstanceID       string  `json:"instance_id"`
	PlatformAgentID  string  `json:"platform_agent_id"`
	ClientID         string  `json:"client_id"`
	ConversationID   *string `json:"conversation_id,omitempty"`
	ResumeTerminalID *string `json:"resume_terminal_id,omitempty"`
	Iat              int64   `json:"iat"`
	Exp              int64   `json:"exp"`
}

type CanvasTicketClaims struct {
	Iss             string   `json:"iss"`
	Sub             string   `json:"sub"`
	Jti             string   `json:"jti"`
	Purpose         string   `json:"purpose"`
	InstanceID      string   `json:"instance_id"`
	PlatformAgentID string   `json:"platform_agent_id"`
	ClientID        string   `json:"client_id"`
	ConversationID  string   `json:"conversation_id"`
	CanvasID        string   `json:"canvas_id"`
	Role            string   `json:"role"`
	SessionID       string   `json:"session_id"`
	Aud             []string `json:"aud"`
	Iat             int64    `json:"iat"`
	Exp             int64    `json:"exp"`
}

type TerminalSessionDocument struct {
	Transport       string               `json:"transport"`
	ProtocolVersion int64                `json:"protocolVersion"`
	Header          RealtimeTicketHeader `json:"header"`
	WebsocketURL    string               `json:"websocketUrl"`
	Ticket          string               `json:"ticket"`
	IssuedAt        string               `json:"issuedAt"`
	ExpiresAt       string               `json:"expiresAt"`
	Claims          TerminalTicketClaims `json:"claims"`
}

type CanvasSessionDocument struct {
	Transport       string               `json:"transport"`
	ProtocolVersion int64                `json:"protocolVersion"`
	Header          RealtimeTicketHeader `json:"header"`
	RelayURL        string               `json:"relayUrl"`
	Ticket          string               `json:"ticket"`
	IssuedAt        string               `json:"issuedAt"`
	ExpiresAt       string               `json:"expiresAt"`
	Claims          CanvasTicketClaims   `json:"claims"`
}

type DeviceBindingErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

type UHPCreateResponseJSONRequest struct {
	Input                UHPCreateResponseJSONRequestInput     `json:"input"`
	Model                *string                               `json:"model,omitempty"`
	Metadata             *UHPCreateResponseJSONRequestMetadata `json:"metadata,omitempty"`
	PreviousResponseID   *string                               `json:"previous_response_id,omitempty"`
	Instructions         *string                               `json:"instructions,omitempty"`
	Store                *bool                                 `json:"store,omitempty"`
	MaxOutputTokens      *int64                                `json:"max_output_tokens,omitempty"`
	MaxStep              *int64                                `json:"max_step,omitempty"`
	TimeoutSeconds       *int64                                `json:"timeout_seconds,omitempty"`
	Tools                []map[string]JSONValue                `json:"tools,omitempty"`
	Include              []string                              `json:"include,omitempty"`
	Background           *bool                                 `json:"background,omitempty"`
	AdditionalProperties map[string]JSONValue                  `json:"-"`
}

func (v UHPCreateResponseJSONRequest) MarshalJSON() ([]byte, error) {
	type plain UHPCreateResponseJSONRequest
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPCreateResponseJSONRequest) UnmarshalJSON(data []byte) error {
	type plain UHPCreateResponseJSONRequest
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "input")
	delete(fields, "model")
	delete(fields, "metadata")
	delete(fields, "previous_response_id")
	delete(fields, "instructions")
	delete(fields, "store")
	delete(fields, "max_output_tokens")
	delete(fields, "max_step")
	delete(fields, "timeout_seconds")
	delete(fields, "tools")
	delete(fields, "include")
	delete(fields, "background")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPCreateResponseJSONRequest(decoded)
	return nil
}

type CreateClientSessionOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type RefreshClientSessionRequest struct {
	RequestedCapabilities []string `json:"requested_capabilities,omitempty"`
	TtlSeconds            *int64   `json:"ttl_seconds,omitempty"`
}

type RefreshClientSessionOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type RevokeClientSessionOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type DeleteExternalUserOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListProvidersOptions struct {
	Capability *string `json:"capability,omitempty"`
}

type ListDeployRegionsOptions struct {
	ProviderID *string `json:"provider_id,omitempty"`
	Available  *bool   `json:"available,omitempty"`
}

type ListDeployModelsOptions struct {
	AgentFramework *string `json:"agent_framework,omitempty"`
	Search         *string `json:"search,omitempty"`
}

type ListInstanceTemplatesOptions struct {
	Page           *int64  `json:"page,omitempty"`
	PageSize       *int64  `json:"page_size,omitempty"`
	AgentFramework *string `json:"agent_framework,omitempty"`
	ProviderID     *string `json:"provider_id,omitempty"`
	Search         *string `json:"search,omitempty"`
}

type ListAgentTemplatesResponse struct {
	Data  []agentTemplateCatalogView `json:"data"`
	Total int64                      `json:"total"`
}

type ListAgentTemplatesOptions struct {
	Category *string `json:"category,omitempty"`
	Search   *string `json:"search,omitempty"`
	Page     *int64  `json:"page,omitempty"`
	PageSize *int64  `json:"page_size,omitempty"`
}

type ListInstancesOptions struct {
	Page           *int64  `json:"page,omitempty"`
	PageSize       *int64  `json:"page_size,omitempty"`
	Status         *string `json:"status,omitempty"`
	ProviderID     *string `json:"provider_id,omitempty"`
	AgentFramework *string `json:"agent_framework,omitempty"`
	ClusterID      *string `json:"cluster_id,omitempty"`
	Search         *string `json:"search,omitempty"`
}

type InstanceCreateOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type UpdateInstanceMetadataResponse struct {
	Data RuntimeInstanceSummary `json:"data"`
}

type UpdateInstanceMetadataOptions struct {
	IfMatch string `json:"If-Match"`
}

type DeleteInstanceOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
	IfMatch        string `json:"If-Match"`
}

type StartInstanceOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
	IfMatch        string `json:"If-Match"`
}

type StopInstanceOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
	IfMatch        string `json:"If-Match"`
}

type UpgradeInstanceRequest struct {
	ImageID       *string `json:"image_id,omitempty"`
	ImageRef      *string `json:"image_ref,omitempty"`
	TargetVersion *string `json:"target_version,omitempty"`
}

type UpgradeInstanceOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListAgentsOptions struct {
	InstanceID *string `json:"instance_id,omitempty"`
	Status     *string `json:"status,omitempty"`
	Visibility *string `json:"visibility,omitempty"`
	Search     *string `json:"search,omitempty"`
	Page       *int64  `json:"page,omitempty"`
	PageSize   *int64  `json:"page_size,omitempty"`
}

type UpdateAgentOptions struct {
	IfMatch string `json:"If-Match"`
}

type CreateAgentConversationOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListAgentConversationsOptions struct {
	Cursor *string                             `json:"cursor,omitempty"`
	Limit  *int64                              `json:"limit,omitempty"`
	State  *ListAgentConversationsOptionsState `json:"state,omitempty"`
}

type UpdateConversationOptions struct {
	IfMatch string `json:"If-Match"`
}

type DeleteConversationOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListConversationMessagesOptions struct {
	Cursor *string `json:"cursor,omitempty"`
	Limit  *int64  `json:"limit,omitempty"`
}

type CancelConversationOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ClearConversationOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type SetConversationModelOptions struct {
	IfMatch string `json:"If-Match"`
}

type CreateAgentTaskOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListAgentTasksOptions struct {
	Cursor *string                     `json:"cursor,omitempty"`
	Since  *string                     `json:"since,omitempty"`
	Limit  *int64                      `json:"limit,omitempty"`
	State  *ListAgentTasksOptionsState `json:"state,omitempty"`
}

type ListAgentTaskMessagesOptions struct {
	Cursor *string `json:"cursor,omitempty"`
	Since  *string `json:"since,omitempty"`
	Limit  *int64  `json:"limit,omitempty"`
}

type CancelAgentTaskOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ContinueAgentTaskOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type InvokeAgentOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type GetUsageSummaryOptions struct {
	Period         *GetUsageSummaryOptionsPeriod `json:"period,omitempty"`
	ExternalUserID *string                       `json:"external_user_id,omitempty"`
	Category       *string                       `json:"category,omitempty"`
}

type InvokeRuntimeMethodRequest struct {
	JSONrpc InvokeRuntimeMethodRequestJSONrpc `json:"jsonrpc"`
	ID      string                            `json:"id"`
	Method  string                            `json:"method"`
	Params  JSONValue                         `json:"params"`
}

type InvokeRuntimeMethodOptions struct {
	IdempotencyKey    string  `json:"Idempotency-Key"`
	XBeeOSOperationID *string `json:"X-BeeOS-Operation-Id,omitempty"`
}

type ListRuntimeOperationsOptions struct {
	Status *ListRuntimeOperationsOptionsStatus `json:"status,omitempty"`
	Cursor *string                             `json:"cursor,omitempty"`
	Limit  *int64                              `json:"limit,omitempty"`
	Method *string                             `json:"method,omitempty"`
}

type CancelRuntimeOperationResponse struct {
	Status      string `json:"status"`
	OperationID string `json:"operationId"`
}

type CancelRuntimeOperationOptions struct {
	IdempotencyKey    string  `json:"Idempotency-Key"`
	XBeeOSOperationID *string `json:"X-BeeOS-Operation-Id,omitempty"`
}

type CreateTerminalSessionRequest struct {
	PlatformAgentID  string  `json:"platformAgentId"`
	ConversationID   *string `json:"conversationId,omitempty"`
	ResumeTerminalID *string `json:"resumeTerminalId,omitempty"`
}

type CreateCanvasSessionRequest struct {
	PlatformAgentID string  `json:"platformAgentId"`
	ConversationID  string  `json:"conversationId"`
	CanvasID        *string `json:"canvasId,omitempty"`
}

type ExecInstanceRequest struct {
	Argv           []string `json:"argv"`
	TimeoutSeconds *int64   `json:"timeout_seconds,omitempty"`
}

type PresignFileUploadOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ConfirmFileUploadOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListFilesOptions struct {
	ContentType *string `json:"content_type,omitempty"`
	Since       *string `json:"since,omitempty"`
	Status      *string `json:"status,omitempty"`
	FileType    *string `json:"file_type,omitempty"`
	Category    *string `json:"category,omitempty"`
	Source      *string `json:"source,omitempty"`
	Q           *string `json:"q,omitempty"`
	InstanceID  *string `json:"instance_id,omitempty"`
	AgentID     *string `json:"agent_id,omitempty"`
	Sort        *string `json:"sort,omitempty"`
	SortDir     *string `json:"sort_dir,omitempty"`
	Limit       *int64  `json:"limit,omitempty"`
	Offset      *int64  `json:"offset,omitempty"`
}

type RenameFileRequest struct {
	Title string `json:"title"`
}

type DeleteFileOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListMCPServersResponse struct {
	Data  []MCPServer `json:"data"`
	Total int64       `json:"total"`
}

type GetMCPServerResponse struct {
	Data MCPServer `json:"data"`
}

type ResolveMCPServerResponse struct {
	Data MCPServerResolution `json:"data"`
}

type ListSkillsOptions struct {
	Ids      *string `json:"ids,omitempty"`
	Category *string `json:"category,omitempty"`
	Cursor   *string `json:"cursor,omitempty"`
	Q        *string `json:"q,omitempty"`
	OrderBy  *string `json:"order_by,omitempty"`
	Limit    *int64  `json:"limit,omitempty"`
	Offset   *int64  `json:"offset,omitempty"`
}

type CreateSkillRequest struct {
	Slug        string                        `json:"slug"`
	Name        string                        `json:"name"`
	Description *string                       `json:"description,omitempty"`
	Category    *string                       `json:"category,omitempty"`
	License     *string                       `json:"license,omitempty"`
	Version     string                        `json:"version"`
	Changelog   *string                       `json:"changelog,omitempty"`
	Tags        []string                      `json:"tags,omitempty"`
	Files       []CreateSkillRequestFilesItem `json:"files"`
}

type CreateSkillResponse struct {
	Data Skill `json:"data"`
}

type SearchSkillsOptions struct {
	Ids      *string `json:"ids,omitempty"`
	Category *string `json:"category,omitempty"`
	Cursor   *string `json:"cursor,omitempty"`
	Q        *string `json:"q,omitempty"`
	OrderBy  *string `json:"order_by,omitempty"`
	Limit    *int64  `json:"limit,omitempty"`
	Offset   *int64  `json:"offset,omitempty"`
}

type GetSkillResponse struct {
	Data Skill `json:"data"`
}

type GetSkillBySlugResponse struct {
	Data Skill `json:"data"`
}

type ListSkillCategoriesResponse struct {
	Data []SkillCategory `json:"data"`
}

type GetFeaturedSkillsResponse struct {
	Data  []Skill `json:"data"`
	Total int64   `json:"total"`
}

type GetFeaturedSkillsOptions struct {
	Scope      *string `json:"scope,omitempty"`
	ScopeValue *string `json:"scope_value,omitempty"`
	Limit      *int64  `json:"limit,omitempty"`
}

type ListSkillSetsResponse struct {
	Data  []skillSetListView `json:"data"`
	Total int64              `json:"total"`
}

type ListSkillSetsOptions struct {
	Category *string `json:"category,omitempty"`
	Page     *int64  `json:"page,omitempty"`
	PageSize *int64  `json:"page_size,omitempty"`
}

type CreateShareFileShareOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ResolveFileShareResponse struct {
	FileID      string                 `json:"file_id"`
	Slug        string                 `json:"slug"`
	Filename    string                 `json:"filename"`
	ContentType string                 `json:"content_type"`
	SizeBytes   int64                  `json:"size_bytes"`
	Download    FileTransferDescriptor `json:"download"`
}

type CreateShareReplyResponse struct {
	Data CreateShareReplyResponseData `json:"data"`
}

type GetShareReplyResponse struct {
	Data GetShareReplyResponseData `json:"data"`
}

type GetInstanceConnectURLOptions struct {
	Service    *string `json:"service,omitempty"`
	ClientID   *string `json:"client_id,omitempty"`
	Role       *string `json:"role,omitempty"`
	Generation *string `json:"generation,omitempty"`
}

type GetInstanceStreamURLResponse struct {
	Data JSONValue `json:"data"`
}

type GetInstanceStreamURLOptions struct {
	ViewportWidth  *int64   `json:"viewportWidth,omitempty"`
	ViewportHeight *int64   `json:"viewportHeight,omitempty"`
	Dpr            *float64 `json:"dpr,omitempty"`
}

type ResumeConversationResponse struct {
	Data ResumeConversationResponseData `json:"data"`
}

type ResumeConversationOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type CreateAutomationResponse struct {
	Success bool                `json:"success"`
	Data    ProtoAutomationRule `json:"data"`
}

type ListAutomationsResponse struct {
	Success bool                         `json:"success"`
	Data    ProtoListAutomationsResponse `json:"data"`
}

type ListAutomationsOptions struct {
	Status *string `json:"status,omitempty"`
	Cursor *string `json:"cursor,omitempty"`
	Limit  *int64  `json:"limit,omitempty"`
}

type GetAutomationResponse struct {
	Success bool      `json:"success"`
	Data    JSONValue `json:"data"`
}

type UpdateAutomationResponse struct {
	Success bool                `json:"success"`
	Data    ProtoAutomationRule `json:"data"`
}

type PauseAutomationResponse struct {
	Success bool      `json:"success"`
	Data    JSONValue `json:"data"`
}

type ResumeAutomationResponse struct {
	Success bool      `json:"success"`
	Data    JSONValue `json:"data"`
}

type CreateAutomationRunResponse struct {
	Success bool               `json:"success"`
	Data    ProtoAutomationRun `json:"data"`
}

type CreateAutomationRunOptions struct {
	IdempotencyKey string `json:"Idempotency-Key"`
}

type ListAutomationRunsResponse struct {
	Success bool                            `json:"success"`
	Data    ProtoListAutomationRunsResponse `json:"data"`
}

type ListAutomationRunsOptions struct {
	Status *string `json:"status,omitempty"`
	Cursor *string `json:"cursor,omitempty"`
	Limit  *int64  `json:"limit,omitempty"`
}

type GetAutomationRunResponse struct {
	Success bool               `json:"success"`
	Data    ProtoAutomationRun `json:"data"`
}

type CreateWebhookAutomationResponse struct {
	Success bool                `json:"success"`
	Data    ProtoAutomationRule `json:"data"`
}

type PutConnectorCredentialConnectorResponse struct {
	Data ProtoPutConnectorCredentialResponse `json:"data"`
}

type DeleteConnectorCredentialConnectorResponse struct {
	Data ProtoDeleteConnectorCredentialResponse `json:"data"`
}

type ListInstanceConnectorsConnectorResponse struct {
	Data ProtoListInstanceConnectorsResponse `json:"data"`
}

type InstallManagedConnectorConnectorResponse struct {
	Data JSONValue `json:"data"`
}

type UpdateManagedConnectorConnectorResponse struct {
	Data JSONValue `json:"data"`
}

type UninstallManagedConnectorConnectorResponse struct {
	Data ProtoUninstallManagedConnectorResponse `json:"data"`
}

type ListMcpServersConnectorResponse struct {
	Data ProtoListMcpServersResponse `json:"data"`
}

type GetMcpServerConnectorResponse struct {
	Data ProtoGetMcpServerResponse `json:"data"`
}

type ListCategoriesConnectorResponse struct {
	Data ProtoListCategoriesResponse `json:"data"`
}

type ResolvePreparationConnectorResponse struct {
	Data JSONValue `json:"data"`
}

type ResolveInstallConnectorResponse struct {
	Data ProtoResolveInstallResponse `json:"data"`
}

type TranscribeAudioRequest struct {
	File []byte `json:"file"`
}

type TranscribeAudioResponse struct {
	Success bool                        `json:"success"`
	Data    TranscribeAudioResponseData `json:"data"`
}

type GetShareCanvasResponse struct {
	Success bool         `json:"success"`
	Data    *CanvasShare `json:"data"`
}

type GetShareCanvasOptions struct {
	XBeeOSConversationID  string `json:"X-BeeOS-Conversation-ID"`
	XBeeOSPlatformAgentID string `json:"X-BeeOS-Platform-Agent-ID"`
}

type CreateShareCanvasRequest struct {
	Mode             string  `json:"mode"`
	Password         *string `json:"password,omitempty"`
	AllowInteraction *bool   `json:"allowInteraction,omitempty"`
}

type CreateShareCanvasResponse struct {
	Success bool         `json:"success"`
	Data    *CanvasShare `json:"data"`
}

type CreateShareCanvasOptions struct {
	XBeeOSConversationID  string `json:"X-BeeOS-Conversation-ID"`
	XBeeOSPlatformAgentID string `json:"X-BeeOS-Platform-Agent-ID"`
}

type DeleteShareCanvasOptions struct {
	XBeeOSConversationID  string `json:"X-BeeOS-Conversation-ID"`
	XBeeOSPlatformAgentID string `json:"X-BeeOS-Platform-Agent-ID"`
}

type ListCanvasSnapshotsResponse struct {
	Success bool             `json:"success"`
	Data    []CanvasSnapshot `json:"data"`
}

type ListCanvasSnapshotsOptions struct {
	XBeeOSConversationID  string `json:"X-BeeOS-Conversation-ID"`
	XBeeOSPlatformAgentID string `json:"X-BeeOS-Platform-Agent-ID"`
}

type RestoreCanvasSnapshotResponse struct {
	Success bool                              `json:"success"`
	Data    RestoreCanvasSnapshotResponseData `json:"data"`
}

type RestoreCanvasSnapshotOptions struct {
	XBeeOSConversationID  string `json:"X-BeeOS-Conversation-ID"`
	XBeeOSPlatformAgentID string `json:"X-BeeOS-Platform-Agent-ID"`
}

type GetCanvasSessionResponse struct {
	Success bool                          `json:"success"`
	Data    *GetCanvasSessionResponseData `json:"data"`
}

type GetCanvasSessionOptions struct {
	XBeeOSConversationID  string `json:"X-BeeOS-Conversation-ID"`
	XBeeOSPlatformAgentID string `json:"X-BeeOS-Platform-Agent-ID"`
}

type GetAgentBindDetailsResponse struct {
	Success bool                 `json:"success"`
	Data    agentBindDetailsWire `json:"data"`
}

type ConfirmAgentBindRequest struct {
	Name          *string `json:"name,omitempty"`
	ModelPrimary  *string `json:"modelPrimary,omitempty"`
	ModelPrimary2 *string `json:"model_primary,omitempty"`
}

type ConfirmAgentBindResponse struct {
	Success bool          `json:"success"`
	Data    agentBindWire `json:"data"`
}

type CreatePortalBindRequest struct {
	Name *string `json:"name,omitempty"`
}

type CreatePortalBindResponse struct {
	Success bool           `json:"success"`
	Data    portalBindWire `json:"data"`
}

type GetPortalBindResponse struct {
	Success bool           `json:"success"`
	Data    portalBindWire `json:"data"`
}

type RevokePortalBindResponse struct {
	Success bool           `json:"success"`
	Data    portalBindWire `json:"data"`
}

type ResolvePortalBindRequest struct {
	Decision   ResolvePortalBindRequestDecision `json:"decision"`
	InstanceID *string                          `json:"instance_id,omitempty"`
}

type ResolvePortalBindResponse struct {
	Success bool           `json:"success"`
	Data    portalBindWire `json:"data"`
}

type InvokeA2ARequest struct {
	JSONrpc InvokeA2ARequestJSONrpc `json:"jsonrpc"`
	ID      *string                 `json:"id,omitempty"`
	Method  string                  `json:"method"`
	Params  *JSONValue              `json:"params,omitempty"`
}

type ListA2ATasksResponse struct {
	Tasks      []a2aTaskView `json:"tasks"`
	Total      int64         `json:"total"`
	NextCursor string        `json:"next_cursor"`
	HasMore    bool          `json:"has_more"`
}

type ListA2ATasksOptions struct {
	Direction *string `json:"direction,omitempty"`
	AgentID   *string `json:"agent_id,omitempty"`
	Cursor    *string `json:"cursor,omitempty"`
	Limit     *int64  `json:"limit,omitempty"`
}

type GetA2ATaskOptions struct {
	HistoryLength *int64 `json:"history_length,omitempty"`
}

type ListHarnessesResponse struct {
	Harnesses []UHPHarness `json:"harnesses"`
}

type CreateResponseOptions struct {
	IdempotencyKey *string `json:"Idempotency-Key,omitempty"`
	UHPVersion     *string `json:"UHP-Version,omitempty"`
}

type DeleteResponseResponse struct {
	ID      *string `json:"id,omitempty"`
	Deleted *bool   `json:"deleted,omitempty"`
}

type GetResponseInputItemsResponse struct {
	Object *GetResponseInputItemsResponseObject `json:"object,omitempty"`
	Data   []map[string]JSONValue               `json:"data,omitempty"`
}

type GetResponseEventsOptions struct {
	LastEventID *string `json:"Last-Event-ID,omitempty"`
	UHPVersion  *string `json:"UHP-Version,omitempty"`
}

type ClientSessionInputClientType string

const (
	ClientSessionInputClientTypeWeb    ClientSessionInputClientType = "web"
	ClientSessionInputClientTypeNative ClientSessionInputClientType = "native"
)

type ClientSessionInputDeviceAttestation struct {
	Jkt string `json:"jkt"`
}

type BindingClientType string

const (
	BindingClientTypeWeb    BindingClientType = "web"
	BindingClientTypeNative BindingClientType = "native"
)

type ClientSessionResponseClientAPIURL string

const (
	ClientSessionResponseClientAPIURLHttpsClientApiCloudBeeosAiV1 ClientSessionResponseClientAPIURL = "https://client-api.cloud.beeos.ai/v1"
)

type DeletionAcceptedStatus string

const (
	DeletionAcceptedStatusPending    DeletionAcceptedStatus = "pending"
	DeletionAcceptedStatusProcessing DeletionAcceptedStatus = "processing"
	DeletionAcceptedStatusFailed     DeletionAcceptedStatus = "failed"
	DeletionAcceptedStatusCompleted  DeletionAcceptedStatus = "completed"
)

type AgentPatchVisibility string

const (
	AgentPatchVisibilityPrivate     AgentPatchVisibility = "private"
	AgentPatchVisibilityUnlisted    AgentPatchVisibility = "unlisted"
	AgentPatchVisibilityOrg         AgentPatchVisibility = "org"
	AgentPatchVisibilityPublic      AgentPatchVisibility = "public"
	AgentPatchVisibilityMarketplace AgentPatchVisibility = "marketplace"
)

type ConversationState string

const (
	ConversationStateOpen   ConversationState = "open"
	ConversationStateClosed ConversationState = "closed"
)

type MessageRealtimePublishStatus string

const (
	MessageRealtimePublishStatusPublished      MessageRealtimePublishStatus = "published"
	MessageRealtimePublishStatusUnconfirmed    MessageRealtimePublishStatus = "unconfirmed"
	MessageRealtimePublishStatusNotRepublished MessageRealtimePublishStatus = "not_republished"
)

type UHPDiscoveryObject string

const (
	UHPDiscoveryObjectUhpDiscovery UHPDiscoveryObject = "uhp.discovery"
)

type UHPDiscoveryProtocol string

const (
	UHPDiscoveryProtocolUhp UHPDiscoveryProtocol = "uhp"
)

type UHPDiscoveryConformanceClass string

const (
	UHPDiscoveryConformanceClassCore     UHPDiscoveryConformanceClass = "core"
	UHPDiscoveryConformanceClassExtended UHPDiscoveryConformanceClass = "extended"
	UHPDiscoveryConformanceClassFull     UHPDiscoveryConformanceClass = "full"
)

type UHPDiscoveryImplementation struct {
	Name                 *string              `json:"name,omitempty"`
	Version              *string              `json:"version,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPDiscoveryImplementation) MarshalJSON() ([]byte, error) {
	type plain UHPDiscoveryImplementation
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPDiscoveryImplementation) UnmarshalJSON(data []byte) error {
	type plain UHPDiscoveryImplementation
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "version")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPDiscoveryImplementation(decoded)
	return nil
}

type UHPHarnessObject string

const (
	UHPHarnessObjectHarness UHPHarnessObject = "harness"
)

type UHPMcpServerTransport string

const (
	UHPMcpServerTransportHttp UHPMcpServerTransport = "http"
	UHPMcpServerTransportSse  UHPMcpServerTransport = "sse"
)

type UHPPluginMcpServerTransport string

const (
	UHPPluginMcpServerTransportHttp  UHPPluginMcpServerTransport = "http"
	UHPPluginMcpServerTransportSse   UHPPluginMcpServerTransport = "sse"
	UHPPluginMcpServerTransportStdio UHPPluginMcpServerTransport = "stdio"
)

type UHPPluginManifestAuthor struct {
	Name                 *string              `json:"name,omitempty"`
	Email                *string              `json:"email,omitempty"`
	URL                  *string              `json:"url,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPPluginManifestAuthor) MarshalJSON() ([]byte, error) {
	type plain UHPPluginManifestAuthor
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPPluginManifestAuthor) UnmarshalJSON(data []byte) error {
	type plain UHPPluginManifestAuthor
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "name")
	delete(fields, "email")
	delete(fields, "url")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPPluginManifestAuthor(decoded)
	return nil
}

type UHPModelCatalogBackendsValue struct {
	Default string     `json:"default"`
	Models  []UHPModel `json:"models"`
}

// UHPCreateResponseRequestInput represents the documented alternatives. Set one variant when encoding.
type UHPCreateResponseRequestInput struct {
	Variant1 *string
	Variant2 *[]map[string]JSONValue
}

func (v UHPCreateResponseRequestInput) MarshalJSON() ([]byte, error) {
	if v.Variant1 != nil {
		return json.Marshal(v.Variant1)
	}
	if v.Variant2 != nil {
		return json.Marshal(v.Variant2)
	}
	return nil, fmt.Errorf("UHPCreateResponseRequestInput: no variant set")
}

func (v *UHPCreateResponseRequestInput) UnmarshalJSON(data []byte) error {
	{
		var decoded string
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant1 = &decoded
			return nil
		}
	}
	{
		var decoded []map[string]JSONValue
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant2 = &decoded
			return nil
		}
	}
	return fmt.Errorf("UHPCreateResponseRequestInput: response matches no documented variant")
}

type UHPCreateResponseRequestMetadata struct {
	HarnessID            *string              `json:"harness_id,omitempty"`
	Environment          *string              `json:"environment,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPCreateResponseRequestMetadata) MarshalJSON() ([]byte, error) {
	type plain UHPCreateResponseRequestMetadata
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPCreateResponseRequestMetadata) UnmarshalJSON(data []byte) error {
	type plain UHPCreateResponseRequestMetadata
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "harness_id")
	delete(fields, "environment")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPCreateResponseRequestMetadata(decoded)
	return nil
}

type UHPResponseObject string

const (
	UHPResponseObjectResponse UHPResponseObject = "response"
)

type UHPResponseMetadata struct {
	SessionID            *string              `json:"session_id,omitempty"`
	Environment          *string              `json:"environment,omitempty"`
	RequestedModel       *string              `json:"requested_model,omitempty"`
	ModelFallback        *bool                `json:"model_fallback,omitempty"`
	ModelFallbackReason  *string              `json:"model_fallback_reason,omitempty"`
	IgnoredFields        []string             `json:"ignored_fields,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPResponseMetadata) MarshalJSON() ([]byte, error) {
	type plain UHPResponseMetadata
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPResponseMetadata) UnmarshalJSON(data []byte) error {
	type plain UHPResponseMetadata
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "session_id")
	delete(fields, "environment")
	delete(fields, "requested_model")
	delete(fields, "model_fallback")
	delete(fields, "model_fallback_reason")
	delete(fields, "ignored_fields")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPResponseMetadata(decoded)
	return nil
}

type UHPAnnotationType string

const (
	UHPAnnotationTypeContainerFileCitation UHPAnnotationType = "container_file_citation"
)

type UHPErrorType string

const (
	UHPErrorTypeInvalidRequestError UHPErrorType = "invalid_request_error"
	UHPErrorTypeAuthenticationError UHPErrorType = "authentication_error"
	UHPErrorTypePermissionError     UHPErrorType = "permission_error"
	UHPErrorTypeRateLimitError      UHPErrorType = "rate_limit_error"
	UHPErrorTypeHarnessError        UHPErrorType = "harness_error"
	UHPErrorTypeServerError         UHPErrorType = "server_error"
)

type RuntimeInstanceSummaryCapabilities struct {
	Computer *bool `json:"computer,omitempty"`
	Mobile   *bool `json:"mobile,omitempty"`
	Device   *bool `json:"device,omitempty"`
	Terminal *bool `json:"terminal,omitempty"`
}

type RuntimeLLMProviderProtocol string

const (
	RuntimeLLMProviderProtocolOpenai    RuntimeLLMProviderProtocol = "openai"
	RuntimeLLMProviderProtocolAnthropic RuntimeLLMProviderProtocol = "anthropic"
)

type FileSummaryInstancesItem struct {
	Source         string  `json:"source"`
	InstanceID     *string `json:"instance_id,omitempty"`
	AgentID        *string `json:"agent_id,omitempty"`
	OperationID    *string `json:"operation_id,omitempty"`
	InstanceName   *string `json:"instance_name,omitempty"`
	AgentName      *string `json:"agent_name,omitempty"`
	AvatarURL      *string `json:"avatar_url,omitempty"`
	AgentFramework *string `json:"agent_framework,omitempty"`
	Destroyed      *bool   `json:"destroyed,omitempty"`
	Count          int64   `json:"count"`
}

type CreateServerInstanceInputAgentFramework string

const (
	CreateServerInstanceInputAgentFrameworkOpenclaw CreateServerInstanceInputAgentFramework = "openclaw"
)

type RuntimeInstanceStatusResultData struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Status        string `json:"status"`
	DesiredStatus string `json:"desired_status"`
	Connectivity  string `json:"connectivity"`
}

type ReplyShareResponseData struct {
	Slug      string                              `json:"slug"`
	CreatedAt string                              `json:"created_at"`
	Agent     ReplyShareResponseDataAgent         `json:"agent"`
	Reply     ReplyShareResponseDataReply         `json:"reply"`
	Sources   []ReplyShareResponseDataSourcesItem `json:"sources"`
	Files     []ReplyShareResponseDataFilesItem   `json:"files"`
}

type ConnectURLResponseData struct {
	URL             string                         `json:"url"`
	Mode            string                         `json:"mode"`
	Token           string                         `json:"token"`
	Service         string                         `json:"service"`
	Connectivity    string                         `json:"connectivity"`
	StreamSessionID string                         `json:"stream_session_id"`
	Browser         *ConnectURLResponseDataBrowser `json:"browser,omitempty"`
}

type RuntimeMethodResponseJSONrpc string

const (
	RuntimeMethodResponseJSONrpc20 RuntimeMethodResponseJSONrpc = "2.0"
)

// RuntimeMethodResponseID represents the documented alternatives. Set one variant when encoding.
type RuntimeMethodResponseID struct {
	Variant1 *string
	Variant2 *int64
	Variant3 **struct{}
}

func (v RuntimeMethodResponseID) MarshalJSON() ([]byte, error) {
	if v.Variant1 != nil {
		return json.Marshal(v.Variant1)
	}
	if v.Variant2 != nil {
		return json.Marshal(v.Variant2)
	}
	if v.Variant3 != nil {
		return json.Marshal(v.Variant3)
	}
	return nil, fmt.Errorf("RuntimeMethodResponseID: no variant set")
}

func (v *RuntimeMethodResponseID) UnmarshalJSON(data []byte) error {
	{
		var decoded string
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant1 = &decoded
			return nil
		}
	}
	{
		var decoded int64
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant2 = &decoded
			return nil
		}
	}
	{
		var decoded *struct{}
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant3 = &decoded
			return nil
		}
	}
	return fmt.Errorf("RuntimeMethodResponseID: response matches no documented variant")
}

type RuntimeMethodResponseError struct {
	Code    int64      `json:"code"`
	Message string     `json:"message"`
	Data    *JSONValue `json:"data,omitempty"`
}

type A2AAgentCardSupportedInterfacesItem struct {
	URL             string `json:"url"`
	ProtocolBinding string `json:"protocolBinding"`
	ProtocolVersion string `json:"protocolVersion"`
}

// UHPCreateResponseJSONRequestInput represents the documented alternatives. Set one variant when encoding.
type UHPCreateResponseJSONRequestInput struct {
	Variant1 *string
	Variant2 *[]map[string]JSONValue
}

func (v UHPCreateResponseJSONRequestInput) MarshalJSON() ([]byte, error) {
	if v.Variant1 != nil {
		return json.Marshal(v.Variant1)
	}
	if v.Variant2 != nil {
		return json.Marshal(v.Variant2)
	}
	return nil, fmt.Errorf("UHPCreateResponseJSONRequestInput: no variant set")
}

func (v *UHPCreateResponseJSONRequestInput) UnmarshalJSON(data []byte) error {
	{
		var decoded string
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant1 = &decoded
			return nil
		}
	}
	{
		var decoded []map[string]JSONValue
		if err := json.Unmarshal(data, &decoded); err == nil {
			v.Variant2 = &decoded
			return nil
		}
	}
	return fmt.Errorf("UHPCreateResponseJSONRequestInput: response matches no documented variant")
}

type UHPCreateResponseJSONRequestMetadata struct {
	HarnessID            *string              `json:"harness_id,omitempty"`
	Environment          *string              `json:"environment,omitempty"`
	AdditionalProperties map[string]JSONValue `json:"-"`
}

func (v UHPCreateResponseJSONRequestMetadata) MarshalJSON() ([]byte, error) {
	type plain UHPCreateResponseJSONRequestMetadata
	encoded, err := json.Marshal(plain(v))
	if err != nil {
		return nil, err
	}
	values := map[string]json.RawMessage{}
	for key, value := range v.AdditionalProperties {
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		values[key] = raw
	}
	var known map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &known); err != nil {
		return nil, err
	}
	for key, value := range known {
		values[key] = value
	}
	return json.Marshal(values)
}
func (v *UHPCreateResponseJSONRequestMetadata) UnmarshalJSON(data []byte) error {
	type plain UHPCreateResponseJSONRequestMetadata
	var decoded plain
	if err := json.Unmarshal(data, &decoded); err != nil {
		return err
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	delete(fields, "harness_id")
	delete(fields, "environment")
	decoded.AdditionalProperties = map[string]JSONValue{}
	for key, raw := range fields {
		var value JSONValue
		if err := json.Unmarshal(raw, &value); err != nil {
			return err
		}
		decoded.AdditionalProperties[key] = value
	}
	*v = UHPCreateResponseJSONRequestMetadata(decoded)
	return nil
}

type ListAgentConversationsOptionsState string

const (
	ListAgentConversationsOptionsStateOpen   ListAgentConversationsOptionsState = "open"
	ListAgentConversationsOptionsStateClosed ListAgentConversationsOptionsState = "closed"
	ListAgentConversationsOptionsStateAll    ListAgentConversationsOptionsState = "all"
)

type ListAgentTasksOptionsState string

const (
	ListAgentTasksOptionsStateAll           ListAgentTasksOptionsState = "all"
	ListAgentTasksOptionsStateQueued        ListAgentTasksOptionsState = "queued"
	ListAgentTasksOptionsStateRunning       ListAgentTasksOptionsState = "running"
	ListAgentTasksOptionsStateInputRequired ListAgentTasksOptionsState = "input_required"
	ListAgentTasksOptionsStateAuthRequired  ListAgentTasksOptionsState = "auth_required"
	ListAgentTasksOptionsStateCompleted     ListAgentTasksOptionsState = "completed"
	ListAgentTasksOptionsStateFailed        ListAgentTasksOptionsState = "failed"
	ListAgentTasksOptionsStateCanceled      ListAgentTasksOptionsState = "canceled"
	ListAgentTasksOptionsStateTimeout       ListAgentTasksOptionsState = "timeout"
	ListAgentTasksOptionsStateRejected      ListAgentTasksOptionsState = "rejected"
)

type GetUsageSummaryOptionsPeriod string

const (
	GetUsageSummaryOptionsPeriodDay   GetUsageSummaryOptionsPeriod = "day"
	GetUsageSummaryOptionsPeriodWeek  GetUsageSummaryOptionsPeriod = "week"
	GetUsageSummaryOptionsPeriodMonth GetUsageSummaryOptionsPeriod = "month"
)

type InvokeRuntimeMethodRequestJSONrpc string

const (
	InvokeRuntimeMethodRequestJSONrpc20 InvokeRuntimeMethodRequestJSONrpc = "2.0"
)

type ListRuntimeOperationsOptionsStatus string

const (
	ListRuntimeOperationsOptionsStatusActive ListRuntimeOperationsOptionsStatus = "active"
)

type CreateSkillRequestFilesItem struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

type CreateShareReplyResponseData struct {
	Slug      string `json:"slug"`
	CreatedAt string `json:"created_at"`
}

type GetShareReplyResponseData struct {
	Slug      string `json:"slug"`
	CreatedAt string `json:"created_at"`
}

type ResumeConversationResponseData struct {
	RequestID string `json:"request_id"`
	Status    string `json:"status"`
}

type TranscribeAudioResponseData struct {
	Text            string  `json:"text"`
	DurationSeconds float64 `json:"duration_seconds"`
}

type RestoreCanvasSnapshotResponseData struct {
	SnapshotID string `json:"snapshotId"`
	CanvasID   string `json:"canvasId"`
	Restored   bool   `json:"restored"`
	Version    int64  `json:"version"`
}

type GetCanvasSessionResponseData struct {
	CanvasID   string `json:"canvasId"`
	SessionID  string `json:"sessionId"`
	InstanceID string `json:"instanceId"`
	LinkedAt   string `json:"linkedAt"`
	Role       string `json:"role"`
}

type ResolvePortalBindRequestDecision string

const (
	ResolvePortalBindRequestDecisionRecover ResolvePortalBindRequestDecision = "recover"
	ResolvePortalBindRequestDecisionCreate  ResolvePortalBindRequestDecision = "create"
)

type InvokeA2ARequestJSONrpc string

const (
	InvokeA2ARequestJSONrpc20 InvokeA2ARequestJSONrpc = "2.0"
)

type GetResponseInputItemsResponseObject string

const (
	GetResponseInputItemsResponseObjectList GetResponseInputItemsResponseObject = "list"
)

type ReplyShareResponseDataAgent struct {
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url"`
	Framework string `json:"framework"`
}

type ReplyShareResponseDataReply struct {
	Parts     []ReplyShareResponseDataReplyPartsItem `json:"parts"`
	CreatedAt string                                 `json:"created_at"`
}

type ReplyShareResponseDataSourcesItem struct {
	URL   *string `json:"url,omitempty"`
	Title *string `json:"title,omitempty"`
}

type ReplyShareResponseDataFilesItem struct {
	FileID      *string `json:"file_id,omitempty"`
	Filename    *string `json:"filename,omitempty"`
	ContentType *string `json:"content_type,omitempty"`
	SizeBytes   *int64  `json:"size_bytes,omitempty"`
}

type ConnectURLResponseDataBrowser struct {
	GrantID    string `json:"grant_id"`
	Generation string `json:"generation"`
	ExpiresAt  string `json:"expires_at"`
	Role       string `json:"role"`
}

type ReplyShareResponseDataReplyPartsItem struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type APIErrorBody interface{ isAPIErrorBody() }
type InvalidResponseBody struct {
	Code        string
	ContentType string
	Body        string
	RawBody     []byte
	Reason      string
}

func (InvalidResponseBody) isAPIErrorBody()        {}
func (ErrorResponse) isAPIErrorBody()              {}
func (DeviceBindingErrorResponse) isAPIErrorBody() {}
func (UHPErrorEnvelope) isAPIErrorBody()           {}
func jsonString(value json.RawMessage) bool {
	value = bytes.TrimSpace(value)
	return len(value) > 0 && value[0] == '"'
}
func nonemptyJSONString(value json.RawMessage) bool {
	var decoded string
	return json.Unmarshal(value, &decoded) == nil && decoded != ""
}
func matchesErrorBody(schema string, payload []byte) bool {
	var fields map[string]json.RawMessage
	if json.Unmarshal(payload, &fields) != nil {
		return false
	}
	switch schema {
	case "UHPErrorEnvelope":
		var nested map[string]json.RawMessage
		if json.Unmarshal(fields["error"], &nested) != nil {
			return false
		}
		return nonemptyJSONString(nested["code"]) && jsonString(nested["message"])
	case "DeviceBindingErrorResponse":
		return nonemptyJSONString(fields["error"]) && jsonString(fields["message"])
	default:
		return nonemptyJSONString(fields["code"]) && jsonString(fields["message"])
	}
}
func decodeErrorBody[T APIErrorBody](schema string, payload []byte) (APIErrorBody, error) {
	if !matchesErrorBody(schema, payload) {
		return nil, fmt.Errorf("invalid error envelope")
	}
	var body T
	err := json.Unmarshal(payload, &body)
	return body, err
}
func decodeAPIError(operation string, status int, payload []byte) (APIErrorBody, error) {
	switch operation {
	case "createClientSession", "refreshClientSession", "revokeClientSession", "deleteExternalUser", "getExternalUserDeletion", "listProviders", "listDeployRegions", "listDeployModels", "listInstanceTemplates", "getInstanceTemplate", "listAgentTemplates", "listInstances", "instanceCreate", "getInstance", "updateInstanceMetadata", "deleteInstance", "getInstanceStatus", "startInstance", "stopInstance", "upgradeInstance", "getInstanceUpgrade", "listAgents", "getAgent", "updateAgent", "createAgentConversation", "listAgentConversations", "getConversation", "updateConversation", "deleteConversation", "listConversationMessages", "getConversationMessage", "cancelConversation", "clearConversation", "setConversationModel", "createAgentTask", "listAgentTasks", "getAgentTask", "listAgentTaskMessages", "cancelAgentTask", "continueAgentTask", "invokeAgent", "getUsageSummary", "invokeRuntimeMethod", "cancelRuntimeOperation", "execInstance", "presignFileUpload", "confirmFileUpload", "listFiles", "getFile", "renameFile", "deleteFile", "listMCPServers", "getMCPServer", "resolveMCPServer", "listSkills", "createSkill", "searchSkills", "getSkill", "getSkillBySlug", "listSkillCategories", "getFeaturedSkills", "getAgentTemplate", "listSkillSets", "getSkillSet", "createShareFileShare", "getShareFileShare", "revokeShareFileShare", "resolveFileShare", "getFilesSummary", "createShareReply", "getShareReply", "revokeShareReply", "resolveReplyShare", "getInstanceConnectURL", "getInstanceStreamURL", "resumeConversation", "createAutomation", "listAutomations", "getAutomation", "updateAutomation", "deleteAutomation", "pauseAutomation", "resumeAutomation", "createAutomationRun", "listAutomationRuns", "getAutomationRun", "createWebhookAutomation", "PutConnectorCredentialConnector", "DeleteConnectorCredentialConnector", "ListInstanceConnectorsConnector", "InstallManagedConnectorConnector", "UpdateManagedConnectorConnector", "UninstallManagedConnectorConnector", "ListMcpServersConnector", "GetMcpServerConnector", "ListCategoriesConnector", "ResolvePreparationConnector", "ResolveInstallConnector", "transcribeAudio", "getShareCanvas", "createShareCanvas", "deleteShareCanvas", "listCanvasSnapshots", "restoreCanvasSnapshot", "getCanvasSession", "invokeA2A", "getA2AAgentCard", "getA2AAgentCardLegacy", "listA2ATasks", "getA2ATask", "cancelA2ATask":

		return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
	case "getRuntimeCapabilities":
		if status == 401 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		if status == 404 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
	case "listRuntimeOperations":
		if status == 400 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		if status == 401 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		if status == 404 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
	case "getRuntimeOperation":
		if status == 404 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
	case "createTerminalSession", "createCanvasSession":
		if status == 400 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		if status == 401 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		if status == 404 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		if status == 429 {
			return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
		}
		return decodeErrorBody[ErrorResponse]("ErrorResponse", payload)
	case "getAgentBindDetails", "confirmAgentBind", "createPortalBind", "getPortalBind", "revokePortalBind", "resolvePortalBind":

		return decodeErrorBody[DeviceBindingErrorResponse]("DeviceBindingErrorResponse", payload)
	case "getDiscovery", "getResponseEvents":

		return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
	case "listHarnesses", "listModels":
		if status == 401 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
	case "getHarness", "listHarnessModels", "getResponse", "deleteResponse", "getResponseInputItems", "cancelResponse":
		if status == 404 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
	case "createResponse":
		if status == 400 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		if status == 401 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		if status == 404 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		if status == 409 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		if status == 422 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		if status == 429 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		if status == 503 {
			return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
		}
		return decodeErrorBody[UHPErrorEnvelope]("UHPErrorEnvelope", payload)
	}
	return nil, fmt.Errorf("BeeOS API %s HTTP %d: undocumented error response", operation, status)
}

type APIError struct {
	Status int
	Body   APIErrorBody
}

func (e *APIError) Error() string { return fmt.Sprintf("BeeOS API returned HTTP %d", e.Status) }

type BeeOSClient struct {
	baseURL        string
	apiKey         func() string
	transport      *http.Client
	externalUserID string
	Identity       *IdentityResource
	Catalog        *CatalogResource
	Instances      *InstancesResource
	Agents         *AgentsResource
	Conversations  *ConversationsResource
	Messages       *MessagesResource
	Tasks          *TasksResource
	Usage          *UsageResource
	Methods        *MethodsResource
	Operations     *OperationsResource
	Files          *FilesResource
	Mcp            *McpResource
	Skills         *SkillsResource
	SkillSets      *SkillSetsResource
	Automations    *AutomationsResource
	Connectors     *ConnectorsResource
	Audio          *AudioResource
	Canvases       *CanvasesResource
	DeviceBindings *DeviceBindingsResource
	A2a            *A2aResource
	Harnesses      *HarnessesResource
	Responses      *ResponsesResource
}

func NewBeeOSClient(baseURL string, keyProvider func() string, transport *http.Client) (*BeeOSClient, error) {
	if transport == nil {
		transport = http.DefaultClient
	}
	c := &BeeOSClient{baseURL: strings.TrimRight(baseURL, "/"), apiKey: keyProvider, transport: transport}
	c.initResources()
	return c, nil
}
func (c *BeeOSClient) initResources() {
	c.Identity = &IdentityResource{client: c}
	c.Catalog = &CatalogResource{client: c}
	c.Instances = &InstancesResource{client: c}
	c.Agents = &AgentsResource{client: c}
	c.Conversations = &ConversationsResource{client: c}
	c.Messages = &MessagesResource{client: c}
	c.Tasks = &TasksResource{client: c}
	c.Usage = &UsageResource{client: c}
	c.Methods = &MethodsResource{client: c}
	c.Operations = &OperationsResource{client: c}
	c.Files = &FilesResource{client: c}
	c.Mcp = &McpResource{client: c}
	c.Skills = &SkillsResource{client: c}
	c.SkillSets = &SkillSetsResource{client: c}
	c.Automations = &AutomationsResource{client: c}
	c.Connectors = &ConnectorsResource{client: c}
	c.Audio = &AudioResource{client: c}
	c.Canvases = &CanvasesResource{client: c}
	c.DeviceBindings = &DeviceBindingsResource{client: c}
	c.A2a = &A2aResource{client: c}
	c.Harnesses = &HarnessesResource{client: c}
	c.Responses = &ResponsesResource{client: c}
}
func (c *BeeOSClient) WithExternalUser(externalUserID string) *BeeOSClient {
	copy := *c
	copy.externalUserID = externalUserID
	copy.initResources()
	return &copy
}

func (c *BeeOSClient) send(ctx context.Context, operation, method, path, basePath string, query url.Values, headers http.Header, body []byte, contentType string) (*http.Response, error) {
	base := c.baseURL
	if basePath != "" {
		parsed, err := url.Parse(base)
		if err != nil {
			return nil, err
		}
		parsed.Path, parsed.RawPath, parsed.RawQuery, parsed.Fragment = basePath, "", "", ""
		base = parsed.String()
	}
	target := base + path
	if len(query) > 0 {
		target += "?" + query.Encode()
	}
	request, err := http.NewRequestWithContext(ctx, method, target, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	request.Header = headers
	request.Header.Set("Authorization", "Bearer "+c.apiKey())
	if c.externalUserID != "" {
		request.Header.Set("X-BeeOS-External-User-ID", c.externalUserID)
	}
	if contentType != "" {
		request.Header.Set("Content-Type", contentType)
	}
	response, err := c.transport.Do(request)
	if err != nil {
		return nil, err
	}
	if response.StatusCode >= 400 {
		defer response.Body.Close()
		payload, err := io.ReadAll(response.Body)
		if err != nil {
			return nil, err
		}
		contentType := response.Header.Get("Content-Type")
		mediaType := strings.ToLower(strings.TrimSpace(strings.Split(contentType, ";")[0]))
		invalid := InvalidResponseBody{Code: "invalid_response", ContentType: contentType, Body: string(payload), RawBody: payload, Reason: "non_json_error"}
		if mediaType != "application/json" && !strings.HasSuffix(mediaType, "+json") {
			return nil, &APIError{Status: response.StatusCode, Body: invalid}
		}
		body, err := decodeAPIError(operation, response.StatusCode, payload)
		if err != nil {
			invalid.Reason = "invalid_error_shape"
			if !json.Valid(payload) {
				invalid.Reason = "invalid_json_error"
			}
			return nil, &APIError{Status: response.StatusCode, Body: invalid}
		}
		return nil, &APIError{Status: response.StatusCode, Body: body}
	}
	return response, nil
}

func (c *BeeOSClient) request(ctx context.Context, operation, method, path, basePath string, query url.Values, headers http.Header, body []byte, contentType string) ([]byte, error) {
	response, err := c.send(ctx, operation, method, path, basePath, query, headers, body, contentType)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	return io.ReadAll(response.Body)
}

func encodeFileMultipart(file []byte) ([]byte, string, error) {
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	part, err := writer.CreateFormFile("file", "audio")
	if err != nil {
		return nil, "", err
	}
	if _, err := part.Write(file); err != nil {
		return nil, "", err
	}
	if err := writer.Close(); err != nil {
		return nil, "", err
	}
	return body.Bytes(), writer.FormDataContentType(), nil
}

type StreamEvent interface{ UHPEvent }
type EventStream[T StreamEvent] struct {
	body   io.ReadCloser
	reader *bufio.Reader
}
type UHPEventStream = EventStream[UHPEvent]

func (s *EventStream[T]) Close() error { return s.body.Close() }
func (s *EventStream[T]) Next() (*T, error) {
	var data []string
	for {
		line, err := s.reader.ReadString('\n')
		line = strings.TrimRight(line, "\r\n")
		if strings.HasPrefix(line, "data:") {
			data = append(data, strings.TrimPrefix(strings.TrimPrefix(line, "data:"), " "))
		}
		if (line == "" || err == io.EOF) && len(data) > 0 {
			var event T
			if decodeErr := json.Unmarshal([]byte(strings.Join(data, "\n")), &event); decodeErr != nil {
				return nil, decodeErr
			}
			return &event, nil
		}
		if err != nil {
			return nil, err
		}
	}
}

type IdentityResource struct{ client *BeeOSClient }

func (r *IdentityResource) CreateClientSession(ctx context.Context, input ClientSessionInput, options CreateClientSessionOptions) (ClientSessionResponse, error) {
	path := "/client-sessions"
	query := url.Values{}
	headers := http.Header{}
	var output ClientSessionResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createClientSession", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *IdentityResource) RefreshClientSession(ctx context.Context, sessionId string, input *RefreshClientSessionRequest, options RefreshClientSessionOptions) (ClientSessionResponse, error) {
	path := "/client-sessions/" + url.PathEscape(fmt.Sprint(sessionId)) + "/refresh"
	query := url.Values{}
	headers := http.Header{}
	var output ClientSessionResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	if input != nil {
		encoded, err := json.Marshal(input)
		if err != nil {
			return output, err
		}
		body = encoded
	}
	payload, err := r.client.request(ctx, "refreshClientSession", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *IdentityResource) RevokeClientSession(ctx context.Context, sessionId string, options RevokeClientSessionOptions) error {
	path := "/client-sessions/" + url.PathEscape(fmt.Sprint(sessionId)) + ""
	query := url.Values{}
	headers := http.Header{}
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	_, err := r.client.request(ctx, "revokeClientSession", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *IdentityResource) DeleteExternalUser(ctx context.Context, externalUserId ExternalUserID, options DeleteExternalUserOptions) (DeletionAccepted, error) {
	path := "/external-users/" + url.PathEscape(fmt.Sprint(externalUserId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output DeletionAccepted
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	payload, err := r.client.request(ctx, "deleteExternalUser", "DELETE", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *IdentityResource) GetExternalUserDeletion(ctx context.Context, externalUserId ExternalUserID, deletionId string) (Deletion, error) {
	path := "/external-users/" + url.PathEscape(fmt.Sprint(externalUserId)) + "/deletions/" + url.PathEscape(fmt.Sprint(deletionId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output Deletion
	var body []byte
	payload, err := r.client.request(ctx, "getExternalUserDeletion", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type CatalogResource struct{ client *BeeOSClient }

func (r *CatalogResource) ListProviders(ctx context.Context, options ListProvidersOptions) (ProviderPage, error) {
	path := "/providers"
	query := url.Values{}
	headers := http.Header{}
	var output ProviderPage
	if options.Capability != nil {
		query.Set("capability", fmt.Sprint(*options.Capability))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listProviders", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) ListRegions(ctx context.Context, options ListDeployRegionsOptions) (RegionPage, error) {
	path := "/deploy/regions"
	query := url.Values{}
	headers := http.Header{}
	var output RegionPage
	if options.ProviderID != nil {
		query.Set("provider_id", fmt.Sprint(*options.ProviderID))
	}
	if options.Available != nil {
		query.Set("available", fmt.Sprint(*options.Available))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listDeployRegions", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) ListModels(ctx context.Context, options ListDeployModelsOptions) (ModelPage, error) {
	path := "/deploy/models"
	query := url.Values{}
	headers := http.Header{}
	var output ModelPage
	if options.AgentFramework != nil {
		query.Set("agent_framework", fmt.Sprint(*options.AgentFramework))
	}
	if options.Search != nil {
		query.Set("search", fmt.Sprint(*options.Search))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listDeployModels", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) ListInstanceTemplates(ctx context.Context, options ListInstanceTemplatesOptions) (InstanceTemplatePage, error) {
	path := "/instance-templates"
	query := url.Values{}
	headers := http.Header{}
	var output InstanceTemplatePage
	if options.Page != nil {
		query.Set("page", fmt.Sprint(*options.Page))
	}
	if options.PageSize != nil {
		query.Set("page_size", fmt.Sprint(*options.PageSize))
	}
	if options.AgentFramework != nil {
		query.Set("agent_framework", fmt.Sprint(*options.AgentFramework))
	}
	if options.ProviderID != nil {
		query.Set("provider_id", fmt.Sprint(*options.ProviderID))
	}
	if options.Search != nil {
		query.Set("search", fmt.Sprint(*options.Search))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listInstanceTemplates", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) GetInstanceTemplate(ctx context.Context, templateId string) (InstanceTemplate, error) {
	path := "/instance-templates/" + url.PathEscape(fmt.Sprint(templateId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output InstanceTemplate
	var body []byte
	payload, err := r.client.request(ctx, "getInstanceTemplate", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) ListAgentTemplates(ctx context.Context, options ListAgentTemplatesOptions) (ListAgentTemplatesResponse, error) {
	path := "/agent-templates"
	query := url.Values{}
	headers := http.Header{}
	var output ListAgentTemplatesResponse
	if options.Category != nil {
		query.Set("category", fmt.Sprint(*options.Category))
	}
	if options.Search != nil {
		query.Set("search", fmt.Sprint(*options.Search))
	}
	if options.Page != nil {
		query.Set("page", fmt.Sprint(*options.Page))
	}
	if options.PageSize != nil {
		query.Set("page_size", fmt.Sprint(*options.PageSize))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAgentTemplates", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) GetAgentTemplate(ctx context.Context, id string) (agentTemplateCatalogView, error) {
	path := "/agent-templates/" + url.PathEscape(fmt.Sprint(id)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output agentTemplateCatalogView
	var body []byte
	payload, err := r.client.request(ctx, "getAgentTemplate", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CatalogResource) GetDiscovery(ctx context.Context) (UHPDiscovery, error) {
	path := "/uhp"
	query := url.Values{}
	headers := http.Header{}
	var output UHPDiscovery
	var body []byte
	payload, err := r.client.request(ctx, "getDiscovery", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type InstancesResource struct{ client *BeeOSClient }

func (r *InstancesResource) List(ctx context.Context, options ListInstancesOptions) (InstancePage, error) {
	path := "/instances"
	query := url.Values{}
	headers := http.Header{}
	var output InstancePage
	if options.Page != nil {
		query.Set("page", fmt.Sprint(*options.Page))
	}
	if options.PageSize != nil {
		query.Set("page_size", fmt.Sprint(*options.PageSize))
	}
	if options.Status != nil {
		query.Set("status", fmt.Sprint(*options.Status))
	}
	if options.ProviderID != nil {
		query.Set("provider_id", fmt.Sprint(*options.ProviderID))
	}
	if options.AgentFramework != nil {
		query.Set("agent_framework", fmt.Sprint(*options.AgentFramework))
	}
	if options.ClusterID != nil {
		query.Set("cluster_id", fmt.Sprint(*options.ClusterID))
	}
	if options.Search != nil {
		query.Set("search", fmt.Sprint(*options.Search))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listInstances", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Create(ctx context.Context, input CreateServerInstanceInput, options InstanceCreateOptions) (RuntimeInstanceResult, error) {
	path := "/instances"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeInstanceResult
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "instanceCreate", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Get(ctx context.Context, instanceId string) (RuntimeInstanceResult, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeInstanceResult
	var body []byte
	payload, err := r.client.request(ctx, "getInstance", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Update(ctx context.Context, instanceId string, input UpdateServerInstanceInput, options UpdateInstanceMetadataOptions) (UpdateInstanceMetadataResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output UpdateInstanceMetadataResponse
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "updateInstanceMetadata", "PATCH", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Delete(ctx context.Context, instanceId string, options DeleteInstanceOptions) (RuntimeInstanceResult, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeInstanceResult
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	payload, err := r.client.request(ctx, "deleteInstance", "DELETE", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) GetStatus(ctx context.Context, instanceId string) (RuntimeInstanceStatusResult, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/status"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeInstanceStatusResult
	var body []byte
	payload, err := r.client.request(ctx, "getInstanceStatus", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Start(ctx context.Context, instanceId string, options StartInstanceOptions) (RuntimeInstanceResult, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/start"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeInstanceResult
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	payload, err := r.client.request(ctx, "startInstance", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Stop(ctx context.Context, instanceId string, options StopInstanceOptions) (RuntimeInstanceResult, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/stop"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeInstanceResult
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	payload, err := r.client.request(ctx, "stopInstance", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Upgrade(ctx context.Context, instanceId string, input UpgradeInstanceRequest, options UpgradeInstanceOptions) (RuntimeUpgradeJob, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/upgrade"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeUpgradeJob
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "upgradeInstance", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) GetUpgrade(ctx context.Context, instanceId string, jobId string) (RuntimeUpgradeJob, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/upgrades/" + url.PathEscape(fmt.Sprint(jobId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeUpgradeJob
	var body []byte
	payload, err := r.client.request(ctx, "getInstanceUpgrade", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) CreateTerminalSession(ctx context.Context, instanceId string, input CreateTerminalSessionRequest) (TerminalSessionDocument, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/terminal-sessions"
	query := url.Values{}
	headers := http.Header{}
	var output TerminalSessionDocument
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createTerminalSession", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) CreateCanvasSession(ctx context.Context, instanceId string, input CreateCanvasSessionRequest) (CanvasSessionDocument, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvas-sessions"
	query := url.Values{}
	headers := http.Header{}
	var output CanvasSessionDocument
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createCanvasSession", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) Exec(ctx context.Context, instanceId string, input ExecInstanceRequest) (RuntimeExecResult, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/exec"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeExecResult
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "execInstance", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) GetConnectURL(ctx context.Context, instanceId string, options GetInstanceConnectURLOptions) (ConnectURLResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/connect-url"
	query := url.Values{}
	headers := http.Header{}
	var output ConnectURLResponse
	if options.Service != nil {
		query.Set("service", fmt.Sprint(*options.Service))
	}
	if options.ClientID != nil {
		query.Set("client_id", fmt.Sprint(*options.ClientID))
	}
	if options.Role != nil {
		query.Set("role", fmt.Sprint(*options.Role))
	}
	if options.Generation != nil {
		query.Set("generation", fmt.Sprint(*options.Generation))
	}
	var body []byte
	payload, err := r.client.request(ctx, "getInstanceConnectURL", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *InstancesResource) GetStreamURL(ctx context.Context, instanceId string, options GetInstanceStreamURLOptions) (GetInstanceStreamURLResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/stream-url"
	query := url.Values{}
	headers := http.Header{}
	var output GetInstanceStreamURLResponse
	if options.ViewportWidth != nil {
		query.Set("viewportWidth", fmt.Sprint(*options.ViewportWidth))
	}
	if options.ViewportHeight != nil {
		query.Set("viewportHeight", fmt.Sprint(*options.ViewportHeight))
	}
	if options.Dpr != nil {
		query.Set("dpr", fmt.Sprint(*options.Dpr))
	}
	var body []byte
	payload, err := r.client.request(ctx, "getInstanceStreamURL", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type AgentsResource struct{ client *BeeOSClient }

func (r *AgentsResource) List(ctx context.Context, options ListAgentsOptions) (AgentPage, error) {
	path := "/agents"
	query := url.Values{}
	headers := http.Header{}
	var output AgentPage
	if options.InstanceID != nil {
		query.Set("instance_id", fmt.Sprint(*options.InstanceID))
	}
	if options.Status != nil {
		query.Set("status", fmt.Sprint(*options.Status))
	}
	if options.Visibility != nil {
		query.Set("visibility", fmt.Sprint(*options.Visibility))
	}
	if options.Search != nil {
		query.Set("search", fmt.Sprint(*options.Search))
	}
	if options.Page != nil {
		query.Set("page", fmt.Sprint(*options.Page))
	}
	if options.PageSize != nil {
		query.Set("page_size", fmt.Sprint(*options.PageSize))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAgents", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AgentsResource) Get(ctx context.Context, agentId string) (AgentResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output AgentResponse
	var body []byte
	payload, err := r.client.request(ctx, "getAgent", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AgentsResource) Update(ctx context.Context, agentId string, input AgentPatch, options UpdateAgentOptions) (AgentResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output AgentResponse
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "updateAgent", "PATCH", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AgentsResource) Invoke(ctx context.Context, agentId string, input AgentInvokeInput, options InvokeAgentOptions) (AgentInvokeResult, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/invoke"
	query := url.Values{}
	headers := http.Header{}
	var output AgentInvokeResult
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "invokeAgent", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type ConversationsResource struct{ client *BeeOSClient }

func (r *ConversationsResource) Create(ctx context.Context, agentId string, input CreateConversationInput, options CreateAgentConversationOptions) (ConversationResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations"
	query := url.Values{}
	headers := http.Header{}
	var output ConversationResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createAgentConversation", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) List(ctx context.Context, agentId string, options ListAgentConversationsOptions) (ConversationPage, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations"
	query := url.Values{}
	headers := http.Header{}
	var output ConversationPage
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	if options.State != nil {
		query.Set("state", fmt.Sprint(*options.State))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAgentConversations", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) Get(ctx context.Context, agentId string, conversationId string) (ConversationResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output ConversationResponse
	var body []byte
	payload, err := r.client.request(ctx, "getConversation", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) Update(ctx context.Context, agentId string, conversationId string, input UpdateConversationInput, options UpdateConversationOptions) (ConversationResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output ConversationResponse
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "updateConversation", "PATCH", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) Delete(ctx context.Context, agentId string, conversationId string, options DeleteConversationOptions) error {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	_, err := r.client.request(ctx, "deleteConversation", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *ConversationsResource) Cancel(ctx context.Context, agentId string, conversationId string, input CancelConversationInput, options CancelConversationOptions) (CommandReceiptResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/cancel"
	query := url.Values{}
	headers := http.Header{}
	var output CommandReceiptResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "cancelConversation", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) Clear(ctx context.Context, agentId string, conversationId string, options ClearConversationOptions) (ClearConversationReceiptResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/clear"
	query := url.Values{}
	headers := http.Header{}
	var output ClearConversationReceiptResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	payload, err := r.client.request(ctx, "clearConversation", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) SetModel(ctx context.Context, agentId string, conversationId string, input SetConversationModelInput, options SetConversationModelOptions) (CommandReceiptResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/model"
	query := url.Values{}
	headers := http.Header{}
	var output CommandReceiptResponse
	headers.Set("If-Match", fmt.Sprint(options.IfMatch))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "setConversationModel", "PUT", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConversationsResource) Resume(ctx context.Context, agentId string, conversationId string, options ResumeConversationOptions) (ResumeConversationResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/resume"
	query := url.Values{}
	headers := http.Header{}
	var output ResumeConversationResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	payload, err := r.client.request(ctx, "resumeConversation", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type MessagesResource struct{ client *BeeOSClient }

func (r *MessagesResource) List(ctx context.Context, agentId string, conversationId string, options ListConversationMessagesOptions) (MessagePage, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/messages"
	query := url.Values{}
	headers := http.Header{}
	var output MessagePage
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listConversationMessages", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *MessagesResource) Get(ctx context.Context, agentId string, conversationId string, messageId string) (MessageEnvelopeResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/messages/" + url.PathEscape(fmt.Sprint(messageId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output MessageEnvelopeResponse
	var body []byte
	payload, err := r.client.request(ctx, "getConversationMessage", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *MessagesResource) CreateShare(ctx context.Context, agentId string, conversationId string, messageId string) (CreateShareReplyResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/messages/" + url.PathEscape(fmt.Sprint(messageId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var output CreateShareReplyResponse
	var body []byte
	payload, err := r.client.request(ctx, "createShareReply", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *MessagesResource) GetShare(ctx context.Context, agentId string, conversationId string, messageId string) (GetShareReplyResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/messages/" + url.PathEscape(fmt.Sprint(messageId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var output GetShareReplyResponse
	var body []byte
	payload, err := r.client.request(ctx, "getShareReply", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *MessagesResource) RevokeShare(ctx context.Context, agentId string, conversationId string, messageId string) error {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/conversations/" + url.PathEscape(fmt.Sprint(conversationId)) + "/messages/" + url.PathEscape(fmt.Sprint(messageId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var body []byte
	_, err := r.client.request(ctx, "revokeShareReply", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *MessagesResource) ResolveShare(ctx context.Context, slug string) (ReplyShareResponse, error) {
	path := "/reply-shares/" + url.PathEscape(fmt.Sprint(slug)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output ReplyShareResponse
	var body []byte
	payload, err := r.client.request(ctx, "resolveReplyShare", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type TasksResource struct{ client *BeeOSClient }

func (r *TasksResource) Create(ctx context.Context, agentId string, input CreateTaskInput, options CreateAgentTaskOptions) (CreateTaskResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks"
	query := url.Values{}
	headers := http.Header{}
	var output CreateTaskResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createAgentTask", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *TasksResource) List(ctx context.Context, agentId string, options ListAgentTasksOptions) (TaskPage, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks"
	query := url.Values{}
	headers := http.Header{}
	var output TaskPage
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Since != nil {
		query.Set("since", fmt.Sprint(*options.Since))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	if options.State != nil {
		query.Set("state", fmt.Sprint(*options.State))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAgentTasks", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *TasksResource) Get(ctx context.Context, agentId string, taskId string) (TaskResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks/" + url.PathEscape(fmt.Sprint(taskId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output TaskResponse
	var body []byte
	payload, err := r.client.request(ctx, "getAgentTask", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *TasksResource) ListMessages(ctx context.Context, agentId string, taskId string, options ListAgentTaskMessagesOptions) (MessagePage, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks/" + url.PathEscape(fmt.Sprint(taskId)) + "/messages"
	query := url.Values{}
	headers := http.Header{}
	var output MessagePage
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Since != nil {
		query.Set("since", fmt.Sprint(*options.Since))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAgentTaskMessages", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *TasksResource) Cancel(ctx context.Context, agentId string, taskId string, input *CancelTaskInput, options CancelAgentTaskOptions) (CommandReceiptResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks/" + url.PathEscape(fmt.Sprint(taskId)) + "/cancel"
	query := url.Values{}
	headers := http.Header{}
	var output CommandReceiptResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	if input != nil {
		encoded, err := json.Marshal(input)
		if err != nil {
			return output, err
		}
		body = encoded
	}
	payload, err := r.client.request(ctx, "cancelAgentTask", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *TasksResource) ContinueTask(ctx context.Context, agentId string, taskId string, input *ContinueTaskInput, options ContinueAgentTaskOptions) (CommandReceiptResponse, error) {
	path := "/agents/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks/" + url.PathEscape(fmt.Sprint(taskId)) + "/continue"
	query := url.Values{}
	headers := http.Header{}
	var output CommandReceiptResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	if input != nil {
		encoded, err := json.Marshal(input)
		if err != nil {
			return output, err
		}
		body = encoded
	}
	payload, err := r.client.request(ctx, "continueAgentTask", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type UsageResource struct{ client *BeeOSClient }

func (r *UsageResource) GetSummary(ctx context.Context, options GetUsageSummaryOptions) (ServerUsageSummary, error) {
	path := "/usage/summary"
	query := url.Values{}
	headers := http.Header{}
	var output ServerUsageSummary
	if options.Period != nil {
		query.Set("period", fmt.Sprint(*options.Period))
	}
	if options.ExternalUserID != nil {
		query.Set("external_user_id", fmt.Sprint(*options.ExternalUserID))
	}
	if options.Category != nil {
		query.Set("category", fmt.Sprint(*options.Category))
	}
	var body []byte
	payload, err := r.client.request(ctx, "getUsageSummary", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type MethodsResource struct{ client *BeeOSClient }

func (r *MethodsResource) GetCapabilities(ctx context.Context, instanceId string) (RuntimeCapabilityDocument, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/runtime-capabilities"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeCapabilityDocument
	var body []byte
	payload, err := r.client.request(ctx, "getRuntimeCapabilities", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *MethodsResource) Invoke(ctx context.Context, instanceId string, input InvokeRuntimeMethodRequest, options InvokeRuntimeMethodOptions) (RuntimeMethodResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/methods"
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeMethodResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	if options.XBeeOSOperationID != nil {
		headers.Set("X-BeeOS-Operation-Id", fmt.Sprint(*options.XBeeOSOperationID))
	}
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "invokeRuntimeMethod", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type OperationsResource struct{ client *BeeOSClient }

func (r *OperationsResource) List(ctx context.Context, instanceId string, options ListRuntimeOperationsOptions) (CloudSkillOperationPage, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/operations"
	query := url.Values{}
	headers := http.Header{}
	var output CloudSkillOperationPage
	if options.Status != nil {
		query.Set("status", fmt.Sprint(*options.Status))
	}
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	if options.Method != nil {
		query.Set("method", fmt.Sprint(*options.Method))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listRuntimeOperations", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *OperationsResource) Get(ctx context.Context, operationId string, instanceId string) (CloudSkillOperationDetail, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/operations/" + url.PathEscape(fmt.Sprint(operationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output CloudSkillOperationDetail
	var body []byte
	payload, err := r.client.request(ctx, "getRuntimeOperation", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *OperationsResource) Cancel(ctx context.Context, operationId string, instanceId string, options CancelRuntimeOperationOptions) (CancelRuntimeOperationResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/operations/" + url.PathEscape(fmt.Sprint(operationId)) + "/cancel"
	query := url.Values{}
	headers := http.Header{}
	var output CancelRuntimeOperationResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	if options.XBeeOSOperationID != nil {
		headers.Set("X-BeeOS-Operation-Id", fmt.Sprint(*options.XBeeOSOperationID))
	}
	var body []byte
	payload, err := r.client.request(ctx, "cancelRuntimeOperation", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type FilesResource struct{ client *BeeOSClient }

func (r *FilesResource) PrepareUpload(ctx context.Context, input FilePrepareUploadInput, options PresignFileUploadOptions) (FileTransferDescriptor, error) {
	path := "/files/presign-upload"
	query := url.Values{}
	headers := http.Header{}
	var output FileTransferDescriptor
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "presignFileUpload", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) ConfirmUpload(ctx context.Context, fileId string, input FileConfirmInput, options ConfirmFileUploadOptions) (FileFile, error) {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + "/confirm"
	query := url.Values{}
	headers := http.Header{}
	var output FileFile
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "confirmFileUpload", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) List(ctx context.Context, options ListFilesOptions) (FilePage, error) {
	path := "/files"
	query := url.Values{}
	headers := http.Header{}
	var output FilePage
	if options.ContentType != nil {
		query.Set("content_type", fmt.Sprint(*options.ContentType))
	}
	if options.Since != nil {
		query.Set("since", fmt.Sprint(*options.Since))
	}
	if options.Status != nil {
		query.Set("status", fmt.Sprint(*options.Status))
	}
	if options.FileType != nil {
		query.Set("file_type", fmt.Sprint(*options.FileType))
	}
	if options.Category != nil {
		query.Set("category", fmt.Sprint(*options.Category))
	}
	if options.Source != nil {
		query.Set("source", fmt.Sprint(*options.Source))
	}
	if options.Q != nil {
		query.Set("q", fmt.Sprint(*options.Q))
	}
	if options.InstanceID != nil {
		query.Set("instance_id", fmt.Sprint(*options.InstanceID))
	}
	if options.AgentID != nil {
		query.Set("agent_id", fmt.Sprint(*options.AgentID))
	}
	if options.Sort != nil {
		query.Set("sort", fmt.Sprint(*options.Sort))
	}
	if options.SortDir != nil {
		query.Set("sort_dir", fmt.Sprint(*options.SortDir))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	if options.Offset != nil {
		query.Set("offset", fmt.Sprint(*options.Offset))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listFiles", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) Get(ctx context.Context, fileId string) (FileResolution, error) {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output FileResolution
	var body []byte
	payload, err := r.client.request(ctx, "getFile", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) Rename(ctx context.Context, fileId string, input RenameFileRequest) (FileFile, error) {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output FileFile
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "renameFile", "PATCH", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) Delete(ctx context.Context, fileId string, options DeleteFileOptions) error {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + ""
	query := url.Values{}
	headers := http.Header{}
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	_, err := r.client.request(ctx, "deleteFile", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *FilesResource) CreateShare(ctx context.Context, fileId string, options CreateShareFileShareOptions) (FileShareResponse, error) {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var output FileShareResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	payload, err := r.client.request(ctx, "createShareFileShare", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) GetShare(ctx context.Context, fileId string) (FileShareResponse, error) {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var output FileShareResponse
	var body []byte
	payload, err := r.client.request(ctx, "getShareFileShare", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) RevokeShare(ctx context.Context, fileId string) error {
	path := "/files/" + url.PathEscape(fmt.Sprint(fileId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var body []byte
	_, err := r.client.request(ctx, "revokeShareFileShare", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *FilesResource) ResolveShare(ctx context.Context, slug string) (ResolveFileShareResponse, error) {
	path := "/file-shares/" + url.PathEscape(fmt.Sprint(slug)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output ResolveFileShareResponse
	var body []byte
	payload, err := r.client.request(ctx, "resolveFileShare", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *FilesResource) GetSummary(ctx context.Context) (FileSummary, error) {
	path := "/files/summary"
	query := url.Values{}
	headers := http.Header{}
	var output FileSummary
	var body []byte
	payload, err := r.client.request(ctx, "getFilesSummary", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type McpResource struct{ client *BeeOSClient }

func (r *McpResource) List(ctx context.Context) (ListMCPServersResponse, error) {
	path := "/mcp/servers"
	query := url.Values{}
	headers := http.Header{}
	var output ListMCPServersResponse
	var body []byte
	payload, err := r.client.request(ctx, "listMCPServers", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *McpResource) Get(ctx context.Context, serverId string) (GetMCPServerResponse, error) {
	path := "/mcp/servers/" + url.PathEscape(fmt.Sprint(serverId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetMCPServerResponse
	var body []byte
	payload, err := r.client.request(ctx, "getMCPServer", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *McpResource) Resolve(ctx context.Context, serverId string) (ResolveMCPServerResponse, error) {
	path := "/mcp/servers/" + url.PathEscape(fmt.Sprint(serverId)) + "/resolve"
	query := url.Values{}
	headers := http.Header{}
	var output ResolveMCPServerResponse
	var body []byte
	payload, err := r.client.request(ctx, "resolveMCPServer", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type SkillsResource struct{ client *BeeOSClient }

func (r *SkillsResource) List(ctx context.Context, options ListSkillsOptions) (SkillPage, error) {
	path := "/skills"
	query := url.Values{}
	headers := http.Header{}
	var output SkillPage
	if options.Ids != nil {
		query.Set("ids", fmt.Sprint(*options.Ids))
	}
	if options.Category != nil {
		query.Set("category", fmt.Sprint(*options.Category))
	}
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Q != nil {
		query.Set("q", fmt.Sprint(*options.Q))
	}
	if options.OrderBy != nil {
		query.Set("order_by", fmt.Sprint(*options.OrderBy))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	if options.Offset != nil {
		query.Set("offset", fmt.Sprint(*options.Offset))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listSkills", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillsResource) Create(ctx context.Context, input CreateSkillRequest) (CreateSkillResponse, error) {
	path := "/skills"
	query := url.Values{}
	headers := http.Header{}
	var output CreateSkillResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createSkill", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillsResource) Search(ctx context.Context, options SearchSkillsOptions) (SkillPage, error) {
	path := "/skills/search"
	query := url.Values{}
	headers := http.Header{}
	var output SkillPage
	if options.Ids != nil {
		query.Set("ids", fmt.Sprint(*options.Ids))
	}
	if options.Category != nil {
		query.Set("category", fmt.Sprint(*options.Category))
	}
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Q != nil {
		query.Set("q", fmt.Sprint(*options.Q))
	}
	if options.OrderBy != nil {
		query.Set("order_by", fmt.Sprint(*options.OrderBy))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	if options.Offset != nil {
		query.Set("offset", fmt.Sprint(*options.Offset))
	}
	var body []byte
	payload, err := r.client.request(ctx, "searchSkills", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillsResource) Get(ctx context.Context, id string) (GetSkillResponse, error) {
	path := "/skills/" + url.PathEscape(fmt.Sprint(id)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetSkillResponse
	var body []byte
	payload, err := r.client.request(ctx, "getSkill", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillsResource) GetBySlug(ctx context.Context, slug string) (GetSkillBySlugResponse, error) {
	path := "/skills/by-slug/" + url.PathEscape(fmt.Sprint(slug)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetSkillBySlugResponse
	var body []byte
	payload, err := r.client.request(ctx, "getSkillBySlug", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillsResource) Categories(ctx context.Context) (ListSkillCategoriesResponse, error) {
	path := "/skills/categories"
	query := url.Values{}
	headers := http.Header{}
	var output ListSkillCategoriesResponse
	var body []byte
	payload, err := r.client.request(ctx, "listSkillCategories", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillsResource) Featured(ctx context.Context, options GetFeaturedSkillsOptions) (GetFeaturedSkillsResponse, error) {
	path := "/featured"
	query := url.Values{}
	headers := http.Header{}
	var output GetFeaturedSkillsResponse
	if options.Scope != nil {
		query.Set("scope", fmt.Sprint(*options.Scope))
	}
	if options.ScopeValue != nil {
		query.Set("scope_value", fmt.Sprint(*options.ScopeValue))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	var body []byte
	payload, err := r.client.request(ctx, "getFeaturedSkills", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type SkillSetsResource struct{ client *BeeOSClient }

func (r *SkillSetsResource) List(ctx context.Context, options ListSkillSetsOptions) (ListSkillSetsResponse, error) {
	path := "/skillhub/skill-sets"
	query := url.Values{}
	headers := http.Header{}
	var output ListSkillSetsResponse
	if options.Category != nil {
		query.Set("category", fmt.Sprint(*options.Category))
	}
	if options.Page != nil {
		query.Set("page", fmt.Sprint(*options.Page))
	}
	if options.PageSize != nil {
		query.Set("page_size", fmt.Sprint(*options.PageSize))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listSkillSets", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *SkillSetsResource) Get(ctx context.Context, slug string) (skillSetDetailView, error) {
	path := "/skillhub/skill-sets/" + url.PathEscape(fmt.Sprint(slug)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output skillSetDetailView
	var body []byte
	payload, err := r.client.request(ctx, "getSkillSet", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type AutomationsResource struct{ client *BeeOSClient }

func (r *AutomationsResource) Create(ctx context.Context, input ProtoAutomationInput) (CreateAutomationResponse, error) {
	path := "/automations"
	query := url.Values{}
	headers := http.Header{}
	var output CreateAutomationResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createAutomation", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) List(ctx context.Context, options ListAutomationsOptions) (ListAutomationsResponse, error) {
	path := "/automations"
	query := url.Values{}
	headers := http.Header{}
	var output ListAutomationsResponse
	if options.Status != nil {
		query.Set("status", fmt.Sprint(*options.Status))
	}
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAutomations", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) Get(ctx context.Context, automationId string) (GetAutomationResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetAutomationResponse
	var body []byte
	payload, err := r.client.request(ctx, "getAutomation", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) Update(ctx context.Context, automationId string, input ProtoAutomationPatch) (UpdateAutomationResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output UpdateAutomationResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "updateAutomation", "PATCH", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) Delete(ctx context.Context, automationId string) error {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var body []byte
	_, err := r.client.request(ctx, "deleteAutomation", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *AutomationsResource) Pause(ctx context.Context, automationId string) (PauseAutomationResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + "/pause"
	query := url.Values{}
	headers := http.Header{}
	var output PauseAutomationResponse
	var body []byte
	payload, err := r.client.request(ctx, "pauseAutomation", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) Resume(ctx context.Context, automationId string) (ResumeAutomationResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + "/resume"
	query := url.Values{}
	headers := http.Header{}
	var output ResumeAutomationResponse
	var body []byte
	payload, err := r.client.request(ctx, "resumeAutomation", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) CreateRun(ctx context.Context, automationId string, input ProtoAutomationRunInput, options CreateAutomationRunOptions) (CreateAutomationRunResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + "/runs"
	query := url.Values{}
	headers := http.Header{}
	var output CreateAutomationRunResponse
	headers.Set("Idempotency-Key", fmt.Sprint(options.IdempotencyKey))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createAutomationRun", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) ListRuns(ctx context.Context, automationId string, options ListAutomationRunsOptions) (ListAutomationRunsResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + "/runs"
	query := url.Values{}
	headers := http.Header{}
	var output ListAutomationRunsResponse
	if options.Status != nil {
		query.Set("status", fmt.Sprint(*options.Status))
	}
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listAutomationRuns", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) GetRun(ctx context.Context, automationId string, runId string) (GetAutomationRunResponse, error) {
	path := "/automations/" + url.PathEscape(fmt.Sprint(automationId)) + "/runs/" + url.PathEscape(fmt.Sprint(runId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetAutomationRunResponse
	var body []byte
	payload, err := r.client.request(ctx, "getAutomationRun", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *AutomationsResource) CreateWebhook(ctx context.Context, input ProtoAutomationWebhookInput) (CreateWebhookAutomationResponse, error) {
	path := "/automations/webhooks"
	query := url.Values{}
	headers := http.Header{}
	var output CreateWebhookAutomationResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createWebhookAutomation", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type ConnectorsResource struct{ client *BeeOSClient }

func (r *ConnectorsResource) CredentialPut(ctx context.Context, input ProtoPutConnectorCredentialRequest) (PutConnectorCredentialConnectorResponse, error) {
	path := "/connectors/credential-put"
	query := url.Values{}
	headers := http.Header{}
	var output PutConnectorCredentialConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "PutConnectorCredentialConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) CredentialDelete(ctx context.Context, input ProtoDeleteConnectorCredentialRequest) (DeleteConnectorCredentialConnectorResponse, error) {
	path := "/connectors/credential-delete"
	query := url.Values{}
	headers := http.Header{}
	var output DeleteConnectorCredentialConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "DeleteConnectorCredentialConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) List(ctx context.Context, input ProtoListInstanceConnectorsRequest) (ListInstanceConnectorsConnectorResponse, error) {
	path := "/connectors/list"
	query := url.Values{}
	headers := http.Header{}
	var output ListInstanceConnectorsConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "ListInstanceConnectorsConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) Install(ctx context.Context, input ProtoInstallManagedConnectorRequest) (InstallManagedConnectorConnectorResponse, error) {
	path := "/connectors/install"
	query := url.Values{}
	headers := http.Header{}
	var output InstallManagedConnectorConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "InstallManagedConnectorConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) Update(ctx context.Context, input ProtoUpdateManagedConnectorRequest) (UpdateManagedConnectorConnectorResponse, error) {
	path := "/connectors/update"
	query := url.Values{}
	headers := http.Header{}
	var output UpdateManagedConnectorConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "UpdateManagedConnectorConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) Uninstall(ctx context.Context, input ProtoUninstallManagedConnectorRequest) (UninstallManagedConnectorConnectorResponse, error) {
	path := "/connectors/uninstall"
	query := url.Values{}
	headers := http.Header{}
	var output UninstallManagedConnectorConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "UninstallManagedConnectorConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) CatalogList(ctx context.Context, input ProtoListMcpServersRequest) (ListMcpServersConnectorResponse, error) {
	path := "/connectors/catalog-list"
	query := url.Values{}
	headers := http.Header{}
	var output ListMcpServersConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "ListMcpServersConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) CatalogGet(ctx context.Context, input ProtoGetMcpServerRequest) (GetMcpServerConnectorResponse, error) {
	path := "/connectors/catalog-get"
	query := url.Values{}
	headers := http.Header{}
	var output GetMcpServerConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "GetMcpServerConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) CatalogCategories(ctx context.Context, input ProtoMcpListCategoriesRequest) (ListCategoriesConnectorResponse, error) {
	path := "/connectors/catalog-categories"
	query := url.Values{}
	headers := http.Header{}
	var output ListCategoriesConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "ListCategoriesConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) CatalogPrepare(ctx context.Context, input ProtoResolveMcpPreparationRequest) (ResolvePreparationConnectorResponse, error) {
	path := "/connectors/catalog-prepare"
	query := url.Values{}
	headers := http.Header{}
	var output ResolvePreparationConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "ResolvePreparationConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ConnectorsResource) CatalogResolve(ctx context.Context, input ProtoResolveInstallRequest) (ResolveInstallConnectorResponse, error) {
	path := "/connectors/catalog-resolve"
	query := url.Values{}
	headers := http.Header{}
	var output ResolveInstallConnectorResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "ResolveInstallConnector", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type AudioResource struct{ client *BeeOSClient }

func (r *AudioResource) Transcribe(ctx context.Context, input TranscribeAudioRequest) (TranscribeAudioResponse, error) {
	path := "/audio/transcribe"
	query := url.Values{}
	headers := http.Header{}
	var output TranscribeAudioResponse
	var body []byte
	encoded, contentType, err := encodeFileMultipart(input.File)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "transcribeAudio", "POST", path, "", query, headers, body, contentType)
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type CanvasesResource struct{ client *BeeOSClient }

func (r *CanvasesResource) GetShare(ctx context.Context, instanceId string, canvasId string, options GetShareCanvasOptions) (GetShareCanvasResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvases/" + url.PathEscape(fmt.Sprint(canvasId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var output GetShareCanvasResponse
	headers.Set("X-BeeOS-Conversation-ID", fmt.Sprint(options.XBeeOSConversationID))
	headers.Set("X-BeeOS-Platform-Agent-ID", fmt.Sprint(options.XBeeOSPlatformAgentID))
	var body []byte
	payload, err := r.client.request(ctx, "getShareCanvas", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CanvasesResource) CreateShare(ctx context.Context, instanceId string, canvasId string, input CreateShareCanvasRequest, options CreateShareCanvasOptions) (CreateShareCanvasResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvases/" + url.PathEscape(fmt.Sprint(canvasId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	var output CreateShareCanvasResponse
	headers.Set("X-BeeOS-Conversation-ID", fmt.Sprint(options.XBeeOSConversationID))
	headers.Set("X-BeeOS-Platform-Agent-ID", fmt.Sprint(options.XBeeOSPlatformAgentID))
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createShareCanvas", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CanvasesResource) DeleteShare(ctx context.Context, instanceId string, canvasId string, options DeleteShareCanvasOptions) error {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvases/" + url.PathEscape(fmt.Sprint(canvasId)) + "/share"
	query := url.Values{}
	headers := http.Header{}
	headers.Set("X-BeeOS-Conversation-ID", fmt.Sprint(options.XBeeOSConversationID))
	headers.Set("X-BeeOS-Platform-Agent-ID", fmt.Sprint(options.XBeeOSPlatformAgentID))
	var body []byte
	_, err := r.client.request(ctx, "deleteShareCanvas", "DELETE", path, "", query, headers, body, "")
	return err
}

func (r *CanvasesResource) ListSnapshots(ctx context.Context, instanceId string, canvasId string, options ListCanvasSnapshotsOptions) (ListCanvasSnapshotsResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvases/" + url.PathEscape(fmt.Sprint(canvasId)) + "/snapshots"
	query := url.Values{}
	headers := http.Header{}
	var output ListCanvasSnapshotsResponse
	headers.Set("X-BeeOS-Conversation-ID", fmt.Sprint(options.XBeeOSConversationID))
	headers.Set("X-BeeOS-Platform-Agent-ID", fmt.Sprint(options.XBeeOSPlatformAgentID))
	var body []byte
	payload, err := r.client.request(ctx, "listCanvasSnapshots", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CanvasesResource) RestoreSnapshot(ctx context.Context, instanceId string, canvasId string, snapshotId string, options RestoreCanvasSnapshotOptions) (RestoreCanvasSnapshotResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvases/" + url.PathEscape(fmt.Sprint(canvasId)) + "/snapshots/" + url.PathEscape(fmt.Sprint(snapshotId)) + "/restore"
	query := url.Values{}
	headers := http.Header{}
	var output RestoreCanvasSnapshotResponse
	headers.Set("X-BeeOS-Conversation-ID", fmt.Sprint(options.XBeeOSConversationID))
	headers.Set("X-BeeOS-Platform-Agent-ID", fmt.Sprint(options.XBeeOSPlatformAgentID))
	var body []byte
	payload, err := r.client.request(ctx, "restoreCanvasSnapshot", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *CanvasesResource) GetSession(ctx context.Context, instanceId string, conversationId string, options GetCanvasSessionOptions) (GetCanvasSessionResponse, error) {
	path := "/instances/" + url.PathEscape(fmt.Sprint(instanceId)) + "/canvas-sessions/" + url.PathEscape(fmt.Sprint(conversationId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetCanvasSessionResponse
	headers.Set("X-BeeOS-Conversation-ID", fmt.Sprint(options.XBeeOSConversationID))
	headers.Set("X-BeeOS-Platform-Agent-ID", fmt.Sprint(options.XBeeOSPlatformAgentID))
	var body []byte
	payload, err := r.client.request(ctx, "getCanvasSession", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type DeviceBindingsResource struct{ client *BeeOSClient }

func (r *DeviceBindingsResource) GetDetails(ctx context.Context, id string) (GetAgentBindDetailsResponse, error) {
	path := "/agent/bind/" + url.PathEscape(fmt.Sprint(id)) + "/details"
	query := url.Values{}
	headers := http.Header{}
	var output GetAgentBindDetailsResponse
	var body []byte
	payload, err := r.client.request(ctx, "getAgentBindDetails", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *DeviceBindingsResource) Confirm(ctx context.Context, id string, input ConfirmAgentBindRequest) (ConfirmAgentBindResponse, error) {
	path := "/agent/bind/" + url.PathEscape(fmt.Sprint(id)) + "/confirm"
	query := url.Values{}
	headers := http.Header{}
	var output ConfirmAgentBindResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "confirmAgentBind", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *DeviceBindingsResource) CreatePortal(ctx context.Context, input CreatePortalBindRequest) (CreatePortalBindResponse, error) {
	path := "/agent/portal/bind-sessions"
	query := url.Values{}
	headers := http.Header{}
	var output CreatePortalBindResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createPortalBind", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *DeviceBindingsResource) GetPortal(ctx context.Context, id string) (GetPortalBindResponse, error) {
	path := "/agent/portal/bind-sessions/" + url.PathEscape(fmt.Sprint(id)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output GetPortalBindResponse
	var body []byte
	payload, err := r.client.request(ctx, "getPortalBind", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *DeviceBindingsResource) RevokePortal(ctx context.Context, id string) (RevokePortalBindResponse, error) {
	path := "/agent/portal/bind-sessions/" + url.PathEscape(fmt.Sprint(id)) + "/revoke"
	query := url.Values{}
	headers := http.Header{}
	var output RevokePortalBindResponse
	var body []byte
	payload, err := r.client.request(ctx, "revokePortalBind", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *DeviceBindingsResource) ResolvePortal(ctx context.Context, id string, input ResolvePortalBindRequest) (ResolvePortalBindResponse, error) {
	path := "/agent/portal/bind-sessions/" + url.PathEscape(fmt.Sprint(id)) + "/resolve"
	query := url.Values{}
	headers := http.Header{}
	var output ResolvePortalBindResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "resolvePortalBind", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type A2aResource struct{ client *BeeOSClient }

func (r *A2aResource) Invoke(ctx context.Context, agentId string, input InvokeA2ARequest) (RuntimeMethodResponse, error) {
	path := "/a2a/" + url.PathEscape(fmt.Sprint(agentId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output RuntimeMethodResponse
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "invokeA2A", "POST", path, "", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *A2aResource) GetAgentCard(ctx context.Context, agentId string) (A2AAgentCard, error) {
	path := "/a2a/" + url.PathEscape(fmt.Sprint(agentId)) + "/.well-known/agent-card.json"
	query := url.Values{}
	headers := http.Header{}
	var output A2AAgentCard
	var body []byte
	payload, err := r.client.request(ctx, "getA2AAgentCard", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *A2aResource) GetAgentCardLegacy(ctx context.Context, agentId string) (A2AAgentCard, error) {
	path := "/a2a/" + url.PathEscape(fmt.Sprint(agentId)) + "/.well-known/agent.json"
	query := url.Values{}
	headers := http.Header{}
	var output A2AAgentCard
	var body []byte
	payload, err := r.client.request(ctx, "getA2AAgentCardLegacy", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *A2aResource) ListTasks(ctx context.Context, agentId string, options ListA2ATasksOptions) (ListA2ATasksResponse, error) {
	path := "/a2a/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks"
	query := url.Values{}
	headers := http.Header{}
	var output ListA2ATasksResponse
	if options.Direction != nil {
		query.Set("direction", fmt.Sprint(*options.Direction))
	}
	if options.AgentID != nil {
		query.Set("agent_id", fmt.Sprint(*options.AgentID))
	}
	if options.Cursor != nil {
		query.Set("cursor", fmt.Sprint(*options.Cursor))
	}
	if options.Limit != nil {
		query.Set("limit", fmt.Sprint(*options.Limit))
	}
	var body []byte
	payload, err := r.client.request(ctx, "listA2ATasks", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *A2aResource) GetTask(ctx context.Context, agentId string, taskId string, options GetA2ATaskOptions) (a2aTaskView, error) {
	path := "/a2a/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks/" + url.PathEscape(fmt.Sprint(taskId)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output a2aTaskView
	if options.HistoryLength != nil {
		query.Set("history_length", fmt.Sprint(*options.HistoryLength))
	}
	var body []byte
	payload, err := r.client.request(ctx, "getA2ATask", "GET", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *A2aResource) CancelTask(ctx context.Context, agentId string, taskId string) (a2aTaskView, error) {
	path := "/a2a/" + url.PathEscape(fmt.Sprint(agentId)) + "/tasks/" + url.PathEscape(fmt.Sprint(taskId)) + "/cancel"
	query := url.Values{}
	headers := http.Header{}
	var output a2aTaskView
	var body []byte
	payload, err := r.client.request(ctx, "cancelA2ATask", "POST", path, "", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type HarnessesResource struct{ client *BeeOSClient }

func (r *HarnessesResource) List(ctx context.Context) (ListHarnessesResponse, error) {
	path := "/harnesses"
	query := url.Values{}
	headers := http.Header{}
	var output ListHarnessesResponse
	var body []byte
	payload, err := r.client.request(ctx, "listHarnesses", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *HarnessesResource) Get(ctx context.Context, harnessid string) (UHPHarness, error) {
	path := "/harnesses/" + url.PathEscape(fmt.Sprint(harnessid)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output UHPHarness
	var body []byte
	payload, err := r.client.request(ctx, "getHarness", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *HarnessesResource) ListAllModels(ctx context.Context) (UHPModelCatalog, error) {
	path := "/models"
	query := url.Values{}
	headers := http.Header{}
	var output UHPModelCatalog
	var body []byte
	payload, err := r.client.request(ctx, "listModels", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *HarnessesResource) ListModels(ctx context.Context, harnessid string) (UHPHarnessModels, error) {
	path := "/harnesses/" + url.PathEscape(fmt.Sprint(harnessid)) + "/models"
	query := url.Values{}
	headers := http.Header{}
	var output UHPHarnessModels
	var body []byte
	payload, err := r.client.request(ctx, "listHarnessModels", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

type ResponsesResource struct{ client *BeeOSClient }

func (r *ResponsesResource) Create(ctx context.Context, input UHPCreateResponseJSONRequest, options CreateResponseOptions) (UHPResponse, error) {
	path := "/responses"
	query := url.Values{}
	headers := http.Header{}
	var output UHPResponse
	if options.IdempotencyKey != nil {
		headers.Set("Idempotency-Key", fmt.Sprint(*options.IdempotencyKey))
	}
	if options.UHPVersion != nil {
		headers.Set("UHP-Version", fmt.Sprint(*options.UHPVersion))
	}
	var body []byte
	encoded, err := json.Marshal(input)
	if err != nil {
		return output, err
	}
	body = encoded
	payload, err := r.client.request(ctx, "createResponse", "POST", path, "/uhp/v1", query, headers, body, "application/json")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ResponsesResource) Get(ctx context.Context, responseid string) (UHPResponse, error) {
	path := "/responses/" + url.PathEscape(fmt.Sprint(responseid)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output UHPResponse
	var body []byte
	payload, err := r.client.request(ctx, "getResponse", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ResponsesResource) Delete(ctx context.Context, responseid string) (DeleteResponseResponse, error) {
	path := "/responses/" + url.PathEscape(fmt.Sprint(responseid)) + ""
	query := url.Values{}
	headers := http.Header{}
	var output DeleteResponseResponse
	var body []byte
	payload, err := r.client.request(ctx, "deleteResponse", "DELETE", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ResponsesResource) GetInputItems(ctx context.Context, responseid string) (GetResponseInputItemsResponse, error) {
	path := "/responses/" + url.PathEscape(fmt.Sprint(responseid)) + "/input_items"
	query := url.Values{}
	headers := http.Header{}
	var output GetResponseInputItemsResponse
	var body []byte
	payload, err := r.client.request(ctx, "getResponseInputItems", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ResponsesResource) Cancel(ctx context.Context, responseid string) (UHPResponse, error) {
	path := "/responses/" + url.PathEscape(fmt.Sprint(responseid)) + "/cancel"
	query := url.Values{}
	headers := http.Header{}
	var output UHPResponse
	var body []byte
	payload, err := r.client.request(ctx, "cancelResponse", "POST", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return output, err
	}
	err = json.Unmarshal(payload, &output)
	return output, err
}

func (r *ResponsesResource) GetEvents(ctx context.Context, responseid string, options GetResponseEventsOptions) (*EventStream[UHPEvent], error) {
	path := "/responses/" + url.PathEscape(fmt.Sprint(responseid)) + "/events"
	query := url.Values{}
	headers := http.Header{}
	if options.LastEventID != nil {
		headers.Set("Last-Event-ID", fmt.Sprint(*options.LastEventID))
	}
	if options.UHPVersion != nil {
		headers.Set("UHP-Version", fmt.Sprint(*options.UHPVersion))
	}
	var body []byte
	response, err := r.client.send(ctx, "getResponseEvents", "GET", path, "/uhp/v1", query, headers, body, "")
	if err != nil {
		return nil, err
	}
	return &EventStream[UHPEvent]{body: response.Body, reader: bufio.NewReader(response.Body)}, nil
}

func (r *ResponsesResource) CreateStream(ctx context.Context, input UHPCreateResponseJSONRequest, options CreateResponseOptions) (*UHPEventStream, error) {
	encoded, err := json.Marshal(input)
	if err != nil {
		return nil, err
	}
	var body map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &body); err != nil {
		return nil, err
	}
	body["stream"] = json.RawMessage("true")
	encoded, err = json.Marshal(body)
	if err != nil {
		return nil, err
	}
	headers := http.Header{}
	if options.IdempotencyKey != nil {
		headers.Set("Idempotency-Key", *options.IdempotencyKey)
	}
	if options.UHPVersion != nil {
		headers.Set("UHP-Version", *options.UHPVersion)
	}
	response, err := r.client.send(ctx, "createResponse", "POST", "/responses", "/uhp/v1", url.Values{}, headers, encoded, "application/json")
	if err != nil {
		return nil, err
	}
	return &UHPEventStream{body: response.Body, reader: bufio.NewReader(response.Body)}, nil
}
