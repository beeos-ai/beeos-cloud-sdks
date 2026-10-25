package beeoscloudsdk

import (
	"bytes"
	"encoding/json"
	"os"
	"testing"
)

// Every published /v2 event example decodes into the SDK types with no unknown field.
func TestNativeWebhookEventExamplesDecode(t *testing.T) {
	raw, err := os.ReadFile("../spec/native-webhook-events.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct{ Events []json.RawMessage }
	if err := json.Unmarshal(raw, &fixture); err != nil || len(fixture.Events) == 0 {
		t.Fatalf("fixture: %v", err)
	}
	strict := func(data []byte, target any) error {
		decoder := json.NewDecoder(bytes.NewReader(data))
		decoder.DisallowUnknownFields()
		return decoder.Decode(target)
	}
	for _, body := range fixture.Events {
		var event NativeWebhookEvent
		if err := strict(body, &event); err != nil {
			t.Fatalf("%s: %v", body, err)
		}
		if event.Event.EventID == "" || event.Event.Scope.AgentID == "" || event.Event.Scope.SessionID == "" {
			t.Fatalf("incomplete event %+v", event)
		}
		switch event.Event.Type {
		case "session.created", "session.updated", "session.deleted":
			var data NativeSessionWebhookData
			if err := strict(event.Event.Data, &data); err != nil || data.ResourceVersion == "" || event.Event.Scope.ResponseID != "" {
				t.Fatalf("%s data: %v", event.Event.Type, err)
			}
		case "response.terminal":
			var data NativeResponseTerminalWebhookData
			if err := strict(event.Event.Data, &data); err != nil || data.Status == "" || event.Event.Scope.ResponseID == "" {
				t.Fatalf("%s data: %v", event.Event.Type, err)
			}
		default:
			t.Fatalf("unexpected type %s", event.Event.Type)
		}
	}
}
