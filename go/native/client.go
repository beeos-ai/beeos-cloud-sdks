// Code generated from spec/native.openapi.json and maintained native runtime. DO NOT EDIT.
package native

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"reflect"
	"strconv"
	"strings"
	"time"
)

type Nullable[T any] struct{ Value *T }

func (value Nullable[T]) MarshalJSON() ([]byte, error)     { return json.Marshal(value.Value) }
func (value *Nullable[T]) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &value.Value) }
func Pointer[T any](value T) *T                            { return &value }

type HTTPHeaders struct {
	RequestID, ETag, Location, RetryAfter string
	ShouldRetry                           *bool
	Raw                                   http.Header
}
type Acceptance struct {
	Status                          *int
	ResourceID                      *string
	ETag, RequestID, IdempotencyKey string
}
type BeeOSHTTPResponse[T any] struct {
	Status     int
	Body       T
	Headers    HTTPHeaders
	Acceptance *Acceptance
}
type BeeOSAPIError struct {
	HTTPStatus                                   int
	Code, Message, Reason, RequestID, RetryAfter string
	ShouldRetry                                  *bool
	RawEnvelope                                  json.RawMessage
	Headers                                      HTTPHeaders
	Acceptance                                   *Acceptance
}

func (err *BeeOSAPIError) Error() string {
	return fmt.Sprintf("BeeOS HTTP %d %s: %s", err.HTTPStatus, err.Code, err.Message)
}

type SDKWaitTimeout struct {
	Message      string
	Acceptance   *Acceptance
	LastResponse *BeeOSHTTPResponse[json.RawMessage]
	Cause        error
}

func (err *SDKWaitTimeout) Error() string { return err.Message }
func (err *SDKWaitTimeout) Unwrap() error { return err.Cause }

type SDKRequestTimeout struct{ *SDKWaitTimeout }
type SDKCancelled struct{ *SDKWaitTimeout }
type SDKPublicationSuperseded struct{ *SDKWaitTimeout }
type SDKOperationFailed struct{ *SDKWaitTimeout }
type SDKTransportError struct{ *SDKWaitTimeout }
type RequestOptions struct {
	IdempotencyKey                                                 string
	Wait                                                           *bool
	RequestTimeoutSeconds, WaitTimeoutSeconds, PollIntervalSeconds float64
	OnProgress                                                     func(BeeOSHTTPResponse[json.RawMessage])
}
type ClientOptions struct {
	BaseURL, APIKey string
	APIKeyProvider  func() string
	HTTPClient      *http.Client
	WebSocketDialer WebSocketDialer
}
type Client struct {
	options       ClientOptions
	origin        *url.URL
	Sandboxes     *SandboxesService
	Templates     *TemplatesService
	AccessTickets *AccessTicketsService
	Agents        *AgentsService
	Models        *ModelsService
	Sessions      *SessionsService
	Responses     *ResponsesService
	Files         *FilesService
	Capabilities  *CapabilitiesService
	Canvases      *CanvasesService
}

func NewClient(options ClientOptions) (*Client, error) {
	origin, err := url.Parse(options.BaseURL)
	if err != nil {
		return nil, err
	}
	if (origin.Scheme != "https" && origin.Scheme != "http") || origin.Host == "" || (options.APIKey == "" && options.APIKeyProvider == nil) {
		return nil, fmt.Errorf("base URL and server API key required")
	}
	origin.Path = ""
	origin.RawPath = ""
	origin.RawQuery = ""
	origin.Fragment = ""
	if options.HTTPClient == nil {
		options.HTTPClient = &http.Client{}
	}
	client := &Client{options: options, origin: origin}
	client.Sandboxes = newSandboxesService(client)
	client.Templates = newTemplatesService(client)
	client.AccessTickets = newAccessTicketsService(client)
	client.Agents = newAgentsService(client)
	client.Models = newModelsService(client)
	client.Sessions = newSessionsService(client)
	client.Responses = newResponsesService(client)
	client.Files = newFilesService(client)
	client.Capabilities = newCapabilitiesService(client)
	client.Canvases = newCanvasesService(client)
	return client, nil
}
func NewIdempotencyKey() (string, error) {
	var buffer [16]byte
	if _, err := rand.Read(buffer[:]); err != nil {
		return "", err
	}
	return hex.EncodeToString(buffer[:]), nil
}

type nativeParameter struct {
	Name, In string
	Required bool
}
type nativeOperation struct {
	ID, Method, Path, ContentType, ResponseType string
	Wait, Keyed                                 bool
	Parameters                                  []nativeParameter
}
type operationContext struct {
	acceptance *Acceptance
	last       *BeeOSHTTPResponse[json.RawMessage]
	caller     context.Context
	ctx        context.Context
	cancel     context.CancelFunc
}

