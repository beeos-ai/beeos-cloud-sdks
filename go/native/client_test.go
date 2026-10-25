package native

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"reflect"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func testClient(t *testing.T, handler http.HandlerFunc) (*Client, *httptest.Server) {
	t.Helper()
	server := httptest.NewServer(handler)
	t.Cleanup(server.Close)
	client, err := NewClient(ClientOptions{BaseURL: server.URL + "/v1/ignored", APIKey: "bsk_test"})
	if err != nil {
		t.Fatal(err)
	}
	return client, server
}
func jsonReply(writer http.ResponseWriter, status int, body string) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	fmt.Fprint(writer, body)
}
func TestAllNativeOperationsReachCanonicalRoute(t *testing.T) {
	raw, err := os.ReadFile("../../spec/native.openapi.json")
	if err != nil {
		t.Fatal(err)
	}
	var spec struct {
		Paths map[string]map[string]struct {
			OperationID string          `json:"operationId"`
			Resource    string          `json:"x-sdk-resource"`
			Method      string          `json:"x-sdk-go-method"`
			RequestBody json.RawMessage `json:"requestBody"`
		}
	}
	if err = json.Unmarshal(raw, &spec); err != nil {
		t.Fatal(err)
	}
	count := 0
	for path, item := range spec.Paths {
		for _, operation := range item {
			if operation.OperationID == "" {
				continue
			}
			t.Run(operation.OperationID, func(t *testing.T) {
				op := nativeOperations[operation.OperationID]
				var seen bool
				client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
					seen = true
					if r.Method != op.Method {
						t.Errorf("method %s", r.Method)
					}
					expected := path
					for strings.Contains(expected, "{") {
						start := strings.Index(expected, "{")
						end := strings.Index(expected, "}")
						expected = expected[:start] + "item%2Fone" + expected[end+1:]
					}
					if r.URL.EscapedPath() != expected {
						t.Errorf("path %s, want %s", r.URL.EscapedPath(), expected)
					}
					if r.Header.Get("Authorization") != "Bearer bsk_test" {
						t.Error("authorization missing")
					}
					if op.Keyed && r.Header.Get("Idempotency-Key") != "saved-key" {
						t.Error("intent key missing")
					}
					switch op.ResponseType {
					case "sse":
						w.Header().Set("Content-Type", "text/event-stream")
						fmt.Fprint(w, "id: 2\ndata: {}\n\n")
					case "bytes":
						w.Write([]byte{0, 255})
					case "void":
						w.WriteHeader(204)
					default:
						if strings.HasPrefix(op.ID, "list") {
							jsonReply(w, 200, `{"data":[]}`)
						} else {
							jsonReply(w, 200, `{"data":{"id":"resource"}}`)
						}
					}
				})
				service := reflect.ValueOf(client)
				for _, part := range strings.Split(operation.Resource, ".") {
					name := strings.ToUpper(part[:1]) + part[1:]
					if part == "accessTickets" {
						name = "AccessTickets"
					}
					service = service.Elem().FieldByName(name)
				}
				method := service.MethodByName(operation.Method)
				if !method.IsValid() {
					t.Fatalf("missing method %s.%s", operation.Resource, operation.Method)
				}
				args := []reflect.Value{reflect.ValueOf(context.Background())}
				for index := 1; index < method.Type().NumIn()-1; index++ {
					typ := method.Type().In(index)
					if typ.Kind() == reflect.String {
						args = append(args, reflect.ValueOf("item/one"))
					} else if typ.Implements(reflect.TypeFor[io.Reader]()) {
						args = append(args, reflect.ValueOf(bytes.NewReader([]byte{0, 255})))
					} else {
						body := reflect.New(typ).Elem()
						seedNativeUnions(body)
						args = append(args, body)
					}
				}
				options := reflect.New(method.Type().In(method.Type().NumIn() - 1)).Elem()
				request := options.FieldByName("RequestOptions")
				request.FieldByName("Wait").Set(reflect.ValueOf(Pointer(false)))
				request.FieldByName("IdempotencyKey").SetString("saved-key")
				for _, param := range op.Parameters {
					field := options.FieldByName(nativeOptionField(param.Name))
					if !field.IsValid() {
						t.Fatalf("missing option %s", param.Name)
					}
					switch field.Kind() {
					case reflect.String:
						field.SetString("value")
						if param.Name == "If-Match" {
							field.SetString(`"7"`)
						}
					case reflect.Int64:
						field.SetInt(2)
					}
				}
				args = append(args, options)
				result := method.Call(args)
				if !result[1].IsNil() {
					t.Fatal(result[1].Interface())
				}
				if !seen {
					t.Fatal("no actual HTTP request")
				}
				if op.ResponseType == "sse" {
					close := result[0].MethodByName("Close")
					close.Call(nil)
				} else if op.ResponseType == "bytes" {
					result[0].FieldByName("Body").Interface().(io.ReadCloser).Close()
				}
			})
			count++
		}
	}
	if count != 58 {
		t.Fatalf("count %d", count)
	}
}
func nativeOptionField(name string) string {
	switch name {
	case "If-Match":
		return "IfMatch"
	case "If-None-Match":
		return "IfNoneMatch"
	case "Content-Length":
		return "ContentLength"
	case "Content-SHA256":
		return "ContentSHA256"
	case "Last-Event-ID":
		return "LastEventID"
	case "media_type":
		return "MediaType"
	case "agent_id":
		return "AgentID"
	case "end_user_ref":
		return "EndUserRef"
	}
	return strings.ToUpper(name[:1]) + name[1:]
}
func seedNativeUnions(value reflect.Value) {
	if value.Kind() != reflect.Struct {
		return
	}
	union := false
	for i := 0; i < value.NumField(); i++ {
		if value.Type().Field(i).Tag.Get("json") == "-" {
			union = true
			break
		}
	}
	if union {
		field := value.Field(0)
		if field.Kind() == reflect.Pointer {
			field.Set(reflect.New(field.Type().Elem()))
			seedNativeUnions(field.Elem())
		}
		return
	}
	for i := 0; i < value.NumField(); i++ {
		field := value.Field(i)
		if field.Kind() == reflect.Struct {
			seedNativeUnions(field)
		}
	}
}
func TestAcceptanceFinalHeadersAndStableKey(t *testing.T) {
	calls := 0
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		calls++
		if calls == 1 {
			if r.Method != "POST" || r.Header.Get("Idempotency-Key") != "persisted" {
				t.Error("write intent changed")
			}
			w.Header().Set("ETag", `"1"`)
			w.Header().Set("X-Request-ID", "accepted")
			jsonReply(w, 202, `{"data":{"id":"sandbox","status":"pending"}}`)
		} else {
			if r.Method != "GET" {
				t.Error("write retried")
			}
			w.Header().Set("ETag", `"2"`)
			jsonReply(w, 200, `{"data":{"id":"sandbox","status":"running"}}`)
		}
	})
	result, err := client.Sandboxes.Create(context.Background(), SandboxCreate{Template: "beeos/base"}, CreateSandboxOptions{RequestOptions: RequestOptions{IdempotencyKey: "persisted", PollIntervalSeconds: .001}})
	if err != nil {
		t.Fatal(err)
	}
	if result.Status != 200 || result.Headers.ETag != `"2"` || *result.Acceptance.Status != 202 || *result.Acceptance.ResourceID != "sandbox" || result.Acceptance.ETag != `"1"` || result.Acceptance.IdempotencyKey != "persisted" || calls != 2 {
		t.Fatalf("result %#v", result)
	}
}
func agentJSON(state, revision, target string) string {
	return fmt.Sprintf(`{"data":{"id":"agent","desired_config_revision":%q,"configuration":{"target":%s,"credential_status":{"slots":[]}},"publication":{"accepted_config_revision":%q,"state":%q,"changed_components":["model"]},"binding":{"sandbox_id":"sandbox","prepared_config_revision":%q,"credential_activation_revision":"rev_old","credential_status":{"slots":[{"slot":"model_primary","configured":true},{"slot":"search_provider","configured":false}]}}}}`, revision, target, revision, state, revision)
}
func TestExactPublicationDeferredSupersessionAndCredentialRevision(t *testing.T) {
	t.Run("older credential remains valid", func(t *testing.T) {
		calls := 0
		client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
			calls++
			state := "preparing"
			if calls > 1 {
				state = "ready"
			}
			jsonReply(w, 200, agentJSON(state, "rev_new", `{"kind":"managed","sandbox_id":"sandbox"}`))
		})
		result, err := client.Agents.Update(context.Background(), "agent", NativeAgentPatch{}, UpdateNativeAgentOptions{IfMatch: `"4"`, RequestOptions: RequestOptions{PollIntervalSeconds: .001}})
		if err != nil {
			t.Fatal(err)
		}
		if result.Body.Data.Publication.State != "ready" || calls != 2 {
			t.Fatal("publication not observed")
		}
	})
	t.Run("deferred does not wake", func(t *testing.T) {
		calls := 0
		client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
			calls++
			jsonReply(w, 201, agentJSON("deferred", "rev_new", `{"kind":"recipe"}`))
		})
		_, err := client.Agents.Create(context.Background(), NativeAgentCreate{Engine: "openclaw"}, CreateNativeAgentOptions{})
		if err != nil {
			t.Fatal(err)
		}
		if calls != 1 {
			t.Fatal("deferred polled")
		}
	})
	t.Run("superseded is visible", func(t *testing.T) {
		calls := 0
		client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
			calls++
			revision := "rev_first"
			if calls > 1 {
				revision = "rev_other"
			}
			jsonReply(w, 200, agentJSON("preparing", revision, `{"kind":"managed","sandbox_id":"sandbox"}`))
		})
		_, err := client.Agents.Update(context.Background(), "agent", NativeAgentPatch{}, UpdateNativeAgentOptions{IfMatch: `"1"`, RequestOptions: RequestOptions{PollIntervalSeconds: .001}})
		var superseded *SDKPublicationSuperseded
		if !errors.As(err, &superseded) {
			t.Fatalf("expected superseded, got %v", err)
		}
	})
}
func TestDeadlineCancellationTypedErrorsAndCommandOutcome(t *testing.T) {
	var mu sync.Mutex
	var methods []string
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		methods = append(methods, r.Method)
		mu.Unlock()
		jsonReply(w, 202, `{"data":{"id":"sandbox","status":"pending"}}`)
	})
	_, err := client.Sandboxes.Create(context.Background(), SandboxCreate{Template: "beeos/base"}, CreateSandboxOptions{RequestOptions: RequestOptions{IdempotencyKey: "recover", WaitTimeoutSeconds: .02, PollIntervalSeconds: .005}})
	var timeout *SDKWaitTimeout
	if !errors.As(err, &timeout) || timeout.Acceptance.IdempotencyKey != "recover" || *timeout.Acceptance.ResourceID != "sandbox" {
		t.Fatalf("timeout context %v", err)
	}
	mu.Lock()
	for i, method := range methods {
		if i > 0 && method != "GET" {
			t.Error("unexpected remote mutation")
		}
	}
	mu.Unlock()
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	_, err = client.Sandboxes.Create(ctx, SandboxCreate{Template: "beeos/desktop"}, CreateSandboxOptions{})
	var cancelled *SDKCancelled
	if !errors.As(err, &cancelled) {
		t.Fatalf("expected local cancellation: %v", err)
	}
	command, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		jsonReply(w, 202, `{"data":{"id":"command","state":"completed","process_outcome":"exited","exit_code":0,"capture_status":"failed"}}`)
	})
	result, err := command.Sandboxes.Commands.Run(context.Background(), "sandbox", CommandCreate{Argv: []string{"true"}}, RunSandboxCommandOptions{})
	if err != nil || result.Body.Data.CaptureStatus != "failed" {
		t.Fatalf("failed collection was swallowed: %v", err)
	}
	api, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Should-Retry", "true")
		w.Header().Set("Retry-After", "2")
		jsonReply(w, 503, `{"code":"future_code","message":"later","request_id":"req","details":{"reason":"future_reason"}}`)
	})
	_, err = api.Sessions.Get(context.Background(), "session", GetNativeSessionOptions{})
	var failure *BeeOSAPIError
	if !errors.As(err, &failure) || failure.Reason != "future_reason" || failure.Code != "future_code" || failure.ShouldRetry == nil || !*failure.ShouldRetry || failure.RetryAfter != "2" {
		t.Fatalf("typed API error %v", err)
	}
}
func TestBinaryRoundTripAndStrongETag(t *testing.T) {
	bytesValue := []byte{0, 255, 4}
	calls := 0
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		calls++
		if r.URL.Query().Get("path") != "/workspace/input" {
			t.Error("query not encoded")
		}
		if r.Method == "PUT" {
			content, err := io.ReadAll(r.Body)
			if err != nil || !bytes.Equal(content, bytesValue) || r.ContentLength != 3 || r.Header.Get("Content-SHA256") != strings.Repeat("a", 64) {
				t.Error("binary request mismatch")
			}
			jsonReply(w, 200, `{"data":{"path":"/workspace/input"}}`)
		} else {
			w.Write(bytesValue)
		}
	})
	_, err := client.Sandboxes.Files.Write(context.Background(), "sandbox", bytes.NewReader(bytesValue), WriteSandboxFileOptions{Path: "/workspace/input", ContentLength: 3, ContentSHA256: strings.Repeat("a", 64)})
	if err != nil {
		t.Fatal(err)
	}
	read, err := client.Sandboxes.Files.Read(context.Background(), "sandbox", ReadSandboxFileOptions{Path: "/workspace/input"})
	if err != nil {
		t.Fatal(err)
	}
	defer read.Body.Close()
	got, err := io.ReadAll(read.Body)
	if err != nil || !bytes.Equal(got, bytesValue) {
		t.Fatal("binary response mismatch")
	}
	_, err = client.Sandboxes.Terminate(context.Background(), "sandbox", TerminateSandboxOptions{IfMatch: `W/"1"`})
	if err == nil || calls != 2 {
		t.Fatal("weak ETag reached HTTP")
	}
}
func TestMemoryDurableReceiptAndTypedUnionNull(t *testing.T) {
	calls := 0
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		calls++
		if calls == 1 {
			jsonReply(w, 202, `{"data":{"completion":"accepted","receipt":{"receipt_id":"receipt","disposition":"accepted"}}}`)
		} else {
			jsonReply(w, 200, `{"data":{"completion":"durable","receipt":{"receipt_id":"receipt","disposition":"committed","committed_at":"now","read_watermark":"watermark","index_watermark":null}}}`)
		}
	})
	result, err := client.Agents.Memory.Remember(context.Background(), "agent", NativeMemoryRemember{Content: "value", Kind: "semantic", Source: NativeMemorySource{Schema0: &Schema0{Kind: "explicit"}}}, RememberNativeMemoryOptions{RequestOptions: RequestOptions{PollIntervalSeconds: .001}})
	if err != nil || result.Body.Data.Completion != "durable" || calls != 2 {
		t.Fatalf("memory wait %v", err)
	}
	patch := NativeAgentPatch{ModelID: &Nullable[OpaqueID]{Value: nil}, DisabledTools: Pointer([]string{})}
	encoded, err := json.Marshal(patch)
	if err != nil || !bytes.Contains(encoded, []byte(`"model_id":null`)) || !bytes.Contains(encoded, []byte(`"disabled_tools":[]`)) {
		t.Fatalf("omitted/null/empty lost: %s %v", encoded, err)
	}
}
func TestResponseStreamAdmitsOnceAndResumesCursor(t *testing.T) {
	posts, gets := 0, 0
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			posts++
			jsonReply(w, 202, `{"data":{"id":"response"}}`)
			return
		}
		gets++
		if r.URL.Path != "/v2/responses/response/events" {
			t.Error("stream wrong response")
		}
		if gets > 1 && r.Header.Get("Last-Event-ID") != "9" {
			t.Error("cursor not restored")
		}
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, "\uFEFFid: 9\rdata: {\"type\":\"response.phase\",\"response_id\":\"response\",\"sequence\":9,\"phase\":\"executing\"}\r\r")
	})
	result, err := client.Responses.CreateStream(context.Background(), NativeResponseCreate{SessionID: "session", Input: []ResponseInput{{TextInput: &TextInput{Type: "input_text", Text: "hello"}}}}, CreateNativeResponseOptions{RequestOptions: RequestOptions{IdempotencyKey: "intent"}})
	if err != nil {
		t.Fatal(err)
	}
	event, err := result.Events.Receive(context.Background())
	if err != nil || event.NativeResponseEventVariant1 == nil || result.Events.LastEventID != "9" {
		t.Fatalf("event/cursor %v %#v", err, event)
	}
	result.Events.Close()
	resumed, err := client.Responses.Events(context.Background(), result.ResponseID, StreamNativeResponseEventsOptions{LastEventID: Pointer(result.Events.LastEventID)})
	if err != nil {
		t.Fatal(err)
	}
	resumed.Close()
	if posts != 1 || gets != 2 {
		t.Fatal("response intent replayed")
	}
}
func TestResponseEventStreamSkipsUnknownTypesWithoutClosing(t *testing.T) {
	client, _ := testClient(t, func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, "id: 1\ndata: {\"type\":\"response.output_text.preview\",\"response_id\":\"response\",\"sequence\":1,\"delta\":\"x\"}\n\n"+
			"id: 2\ndata: {\"type\":\"response.beeos.part\",\"response_id\":\"response\",\"sequence\":2}\n\n"+
			"id: 3\ndata: {\"type\":\"response.output\",\"response_id\":\"response\",\"sequence\":3,\"item\":{\"type\":\"output_text\",\"text\":\"done\"}}\n\n"+
			"id: 4\ndata: {\"type\":\"response.completed\",\"response_id\":\"response\",\"sequence\":4,\"response\":{\"id\":\"response\",\"status\":\"completed\"}}\n\n")
	})
	stream, err := client.Responses.Events(context.Background(), "response", StreamNativeResponseEventsOptions{})
	if err != nil {
		t.Fatal(err)
	}
	defer stream.Close()
	first, err := stream.Receive(context.Background())
	if err != nil || first.NativeResponseEventVariant2 == nil || stream.LastEventID != "3" {
		t.Fatalf("first modeled event after internal events: %v %#v cursor=%s", err, first, stream.LastEventID)
	}
	terminal, err := stream.Receive(context.Background())
	if err != nil || terminal.NativeResponseEventVariant4 == nil || stream.LastEventID != "4" {
		t.Fatalf("terminal event after skipped types: %v %#v cursor=%s", err, terminal, stream.LastEventID)
	}
	if _, err = stream.Receive(context.Background()); !errors.Is(err, io.EOF) {
		t.Fatalf("stream did not end cleanly after skipped types: %v", err)
	}
}

