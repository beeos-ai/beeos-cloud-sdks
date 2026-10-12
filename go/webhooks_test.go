package beeoscloudsdk

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strings"
	"testing"
	"time"
)

type webhookVector struct {
	Secret    string            `json:"secret"`
	Timestamp string            `json:"timestamp"`
	Body      string            `json:"body"`
	Signature string            `json:"signature"`
	Headers   map[string]string `json:"headers"`
	Header    string            `json:"header"`
}

func loadWebhookVectors(t *testing.T) (developer, a2a webhookVector) {
	t.Helper()
	raw, err := os.ReadFile("../spec/webhook-signature-vectors.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Developer webhookVector `json:"x-signature-test-vector"`
		A2A       webhookVector `json:"x-a2a-signature-test-vector"`
	}
	if err := json.Unmarshal(raw, &fixture); err != nil {
		t.Fatal(err)
	}
	return fixture.Developer, fixture.A2A
}

func vectorTime(t *testing.T, vector webhookVector) time.Time {
	t.Helper()
	var seconds int64
	for _, digit := range vector.Timestamp {
		seconds = seconds*10 + int64(digit-'0')
	}
	return time.Unix(seconds, 0)
}

func expectReason(t *testing.T, name string, err error, want WebhookVerificationReason) {
	t.Helper()
	var verification *WebhookVerificationError
	if !errors.As(err, &verification) || verification.Reason != want {
		t.Fatalf("%s: err=%v, want reason %s", name, err, want)
	}
	if !errors.Is(err, ErrInvalidWebhookSignature) {
		t.Fatalf("%s: errors.Is(ErrInvalidWebhookSignature) is false", name)
	}
}

func developerHeader(vector webhookVector) http.Header {
	header := http.Header{}
	for name, value := range vector.Headers {
		header.Set(name, value)
	}
	return header
}

func TestVerifyWebhookSignature(t *testing.T) {
	vector, _ := loadWebhookVectors(t)
	now := WithNow(vectorTime(t, vector))
	body := []byte(vector.Body)

	if err := VerifyWebhookSignature(body, developerHeader(vector), vector.Secret, now); err != nil {
		t.Fatalf("platform vector: %v", err)
	}
	literal := http.Header{"x-beeos-webhook-timestamp": {vector.Timestamp}, "X-BEEOS-WEBHOOK-SIGNATURE": {vector.Signature}}
	if err := VerifyWebhookSignature(body, literal, vector.Secret, now); err != nil {
		t.Fatalf("non-canonical header keys: %v", err)
	}

	expectReason(t, "tampered body", VerifyWebhookSignature(append(body[:len(body):len(body)], ' '), developerHeader(vector), vector.Secret, now), WebhookSignatureMismatch)
	expectReason(t, "wrong secret", VerifyWebhookSignature(body, developerHeader(vector), strings.Replace(vector.Secret, "docs", "evil", 1), now), WebhookSignatureMismatch)
	for _, signature := range []string{"abc", strings.Repeat("z", 64), ""} {
		header := developerHeader(vector)
		header.Set("X-BeeOS-Webhook-Signature", signature)
		expectReason(t, "malformed signature "+signature, VerifyWebhookSignature(body, header, vector.Secret, now), WebhookSignatureMismatch)
	}
}

func TestVerifyWebhookSignatureTimestamp(t *testing.T) {
	vector, _ := loadWebhookVectors(t)
	at := vectorTime(t, vector)
	body := []byte(vector.Body)
	expectReason(t, "future", VerifyWebhookSignature(body, developerHeader(vector), vector.Secret, WithNow(at.Add(301*time.Second))), WebhookTimestampOutOfTolerance)
	expectReason(t, "past", VerifyWebhookSignature(body, developerHeader(vector), vector.Secret, WithNow(at.Add(-301*time.Second))), WebhookTimestampOutOfTolerance)
	if err := VerifyWebhookSignature(body, developerHeader(vector), vector.Secret, WithNow(at.Add(300*time.Second))); err != nil {
		t.Fatalf("edge of the default tolerance: %v", err)
	}
	expectReason(t, "custom tolerance", VerifyWebhookSignature(body, developerHeader(vector), vector.Secret, WithNow(at.Add(11*time.Second)), WithTolerance(10*time.Second)), WebhookTimestampOutOfTolerance)
	for _, timestamp := range []string{"", "abc", "1700000000.5", "-1", "1e9", " 1700000000", "１７００００００００"} {
		header := developerHeader(vector)
		header.Set("X-BeeOS-Webhook-Timestamp", timestamp)
		expectReason(t, "timestamp "+timestamp, VerifyWebhookSignature(body, header, vector.Secret, WithNow(at)), WebhookInvalidTimestamp)
	}
}