func newOperationContext(ctx context.Context, op nativeOperation, options RequestOptions) (*operationContext, error) {
	result := &operationContext{caller: ctx, ctx: ctx, cancel: func() {}}
	if options.RequestTimeoutSeconds < 0 || options.WaitTimeoutSeconds < 0 || options.PollIntervalSeconds < 0 {
		return nil, fmt.Errorf("local deadlines and poll interval must be positive")
	}
	if op.Keyed {
		key := options.IdempotencyKey
		if key == "" {
			var err error
			key, err = NewIdempotencyKey()
			if err != nil {
				return nil, err
			}
		}
		if len(key) > 256 {
			return nil, fmt.Errorf("Idempotency-Key exceeds 256 bytes")
		}
		result.acceptance = &Acceptance{IdempotencyKey: key}
	}
	if op.Wait && (options.Wait == nil || *options.Wait) {
		seconds := options.WaitTimeoutSeconds
		if seconds == 0 {
			seconds = 300
		}
		result.ctx, result.cancel = context.WithTimeout(ctx, time.Duration(seconds*float64(time.Second)))
	}
	return result, nil
}
func localError(ctx *operationContext, cause error, request bool) error {
	base := &SDKWaitTimeout{Message: "Local wait deadline exceeded", Acceptance: ctx.acceptance, LastResponse: ctx.last, Cause: cause}
	if ctx.caller.Err() != nil {
		base.Message = "Local operation cancelled"
		return &SDKCancelled{base}
	}
	if ctx.ctx.Err() != nil {
		return base
	}
	if request {
		base.Message = "HTTP request deadline exceeded"
		return &SDKRequestTimeout{base}
	}
	return cause
}
func readHeaders(raw http.Header) HTTPHeaders {
	result := HTTPHeaders{RequestID: raw.Get("X-Request-ID"), ETag: raw.Get("ETag"), Location: raw.Get("Location"), RetryAfter: raw.Get("Retry-After"), Raw: raw.Clone()}
	value := raw.Get("Should-Retry")
	if value == "" {
		value = raw.Get("X-Should-Retry")
	}
	if value != "" {
		flag := value == "true"
		result.ShouldRetry = &flag
	}
	return result
}
func wireValue(value any) (reflect.Value, bool) {
	if value == nil {
		return reflect.Value{}, false
	}
	result := reflect.ValueOf(value)
	for result.Kind() == reflect.Pointer || result.Kind() == reflect.Interface {
		if result.IsNil() {
			return reflect.Value{}, false
		}
		result = result.Elem()
	}
	return result, true
}
func makeRequest(ctx context.Context, client *Client, op nativeOperation, path map[string]string, body any, wire map[string]any, options RequestOptions, operation *operationContext) (*http.Response, context.CancelFunc, error) {
	target := op.Path
	for key, value := range path {
		if value == "" {
			return nil, nil, fmt.Errorf("empty path parameter %s", key)
		}
		target = strings.ReplaceAll(target, "{"+key+"}", url.PathEscape(value))
	}
	requestURL, err := url.Parse(client.origin.String() + target)
	if err != nil {
		return nil, nil, err
	}
	query := requestURL.Query()
	headers := http.Header{}
	key := client.options.APIKey
	if client.options.APIKeyProvider != nil {
		key = client.options.APIKeyProvider()
	}
	headers.Set("Authorization", "Bearer "+key)
	accept := "application/json"
	if op.ResponseType == "sse" {
		accept = "text/event-stream"
	}
	if op.ResponseType == "bytes" {
		accept = "application/octet-stream"
	}
	headers.Set("Accept", accept)
	if op.ContentType != "" {
		headers.Set("Content-Type", op.ContentType)
	}
	if op.Keyed {
		headers.Set("Idempotency-Key", operation.acceptance.IdempotencyKey)
	}
	for _, param := range op.Parameters {
		value, ok := wireValue(wire[param.Name])
		if !ok {
			if param.Required {
				return nil, nil, fmt.Errorf("missing required option %s", param.Name)
			}
			continue
		}
		if !param.Required && value.IsZero() {
			continue
		}
		text := fmt.Sprint(value.Interface())
		if param.Name == "If-Match" && (len(text) < 3 || !strings.HasPrefix(text, "\"") || !strings.HasSuffix(text, "\"") || strings.ContainsAny(text[1:len(text)-1], "\"\r\n")) {
			return nil, nil, fmt.Errorf("If-Match must be a strong quoted ETag")
		}
		if param.In == "header" {
			headers.Set(param.Name, text)
		} else if value.Kind() == reflect.Slice {
			for i := 0; i < value.Len(); i++ {
				query.Add(param.Name, fmt.Sprint(value.Index(i).Interface()))
			}
		} else {
			query.Add(param.Name, text)
		}
	}
	requestURL.RawQuery = query.Encode()
	var reader io.Reader
	if body != nil {
		if op.ContentType == "application/octet-stream" {
			var ok bool
			reader, ok = body.(io.Reader)
			if !ok {
				return nil, nil, fmt.Errorf("binary body must implement io.Reader")
			}
		} else {
			encoded, err := json.Marshal(body)
			if err != nil {
				return nil, nil, err
			}
			reader = bytes.NewReader(encoded)
		}
	}
	seconds := options.RequestTimeoutSeconds
	if seconds == 0 {
		seconds = 30
	}
	var requestCtx context.Context
	var cancel context.CancelFunc
	var admissionTimer *time.Timer
	if op.ResponseType == "sse" {
		requestCtx, cancel = context.WithCancel(ctx)
		admissionTimer = time.AfterFunc(time.Duration(seconds*float64(time.Second)), cancel)
	} else {
		requestCtx, cancel = context.WithTimeout(ctx, time.Duration(seconds*float64(time.Second)))
	}
	request, err := http.NewRequestWithContext(requestCtx, op.Method, requestURL.String(), reader)
	if err != nil {
		cancel()
		return nil, nil, err
	}
	request.Header = headers
	if value := headers.Get("Content-Length"); value != "" {
		length, parseErr := strconv.ParseInt(value, 10, 64)
		if parseErr != nil {
			cancel()
			return nil, nil, parseErr
		}
		request.ContentLength = length
		request.Header.Del("Content-Length")
	}
	response, err := client.options.HTTPClient.Do(request)
	if admissionTimer != nil {
		admissionTimer.Stop()
	}
	if err != nil {
		cancel()
		if requestCtx.Err() != nil {
			return nil, nil, localError(operation, err, true)
		}
		return nil, nil, &SDKTransportError{&SDKWaitTimeout{Message: "HTTP transport failed", Acceptance: operation.acceptance, LastResponse: operation.last, Cause: err}}
	}
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		defer response.Body.Close()
		defer cancel()
		raw, readErr := io.ReadAll(response.Body)
		if readErr != nil {
			return nil, nil, readErr
		}
		var envelope struct {
			Code, Message, Reason string
			RequestID             string          `json:"request_id"`
			RetryAfter            json.RawMessage `json:"retry_after"`
			ShouldRetry           *bool           `json:"should_retry"`
			Details               struct {
				Reason string `json:"reason"`
			}
			Error json.RawMessage
		}
		_ = json.Unmarshal(raw, &envelope)
		if len(envelope.Error) > 0 && envelope.Error[0] == '{' {
			_ = json.Unmarshal(envelope.Error, &envelope)
		}
		info := readHeaders(response.Header)
		if envelope.Code == "" {
			envelope.Code = "invalid_response"
		}
		if envelope.Message == "" {
			envelope.Message = response.Status
		}
		if envelope.Reason == "" {
			envelope.Reason = envelope.Details.Reason
		}
		if info.RequestID == "" {
			info.RequestID = envelope.RequestID
		}
		if info.ShouldRetry == nil {
			info.ShouldRetry = envelope.ShouldRetry
		}
		if info.RetryAfter == "" && len(envelope.RetryAfter) > 0 {
			info.RetryAfter = strings.Trim(string(envelope.RetryAfter), "\"")
		}
		return nil, nil, &BeeOSAPIError{HTTPStatus: response.StatusCode, Code: envelope.Code, Message: envelope.Message, Reason: envelope.Reason, RequestID: info.RequestID, RetryAfter: info.RetryAfter, ShouldRetry: info.ShouldRetry, RawEnvelope: raw, Headers: info, Acceptance: operation.acceptance}
	}
	return response, cancel, nil
}

type cancellingReader struct {
	io.ReadCloser
	cancel context.CancelFunc
}

