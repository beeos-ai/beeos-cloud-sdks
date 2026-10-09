package beeoscloudsdk

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"strings"
	"testing"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }
func mockResponse(status int, body string) *http.Response {
	return &http.Response{StatusCode: status, Body: io.NopCloser(strings.NewReader(body)), Header: http.Header{"Content-Type": []string{"application/json"}}}
}
func testClient(t *testing.T, send roundTripFunc) *BeeOSClient {
	t.Helper()
	client, err := NewBeeOSClient("https://cloud.example/v1", func() string { return "provided-at-runtime" }, &http.Client{Transport: send})
	if err != nil {
		t.Fatal(err)
	}
	return client
}

func TestCreateKeepsVariantLLMAndExternalUser(t *testing.T) {
	variant, key := "variant-1", "provided-at-runtime"
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.URL.String() != "https://cloud.example/v1/instances" {
			t.Fatalf("unexpected URL %s", request.URL)
		}
		if request.Header.Get("Authorization") != "Bearer provided-at-runtime" {
			t.Fatal("authorization missing")
		}
		if request.Header.Get("X-BeeOS-External-User-ID") != "user-1" {
			t.Fatal("external user missing")
		}
		var body CreateServerInstanceInput
		if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
			t.Fatal(err)
		}
		if body.VariantID == nil || *body.VariantID != variant || body.LLM == nil || body.LLM.Providers[0].APIKey == nil || *body.LLM.Providers[0].APIKey != key {
			t.Fatal("variant or BYOK payload dropped")
		}
		return mockResponse(201, `{"data":{"id":"instance-1"},"operation":{"id":"op-1","kind":"create","phase":"queued"}}`), nil
	}).WithExternalUser("user-1")
	result, err := client.Instances.Create(context.Background(), CreateServerInstanceInput{Name: "example", VariantID: &variant, LLM: &RuntimeLLM{Providers: []RuntimeLLMProvider{{ID: "custom", Protocol: RuntimeLLMProviderProtocolOpenai, BaseURL: "https://provider.example/v1", APIKey: &key}}, Models: []RuntimeLLMModel{}}}, InstanceCreateOptions{IdempotencyKey: "operation-1"})
	if err != nil {
		t.Fatal(err)
	}
	if result.Data.ID != "instance-1" {
		t.Fatal("typed instance response missing")
	}
}

func TestUHPHostPathAndTypedStream(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.URL.String() != "https://cloud.example/uhp/v1/responses" {
			t.Fatalf("unexpected URL %s", request.URL)
		}
		var body struct {
			Stream bool `json:"stream"`
		}
		if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
			t.Fatal(err)
		}
		if !body.Stream {
			t.Fatal("stream missing")
		}
		return mockResponse(200, "data: {\"type\":\"response.created\",\"sequence_number\":0}\r\n\r\ndata: {\"type\":\"response.completed\",\"sequence_number\":1}\n\n"), nil
	})
	input := "hello"
	stream, err := client.Responses.CreateStream(context.Background(), UHPCreateResponseJSONRequest{Input: UHPCreateResponseJSONRequestInput{Variant1: &input}}, CreateResponseOptions{})
	if err != nil {
		t.Fatal(err)
	}
	defer stream.Close()
	for sequence := int64(0); sequence < 2; sequence++ {
		event, err := stream.Next()
		if err != nil || event.SequenceNumber != sequence {
			t.Fatalf("unexpected event %#v: %v", event, err)
		}
	}
	if _, err := stream.Next(); err != io.EOF {
		t.Fatalf("expected EOF, got %v", err)
	}
}

func TestTypedUHPError(t *testing.T) {
	client := testClient(t, func(*http.Request) (*http.Response, error) {
		return mockResponse(404, `{"error":{"code":"not_found","message":"missing"}}`), nil
	})
	_, err := client.Responses.Get(context.Background(), "response-1")
	var apiError *APIError
	if !errors.As(err, &apiError) || apiError.Status != 404 {
		t.Fatalf("typed API error missing: %v", err)
	}
	if _, ok := apiError.Body.(UHPErrorEnvelope); !ok {
		t.Fatalf("unexpected error body %T", apiError.Body)
	}
}

