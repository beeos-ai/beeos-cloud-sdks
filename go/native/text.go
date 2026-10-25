package native

import "strings"

// ResponseText accumulates /v2/responses/{id}/events text (U-1024-50).
//
// response.output_text.delta events are a live preview: deltas of one item_id
// are appended in arrival order, items in first-seen order. The terminal
// Response output is authoritative and replaces the preview.
type ResponseText struct {
	order    []string
	items    map[string]*strings.Builder
	final    string
	terminal bool
}

// Apply applies one event and returns the current text.
func (t *ResponseText) Apply(event NativeResponseEvent) string {
	if t.terminal {
		return t.final
	}
	if delta := event.NativeResponseEventVariant5; delta != nil {
		if t.items == nil {
			t.items = map[string]*strings.Builder{}
		}
		item, ok := t.items[delta.ItemID]
		if !ok {
			item = &strings.Builder{}
			t.items[delta.ItemID] = item
			t.order = append(t.order, delta.ItemID)
		}
		item.WriteString(delta.Delta)
	} else if terminal := event.NativeResponseEventVariant4; terminal != nil {
		var final strings.Builder
		for _, item := range terminal.Response.Output {
			if item.ResponseOutputItemVariant1 != nil {
				final.WriteString(item.ResponseOutputItemVariant1.Text)
			}
		}
		t.final, t.terminal = final.String(), true
	}
	return t.Text()
}

// Text is the preview so far, or the authoritative terminal text once terminal.
func (t *ResponseText) Text() string {
	if t.terminal {
		return t.final
	}
	return t.Streamed()
}

// Streamed is the concatenated deltas only, independent of the terminal snapshot.
func (t *ResponseText) Streamed() string {
	var out strings.Builder
	for _, id := range t.order {
		out.WriteString(t.items[id].String())
	}
	return out.String()
}

// Terminal reports whether a terminal event was applied.
func (t *ResponseText) Terminal() bool { return t.terminal }