func (reader *cancellingReader) Close() error {
	err := reader.ReadCloser.Close()
	reader.cancel()
	return err
}
func requestNative[T any](client *Client, op nativeOperation, path map[string]string, body any, wire map[string]any, options RequestOptions, operation *operationContext) (BeeOSHTTPResponse[T], error) {
	result := BeeOSHTTPResponse[T]{}
	response, cancel, err := makeRequest(operation.ctx, client, op, path, body, wire, options, operation)
	if err != nil {
		return result, err
	}
	result.Status = response.StatusCode
	result.Headers = readHeaders(response.Header)
	result.Acceptance = operation.acceptance
	if op.ResponseType == "bytes" {
		value, ok := any(&cancellingReader{ReadCloser: response.Body, cancel: cancel}).(T)
		if !ok {
			response.Body.Close()
			cancel()
			return result, fmt.Errorf("invalid binary response type")
		}
		result.Body = value
		return result, nil
	}
	defer cancel()
	defer response.Body.Close()
	var encoded []byte
	if response.StatusCode != 204 {
		encoded, err = io.ReadAll(response.Body)
		if err != nil {
			if response.Request.Context().Err() != nil {
				return result, localError(operation, err, true)
			}
			return result, err
		}
		if err = json.Unmarshal(encoded, &result.Body); err != nil {
			return result, err
		}
	}
	if operation.acceptance != nil && operation.acceptance.Status == nil {
		var resource struct {
			Data struct {
				ID      string `json:"id"`
				Receipt struct {
					ReceiptID string `json:"receipt_id"`
				} `json:"receipt"`
			} `json:"data"`
		}
		_ = json.Unmarshal(encoded, &resource)
		operation.acceptance.Status = Pointer(result.Status)
		if resource.Data.ID != "" {
			operation.acceptance.ResourceID = Pointer(resource.Data.ID)
		} else if resource.Data.Receipt.ReceiptID != "" {
			operation.acceptance.ResourceID = Pointer(resource.Data.Receipt.ReceiptID)
		}
		operation.acceptance.ETag = result.Headers.ETag
		operation.acceptance.RequestID = result.Headers.RequestID
	}
	operation.last = &BeeOSHTTPResponse[json.RawMessage]{Status: result.Status, Body: encoded, Headers: result.Headers, Acceptance: operation.acceptance}
	return result, nil
}
func retryDuration(value string, fallback float64) time.Duration {
	if seconds, err := strconv.ParseFloat(value, 64); err == nil && seconds >= 0 {
		return time.Duration(seconds * float64(time.Second))
	}
	if at, err := http.ParseTime(value); err == nil {
		duration := time.Until(at)
		if duration < 0 {
			return 0
		}
		return duration
	}
	if fallback == 0 {
		fallback = .25
	}
	return time.Duration(fallback * float64(time.Second))
}
func waitNative(operation *operationContext, duration time.Duration) error {
	timer := time.NewTimer(duration)
	defer timer.Stop()
	select {
	case <-timer.C:
		return nil
	case <-operation.ctx.Done():
		return localError(operation, operation.ctx.Err(), false)
	}
}
func callNative[T any](ctx context.Context, client *Client, op nativeOperation, path map[string]string, body any, wire map[string]any, options RequestOptions) (BeeOSHTTPResponse[T], error) {
	operation, err := newOperationContext(ctx, op, options)
	if err != nil {
		return BeeOSHTTPResponse[T]{}, err
	}
	defer operation.cancel()
	result, err := requestNative[T](client, op, path, body, wire, options, operation)
	if err != nil {
		return result, err
	}
	if !op.Wait || (options.Wait != nil && !*options.Wait) {
		return result, nil
	}
	var expectedRevision string
	var expectedTarget string
	var previous string
	if agent, ok := any(result.Body).(NativeAgentResult); ok {
		expectedRevision = string(agent.Data.Publication.AcceptedConfigRevision)
		if agent.Data.Configuration.Target.BeeosManagedTarget != nil {
			expectedTarget = string(agent.Data.Configuration.Target.BeeosManagedTarget.SandboxID)
		}
	}
	for {
		if operation.ctx.Err() != nil {
			return result, localError(operation, operation.ctx.Err(), false)
		}
		observation := fmt.Sprint(result.Status) + result.Headers.ETag + string(operation.last.Body)
		if previous != observation {
			previous = observation
			if options.OnProgress != nil {
				options.OnProgress(*operation.last)
			}
		}
		var poll nativeOperation
		var args map[string]string
		done := false
		switch value := any(result.Body).(type) {
		case SandboxResult:
			if value.Data.Status == "running" {
				done = true
			} else if value.Data.Status == "error" || value.Data.Status == "unknown" {
				return result, &SDKOperationFailed{&SDKWaitTimeout{Message: "Sandbox preparation requires inspection", Acceptance: operation.acceptance, LastResponse: operation.last}}
			}
			poll = nativeOperations["getSandbox"]
			args = map[string]string{"sandbox_id": string(value.Data.ID)}
		case NativeAgentResult:
			publication := value.Data.Publication
			if string(value.Data.DesiredConfigRevision) != expectedRevision || string(publication.AcceptedConfigRevision) != expectedRevision || publication.State == "superseded" {
				return result, &SDKPublicationSuperseded{&SDKWaitTimeout{Message: "Agent publication was superseded", Acceptance: operation.acceptance, LastResponse: operation.last}}
			}
			if publication.State == "deferred" || value.Data.Configuration.Target.BeeosRecipeTarget != nil || len(publication.ChangedComponents) == 0 {
				done = true
			}
			if publication.State == "failed" || publication.State == "partial" || publication.State == "unknown" {
				return result, &SDKOperationFailed{&SDKWaitTimeout{Message: "Agent publication requires inspection", Acceptance: operation.acceptance, LastResponse: operation.last}}
			}
			// publication.ready is the producer's current target/control/fence/credential-receipt verdict.
			// An unchanged valid credential injection may retain an older activation revision.
			if publication.State == "ready" && value.Data.Binding != nil && value.Data.Binding.PreparedConfigRevision != nil && string(*value.Data.Binding.PreparedConfigRevision) == expectedRevision && expectedTarget != "" && string(value.Data.Binding.SandboxID) == expectedTarget {
				done = true
			}
			poll = nativeOperations["getNativeAgent"]
			args = map[string]string{"agent_id": string(value.Data.ID)}
		case CommandResultEnvelope:
			done = value.Data.State == "completed" || value.Data.State == "unknown"
			poll = nativeOperations["getSandboxCommand"]
			args = map[string]string{"sandbox_id": path["sandbox_id"], "command_id": string(value.Data.ID)}
		case NativeMemoryReceiptResult:
			receipt := value.Data.Receipt
			done = (value.Data.Completion == "durable" || value.Data.Completion == "recallable") && (receipt.Disposition == "committed" || receipt.Disposition == "duplicate") && receipt.CommittedAt != nil && receipt.ReadWatermark != nil
			if value.Data.Completion == "failed" || value.Data.Completion == "blocked" || value.Data.Completion == "unknown" {
				return result, &SDKOperationFailed{&SDKWaitTimeout{Message: "Memory durability requires inspection", Acceptance: operation.acceptance, LastResponse: operation.last}}
			}
			poll = nativeOperations["getNativeMemoryReceipt"]
			args = map[string]string{"agent_id": path["agent_id"], "receipt_id": string(receipt.ReceiptID)}
		default:
			return result, fmt.Errorf("unsupported native wait response %T", result.Body)
		}
		if done {
			return result, nil
		}
		if err = waitNative(operation, retryDuration(result.Headers.RetryAfter, options.PollIntervalSeconds)); err != nil {
			return result, err
		}
		for {
			result, err = requestNative[T](client, poll, args, nil, nil, options, operation)
			if err == nil {
				break
			}
			var apiError *BeeOSAPIError
			if !errors.As(err, &apiError) || apiError.ShouldRetry == nil || !*apiError.ShouldRetry || apiError.HTTPStatus == 401 || apiError.HTTPStatus == 403 || apiError.HTTPStatus == 409 || apiError.HTTPStatus == 412 {
				return result, err
			}
			if err = waitNative(operation, retryDuration(apiError.RetryAfter, options.PollIntervalSeconds)); err != nil {
				return result, err
			}
		}
	}
}
func matchesNativeVariant(data []byte, kind string, required, allowed []string, constants string) bool {
	trimmed := bytes.TrimSpace(data)
	if len(trimmed) == 0 {
		return false
	}
	switch kind {
	case "object":
		if trimmed[0] != '{' {
			return false
		}
	case "array":
		return trimmed[0] == '['
	case "string":
		return trimmed[0] == '"'
	case "null":
		return string(trimmed) == "null"
	case "boolean":
		return string(trimmed) == "true" || string(trimmed) == "false"
	}
	var object map[string]json.RawMessage
	if err := json.Unmarshal(data, &object); err != nil {
		return false
	}
	for _, field := range required {
		if _, ok := object[field]; !ok {
			return false
		}
	}
	if allowed != nil {
		for field := range object {
			found := false
			for _, name := range allowed {
				if name == field {
					found = true
					break
				}
			}
			if !found {
				return false
			}
		}
	}
	var expected map[string]json.RawMessage
	_ = json.Unmarshal([]byte(constants), &expected)
	for field, value := range expected {
		if actual, present := object[field]; present && !bytes.Equal(bytes.TrimSpace(actual), value) {
			return false
		}
	}
	return true
}

