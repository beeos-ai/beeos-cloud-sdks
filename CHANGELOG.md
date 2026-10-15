# Changelog

## Unreleased

### Docs

- The Server API spec now carries field and parameter descriptions for the instances
  resource (and its types) in `src/models.ts`, taken from the producer's source
  comments. No API or behavior change.

## 3.1.0 (2026-10-14) — `@beeos-ai/cloud-sdk`, Python `beeos-cloud-sdk`, Go `go/v3`

### BREAKING

- Removed `agents.invoke` (Python `agents.invoke`, Go `AgentsResource.Invoke`),
  `POST /v1/agents/{agentId}/invoke`, and the types `AgentInvokeInput`,
  `AgentInvokeResult`, `AgentAttachment`, `InvokeAgentOptions` and
  `InvokeAgentResponse`. The server
  route has been removed; it was no longer usable (it returned 504).
- Removed the `tasks` resource (`create`, `list`, `get`, `listMessages`, `cancel`,
  `continueTask`; Python `list_messages` / `continue_task`; Python and Go
  `TasksResource`) and its types (`CreateTaskInput`, `CreateTaskResult`,
  `CreateTaskResponse`, `Task`, `TaskResponse`, `TaskPage`, `CancelTaskInput`,
  `ContinueTaskInput` and the `*AgentTask*` operation types) for
  `/v1/agents/{agentId}/tasks`. The server never executed these tasks: they
  stayed `queued` forever, and the routes are removed.
- A2A (`a2a.*`, `/v1/a2a/{agentId}/tasks`) and the A2A task push verifiers
  (`verifyTaskPushSignature`, `verify_task_push_signature`,
  `VerifyTaskPushSignature`) are unchanged.
- The Server API now has 103 operations (110 in 3.0.0). The Go module path stays
  `github.com/beeos-ai/beeos-cloud-sdks/go/v3`.

### Migration

Use UHP `POST /uhp/v1/responses` (`client.responses`). The target is the
harness id (`chrn_*`) in `metadata.harness_id`, replacing the `agentId` path
argument. One request, three modes:

| Old | New |
|---|---|
| `agents.invoke` (wait for the reply) | `responses.create({ input, metadata: { harness_id } })` (`stream: false`) |
| streaming | `responses.createStream(...)` (`stream: true`, typed SSE events) |
| `tasks.create` + polling | `responses.create({ ..., background: true })`, then `responses.get(id)` / `responses.getEvents(id)` / `responses.cancel(id)` |

TypeScript:

```ts
// before (3.0.0)
const result = await client.agents.invoke('agent-1', { message: 'Hello' }, 'op-1');
console.log(result.text);

// after (3.1.0)
const response = await client.responses.create(
  { input: 'Hello', metadata: { harness_id: 'chrn_1' } }, 'op-1');
console.log(response.output);

// streaming
for await (const event of await client.responses.createStream(
  { input: 'Hello', metadata: { harness_id: 'chrn_1' } })) {
  if (event.type === 'response.output_text.delta') process.stdout.write(event.delta ?? '');
}

// background (replaces tasks.create)
const started = await client.responses.create(
  { input: 'Long job', metadata: { harness_id: 'chrn_1' }, background: true }, 'op-2');
const current = await client.responses.get(started.id); // in_progress | completed | ...
await client.responses.cancel(started.id);
```

Python:

```python
# before (3.0.0)
result = client.agents.invoke("agent-1", {"message": "Hello"}, {"Idempotency-Key": "op-1"})

# after (3.1.0)
response = client.responses.create(
    {"input": "Hello", "metadata": {"harness_id": "chrn_1"}}, {"Idempotency-Key": "op-1"})

for event in client.responses.create_stream({"input": "Hello", "metadata": {"harness_id": "chrn_1"}}):
    if event["type"] == "response.output_text.delta":
        print(event.get("delta", ""), end="")

started = client.responses.create(
    {"input": "Long job", "metadata": {"harness_id": "chrn_1"}, "background": True},
    {"Idempotency-Key": "op-2"})
current = client.responses.get(started["id"])
client.responses.cancel(started["id"])
```

Go:

```go
// before (3.0.0)
result, err := client.Agents.Invoke(ctx, "agent-1", sdk.AgentInvokeInput{Message: "Hello"},
	sdk.InvokeAgentOptions{IdempotencyKey: "op-1"})

// after (3.1.0)
input, harness, key := "Hello", "chrn_1", "op-1"
response, err := client.Responses.Create(ctx, sdk.UHPCreateResponseJSONRequest{
	Input:    sdk.UHPCreateResponseJSONRequestInput{Variant1: &input},
	Metadata: &sdk.UHPCreateResponseJSONRequestMetadata{HarnessID: &harness},
}, sdk.CreateResponseOptions{IdempotencyKey: &key})

stream, err := client.Responses.CreateStream(ctx, sdk.UHPCreateResponseJSONRequest{
	Input:    sdk.UHPCreateResponseJSONRequestInput{Variant1: &input},
	Metadata: &sdk.UHPCreateResponseJSONRequestMetadata{HarnessID: &harness},
}, sdk.CreateResponseOptions{})

background := true
started, err := client.Responses.Create(ctx, sdk.UHPCreateResponseJSONRequest{
	Input:      sdk.UHPCreateResponseJSONRequestInput{Variant1: &input},
	Metadata:   &sdk.UHPCreateResponseJSONRequestMetadata{HarnessID: &harness},
	Background: &background,
}, sdk.CreateResponseOptions{IdempotencyKey: &key})
current, err := client.Responses.Get(ctx, started.ID)
_, _, _, _, _ = response, stream, started, current, err
```

## 3.0.0 — `@beeos-ai/cloud-sdk`, Python `beeos-cloud-sdk`, Go `go/v3`

Published 2026-10-12 (npm `@beeos-ai/cloud-sdk`, PyPI `beeos-cloud-sdk`, Go tags
`v3.0.0`, `go/v3.0.0`, `python/v3.0.0`). Deprecated in favor of 3.1.0: 3.0.0
contains `agents.invoke` and `tasks`, neither of which works on the server;
both are removed in 3.1.0.

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
- Every operation has a `summary`; all of them come from the producer's
  `server-operation-summaries.json`.

### Changed

- The spec is refreshed from beeos-cloud-backend main (recorded in
  `spec/sources.json`) and beeos-app-backend main. `generator/refresh-spec.py`
  now lists and reads every input at an explicit `--producer-ref` /
  `--app-sdk-ref` and fails on an unmapped or summary-less operation.
- Harness management text matches the producer: MCP servers are accepted on
  `update` (rejected on `create`), `base` must match the instance runtime, omitted
  skills are uninstalled unless bundled with the runtime, and the unsupported
  fields are only rejected when non-empty or different.
- The runtime-name field is `harness` (`agent_framework` is gone), matching the
  producer since beeos-cloud-backend #89; the producer revision recorded in
  `spec/sources.json` is the Staging release that serves it.
