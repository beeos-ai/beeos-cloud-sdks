package beeoscloudsdk

import (
	"bytes"
	"encoding/json"
	"os"
	"testing"
)

func TestSandboxAgentWebhookTypesDecodeEveryPublishedExample(t *testing.T) {
	raw, err := os.ReadFile("../spec/sandbox-agent-webhook-examples.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Examples map[string]json.RawMessage `json:"examples"`
	}
	if err := json.Unmarshal(raw, &fixture); err != nil || len(fixture.Examples) != 6 {
		t.Fatalf("fixture: %d examples, %v", len(fixture.Examples), err)
	}
	for kind, body := range fixture.Examples {
		var header WebhookEventHeader
		if err := json.Unmarshal(body, &header); err != nil || header.Event.Type != kind || header.Event.EventID == "" {
			t.Fatalf("%s header: %+v %v", kind, header, err)
		}
		decoder := json.NewDecoder(bytes.NewReader(body))
		decoder.DisallowUnknownFields()
		switch kind {
		case WebhookSandboxCreated, WebhookSandboxUpdated, WebhookSandboxTerminated:
			var event SandboxWebhookEvent
			if err := decoder.Decode(&event); err != nil || event.Event.Scope.SandboxID != event.Event.Data.ID || event.Event.OccurredAt.IsZero() {
				t.Fatalf("%s: %+v %v", kind, event, err)
			}
		case WebhookAgentCreated, WebhookAgentUpdated, WebhookAgentDeleted:
			var event AgentWebhookEvent
			if err := decoder.Decode(&event); err != nil || event.Event.Scope.AgentID != event.Event.Data.ID || (event.Event.Data.Publication == nil) != (kind == WebhookAgentDeleted) {
				t.Fatalf("%s: %+v %v", kind, event, err)
			}
		default:
			t.Fatalf("unexpected example %s", kind)
		}
	}
}
