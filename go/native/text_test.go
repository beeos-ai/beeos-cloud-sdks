package native

import (
	"encoding/json"
	"testing"
)

func textEvent(t *testing.T, raw string) NativeResponseEvent {
	t.Helper()
	var event NativeResponseEvent
	if err := json.Unmarshal([]byte(raw), &event); err != nil {
		t.Fatal(err)
	}
	return event
}

func TestResponseTextPreviewThenAuthoritativeTerminal(t *testing.T) {
	delta := func(item, text string) string {
		return `{"type":"response.output_text.delta","response_id":"r","item_id":"` + item + `","output_index":0,"content_index":0,"delta":"` + text + `"}`
	}
	var text ResponseText
	text.Apply(textEvent(t, delta("r:message:0", "Hel")))
	text.Apply(textEvent(t, delta("r:message:1", "Second")))
	if got := text.Apply(textEvent(t, delta("r:message:0", "lo"))); got != "HelloSecond" {
		t.Fatalf("preview %q", got)
	}
	var done NativeResponseEvent
	done.NativeResponseEventVariant4 = &NativeResponseEventVariant4{Type: "response.completed", Response: NativeResponse{Output: []ResponseOutputItem{
		{ResponseOutputItemVariant1: &ResponseOutputItemVariant1{Type: "output_text", Text: "Hello"}},
		{ResponseOutputItemVariant1: &ResponseOutputItemVariant1{Type: "output_text", Text: "Second!"}}}}}
	if got := text.Apply(done); got != "HelloSecond!" || !text.Terminal() || text.Streamed() != "HelloSecond" {
		t.Fatalf("terminal %q streamed %q", got, text.Streamed())
	}
	if got := text.Apply(textEvent(t, delta("r:message:0", "late"))); got != "HelloSecond!" {
		t.Fatalf("delta after terminal changed text: %q", got)
	}
}