type CreateSandboxOptions struct {
	RequestOptions
}
type ListSandboxesOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
	Status *string
	Label  []string
}
type GetSandboxOptions struct {
	RequestOptions
}
type PatchSandboxOptions struct {
	RequestOptions
	IfMatch string
}
type TerminateSandboxOptions struct {
	RequestOptions
	IfMatch string
}
type PauseSandboxOptions struct {
	RequestOptions
	IfMatch string
}
type ResumeSandboxOptions struct {
	RequestOptions
	IfMatch string
}
type ListSandboxTemplatesOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
}
type GetSandboxTemplateOptions struct {
	RequestOptions
}
type CreateSandboxAccessTicketOptions struct {
	RequestOptions
}
type RevokeSandboxAccessTicketOptions struct {
	RequestOptions
	IfMatch string
}
type RunSandboxCommandOptions struct {
	RequestOptions
}
type GetSandboxCommandOptions struct {
	RequestOptions
}
type CancelSandboxCommandOptions struct {
	RequestOptions
}
type StreamSandboxCommandEventsOptions struct {
	RequestOptions
	LastEventID *string
}
type WriteSandboxFileOptions struct {
	RequestOptions
	Path          string
	ContentLength int64
	ContentSHA256 string
	IfMatch       *string
	IfNoneMatch   *string
}
type ReadSandboxFileOptions struct {
	RequestOptions
	Path    string
	IfMatch *string
}
type DownloadCommandArtifactOptions struct {
	RequestOptions
}
type CreateNativeAgentOptions struct {
	RequestOptions
}
type ListNativeAgentsOptions struct {
	RequestOptions
	Limit      *int64
	Cursor     *string
	EndUserRef *EndUserRef
}
type GetNativeAgentOptions struct {
	RequestOptions
}
type UpdateNativeAgentOptions struct {
	RequestOptions
	IfMatch string
}
type DeleteNativeAgentOptions struct {
	RequestOptions
}
type ListNativeAgentModelsOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
}
type GetNativeAgentSkillFilesOptions struct {
	RequestOptions
}
type RevokeNativeAgentAuthorizationsOptions struct {
	RequestOptions
}
type ListNativeModelsOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
}
type CreateNativeSessionOptions struct {
	RequestOptions
}
type ListNativeSessionsOptions struct {
	RequestOptions
	Limit      *int64
	Cursor     *string
	AgentID    *NativeAgentID
	Order      *string
	State      *string
	EndUserRef *EndUserRef
}
type GetNativeSessionOptions struct {
	RequestOptions
}
type UpdateNativeSessionOptions struct {
	RequestOptions
	IfMatch string
}
type DeleteNativeSessionOptions struct {
	RequestOptions
}
type ListNativeSessionFilesOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
}
type ListNativeSessionResponsesOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
	Order  *string
}
type CreateNativeResponseOptions struct {
	RequestOptions
}
type GetNativeResponseOptions struct {
	RequestOptions
}
type DeleteNativeResponseOptions struct {
	RequestOptions
}
type CancelNativeResponseOptions struct {
	RequestOptions
}
type StreamNativeResponseEventsOptions struct {
	RequestOptions
	LastEventID *string
}
type ListNativeResponseInputItemsOptions struct {
	RequestOptions
	Limit  *int64
	Cursor *string
}
type ReplyNativeInteractionOptions struct {
	RequestOptions
}
type CreateNativeFileOptions struct {
	RequestOptions
	Filename      string
	MediaType     string
	ContentLength int64
	ContentSHA256 string
}
type GetNativeFileOptions struct {
	RequestOptions
}
type DeleteNativeFileOptions struct {
	RequestOptions
}
type DownloadNativeFileOptions struct {
	RequestOptions
}
type GetNativeCapabilitiesOptions struct {
	RequestOptions
}
type RememberNativeMemoryOptions struct {
	RequestOptions
}
type RecallNativeMemoryOptions struct {
	RequestOptions
}
type CorrectNativeMemoryOptions struct {
	RequestOptions
}
type ForgetNativeMemoryOptions struct {
	RequestOptions
}
type GetNativeMemoryReceiptOptions struct {
	RequestOptions
}
type GetNativeSessionCanvasOptions struct {
	RequestOptions
}
type CreateNativeCanvasTicketOptions struct {
	RequestOptions
}
type GetNativeCanvasShareOptions struct {
	RequestOptions
}
type CreateNativeCanvasShareOptions struct {
	RequestOptions
}
type DeleteNativeCanvasShareOptions struct {
	RequestOptions
}
type ListNativeCanvasSnapshotsOptions struct {
	RequestOptions
}
type RestoreNativeCanvasSnapshotOptions struct {
	RequestOptions
}

