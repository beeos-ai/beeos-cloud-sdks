package native

import (
	"encoding/json"
	"testing"
)

// INT-2: a failed Response carries details.reason=compute_preparation_failed and
// the open details.runtime_code; the typed Go model must not drop it.
func TestErrorDetailsKeepsUndeclaredKeys(t *testing.T) {
	raw := []byte(`{"code":"runtime_error","message":"compute preparation failed","request_id":"req_1","details":{"reason":"compute_preparation_failed","runtime_code":"unsupported_capability"}}`)
	var envelope OwnerError
	if err := json.Unmarshal(raw, &envelope); err != nil {
		t.Fatal(err)
	}
	details := envelope.Details
	if details == nil || details.Reason == nil || *details.Reason != "compute_preparation_failed" {
		t.Fatalf("reason = %+v", details)
	}
	if got := string(details.Additional["runtime_code"]); got != `"unsupported_capability"` {
		t.Fatalf("runtime_code = %s", got)
	}
	if _, ok := details.Additional["reason"]; ok {
		t.Fatal("declared key duplicated into Additional")
	}
	encoded, err := json.Marshal(details)
	if err != nil {
		t.Fatal(err)
	}
	var roundTrip map[string]string
	if err := json.Unmarshal(encoded, &roundTrip); err != nil {
		t.Fatal(err)
	}
	if roundTrip["reason"] != "compute_preparation_failed" || roundTrip["runtime_code"] != "unsupported_capability" || len(roundTrip) != 2 {
		t.Fatalf("round trip = %v", roundTrip)
	}
	empty, err := json.Marshal(ErrorDetails{})
	if err != nil || string(empty) != `{}` {
		t.Fatalf("empty = %s, %v", empty, err)
	}
}