func TestEstablishedSSEDoesNotInheritAdmissionTimeoutAndCancelsRead(t *testing.T) {
	client, server := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.(http.Flusher).Flush()
		select {
		case <-r.Context().Done():
		case <-time.After(time.Second):
		}
	})
	defer server.CloseClientConnections()
	stream, err := client.Responses.Events(context.Background(), "response", StreamNativeResponseEventsOptions{RequestOptions: RequestOptions{RequestTimeoutSeconds: .01}})
	if err != nil {
		t.Fatal(err)
	}
	time.Sleep(20 * time.Millisecond)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()
	_, err = stream.Receive(ctx)
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("read did not use local cancellation: %v", err)
	}
}

func TestCommittedResponseInputIdentityIsNotCreationContent(t *testing.T) {
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/v2/responses/response/input-items":
			jsonReply(w, 200, `{"data":[{"id":"source-input","content":{"type":"input_text","text":"committed input"}}],"next_cursor":null,"has_more":false}`)
		case "/v2/capabilities":
			jsonReply(w, 200, `{"data":{"api_version":"2","features":{"desktop":"conditional","provider":"unknown"},"limits":{},"engines":[]}}`)
		case "/v2/responses":
			var body struct {
				SessionID string           `json:"session_id"`
				Input     []map[string]any `json:"input"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				t.Error(err)
				w.WriteHeader(400)
				return
			}
			if body.SessionID != "session" || len(body.Input) != 1 || body.Input[0]["type"] != "input_text" || body.Input[0]["text"] != "committed input" || len(body.Input[0]) != 2 {
				t.Error("committed identity wrapper leaked into creation content")
			}
			jsonReply(w, 202, `{"data":{"id":"new-response"}}`)
		default:
			t.Errorf("unexpected path %s", r.URL.Path)
			w.WriteHeader(500)
		}
	})
	page, err := client.Responses.ListInputItems(context.Background(), "response", ListNativeResponseInputItemsOptions{})
	if err != nil || len(page.Body.Data) != 1 {
		t.Fatalf("input identity read: %v", err)
	}
	item := page.Body.Data[0]
	if item.ID != "source-input" || item.Content.TextInput == nil || item.Content.TextInput.Text != "committed input" {
		t.Fatal("committed owner ID/content shape lost")
	}
	if _, err = client.Responses.Create(context.Background(), NativeResponseCreate{SessionID: "session", Input: []ResponseInput{item.Content}}, CreateNativeResponseOptions{}); err != nil {
		t.Fatal(err)
	}
	capabilities, err := client.Capabilities.Get(context.Background(), GetNativeCapabilitiesOptions{})
	if err != nil || capabilities.Body.Data.Features["desktop"] != "conditional" || capabilities.Body.Data.Features["provider"] != "unknown" {
		t.Fatalf("capability observations lost: %v", err)
	}
}

func TestAllCredentialSlotsAndExpandedMaximumRevocationScopesRoundTrip(t *testing.T) {
	slots := make([]CredentialPublicStatus, 64)
	toolIDs, mcpIDs, credentialSlots := make([]OpaqueID, 256), make([]OpaqueID, 64), make([]string, 64)
	type expectedScope struct {
		Kind  string   `json:"kind"`
		ID    OpaqueID `json:"id"`
		State string   `json:"state"`
	}
	affected := make([]expectedScope, 0, 387)
	for index := range toolIDs {
		toolIDs[index] = OpaqueID(fmt.Sprintf("tool_%d", index))
		affected = append(affected, expectedScope{"tool", toolIDs[index], "enforced"})
	}
	for index := range mcpIDs {
		mcpIDs[index] = OpaqueID(fmt.Sprintf("mcp_%d", index))
		affected = append(affected, expectedScope{"mcp", mcpIDs[index], "enforced"})
	}
	for index := range slots {
		slots[index] = CredentialPublicStatus{Slot: fmt.Sprintf("credential_%d", index), Configured: index%3 != 0}
		credentialSlots[index] = slots[index].Slot
		state := "enforced"
		if index%2 == 0 {
			state = "unknown"
		}
		affected = append(affected, expectedScope{"credential", OpaqueID(slots[index].Slot), state})
	}
	affected = append(affected, expectedScope{"binding", "binding_expanded", "failed"}, expectedScope{"sandbox", "sandbox_expanded", "pending"}, expectedScope{"session", "session_expanded", "enforced"})
	revoke := AuthorizationRevoke{AuthorizationRevokeVariant2: &AuthorizationRevokeVariant2{ToolIds: &toolIDs, MCPServerRefs: &mcpIDs, CredentialSlots: &credentialSlots}}
	var writes atomic.Int32
	desiredSlots := make([]CredentialPublicStatus, len(slots))
	for index, slot := range slots {
		desiredSlots[index] = CredentialPublicStatus{Slot: slot.Slot, Configured: false}
	}
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			writes.Add(1)
			if r.URL.Path != "/v2/agents/agent/authorizations/revoke" || r.Header.Get("Idempotency-Key") != "maximum-legal-revocation" {
				t.Error("revocation route/intent changed")
			}
			var input AuthorizationRevoke
			if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
				t.Error(err)
				w.WriteHeader(400)
				return
			}
			if !reflect.DeepEqual(input, revoke) {
				t.Error("maximum legal combined selectors were truncated/rewritten")
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(202)
			_ = json.NewEncoder(w).Encode(map[string]any{"data": map[string]any{"authorization_revision": "authorization_revision", "state": "partial", "affected_scopes": affected, "error": nil}})
			return
		}
		observedSlots, desired := slots, desiredSlots
		if strings.HasSuffix(r.URL.Path, "/empty") {
			observedSlots, desired = []CredentialPublicStatus{}, []CredentialPublicStatus{}
		}
		binding := map[string]any{"binding_id": "binding", "sandbox_id": "sandbox", "state": "ready", "prepared_config_revision": "c1", "credential_activation_revision": "c1", "credential_status": CredentialBindingStatus{Slots: observedSlots}, "persona_scope": "session", "components": []any{}, "error": nil}
		if strings.HasSuffix(r.URL.Path, "/not-prepared") {
			binding["state"] = "preparing"
			binding["prepared_config_revision"] = nil
			binding["credential_activation_revision"] = nil
			binding["credential_status"] = CredentialBindingStatus{Slots: []CredentialPublicStatus{}}
		}
		if strings.HasSuffix(r.URL.Path, "/unprepared") {
			binding = nil
		}
		configuration := map[string]any{"name": "agent", "engine": "openclaw", "instructions": "", "model_id": nil, "skills": []any{}, "mcp_servers": []any{}, "disabled_tools": []string{}, "run_timeout_seconds": 600, "target": map[string]any{"kind": "managed", "sandbox_id": "sandbox"}, "credential_status": CredentialBindingStatus{Slots: desired}}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"data": map[string]any{"id": "agent", "desired_config_revision": "c3", "configuration": configuration, "binding": binding}})
	})
	observed, err := client.Agents.Get(context.Background(), "agent", GetNativeAgentOptions{})
	if err != nil || observed.Body.Data.Binding == nil {
		t.Fatalf("binding observation: %v", err)
	}
	if observed.Body.Data.DesiredConfigRevision != "c3" || !reflect.DeepEqual(observed.Body.Data.Configuration.CredentialStatus.Slots, desiredSlots) || observed.Body.Data.Configuration.CredentialStatus.Slots[1].Configured || !observed.Body.Data.Binding.CredentialStatus.Slots[1].Configured || observed.Body.Data.Binding.PreparedConfigRevision == nil || *observed.Body.Data.Binding.PreparedConfigRevision != "c1" || observed.Body.Data.Binding.CredentialActivationRevision == nil || *observed.Body.Data.Binding.CredentialActivationRevision != "c1" {
		t.Fatal("desired c3 status overwrote actual c1 credential observation")
	}
	configurationJSON, err := json.Marshal(observed.Body.Data.Configuration)
	if err != nil {
		t.Fatal(err)
	}
	var configuration NativeAgentConfiguration
	if err = json.Unmarshal(configurationJSON, &configuration); err != nil || !reflect.DeepEqual(configuration, observed.Body.Data.Configuration) {
		t.Fatalf("desired credential status round trip: %v", err)
	}
	if !reflect.DeepEqual(observed.Body.Data.Binding.CredentialStatus.Slots, slots) {
		t.Fatal("per-slot names/configured observations were collapsed")
	}
	bindingJSON, err := json.Marshal(observed.Body.Data.Binding)
	if err != nil {
		t.Fatal(err)
	}
	var binding AgentBindingObservation
	if err = json.Unmarshal(bindingJSON, &binding); err != nil || !reflect.DeepEqual(&binding, observed.Body.Data.Binding) {
		t.Fatalf("binding round trip lost observations: %v", err)
	}
	empty, err := client.Agents.Get(context.Background(), "empty", GetNativeAgentOptions{})
	if err != nil || empty.Body.Data.Binding == nil {
		t.Fatalf("empty credential binding: %v", err)
	}
	emptyJSON, err := json.Marshal(empty.Body.Data.Binding.CredentialStatus)
	if err != nil || string(emptyJSON) != `{"slots":[]}` {
		t.Fatalf("empty slots were synthesized or encoded null: %v", err)
	}
	if len(empty.Body.Data.Configuration.CredentialStatus.Slots) != 0 {
		t.Fatal("empty desired slots were synthesized")
	}
	unprepared, err := client.Agents.Get(context.Background(), "unprepared", GetNativeAgentOptions{})
	if err != nil || unprepared.Body.Data.Binding != nil || !reflect.DeepEqual(unprepared.Body.Data.Configuration.CredentialStatus.Slots, desiredSlots) {
		t.Fatalf("desired status disappeared before binding exists: %v", err)
	}
	notPrepared, err := client.Agents.Get(context.Background(), "not-prepared", GetNativeAgentOptions{})
	if err != nil || notPrepared.Body.Data.Binding == nil || len(notPrepared.Body.Data.Binding.CredentialStatus.Slots) != 0 || notPrepared.Body.Data.Binding.CredentialActivationRevision != nil || !reflect.DeepEqual(notPrepared.Body.Data.Configuration.CredentialStatus.Slots, desiredSlots) {
		t.Fatalf("unprepared binding invented desired slot activation: %v", err)
	}
	result, err := client.Agents.RevokeAuthorizations(context.Background(), "agent", revoke, RevokeNativeAgentAuthorizationsOptions{RequestOptions: RequestOptions{IdempotencyKey: "maximum-legal-revocation"}})
	if err != nil || result.Status != 202 || result.Body.Data.State != "partial" || len(result.Body.Data.AffectedScopes) != 387 {
		t.Fatalf("expanded revocation result: %v", err)
	}
	for index, scope := range result.Body.Data.AffectedScopes {
		expected := affected[index]
		if scope.Kind != expected.Kind || scope.ID != expected.ID || scope.State != expected.State {
			t.Fatalf("actual affected scope %d was lost/rewritten", index)
		}
	}
	raw, err := json.Marshal(result.Body)
	if err != nil {
		t.Fatal(err)
	}
	var roundTrip AuthorizationEnforcementResult
	if err = json.Unmarshal(raw, &roundTrip); err != nil || !reflect.DeepEqual(roundTrip, result.Body) {
		t.Fatalf("full affected scope round trip: %v", err)
	}
	if writes.Load() != 1 {
		t.Fatal("revocation mutation was replayed")
	}
}
