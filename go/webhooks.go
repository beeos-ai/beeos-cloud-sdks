package beeoscloudsdk

// Verification of BeeOS Cloud webhook requests (hand-written, not generated).
//
// Developer webhook: X-BeeOS-Webhook-Timestamp (unix seconds) and
// X-BeeOS-Webhook-Signature = lowercase hex HMAC-SHA256(secret, "<timestamp>.<raw body>").
// A2A task push: X-BeeOS-Signature: t=<unix>,v1=<hex> with the same MAC.
// The secret is used as its literal bytes. Pass the raw request body, not re-serialized JSON.

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// WebhookVerificationReason says why a webhook request must be rejected.
type WebhookVerificationReason string

const (
	WebhookSecretTooShort          WebhookVerificationReason = "secret_too_short"
	WebhookMissingHeader           WebhookVerificationReason = "missing_header"
	WebhookInvalidHeader           WebhookVerificationReason = "invalid_header"
	WebhookInvalidTimestamp        WebhookVerificationReason = "invalid_timestamp"
	WebhookTimestampOutOfTolerance WebhookVerificationReason = "timestamp_out_of_tolerance"
	WebhookSignatureMismatch       WebhookVerificationReason = "signature_mismatch"
)

const (
	minWebhookSecretBytes   = 32
	defaultWebhookTolerance = 5 * time.Minute
	webhookTimestampHeader  = "X-BeeOS-Webhook-Timestamp"
	webhookSignatureHeader  = "X-BeeOS-Webhook-Signature"
	taskPushSignatureHeader = "X-BeeOS-Signature"
)

// ErrInvalidWebhookSignature matches every *WebhookVerificationError with errors.Is.
var ErrInvalidWebhookSignature = errors.New("invalid webhook signature")

// WebhookVerificationError is returned when a webhook request must be rejected.
type WebhookVerificationError struct {
	Reason  WebhookVerificationReason
	Message string
}

func (e *WebhookVerificationError) Error() string {
	return fmt.Sprintf("invalid webhook signature (%s): %s", e.Reason, e.Message)
}

// Is makes errors.Is(err, ErrInvalidWebhookSignature) true.
func (e *WebhookVerificationError) Is(target error) bool { return target == ErrInvalidWebhookSignature }

func rejectWebhook(reason WebhookVerificationReason, message string) error {
	return &WebhookVerificationError{Reason: reason, Message: message}
}

type verifyOptions struct {
	now       time.Time
	tolerance time.Duration
}

// VerifyOption configures VerifyWebhookSignature and VerifyTaskPushSignature.
type VerifyOption func(*verifyOptions)

// WithNow sets the current time. It defaults to time.Now().
func WithNow(now time.Time) VerifyOption { return func(o *verifyOptions) { o.now = now } }

// WithTolerance sets the largest accepted distance between the signed timestamp and now. It defaults to 5 minutes.
func WithTolerance(tolerance time.Duration) VerifyOption {
	return func(o *verifyOptions) { o.tolerance = tolerance }
}

var (
	webhookUnixSeconds = regexp.MustCompile(`^[0-9]{1,15}$`)
	webhookSHA256Hex   = regexp.MustCompile(`^[0-9a-fA-F]{64}$`)
)

// webhookHeader reads a header case-insensitively; it reports whether the header was sent.
func webhookHeader(header http.Header, name string) (string, bool, error) {
	var values []string
	for key, v := range header {
		if strings.EqualFold(key, name) {
			values = append(values, v...)
		}
	}
	switch len(values) {
	case 0:
		return "", false, nil
	case 1:
		return values[0], true, nil
	}
	return "", false, rejectWebhook(WebhookInvalidHeader, name+" must be sent once")
}

func requireWebhookHeader(header http.Header, name string) (string, error) {
	value, found, err := webhookHeader(header, name)
	if err != nil {
		return "", err
	}
	if !found {
		return "", rejectWebhook(WebhookMissingHeader, name+" header is missing")
	}
	return value, nil
}

func newVerifyOptions(opts []VerifyOption) verifyOptions {
	options := verifyOptions{tolerance: defaultWebhookTolerance}
	for _, apply := range opts {
		apply(&options)
	}
	if options.now.IsZero() {
		options.now = time.Now()
	}
	return options
}