func TestMultipartFile(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		_, parameters, err := mime.ParseMediaType(request.Header.Get("Content-Type"))
		if err != nil {
			t.Fatal(err)
		}
		reader := multipart.NewReader(request.Body, parameters["boundary"])
		part, err := reader.NextPart()
		if err != nil {
			t.Fatal(err)
		}
		data, err := io.ReadAll(part)
		if err != nil || part.FormName() != "file" || string(data) != "audio-bytes" {
			t.Fatalf("multipart file missing: %v", err)
		}
		return mockResponse(200, `{"success":true,"data":{"text":"hello","duration_seconds":1.5}}`), nil
	})
	result, err := client.Audio.Transcribe(context.Background(), TranscribeAudioRequest{File: []byte("audio-bytes")})
	if err != nil || result.Data.Text != "hello" {
		t.Fatalf("unexpected transcription: %v", err)
	}
}

func TestOpenModelPreservesExtensionFields(t *testing.T) {
	var event UHPEvent
	if err := json.Unmarshal([]byte(`{"type":"response.created","sequence_number":0,"vendor_field":{"value":1}}`), &event); err != nil {
		t.Fatal(err)
	}
	if string(event.AdditionalProperties["vendor_field"]) != `{"value":1}` {
		t.Fatal("extension field discarded")
	}
	encoded, err := json.Marshal(event)
	if err != nil || !strings.Contains(string(encoded), `"vendor_field":{"value":1}`) {
		t.Fatalf("extension field not serialized: %v", err)
	}
}

func TestBooleanQueryUsesLowercase(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.URL.Query().Get("available") != "true" {
			t.Fatal("boolean query must use lowercase")
		}
		return mockResponse(200, `{"data":[]}`), nil
	})
	available := true
	if _, err := client.Catalog.ListRegions(context.Background(), ListDeployRegionsOptions{Available: &available}); err != nil {
		t.Fatal(err)
	}
}

func TestScopedClientSessionDoesNotRepeatActorInOptions(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.Header.Get("X-BeeOS-External-User-ID") != "user-1" {
			t.Fatal("scoped actor missing")
		}
		return mockResponse(201, `{}`), nil
	}).WithExternalUser("user-1")
	if _, err := client.Identity.CreateClientSession(context.Background(), ClientSessionInput{ClientType: "web", RequestedCapabilities: []string{}}, CreateClientSessionOptions{IdempotencyKey: "operation-1"}); err != nil {
		t.Fatal(err)
	}
}

type chunkReader struct {
	chunks []string
	reads  int
}

func (r *chunkReader) Read(data []byte) (int, error) {
	if len(r.chunks) == 0 {
		return 0, io.EOF
	}
	chunk := r.chunks[0]
	r.chunks = r.chunks[1:]
	r.reads++
	return copy(data, chunk), nil
}

func TestResponseEventsAreIncrementalAndTyped(t *testing.T) {
	body := &chunkReader{chunks: []string{"data: {\"type\":\"response.created\",\"sequence_number\":0}\n\n", "data: {\"type\":\"response.completed\",\"sequence_number\":1}\n\n"}}
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.URL.String() != "https://cloud.example/uhp/v1/responses/response-1/events" {
			t.Fatalf("unexpected URL %s", request.URL)
		}
		if request.Header.Get("Last-Event-ID") != "0" {
			t.Fatal("resume header missing")
		}
		return &http.Response{StatusCode: 200, Body: io.NopCloser(body), Header: http.Header{}}, nil
	})
	cursor := "0"
	stream, err := client.Responses.GetEvents(context.Background(), "response-1", GetResponseEventsOptions{LastEventID: &cursor})
	if err != nil {
		t.Fatal(err)
	}
	defer stream.Close()
	event, err := stream.Next()
	if err != nil || event.SequenceNumber != 0 || body.reads != 1 {
		t.Fatalf("event was not incremental: %v", err)
	}
}

func TestRuntimeEventsKeepV1BasePath(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.URL.String() != "https://cloud.example/v1/instances/instance-1/operations/op-1/events" {
			t.Fatalf("unexpected URL %s", request.URL)
		}
		return mockResponse(200, "data: {\"id\":\"1\",\"operationId\":\"op-1\",\"method\":\"agent.invoke\",\"event\":{\"type\":\"runtime_operation_started\",\"sequence\":\"1\",\"recordedAt\":\"2026-10-09T00:00:00Z\"}}\n\n"), nil
	})
	stream, err := client.Operations.GetEvents(context.Background(), "op-1", "instance-1", StreamRuntimeOperationEventsOptions{})
	if err != nil {
		t.Fatal(err)
	}
	defer stream.Close()
	event, err := stream.Next()
	if err != nil || event.Event.Sequence != "1" {
		t.Fatalf("runtime event decoding failed: %v", err)
	}
}