func TestVerifyWebhookSignatureHeadersAndSecret(t *testing.T) {
	vector, _ := loadWebhookVectors(t)
	now := WithNow(vectorTime(t, vector))
	body := []byte(vector.Body)
	onlySignature := http.Header{"X-Beeos-Webhook-Signature": {vector.Signature}}
	onlyTimestamp := http.Header{"X-Beeos-Webhook-Timestamp": {vector.Timestamp}}
	expectReason(t, "missing timestamp", VerifyWebhookSignature(body, onlySignature, vector.Secret, now), WebhookMissingHeader)
	expectReason(t, "missing signature", VerifyWebhookSignature(body, onlyTimestamp, vector.Secret, now), WebhookMissingHeader)
	expectReason(t, "no headers", VerifyWebhookSignature(body, nil, vector.Secret, now), WebhookMissingHeader)
	repeated := developerHeader(vector)
	repeated.Add("X-BeeOS-Webhook-Timestamp", vector.Timestamp)
	expectReason(t, "repeated", VerifyWebhookSignature(body, repeated, vector.Secret, now), WebhookInvalidHeader)
	expectReason(t, "short secret", VerifyWebhookSignature(body, nil, strings.Repeat("s", 31), now), WebhookSecretTooShort)
	expectReason(t, "short multibyte secret", VerifyWebhookSignature(body, developerHeader(vector), strings.Repeat("é", 15), now), WebhookSecretTooShort)
}

func taskPushHeader(value string) http.Header { return http.Header{"X-Beeos-Signature": {value}} }

func TestVerifyTaskPushSignature(t *testing.T) {
	_, vector := loadWebhookVectors(t)
	now := WithNow(vectorTime(t, vector))
	body := []byte(vector.Body)
	wrong := strings.Repeat("0", 64)
	parts := strings.Split(vector.Header, ",")
	timestampPart, signaturePart := parts[0], parts[1]

	if err := VerifyTaskPushSignature(body, taskPushHeader(vector.Header), vector.Secret, now); err != nil {
		t.Fatalf("platform vector: %v", err)
	}
	if err := VerifyTaskPushSignature(body, http.Header{"x-beeos-signature": {vector.Header}}, vector.Secret, now); err != nil {
		t.Fatalf("non-canonical header key: %v", err)
	}
	for _, accepted := range []string{timestampPart + ",v0=" + wrong + "," + signaturePart + ",unknown=1", timestampPart + ",v1=" + wrong + "," + signaturePart, signaturePart + ", " + timestampPart} {
		if err := VerifyTaskPushSignature(body, taskPushHeader(accepted), vector.Secret, now); err != nil {
			t.Fatalf("%q: %v", accepted, err)
		}
	}
	expectReason(t, "no v1 matches", VerifyTaskPushSignature(body, taskPushHeader(timestampPart+",v1="+wrong+",v1=abc"), vector.Secret, now), WebhookSignatureMismatch)
	expectReason(t, "tampered body", VerifyTaskPushSignature([]byte(strings.Replace(vector.Body, "true", "false", 1)), taskPushHeader(vector.Header), vector.Secret, now), WebhookSignatureMismatch)
	expectReason(t, "wrong secret", VerifyTaskPushSignature(body, taskPushHeader(vector.Header), strings.Replace(vector.Secret, "docs", "evil", 1), now), WebhookSignatureMismatch)
	expectReason(t, "out of tolerance", VerifyTaskPushSignature(body, taskPushHeader(vector.Header), vector.Secret, WithNow(vectorTime(t, vector).Add(301*time.Second))), WebhookTimestampOutOfTolerance)
	expectReason(t, "invalid timestamp", VerifyTaskPushSignature(body, taskPushHeader("t=abc,v1="+vector.Signature), vector.Secret, now), WebhookInvalidTimestamp)
	expectReason(t, "missing header", VerifyTaskPushSignature(body, nil, vector.Secret, now), WebhookMissingHeader)
	expectReason(t, "short secret", VerifyTaskPushSignature(body, taskPushHeader(vector.Header), "short", now), WebhookSecretTooShort)
	for _, malformed := range []string{"", signaturePart, timestampPart, timestampPart + "," + timestampPart + "," + signaturePart, timestampPart + ",," + signaturePart, timestampPart + ",v1", timestampPart + ",=" + wrong, vector.Signature} {
		expectReason(t, "malformed "+malformed, VerifyTaskPushSignature(body, taskPushHeader(malformed), vector.Secret, now), WebhookInvalidHeader)
	}
}

func TestTaskPushDoesNotAcceptDeveloperHeaders(t *testing.T) {
	developer, _ := loadWebhookVectors(t)
	err := VerifyTaskPushSignature([]byte(developer.Body), developerHeader(developer), developer.Secret, WithNow(vectorTime(t, developer)))
	expectReason(t, "developer headers", err, WebhookMissingHeader)
}