func verifyWebhookMAC(rawBody []byte, timestamp string, signatures []string, secret string, options verifyOptions) error {
	if !webhookUnixSeconds.MatchString(timestamp) {
		return rejectWebhook(WebhookInvalidTimestamp, "timestamp must be integer unix seconds")
	}
	seconds, err := strconv.ParseInt(timestamp, 10, 64)
	if err != nil {
		return rejectWebhook(WebhookInvalidTimestamp, "timestamp must be integer unix seconds")
	}
	distance := options.now.Sub(time.Unix(seconds, 0))
	if distance < 0 {
		distance = -distance
	}
	if distance > options.tolerance {
		return rejectWebhook(WebhookTimestampOutOfTolerance, "timestamp is outside the tolerance window")
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(timestamp + "."))
	mac.Write(rawBody)
	expected := mac.Sum(nil)
	matched := false
	for _, signature := range signatures {
		if !webhookSHA256Hex.MatchString(signature) {
			continue
		}
		actual, err := hex.DecodeString(signature)
		if err == nil && hmac.Equal(actual, expected) {
			matched = true
		}
	}
	if !matched {
		return rejectWebhook(WebhookSignatureMismatch, "signature does not match")
	}
	return nil
}

func requireWebhookSecret(secret string) error {
	if len(secret) < minWebhookSecretBytes {
		return rejectWebhook(WebhookSecretTooShort, fmt.Sprintf("secret must be at least %d bytes", minWebhookSecretBytes))
	}
	return nil
}

// VerifyWebhookSignature verifies a developer webhook request. It returns a
// *WebhookVerificationError (matching ErrInvalidWebhookSignature) when the request must be rejected.
func VerifyWebhookSignature(rawBody []byte, header http.Header, secret string, opts ...VerifyOption) error {
	if err := requireWebhookSecret(secret); err != nil {
		return err
	}
	timestamp, err := requireWebhookHeader(header, webhookTimestampHeader)
	if err != nil {
		return err
	}
	signature, err := requireWebhookHeader(header, webhookSignatureHeader)
	if err != nil {
		return err
	}
	return verifyWebhookMAC(rawBody, timestamp, []string{signature}, secret, newVerifyOptions(opts))
}

// VerifyTaskPushSignature verifies an A2A task push request
// (X-BeeOS-Signature: t=<unix>,v1=<hex>[,v1=<hex>...]).
func VerifyTaskPushSignature(rawBody []byte, header http.Header, secret string, opts ...VerifyOption) error {
	if err := requireWebhookSecret(secret); err != nil {
		return err
	}
	value, err := requireWebhookHeader(header, taskPushSignatureHeader)
	if err != nil {
		return err
	}
	var timestamp *string
	var signatures []string
	for _, part := range strings.Split(value, ",") {
		key, item, found := strings.Cut(part, "=")
		if !found || key == "" {
			return rejectWebhook(WebhookInvalidHeader, taskPushSignatureHeader+" must be t=<unix>,v1=<hex>")
		}
		key, item = strings.TrimSpace(key), strings.TrimSpace(item)
		switch key {
		case "t":
			if timestamp != nil {
				return rejectWebhook(WebhookInvalidHeader, taskPushSignatureHeader+" has more than one t")
			}
			timestamp = &item
		case "v1":
			signatures = append(signatures, item)
		}
	}
	if timestamp == nil || len(signatures) == 0 {
		return rejectWebhook(WebhookInvalidHeader, taskPushSignatureHeader+" needs t and at least one v1")
	}
	return verifyWebhookMAC(rawBody, *timestamp, signatures, secret, newVerifyOptions(opts))
}

// NativeWebhookEvent is a /v2 chat webhook body: session.created,
// session.updated, session.deleted or response.terminal. Scope carries public
// /v2 identities only; there is no instance or end-user identity. Dedupe on
// Event.EventID; delivery order is not guaranteed.
type NativeWebhookEvent struct {
	OrganizationID string                    `json:"organization_id"`
	AppID          string                    `json:"app_id"`
	Event          NativeWebhookEventPayload `json:"event"`
}

// NativeWebhookEventPayload is the event object of a NativeWebhookEvent.
type NativeWebhookEventPayload struct {
	SchemaVersion int                     `json:"schemaVersion"`
	EventID       string                  `json:"eventId"`
	Type          string                  `json:"type"`
	Scope         NativeWebhookEventScope `json:"scope"`
	// Data holds NativeSessionWebhookData for session.* and
	// NativeResponseTerminalWebhookData for response.terminal.
	Data json.RawMessage `json:"data"`
}

// NativeWebhookEventScope identifies the Agent, Session and, for
// response.terminal, the Response.
type NativeWebhookEventScope struct {
	AgentID    string `json:"agentId"`
	SessionID  string `json:"sessionId"`
	ResponseID string `json:"responseId,omitempty"`
}

// NativeSessionWebhookData is the Session snapshot of a session.* event.
// Response input and output are never included.
type NativeSessionWebhookData struct {
	Name            string            `json:"name"`
	Metadata        map[string]string `json:"metadata"`
	ResourceVersion string            `json:"resourceVersion"`
}

// NativeResponseTerminalWebhookData is the outcome of a response.terminal
// event: completed, failed, cancelled or incomplete. ErrorCode is empty when
// the Response has no error. Read the Response for its output.
type NativeResponseTerminalWebhookData struct {
	Status    string `json:"status"`
	ErrorCode string `json:"errorCode,omitempty"`
}