func TestRPCStringIDAndRequiredIdempotency(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if request.Header.Get("Idempotency-Key") != "operation-1" {
			t.Fatal("idempotency missing")
		}
		var input InvokeRuntimeMethodRequest
		if err := json.NewDecoder(request.Body).Decode(&input); err != nil {
			t.Fatal(err)
		}
		if input.ID != "rpc-1" {
			t.Fatal("string RPC ID missing")
		}
		return mockResponse(200, `{"jsonrpc":"2.0","id":"rpc-1","result":{}}`), nil
	})
	if _, err := client.Methods.Invoke(context.Background(), "instance-1", InvokeRuntimeMethodRequest{JSONrpc: "2.0", ID: "rpc-1", Method: "agent.invoke", Params: JSONValue(`{}`)}, InvokeRuntimeMethodOptions{IdempotencyKey: "operation-1"}); err != nil {
		t.Fatal(err)
	}
}

func TestOptionalTaskCancelBodyCanBeOmitted(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		payload, err := io.ReadAll(request.Body)
		if err != nil || len(payload) != 0 {
			t.Fatalf("optional body was not omitted: %v", err)
		}
		return mockResponse(202, `{}`), nil
	}).WithExternalUser("user-1")
	if _, err := client.Tasks.Cancel(context.Background(), "agent-1", "task-1", nil, CancelAgentTaskOptions{IdempotencyKey: "operation-1"}); err != nil {
		t.Fatal(err)
	}
}

func TestCloudAndDeviceBindingErrorShapes(t *testing.T) {
	client := testClient(t, func(request *http.Request) (*http.Response, error) {
		if strings.Contains(request.URL.Path, "bind-sessions") {
			return mockResponse(404, `{"error":"not_found","message":"missing"}`), nil
		}
		return mockResponse(400, `{"code":"bad_request","message":"bad","request_id":"request-1"}`), nil
	})
	_, err := client.Catalog.ListRegions(context.Background(), ListDeployRegionsOptions{})
	var apiError *APIError
	if !errors.As(err, &apiError) {
		t.Fatalf("API error missing: %v", err)
	}
	if body, ok := apiError.Body.(ErrorResponse); !ok || body.Code != "bad_request" {
		t.Fatalf("incorrect Cloud error: %T", apiError.Body)
	}
	_, err = client.DeviceBindings.GetPortal(context.Background(), "missing")
	if !errors.As(err, &apiError) {
		t.Fatalf("API error missing: %v", err)
	}
	if body, ok := apiError.Body.(DeviceBindingErrorResponse); !ok || body.Error != "not_found" {
		t.Fatalf("incorrect binding error: %T", apiError.Body)
	}
}

func TestPlaintextHTTPErrorKeepsStatusAndBody(t *testing.T) {
	client := testClient(t, func(*http.Request) (*http.Response, error) {
		response := mockResponse(404, "404 page not found\n")
		response.Header.Set("Content-Type", "text/plain; charset=utf-8")
		return response, nil
	})
	_, err := client.Catalog.ListRegions(context.Background(), ListDeployRegionsOptions{})
	var apiError *APIError
	if !errors.As(err, &apiError) || apiError.Status != 404 {
		t.Fatalf("status missing: %v", err)
	}
	if body, ok := apiError.Body.(HTTPErrorBody); !ok || body.Body != "404 page not found\n" || body.ContentType != "text/plain; charset=utf-8" {
		t.Fatalf("plaintext body missing: %T", apiError.Body)
	}
}

func TestMalformedJSONErrorRemainsVisible(t *testing.T) {
	client := testClient(t, func(*http.Request) (*http.Response, error) { return mockResponse(400, "not-json"), nil })
	_, err := client.Catalog.ListRegions(context.Background(), ListDeployRegionsOptions{})
	var decodeError *json.SyntaxError
	if !errors.As(err, &decodeError) {
		t.Fatalf("JSON decode failure missing: %v", err)
	}
}

func TestA2ADataPartPreservesDataVariant(t *testing.T) {
	var part A2AOutputPart
	if err := json.Unmarshal([]byte(`{"data":{"value":42}}`), &part); err != nil {
		t.Fatal(err)
	}
	if part.Variant3 == nil || part.Variant2 != nil || string(part.Variant3.Data) != `{"value":42}` {
		t.Fatalf("data part selected incorrect variant: %#v", part)
	}
	encoded, err := json.Marshal(part)
	if err != nil || !strings.Contains(string(encoded), `"data":{"value":42}`) {
		t.Fatalf("data part lost on serialization: %s: %v", encoded, err)
	}
}
