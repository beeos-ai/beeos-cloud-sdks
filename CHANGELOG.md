# Changelog

## 3.0.0 — `@beeos-ai/cloud-sdk`, Python `beeos-cloud-sdk`, Go `go/v3`

Not yet published.

### BREAKING

- The Go module path is `github.com/beeos-ai/beeos-cloud-sdks/go/v3`.
- Removed the TypeScript webhook helpers `verifySvixWebhookSignature`,
  `client.appWebhooks` (`verifySvixSignature`) and `verifyTaskWebhookSignature`.
  Svix is not deployed, so the first could never verify a platform webhook, and
  the last required an `X-BeeOS-Event-Id` header that Cloud never sends. Use the
  new helpers below.
- TypeScript request-body types are named like the Python and Go types: the
  schema name for a `$ref` body (for example `CreateServerInstanceInput`,
  `UHPHarnessCreate`), otherwise `<PascalOperationId>Request` (for example
  `UpgradeInstanceRequest`). The per-operation `<PascalOperationId>Input`
  aliases (`InstanceCreateInput`, `UpdateHarnessInput`, ...) are removed.
- `harnesses.create` and `harnesses.update` take an optional idempotency key
  (TypeScript `idempotencyKey`, Python `{"Idempotency-Key": ...}`, Go
  `CreateHarnessOptions` / `UpdateHarnessOptions`); Go callers pass the options
  value.

### Added

- Webhook verification helpers for developer webhooks
  (`X-BeeOS-Webhook-Timestamp`, `X-BeeOS-Webhook-Signature`) and A2A task pushes
  (`X-BeeOS-Signature: t=<unix>,v1=<hex>`): `verifyWebhookSignature` /
  `verifyTaskPushSignature` (TypeScript), `verify_webhook_signature` /
  `verify_task_push_signature` (Python), `VerifyWebhookSignature` /
  `VerifyTaskPushSignature` (Go). All three share the vectors in
  `spec/webhook-signature-vectors.json`.
- `conversations.setReasoning` and `conversations.setApprovalMode`
  (`PUT .../conversations/{conversationId}/reasoning` and `/approval-mode`), and the
  `reasoning`, `approval_mode` and `active_response` fields of `Conversation`.
- Every operation has a `summary`, taken from the producer's
  `server-operation-summaries.json` (UHP operations keep the UHP protocol summary).

### Changed

- The spec is refreshed from beeos-cloud-backend main (recorded in
  `spec/sources.json`) and beeos-app-backend main. `generator/refresh-spec.py`
  now lists and reads every input at an explicit `--producer-ref` /
  `--app-sdk-ref` and fails on an unmapped or summary-less operation.
- Harness management text matches the producer: MCP servers are accepted on
  `update` (rejected on `create`), `base` must match the instance runtime, omitted
  skills are uninstalled unless bundled with the runtime, and the unsupported
  fields are only rejected when non-empty or different.
- The framework field stays `agent_framework`, the name the producer serves on
  main. The `harness` rename drafted for this release is not on the producer
  (beeos-cloud-backend PRs #89 and #90 are open), so 3.0.0 does not rename it.