var nativeOperations = map[string]nativeOperation{
	"createSandbox":                   {ID: "createSandbox", Method: "POST", Path: "/v1/sandboxes", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{}},
	"listSandboxes":                   {ID: "listSandboxes", Method: "GET", Path: "/v1/sandboxes", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}, {Name: "status", In: "query", Required: false}, {Name: "label", In: "query", Required: false}}},
	"getSandbox":                      {ID: "getSandbox", Method: "GET", Path: "/v1/sandboxes/{sandbox_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"patchSandbox":                    {ID: "patchSandbox", Method: "PATCH", Path: "/v1/sandboxes/{sandbox_id}", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"terminateSandbox":                {ID: "terminateSandbox", Method: "POST", Path: "/v1/sandboxes/{sandbox_id}/terminate", ContentType: "", ResponseType: "void", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"pauseSandbox":                    {ID: "pauseSandbox", Method: "POST", Path: "/v1/sandboxes/{sandbox_id}/pause", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"resumeSandbox":                   {ID: "resumeSandbox", Method: "POST", Path: "/v1/sandboxes/{sandbox_id}/resume", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"listSandboxTemplates":            {ID: "listSandboxTemplates", Method: "GET", Path: "/v1/sandbox-templates", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	"getSandboxTemplate":              {ID: "getSandboxTemplate", Method: "GET", Path: "/v1/sandbox-templates/{template_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"createSandboxAccessTicket":       {ID: "createSandboxAccessTicket", Method: "POST", Path: "/v1/sandboxes/{sandbox_id}/access-tickets", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"revokeSandboxAccessTicket":       {ID: "revokeSandboxAccessTicket", Method: "DELETE", Path: "/v1/sandboxes/{sandbox_id}/access-tickets/{ticket_id}", ContentType: "", ResponseType: "void", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"runSandboxCommand":               {ID: "runSandboxCommand", Method: "POST", Path: "/v1/sandboxes/{sandbox_id}/commands", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{}},
	"getSandboxCommand":               {ID: "getSandboxCommand", Method: "GET", Path: "/v1/sandboxes/{sandbox_id}/commands/{command_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"cancelSandboxCommand":            {ID: "cancelSandboxCommand", Method: "POST", Path: "/v1/sandboxes/{sandbox_id}/commands/{command_id}/cancel", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"streamSandboxCommandEvents":      {ID: "streamSandboxCommandEvents", Method: "GET", Path: "/v1/sandboxes/{sandbox_id}/commands/{command_id}/events", ContentType: "", ResponseType: "sse", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "Last-Event-ID", In: "header", Required: false}}},
	"writeSandboxFile":                {ID: "writeSandboxFile", Method: "PUT", Path: "/v1/sandboxes/{sandbox_id}/files", ContentType: "application/octet-stream", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "path", In: "query", Required: true}, {Name: "Content-Length", In: "header", Required: true}, {Name: "Content-SHA256", In: "header", Required: true}, {Name: "If-Match", In: "header", Required: false}, {Name: "If-None-Match", In: "header", Required: false}}},
	"readSandboxFile":                 {ID: "readSandboxFile", Method: "GET", Path: "/v1/sandboxes/{sandbox_id}/files", ContentType: "", ResponseType: "bytes", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "path", In: "query", Required: true}, {Name: "If-Match", In: "header", Required: false}}},
	"downloadCommandArtifact":         {ID: "downloadCommandArtifact", Method: "GET", Path: "/v1/sandboxes/{sandbox_id}/commands/{command_id}/artifacts/{artifact_id}", ContentType: "", ResponseType: "bytes", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"createNativeAgent":               {ID: "createNativeAgent", Method: "POST", Path: "/v2/agents", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{}},
	"listNativeAgents":                {ID: "listNativeAgents", Method: "GET", Path: "/v2/agents", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}, {Name: "end_user_ref", In: "query", Required: false}}},
	"getNativeAgent":                  {ID: "getNativeAgent", Method: "GET", Path: "/v2/agents/{agent_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"updateNativeAgent":               {ID: "updateNativeAgent", Method: "PATCH", Path: "/v2/agents/{agent_id}", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"deleteNativeAgent":               {ID: "deleteNativeAgent", Method: "DELETE", Path: "/v2/agents/{agent_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"listNativeAgentModels":           {ID: "listNativeAgentModels", Method: "GET", Path: "/v2/agents/{agent_id}/models", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	"getNativeAgentSkillFiles":        {ID: "getNativeAgentSkillFiles", Method: "GET", Path: "/v2/agents/{agent_id}/skills/{skill_id}/files", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"revokeNativeAgentAuthorizations": {ID: "revokeNativeAgentAuthorizations", Method: "POST", Path: "/v2/agents/{agent_id}/authorizations/revoke", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"listNativeModels":                {ID: "listNativeModels", Method: "GET", Path: "/v2/models", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	"createNativeSession":             {ID: "createNativeSession", Method: "POST", Path: "/v2/sessions", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"listNativeSessions":              {ID: "listNativeSessions", Method: "GET", Path: "/v2/sessions", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}, {Name: "agent_id", In: "query", Required: false}, {Name: "order", In: "query", Required: false}, {Name: "state", In: "query", Required: false}, {Name: "end_user_ref", In: "query", Required: false}}},
	"getNativeSession":                {ID: "getNativeSession", Method: "GET", Path: "/v2/sessions/{session_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"updateNativeSession":             {ID: "updateNativeSession", Method: "PATCH", Path: "/v2/sessions/{session_id}", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "If-Match", In: "header", Required: true}}},
	"deleteNativeSession":             {ID: "deleteNativeSession", Method: "DELETE", Path: "/v2/sessions/{session_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"listNativeSessionFiles":          {ID: "listNativeSessionFiles", Method: "GET", Path: "/v2/sessions/{session_id}/files", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	"listNativeSessionResponses":      {ID: "listNativeSessionResponses", Method: "GET", Path: "/v2/sessions/{session_id}/responses", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}, {Name: "order", In: "query", Required: false}}},
	"createNativeResponse":            {ID: "createNativeResponse", Method: "POST", Path: "/v2/responses", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"getNativeResponse":               {ID: "getNativeResponse", Method: "GET", Path: "/v2/responses/{response_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"deleteNativeResponse":            {ID: "deleteNativeResponse", Method: "DELETE", Path: "/v2/responses/{response_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"cancelNativeResponse":            {ID: "cancelNativeResponse", Method: "POST", Path: "/v2/responses/{response_id}/cancel", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"streamNativeResponseEvents":      {ID: "streamNativeResponseEvents", Method: "GET", Path: "/v2/responses/{response_id}/events", ContentType: "", ResponseType: "sse", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "Last-Event-ID", In: "header", Required: false}}},
	"listNativeResponseInputItems":    {ID: "listNativeResponseInputItems", Method: "GET", Path: "/v2/responses/{response_id}/input-items", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	"replyNativeInteraction":          {ID: "replyNativeInteraction", Method: "POST", Path: "/v2/responses/{response_id}/interactions/{interaction_id}/reply", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"createNativeFile":                {ID: "createNativeFile", Method: "POST", Path: "/v2/files", ContentType: "application/octet-stream", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{{Name: "filename", In: "query", Required: true}, {Name: "media_type", In: "query", Required: true}, {Name: "Content-Length", In: "header", Required: true}, {Name: "Content-SHA256", In: "header", Required: true}}},
	"getNativeFile":                   {ID: "getNativeFile", Method: "GET", Path: "/v2/files/{file_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"deleteNativeFile":                {ID: "deleteNativeFile", Method: "DELETE", Path: "/v2/files/{file_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"downloadNativeFile":              {ID: "downloadNativeFile", Method: "GET", Path: "/v2/files/{file_id}/content", ContentType: "", ResponseType: "bytes", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"getNativeCapabilities":           {ID: "getNativeCapabilities", Method: "GET", Path: "/v2/capabilities", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"rememberNativeMemory":            {ID: "rememberNativeMemory", Method: "POST", Path: "/v2/agents/{agent_id}/memory/remember", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{}},
	"recallNativeMemory":              {ID: "recallNativeMemory", Method: "POST", Path: "/v2/agents/{agent_id}/memory/recall", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"correctNativeMemory":             {ID: "correctNativeMemory", Method: "POST", Path: "/v2/agents/{agent_id}/memory/records/{record_id}/correct", ContentType: "application/json", ResponseType: "json", Wait: true, Keyed: true, Parameters: []nativeParameter{}},
	"forgetNativeMemory":              {ID: "forgetNativeMemory", Method: "POST", Path: "/v2/agents/{agent_id}/memory/records/{record_id}/forget", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"getNativeMemoryReceipt":          {ID: "getNativeMemoryReceipt", Method: "GET", Path: "/v2/agents/{agent_id}/memory/receipts/{receipt_id}", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"getNativeSessionCanvas":          {ID: "getNativeSessionCanvas", Method: "GET", Path: "/v2/sessions/{session_id}/canvas", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"createNativeCanvasTicket":        {ID: "createNativeCanvasTicket", Method: "POST", Path: "/v2/sessions/{session_id}/canvas-tickets", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
	"getNativeCanvasShare":            {ID: "getNativeCanvasShare", Method: "GET", Path: "/v2/canvases/{canvas_id}/share", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"createNativeCanvasShare":         {ID: "createNativeCanvasShare", Method: "POST", Path: "/v2/canvases/{canvas_id}/share", ContentType: "application/json", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"deleteNativeCanvasShare":         {ID: "deleteNativeCanvasShare", Method: "DELETE", Path: "/v2/canvases/{canvas_id}/share", ContentType: "", ResponseType: "void", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"listNativeCanvasSnapshots":       {ID: "listNativeCanvasSnapshots", Method: "GET", Path: "/v2/canvases/{canvas_id}/snapshots", ContentType: "", ResponseType: "json", Wait: false, Keyed: false, Parameters: []nativeParameter{}},
	"restoreNativeCanvasSnapshot":     {ID: "restoreNativeCanvasSnapshot", Method: "POST", Path: "/v2/canvases/{canvas_id}/snapshots/{snapshot_id}/restore", ContentType: "", ResponseType: "json", Wait: false, Keyed: true, Parameters: []nativeParameter{}},
}

type SandboxesService struct {
	client   *Client
	Commands *SandboxesCommandsService
	Files    *SandboxesFilesService
	Pty      *SandboxesPtyService
	Desktop  *SandboxesDesktopService
}

func newSandboxesService(client *Client) *SandboxesService {
	service := &SandboxesService{client: client}
	service.Commands = newSandboxesCommandsService(client)
	service.Files = newSandboxesFilesService(client)
	service.Pty = newSandboxesPtyService(client)
	service.Desktop = newSandboxesDesktopService(client)
	return service
}

func (service *SandboxesService) Create(ctx context.Context, body SandboxCreate, options CreateSandboxOptions) (BeeOSHTTPResponse[SandboxResult], error) {
	return callNative[SandboxResult](ctx, service.client, nativeOperations["createSandbox"], map[string]string{}, body, map[string]any{}, options.RequestOptions)
}

func (service *SandboxesService) List(ctx context.Context, options ListSandboxesOptions) (BeeOSHTTPResponse[SandboxPage], error) {
	return callNative[SandboxPage](ctx, service.client, nativeOperations["listSandboxes"], map[string]string{}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor, "status": options.Status, "label": options.Label}, options.RequestOptions)
}

func (service *SandboxesService) Get(ctx context.Context, sandboxId string, options GetSandboxOptions) (BeeOSHTTPResponse[SandboxGetResult], error) {
	return callNative[SandboxGetResult](ctx, service.client, nativeOperations["getSandbox"], map[string]string{"sandbox_id": sandboxId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *SandboxesService) Update(ctx context.Context, sandboxId string, body SandboxPatch, options PatchSandboxOptions) (BeeOSHTTPResponse[SandboxGetResult], error) {
	return callNative[SandboxGetResult](ctx, service.client, nativeOperations["patchSandbox"], map[string]string{"sandbox_id": sandboxId}, body, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

func (service *SandboxesService) Terminate(ctx context.Context, sandboxId string, options TerminateSandboxOptions) (BeeOSHTTPResponse[struct{}], error) {
	return callNative[struct{}](ctx, service.client, nativeOperations["terminateSandbox"], map[string]string{"sandbox_id": sandboxId}, nil, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

func (service *SandboxesService) Pause(ctx context.Context, sandboxId string, body PauseRequest, options PauseSandboxOptions) (BeeOSHTTPResponse[SandboxResult], error) {
	return callNative[SandboxResult](ctx, service.client, nativeOperations["pauseSandbox"], map[string]string{"sandbox_id": sandboxId}, body, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

func (service *SandboxesService) Resume(ctx context.Context, sandboxId string, body ResumeRequest, options ResumeSandboxOptions) (BeeOSHTTPResponse[SandboxResult], error) {
	return callNative[SandboxResult](ctx, service.client, nativeOperations["resumeSandbox"], map[string]string{"sandbox_id": sandboxId}, body, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

type TemplatesService struct {
	client *Client
}

func newTemplatesService(client *Client) *TemplatesService {
	service := &TemplatesService{client: client}

	return service
}

func (service *TemplatesService) List(ctx context.Context, options ListSandboxTemplatesOptions) (BeeOSHTTPResponse[TemplatePage], error) {
	return callNative[TemplatePage](ctx, service.client, nativeOperations["listSandboxTemplates"], map[string]string{}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor}, options.RequestOptions)
}

func (service *TemplatesService) Get(ctx context.Context, templateId string, options GetSandboxTemplateOptions) (BeeOSHTTPResponse[TemplateResult], error) {
	return callNative[TemplateResult](ctx, service.client, nativeOperations["getSandboxTemplate"], map[string]string{"template_id": templateId}, nil, map[string]any{}, options.RequestOptions)
}

type AccessTicketsService struct {
	client *Client
}

func newAccessTicketsService(client *Client) *AccessTicketsService {
	service := &AccessTicketsService{client: client}

	return service
}

func (service *AccessTicketsService) Create(ctx context.Context, sandboxId string, body AccessTicketCreate, options CreateSandboxAccessTicketOptions) (BeeOSHTTPResponse[AccessTicketResult], error) {
	return callNative[AccessTicketResult](ctx, service.client, nativeOperations["createSandboxAccessTicket"], map[string]string{"sandbox_id": sandboxId}, body, map[string]any{}, options.RequestOptions)
}

func (service *AccessTicketsService) Revoke(ctx context.Context, sandboxId string, ticketId string, options RevokeSandboxAccessTicketOptions) (BeeOSHTTPResponse[struct{}], error) {
	return callNative[struct{}](ctx, service.client, nativeOperations["revokeSandboxAccessTicket"], map[string]string{"sandbox_id": sandboxId, "ticket_id": ticketId}, nil, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

type SandboxesCommandsService struct {
	client    *Client
	Artifacts *SandboxesCommandsArtifactsService
}

func newSandboxesCommandsService(client *Client) *SandboxesCommandsService {
	service := &SandboxesCommandsService{client: client}
	service.Artifacts = newSandboxesCommandsArtifactsService(client)
	return service
}

func (service *SandboxesCommandsService) Run(ctx context.Context, sandboxId string, body CommandCreate, options RunSandboxCommandOptions) (BeeOSHTTPResponse[CommandResultEnvelope], error) {
	return callNative[CommandResultEnvelope](ctx, service.client, nativeOperations["runSandboxCommand"], map[string]string{"sandbox_id": sandboxId}, body, map[string]any{}, options.RequestOptions)
}

func (service *SandboxesCommandsService) Get(ctx context.Context, sandboxId string, commandId string, options GetSandboxCommandOptions) (BeeOSHTTPResponse[CommandResultEnvelope], error) {
	return callNative[CommandResultEnvelope](ctx, service.client, nativeOperations["getSandboxCommand"], map[string]string{"sandbox_id": sandboxId, "command_id": commandId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *SandboxesCommandsService) Cancel(ctx context.Context, sandboxId string, commandId string, options CancelSandboxCommandOptions) (BeeOSHTTPResponse[CommandResultEnvelope], error) {
	return callNative[CommandResultEnvelope](ctx, service.client, nativeOperations["cancelSandboxCommand"], map[string]string{"sandbox_id": sandboxId, "command_id": commandId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *SandboxesCommandsService) Events(ctx context.Context, sandboxId string, commandId string, options StreamSandboxCommandEventsOptions) (*EventStream[CommandEvent], error) {
	return openEventStream[CommandEvent](ctx, service.client, nativeOperations["streamSandboxCommandEvents"], map[string]string{"sandbox_id": sandboxId, "command_id": commandId}, map[string]any{"Last-Event-ID": options.LastEventID}, options.RequestOptions)
}

type SandboxesFilesService struct {
	client *Client
}

func newSandboxesFilesService(client *Client) *SandboxesFilesService {
	service := &SandboxesFilesService{client: client}

	return service
}

func (service *SandboxesFilesService) Write(ctx context.Context, sandboxId string, body io.Reader, options WriteSandboxFileOptions) (BeeOSHTTPResponse[FileWriteResultResult], error) {
	return callNative[FileWriteResultResult](ctx, service.client, nativeOperations["writeSandboxFile"], map[string]string{"sandbox_id": sandboxId}, body, map[string]any{"path": options.Path, "Content-Length": options.ContentLength, "Content-SHA256": options.ContentSHA256, "If-Match": options.IfMatch, "If-None-Match": options.IfNoneMatch}, options.RequestOptions)
}

func (service *SandboxesFilesService) Read(ctx context.Context, sandboxId string, options ReadSandboxFileOptions) (BeeOSHTTPResponse[io.ReadCloser], error) {
	return callNative[io.ReadCloser](ctx, service.client, nativeOperations["readSandboxFile"], map[string]string{"sandbox_id": sandboxId}, nil, map[string]any{"path": options.Path, "If-Match": options.IfMatch}, options.RequestOptions)
}

type SandboxesCommandsArtifactsService struct {
	client *Client
}

func newSandboxesCommandsArtifactsService(client *Client) *SandboxesCommandsArtifactsService {
	service := &SandboxesCommandsArtifactsService{client: client}

	return service
}

func (service *SandboxesCommandsArtifactsService) Download(ctx context.Context, sandboxId string, commandId string, artifactId string, options DownloadCommandArtifactOptions) (BeeOSHTTPResponse[io.ReadCloser], error) {
	return callNative[io.ReadCloser](ctx, service.client, nativeOperations["downloadCommandArtifact"], map[string]string{"sandbox_id": sandboxId, "command_id": commandId, "artifact_id": artifactId}, nil, map[string]any{}, options.RequestOptions)
}

type AgentsService struct {
	client *Client
	Memory *AgentsMemoryService
}

func newAgentsService(client *Client) *AgentsService {
	service := &AgentsService{client: client}
	service.Memory = newAgentsMemoryService(client)
	return service
}

func (service *AgentsService) Create(ctx context.Context, body NativeAgentCreate, options CreateNativeAgentOptions) (BeeOSHTTPResponse[NativeAgentResult], error) {
	return callNative[NativeAgentResult](ctx, service.client, nativeOperations["createNativeAgent"], map[string]string{}, body, map[string]any{}, options.RequestOptions)
}

func (service *AgentsService) List(ctx context.Context, options ListNativeAgentsOptions) (BeeOSHTTPResponse[NativeAgentPage], error) {
	return callNative[NativeAgentPage](ctx, service.client, nativeOperations["listNativeAgents"], map[string]string{}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor, "end_user_ref": options.EndUserRef}, options.RequestOptions)
}

func (service *AgentsService) Get(ctx context.Context, agentId string, options GetNativeAgentOptions) (BeeOSHTTPResponse[NativeAgentResult], error) {
	return callNative[NativeAgentResult](ctx, service.client, nativeOperations["getNativeAgent"], map[string]string{"agent_id": agentId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *AgentsService) Update(ctx context.Context, agentId string, body NativeAgentPatch, options UpdateNativeAgentOptions) (BeeOSHTTPResponse[NativeAgentResult], error) {
	return callNative[NativeAgentResult](ctx, service.client, nativeOperations["updateNativeAgent"], map[string]string{"agent_id": agentId}, body, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

func (service *AgentsService) Delete(ctx context.Context, agentId string, options DeleteNativeAgentOptions) (BeeOSHTTPResponse[DeletedResultResult], error) {
	return callNative[DeletedResultResult](ctx, service.client, nativeOperations["deleteNativeAgent"], map[string]string{"agent_id": agentId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *AgentsService) ListModels(ctx context.Context, agentId string, options ListNativeAgentModelsOptions) (BeeOSHTTPResponse[ModelAvailabilityPage], error) {
	return callNative[ModelAvailabilityPage](ctx, service.client, nativeOperations["listNativeAgentModels"], map[string]string{"agent_id": agentId}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor}, options.RequestOptions)
}

func (service *AgentsService) GetSkillFiles(ctx context.Context, agentId string, skillId string, options GetNativeAgentSkillFilesOptions) (BeeOSHTTPResponse[SkillFilesResult], error) {
	return callNative[SkillFilesResult](ctx, service.client, nativeOperations["getNativeAgentSkillFiles"], map[string]string{"agent_id": agentId, "skill_id": skillId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *AgentsService) RevokeAuthorizations(ctx context.Context, agentId string, body AuthorizationRevoke, options RevokeNativeAgentAuthorizationsOptions) (BeeOSHTTPResponse[AuthorizationEnforcementResult], error) {
	return callNative[AuthorizationEnforcementResult](ctx, service.client, nativeOperations["revokeNativeAgentAuthorizations"], map[string]string{"agent_id": agentId}, body, map[string]any{}, options.RequestOptions)
}

type ModelsService struct {
	client *Client
}

func newModelsService(client *Client) *ModelsService {
	service := &ModelsService{client: client}

	return service
}

func (service *ModelsService) List(ctx context.Context, options ListNativeModelsOptions) (BeeOSHTTPResponse[ModelAvailabilityPage], error) {
	return callNative[ModelAvailabilityPage](ctx, service.client, nativeOperations["listNativeModels"], map[string]string{}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor}, options.RequestOptions)
}

type SessionsService struct {
	client *Client
	Canvas *SessionsCanvasService
}

func newSessionsService(client *Client) *SessionsService {
	service := &SessionsService{client: client}
	service.Canvas = newSessionsCanvasService(client)
	return service
}

func (service *SessionsService) Create(ctx context.Context, body NativeSessionCreate, options CreateNativeSessionOptions) (BeeOSHTTPResponse[NativeSessionResult], error) {
	return callNative[NativeSessionResult](ctx, service.client, nativeOperations["createNativeSession"], map[string]string{}, body, map[string]any{}, options.RequestOptions)
}

func (service *SessionsService) List(ctx context.Context, options ListNativeSessionsOptions) (BeeOSHTTPResponse[NativeSessionPage], error) {
	return callNative[NativeSessionPage](ctx, service.client, nativeOperations["listNativeSessions"], map[string]string{}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor, "agent_id": options.AgentID, "order": options.Order, "state": options.State, "end_user_ref": options.EndUserRef}, options.RequestOptions)
}

func (service *SessionsService) Get(ctx context.Context, sessionId string, options GetNativeSessionOptions) (BeeOSHTTPResponse[NativeSessionResult], error) {
	return callNative[NativeSessionResult](ctx, service.client, nativeOperations["getNativeSession"], map[string]string{"session_id": sessionId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *SessionsService) Update(ctx context.Context, sessionId string, body NativeSessionPatch, options UpdateNativeSessionOptions) (BeeOSHTTPResponse[NativeSessionResult], error) {
	return callNative[NativeSessionResult](ctx, service.client, nativeOperations["updateNativeSession"], map[string]string{"session_id": sessionId}, body, map[string]any{"If-Match": options.IfMatch}, options.RequestOptions)
}

func (service *SessionsService) Delete(ctx context.Context, sessionId string, options DeleteNativeSessionOptions) (BeeOSHTTPResponse[DeletedResultResult], error) {
	return callNative[DeletedResultResult](ctx, service.client, nativeOperations["deleteNativeSession"], map[string]string{"session_id": sessionId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *SessionsService) ListFiles(ctx context.Context, sessionId string, options ListNativeSessionFilesOptions) (BeeOSHTTPResponse[FileMetadataPage], error) {
	return callNative[FileMetadataPage](ctx, service.client, nativeOperations["listNativeSessionFiles"], map[string]string{"session_id": sessionId}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor}, options.RequestOptions)
}

func (service *SessionsService) ListResponses(ctx context.Context, sessionId string, options ListNativeSessionResponsesOptions) (BeeOSHTTPResponse[NativeResponsePage], error) {
	return callNative[NativeResponsePage](ctx, service.client, nativeOperations["listNativeSessionResponses"], map[string]string{"session_id": sessionId}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor, "order": options.Order}, options.RequestOptions)
}

type ResponsesService struct {
	client *Client
}

func newResponsesService(client *Client) *ResponsesService {
	service := &ResponsesService{client: client}

	return service
}

func (service *ResponsesService) Create(ctx context.Context, body NativeResponseCreate, options CreateNativeResponseOptions) (BeeOSHTTPResponse[NativeResponseResult], error) {
	return callNative[NativeResponseResult](ctx, service.client, nativeOperations["createNativeResponse"], map[string]string{}, body, map[string]any{}, options.RequestOptions)
}

func (service *ResponsesService) Get(ctx context.Context, responseId string, options GetNativeResponseOptions) (BeeOSHTTPResponse[NativeResponseResult], error) {
	return callNative[NativeResponseResult](ctx, service.client, nativeOperations["getNativeResponse"], map[string]string{"response_id": responseId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *ResponsesService) Delete(ctx context.Context, responseId string, options DeleteNativeResponseOptions) (BeeOSHTTPResponse[DeletedResultResult], error) {
	return callNative[DeletedResultResult](ctx, service.client, nativeOperations["deleteNativeResponse"], map[string]string{"response_id": responseId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *ResponsesService) Cancel(ctx context.Context, responseId string, options CancelNativeResponseOptions) (BeeOSHTTPResponse[NativeResponseResult], error) {
	return callNative[NativeResponseResult](ctx, service.client, nativeOperations["cancelNativeResponse"], map[string]string{"response_id": responseId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *ResponsesService) Events(ctx context.Context, responseId string, options StreamNativeResponseEventsOptions) (*EventStream[NativeResponseEvent], error) {
	return openEventStream[NativeResponseEvent](ctx, service.client, nativeOperations["streamNativeResponseEvents"], map[string]string{"response_id": responseId}, map[string]any{"Last-Event-ID": options.LastEventID}, options.RequestOptions)
}

func (service *ResponsesService) ListInputItems(ctx context.Context, responseId string, options ListNativeResponseInputItemsOptions) (BeeOSHTTPResponse[ResponseInputPage], error) {
	return callNative[ResponseInputPage](ctx, service.client, nativeOperations["listNativeResponseInputItems"], map[string]string{"response_id": responseId}, nil, map[string]any{"limit": options.Limit, "cursor": options.Cursor}, options.RequestOptions)
}

func (service *ResponsesService) ReplyInteraction(ctx context.Context, responseId string, interactionId string, body InteractionReply, options ReplyNativeInteractionOptions) (BeeOSHTTPResponse[InteractionReplyResultResult], error) {
	return callNative[InteractionReplyResultResult](ctx, service.client, nativeOperations["replyNativeInteraction"], map[string]string{"response_id": responseId, "interaction_id": interactionId}, body, map[string]any{}, options.RequestOptions)
}

func (service *ResponsesService) CreateStream(ctx context.Context, body NativeResponseCreate, options CreateNativeResponseOptions) (ResponseStream, error) {
	response, err := service.Create(ctx, body, options)
	result := ResponseStream{Response: response, ResponseID: string(response.Body.Data.ID)}
	if err != nil {
		return result, err
	}
	events, err := service.Events(ctx, result.ResponseID, StreamNativeResponseEventsOptions{RequestOptions: options.RequestOptions})
	result.Events = events
	return result, err
}

type FilesService struct {
	client *Client
}

func newFilesService(client *Client) *FilesService {
	service := &FilesService{client: client}

	return service
}

func (service *FilesService) Create(ctx context.Context, body io.Reader, options CreateNativeFileOptions) (BeeOSHTTPResponse[FileMetadataResult], error) {
	return callNative[FileMetadataResult](ctx, service.client, nativeOperations["createNativeFile"], map[string]string{}, body, map[string]any{"filename": options.Filename, "media_type": options.MediaType, "Content-Length": options.ContentLength, "Content-SHA256": options.ContentSHA256}, options.RequestOptions)
}

func (service *FilesService) Get(ctx context.Context, fileId string, options GetNativeFileOptions) (BeeOSHTTPResponse[FileMetadataResult], error) {
	return callNative[FileMetadataResult](ctx, service.client, nativeOperations["getNativeFile"], map[string]string{"file_id": fileId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *FilesService) Delete(ctx context.Context, fileId string, options DeleteNativeFileOptions) (BeeOSHTTPResponse[DeletedResultResult], error) {
	return callNative[DeletedResultResult](ctx, service.client, nativeOperations["deleteNativeFile"], map[string]string{"file_id": fileId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *FilesService) Download(ctx context.Context, fileId string, options DownloadNativeFileOptions) (BeeOSHTTPResponse[io.ReadCloser], error) {
	return callNative[io.ReadCloser](ctx, service.client, nativeOperations["downloadNativeFile"], map[string]string{"file_id": fileId}, nil, map[string]any{}, options.RequestOptions)
}

type CapabilitiesService struct {
	client *Client
}

func newCapabilitiesService(client *Client) *CapabilitiesService {
	service := &CapabilitiesService{client: client}

	return service
}

func (service *CapabilitiesService) Get(ctx context.Context, options GetNativeCapabilitiesOptions) (BeeOSHTTPResponse[NativeCapabilitiesResult], error) {
	return callNative[NativeCapabilitiesResult](ctx, service.client, nativeOperations["getNativeCapabilities"], map[string]string{}, nil, map[string]any{}, options.RequestOptions)
}

type AgentsMemoryService struct {
	client *Client
}

func newAgentsMemoryService(client *Client) *AgentsMemoryService {
	service := &AgentsMemoryService{client: client}

	return service
}

func (service *AgentsMemoryService) Remember(ctx context.Context, agentId string, body NativeMemoryRemember, options RememberNativeMemoryOptions) (BeeOSHTTPResponse[NativeMemoryReceiptResult], error) {
	return callNative[NativeMemoryReceiptResult](ctx, service.client, nativeOperations["rememberNativeMemory"], map[string]string{"agent_id": agentId}, body, map[string]any{}, options.RequestOptions)
}

func (service *AgentsMemoryService) Recall(ctx context.Context, agentId string, body NativeMemoryRecall, options RecallNativeMemoryOptions) (BeeOSHTTPResponse[NativeMemoryRecallResult], error) {
	return callNative[NativeMemoryRecallResult](ctx, service.client, nativeOperations["recallNativeMemory"], map[string]string{"agent_id": agentId}, body, map[string]any{}, options.RequestOptions)
}

func (service *AgentsMemoryService) Correct(ctx context.Context, agentId string, recordId string, body NativeMemoryCorrect, options CorrectNativeMemoryOptions) (BeeOSHTTPResponse[NativeMemoryReceiptResult], error) {
	return callNative[NativeMemoryReceiptResult](ctx, service.client, nativeOperations["correctNativeMemory"], map[string]string{"agent_id": agentId, "record_id": recordId}, body, map[string]any{}, options.RequestOptions)
}

func (service *AgentsMemoryService) Forget(ctx context.Context, agentId string, recordId string, body NativeMemoryForget, options ForgetNativeMemoryOptions) (BeeOSHTTPResponse[NativeMemoryReceiptResult], error) {
	return callNative[NativeMemoryReceiptResult](ctx, service.client, nativeOperations["forgetNativeMemory"], map[string]string{"agent_id": agentId, "record_id": recordId}, body, map[string]any{}, options.RequestOptions)
}

func (service *AgentsMemoryService) GetReceipt(ctx context.Context, agentId string, receiptId string, options GetNativeMemoryReceiptOptions) (BeeOSHTTPResponse[NativeMemoryReceiptResult], error) {
	return callNative[NativeMemoryReceiptResult](ctx, service.client, nativeOperations["getNativeMemoryReceipt"], map[string]string{"agent_id": agentId, "receipt_id": receiptId}, nil, map[string]any{}, options.RequestOptions)
}

type SessionsCanvasService struct {
	client *Client
}

func newSessionsCanvasService(client *Client) *SessionsCanvasService {
	service := &SessionsCanvasService{client: client}

	return service
}

func (service *SessionsCanvasService) Get(ctx context.Context, sessionId string, options GetNativeSessionCanvasOptions) (BeeOSHTTPResponse[CanvasLinkResult], error) {
	return callNative[CanvasLinkResult](ctx, service.client, nativeOperations["getNativeSessionCanvas"], map[string]string{"session_id": sessionId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *SessionsCanvasService) CreateTicket(ctx context.Context, sessionId string, body CanvasTicketCreate, options CreateNativeCanvasTicketOptions) (BeeOSHTTPResponse[CanvasTicketResult], error) {
	return callNative[CanvasTicketResult](ctx, service.client, nativeOperations["createNativeCanvasTicket"], map[string]string{"session_id": sessionId}, body, map[string]any{}, options.RequestOptions)
}

type CanvasesService struct {
	client *Client
}

func newCanvasesService(client *Client) *CanvasesService {
	service := &CanvasesService{client: client}

	return service
}

func (service *CanvasesService) GetShare(ctx context.Context, canvasId string, options GetNativeCanvasShareOptions) (BeeOSHTTPResponse[CanvasShareResult], error) {
	return callNative[CanvasShareResult](ctx, service.client, nativeOperations["getNativeCanvasShare"], map[string]string{"canvas_id": canvasId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *CanvasesService) Share(ctx context.Context, canvasId string, body CanvasShareCreate, options CreateNativeCanvasShareOptions) (BeeOSHTTPResponse[CanvasShareResult], error) {
	return callNative[CanvasShareResult](ctx, service.client, nativeOperations["createNativeCanvasShare"], map[string]string{"canvas_id": canvasId}, body, map[string]any{}, options.RequestOptions)
}

func (service *CanvasesService) Unshare(ctx context.Context, canvasId string, options DeleteNativeCanvasShareOptions) (BeeOSHTTPResponse[struct{}], error) {
	return callNative[struct{}](ctx, service.client, nativeOperations["deleteNativeCanvasShare"], map[string]string{"canvas_id": canvasId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *CanvasesService) ListSnapshots(ctx context.Context, canvasId string, options ListNativeCanvasSnapshotsOptions) (BeeOSHTTPResponse[CanvasSnapshotPage], error) {
	return callNative[CanvasSnapshotPage](ctx, service.client, nativeOperations["listNativeCanvasSnapshots"], map[string]string{"canvas_id": canvasId}, nil, map[string]any{}, options.RequestOptions)
}

func (service *CanvasesService) RestoreSnapshot(ctx context.Context, canvasId string, snapshotId string, options RestoreNativeCanvasSnapshotOptions) (BeeOSHTTPResponse[CanvasRestoreResult], error) {
	return callNative[CanvasRestoreResult](ctx, service.client, nativeOperations["restoreNativeCanvasSnapshot"], map[string]string{"canvas_id": canvasId, "snapshot_id": snapshotId}, nil, map[string]any{}, options.RequestOptions)
}

type SandboxesPtyService struct {
	client *Client
}

func newSandboxesPtyService(client *Client) *SandboxesPtyService {
	service := &SandboxesPtyService{client: client}

	return service
}

func (service *SandboxesPtyService) Connect(ctx context.Context, sandboxID string, body AccessTicketCreate, options ConnectOptions) (*SocketConnection, error) {
	body.Purpose = "pty"
	return connectNativeSocket(ctx, service.client, sandboxID, body, options)
}

type SandboxesDesktopService struct {
	client *Client
}

func newSandboxesDesktopService(client *Client) *SandboxesDesktopService {
	service := &SandboxesDesktopService{client: client}

	return service
}

func (service *SandboxesDesktopService) Connect(ctx context.Context, sandboxID string, body AccessTicketCreate, options ConnectOptions) (*SocketConnection, error) {
	body.Purpose = "desktop"
	return connectNativeSocket(ctx, service.client, sandboxID, body, options)
}
