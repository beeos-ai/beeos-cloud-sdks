package native

import (
	"context"
	"errors"
	"io"
	"os"
	"strings"
	"testing"
	"time"
)

// TestLiveGateway (SDK-1/SDK-2) runs the generated Go client against an actually
// running isolated public Gateway. Unconfigured is UNQUALIFIED, never a pass.
//
//	BEEOS_NATIVE_SDK_LIVE_URL=http://127.0.0.1:<port>
//	BEEOS_NATIVE_SDK_LIVE_API_KEY_FILE=<isolated bsk_ server key file>
func TestLiveGateway(t *testing.T) {
	origin, keyFile := os.Getenv("BEEOS_NATIVE_SDK_LIVE_URL"), os.Getenv("BEEOS_NATIVE_SDK_LIVE_API_KEY_FILE")
	if origin == "" && keyFile == "" {
		t.Skip("UNQUALIFIED: BEEOS_NATIVE_SDK_LIVE_URL/_API_KEY_FILE absent; no live Gateway call ran")
	}
	if !strings.HasPrefix(origin, "http://127.0.0.1:") && !strings.HasPrefix(origin, "https://127.0.0.1:") {
		t.Fatal("live SDK origin must be loopback")
	}
	raw, err := os.ReadFile(keyFile)
	key := strings.TrimSpace(string(raw))
	if err != nil || !strings.HasPrefix(key, "bsk_") {
		t.Fatal("isolated server key file required")
	}
	client, err := NewClient(ClientOptions{BaseURL: origin, APIKey: key})
	if err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()
	intent, _ := NewIdempotencyKey()
	name := "sdk-go-live-" + intent

	// Error envelope and request ID: wrong credential and unknown resource.
	anonymous, _ := NewClient(ClientOptions{BaseURL: origin, APIKey: "bsk_invalid"})
	var apiError *BeeOSAPIError
	if _, err = anonymous.Agents.List(ctx, ListNativeAgentsOptions{}); !errors.As(err, &apiError) || apiError.HTTPStatus != 401 || apiError.Code == "" || apiError.RequestID == "" {
		t.Fatalf("invalid key must be a typed 401 with code/request ID: %v", err)
	}
	if _, err = client.Agents.Get(ctx, "00000000-0000-4000-8000-000000000000", GetNativeAgentOptions{}); !errors.As(err, &apiError) || apiError.HTTPStatus != 404 || apiError.Code == "" || apiError.RequestID == "" {
		t.Fatalf("unknown Agent must be a typed 404 with code/request ID: %v", err)
	}

	// Stable retry key, deferred no-wake wait and changed-body conflict.
	agentKey := intent + "-agent"
	body := NativeAgentCreate{Engine: "openclaw", Target: explicitRecipeTarget(), Name: Pointer(name), Instructions: Pointer("SDK live check.")}
	created, err := client.Agents.Create(ctx, body, CreateNativeAgentOptions{RequestOptions{IdempotencyKey: agentKey}})
	if err != nil {
		t.Fatal(err)
	}
	agent := created.Body.Data
	defer client.Agents.Delete(context.Background(), string(agent.ID), DeleteNativeAgentOptions{RequestOptions{IdempotencyKey: intent + "-agent-delete"}})
	if created.Acceptance == nil || created.Acceptance.IdempotencyKey != agentKey || created.Acceptance.RequestID == "" || created.Headers.RequestID == "" || created.Headers.ETag == "" {
		t.Fatal("create must expose acceptance key, request ID and ETag")
	}
	if agent.Binding != nil || agent.Publication.State != "deferred" {
		t.Fatalf("recipe Agent wait must return deferred/no binding, got %s", agent.Publication.State)
	}
	replay, err := client.Agents.Create(ctx, body, CreateNativeAgentOptions{RequestOptions{IdempotencyKey: agentKey}})
	if err != nil || replay.Body.Data.ID != agent.ID || replay.Headers.ETag != created.Headers.ETag {
		t.Fatalf("same-key replay must return the original Agent: %v", err)
	}
	changed := body
	changed.Name = Pointer(name + "-changed")
	if _, err = client.Agents.Create(ctx, changed, CreateNativeAgentOptions{RequestOptions{IdempotencyKey: agentKey}}); !errors.As(err, &apiError) || apiError.HTTPStatus != 409 || apiError.RequestID == "" {
		t.Fatalf("same key with changed body must be 409: %v", err)
	}

	// Local deadline and local cancellation are distinct SDK errors that keep
	// the retry key; replaying that key recovers the server outcome.
	recover := func(label string, run func(string) error, check func(error) bool) {
		t.Helper()
		key := intent + "-" + label
		err := run(key)
		var waited *SDKWaitTimeout
		var cancelled *SDKCancelled
		if errors.As(err, &cancelled) {
			waited = cancelled.SDKWaitTimeout
		} else if !errors.As(err, &waited) {
			waited = nil
		}
		if !check(err) || waited == nil || waited.Acceptance == nil || waited.Acceptance.IdempotencyKey != key {
			t.Fatalf("%s: unexpected local error %T %v", label, err, err)
		}
		recovered, err := client.Agents.Create(ctx, NativeAgentCreate{Engine: "openclaw", Target: explicitRecipeTarget(), Name: Pointer(name + "-" + label)}, CreateNativeAgentOptions{RequestOptions{IdempotencyKey: key}})
		if err != nil {
			t.Fatalf("%s: same-key recovery failed: %v", label, err)
		}
		client.Agents.Delete(ctx, string(recovered.Body.Data.ID), DeleteNativeAgentOptions{RequestOptions{IdempotencyKey: key + "-delete"}})
	}
	recover("deadline", func(key string) error {
		_, err := client.Agents.Create(ctx, NativeAgentCreate{Engine: "openclaw", Target: explicitRecipeTarget(), Name: Pointer(name + "-deadline")}, CreateNativeAgentOptions{RequestOptions{IdempotencyKey: key, WaitTimeoutSeconds: 0.000001}})
		return err
	}, func(err error) bool { var c *SDKCancelled; return !errors.As(err, &c) })
	recover("cancel", func(key string) error {
		local, stop := context.WithCancel(ctx)
		stop()
		_, err := client.Agents.Create(local, NativeAgentCreate{Engine: "openclaw", Target: explicitRecipeTarget(), Name: Pointer(name + "-cancel")}, CreateNativeAgentOptions{RequestOptions{IdempotencyKey: key}})
		return err
	}, func(err error) bool { var c *SDKCancelled; return errors.As(err, &c) })

	// Durable Memory wait polls the actual receipt.
	remembered, err := client.Agents.Memory.Remember(ctx, string(agent.ID), NativeMemoryRemember{Content: name + " memory", Kind: "semantic", Source: NativeMemorySource{Schema0: &Schema0{Kind: "explicit"}}}, RememberNativeMemoryOptions{RequestOptions{IdempotencyKey: intent + "-remember"}})
	if err != nil || (remembered.Body.Data.Completion != "durable" && remembered.Body.Data.Completion != "recallable") || remembered.Body.Data.Receipt.ReadWatermark == nil {
		t.Fatalf("Memory wait must end durable: %v", err)
	}

	// Server cancellation of an admitted Response, then SSE replay by cursor.
	session, err := client.Sessions.Create(ctx, NativeSessionCreate{AgentID: agent.ID, Name: Pointer(name)}, CreateNativeSessionOptions{RequestOptions{IdempotencyKey: intent + "-session"}})
	if err != nil {
		t.Fatal(err)
	}
	responseKey := intent + "-response"
	admitted, err := client.Responses.Create(ctx, NativeResponseCreate{SessionID: session.Body.Data.ID, Input: []ResponseInput{{TextInput: &TextInput{Type: "input_text", Text: name}}}, TimeoutSeconds: Pointer(int64(60))}, CreateNativeResponseOptions{RequestOptions{IdempotencyKey: responseKey}})
	if err != nil {
		// Recorded producer behaviour without an execution chain (State/CP-9).
		if !errors.As(err, &apiError) || apiError.HTTPStatus != 503 || apiError.Code != "outcome_unknown" || apiError.RequestID == "" || apiError.Acceptance == nil || apiError.Acceptance.IdempotencyKey != responseKey {
			t.Fatalf("Response admission: %v", err)
		}
		t.Logf("Response create returned 503 outcome_unknown (request_id=%s); recovering through Session history", apiError.RequestID)
	} else if admitted.Status != 202 {
		t.Fatalf("Response create status %d", admitted.Status)
	}
	history, err := client.Sessions.ListResponses(ctx, string(session.Body.Data.ID), ListNativeSessionResponsesOptions{})
	if err != nil || len(history.Body.Data) != 1 {
		t.Fatalf("Session history must contain the admitted Response: %v", err)
	}
	responseID := string(history.Body.Data[0].ID)
	cancelled, err := client.Responses.Cancel(ctx, responseID, CancelNativeResponseOptions{RequestOptions{IdempotencyKey: intent + "-cancel-response"}})
	if err != nil {
		t.Fatal(err)
	}
	for !cancelled.Body.Data.Terminal {
		time.Sleep(200 * time.Millisecond)
		if cancelled, err = client.Responses.Get(ctx, responseID, GetNativeResponseOptions{}); err != nil {
			t.Fatal(err)
		}
	}
	if cancelled.Body.Data.Status != "cancelled" {
		t.Fatalf("server cancellation must settle as cancelled, got %s", cancelled.Body.Data.Status)
	}
	stream, err := client.Responses.Events(ctx, responseID, StreamNativeResponseEventsOptions{})
	if err != nil {
		t.Fatal(err)
	}
	var lastID string
	var terminal *NativeResponseEventVariant4
	for terminal == nil {
		event, err := stream.Receive(ctx)
		if err != nil {
			t.Fatalf("SSE ended before terminal event: %v", err)
		}
		terminal = event.NativeResponseEventVariant4
		lastID = stream.LastEventID
	}
	stream.Close()
	if terminal.Type != "response.cancelled" || terminal.Response.Status != "cancelled" || lastID == "" {
		t.Fatalf("terminal SSE must be response.cancelled with an event ID, got %s", terminal.Type)
	}
	resumed, err := client.Responses.Events(ctx, responseID, StreamNativeResponseEventsOptions{LastEventID: &lastID})
	if err != nil {
		t.Fatal(err)
	}
	if event, err := resumed.Receive(ctx); err == nil {
		t.Fatalf("resume after terminal cursor replayed an event: %+v", event)
	} else if !errors.Is(err, io.EOF) {
		t.Fatalf("resume after terminal cursor: %v", err)
	}
	resumed.Close()
	if _, err = client.Agents.Delete(ctx, string(agent.ID), DeleteNativeAgentOptions{RequestOptions{IdempotencyKey: intent + "-agent-delete"}}); err != nil {
		t.Fatal(err)
	}
	t.Logf("live Gateway: envelope/errors/request IDs, retry keys, deferred/durable waits, local deadline/cancel recovery, server cancel and SSE cursor checked")
}
