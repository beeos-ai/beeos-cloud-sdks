# BeeOS Cloud Server SDKs

The TypeScript package `@beeos-ai/cloud-sdk`, Python distribution
`beeos-cloud-sdk`, and Go module `github.com/beeos-ai/beeos-cloud-sdks/go/v3` share
one contract: [`spec/server.openapi.json`](spec/server.openapi.json). Version
3.1.0 generates typed request, response, query, and error models for the 103
registered Server operations. Inactive API methods and their models are removed.

```ts
import { BeeOSClient } from '@beeos-ai/cloud-sdk';
const client = new BeeOSClient({
  baseURL: 'https://api.cloud.beeos.ai/v1',
  apiKey: () => process.env.BEEOS_API_KEY!,
});
const instance = await client.instances.create({
  name: 'example', variant_id: 'variant-from-catalog',
}, 'example-operation-42');
const response = await client.responses.create({
  input: 'Hello', metadata: { harness_id: 'configured-harness' },
});
console.log(instance.data.id, response.id);
```

Python uses `BeeOSClient(base_url, api_key)`. Go uses
`NewBeeOSClient(baseURL, keyProvider, transport)`.
Both expose the same spec operations through typed resources. Organization and
app come from the server key. Compile-only
examples are in `examples/typescript.ts`, `python/examples/typed_smoke.py`, and
`go/examples/typed_smoke/main.go`.

Instance creation preserves the complete variant and LLM/BYOK request. The
`harness` field and query parameter on instances, templates, and the
catalog carry the product runtime name (for example `openclaw`), not a UHP
harness id (`chrn_*`). Responses, harnesses, and discovery use the producer's `/uhp/v1` surface on the same host;
other server operations use the configured `/v1` base. Non-streaming Responses
use `responses.create` / `Responses.Create`; streaming uses `createStream`,
`create_stream`, or `CreateStream`, with typed SSE events. Audio transcription
uses multipart upload. HTTP errors expose typed wire bodies; every failed HTTP response raises a typed API error with its original status.
Malformed or unrecognized error bodies use `invalid_response` and retain raw
diagnostics; transport failures without an HTTP response remain transport errors.
Python uses a 30-second default timeout, configurable with `timeout=...`.

### Harness management (UHP)

Instance agents are managed only through UHP harnesses (`client.harnesses`,
`/uhp/v1/harnesses`). The discovery capability `harness_management` is still
`false`; these calls work as described below regardless.

- `create`: BeeOS extension `instance_id` and `name` are required, and `base`
  must equal the instance's runtime. `template_id` (with optional
  `template_version`) creates the harness from an agent template.
  `default_model` is honored only here. A non-empty `skills` or `mcp_servers`
  is rejected (422); add them with `update`.
- `update` (PUT): an absent field is unchanged; a present list replaces the
  whole list. When `skills` is present it is diffed against the installed
  skills: listed skills with exactly one of `files[]`, `content` or `blob` (a
  Cloud Files `file_...` id with BeeOS extensions `sha256` and `size_bytes`)
  are installed; an installed skill listed with a different `enabled` flag is
  updated; installed skills that are omitted are uninstalled unless they are
  bundled with the runtime; a listed skill that is not installed and has no
  files, content or blob returns 422; `enabled: false` on a fresh install
  returns 422. When `mcp_servers` is present it is diffed against the runtime's
  MCP servers: a server sent with a credential (`headers` or `auth`, plus the
  BeeOS extension `expires_at`, at most 24 hours ahead) is set; a connected
  server sent without one is kept; omitted servers are unset. `url` must be
  https and `transport` is `http` or `sse`; `get` never returns a `url` or a
  credential. `template_id` applies an agent template. `base` is immutable.
- `get`, `list`, and `listModels` read the current state. A single turn can
  pick its model with the Responses `model` field.
- `create` and `update` with `template_id` take an optional idempotency key
  (`idempotencyKey`, `{"Idempotency-Key": ...}`, `IdempotencyKey`) of 1-128
  visible ASCII characters. The same key and request return the same harness;
  a reused key with another request returns 409 `beeos_idempotency_conflict`.
  Resend a timed-out `create` only with a key, or it creates a second harness.

Not supported by BeeOS Cloud yet (422):

| Request | Code |
|---|---|
| `delete` | `beeos_harness_delete_not_supported` |
| `default_model` different from the current one on `update` (without `template_id`) | `beeos_field_not_supported` |
| name change, non-empty `system_prompt`, `disabled_tools`, `environment` or `plugins`, any `max_step` or `timeout_seconds` (an unchanged name and empty values are accepted) | `beeos_field_not_supported` |
| non-empty `mcp_servers` when the instance runtime has no MCP methods | `beeos_mcp_not_supported` |

Harness writes are synchronous. Cloud submits the runtime operations and waits
up to 45 seconds before answering, so use an HTTP timeout of at least 60
seconds (the Python client uses at least 60 seconds for harness writes).

- `200`: every change is applied; the body is the resulting harness.
- `400` / `413`: the body is not valid JSON or the key is malformed / the body
  exceeds 4 MiB (upload large skills as a `blob`).
- `422`: validation failed or the request is unsupported; nothing was submitted.
- `409` `beeos_harness_busy`: a different write to this harness is in flight;
  retry after `Retry-After`.
- `502` `harness_error`: some items failed; `error.detail.operations[]` lists
  each item's `kind`, `name` and `status`. Succeeded items are applied; resend
  the corrected request to retry the rest.
- `503` `harness_unavailable`: the instance is not running or the operation
  journal is unavailable.
- `504` `beeos_harness_update_in_progress`: the work is still running. Wait for
  `Retry-After` and resend the identical request (with the same idempotency key
  for a create); Cloud re-attaches to the in-flight operations instead of
  starting new ones.

There is no ETag or `If-Match` support and no skill files endpoint.

### Removed runtime methods

3.0.0 removes the runtime methods module (`/instances/{instanceId}/methods`
and its skills, models, MCP, cron, agent, session and canvas facades), the
runtime operations module and runtime capabilities. Cron has no replacement;
conversation turns use `client.responses`.

### Removed catalog modules

3.0.0 removes the skill catalog, featured skills, skill sets, MCP server catalog
and connector (connected account) modules. Those catalogs belong to the calling
product.

### Removed agent invoke and tasks

3.1.0 removes `agents.invoke` and the `tasks` resource. Use `responses.create`
(sync), `responses.createStream` (streaming) or `responses.create` with
`background: true` (async); see [CHANGELOG.md](CHANGELOG.md) for the migration.

`JSONValue` represents genuinely open protocol extension fields. The SDK exposes
only operations registered by the pinned producer; the 12 unregistered operations
are absent from all three clients.

## Verifying webhooks

Cloud signs developer webhooks with `X-BeeOS-Webhook-Timestamp` and
`X-BeeOS-Webhook-Signature`, and A2A task pushes with
`X-BeeOS-Signature: t=<unix>,v1=<hex>`. Both are the lowercase hex
HMAC-SHA256 of `<timestamp>.<raw body>`; the secret (at least 32 bytes) is used
as is. Verify the raw request body before parsing it. A helper returns nothing
on success and raises/returns a `WebhookVerificationError` with a `reason`
(`secret_too_short`, `missing_header`, `invalid_header`, `invalid_timestamp`,
`timestamp_out_of_tolerance`, `signature_mismatch`); the timestamp must be within
5 minutes of now unless you change it.

```ts
import { verifyWebhookSignature, verifyTaskPushSignature } from '@beeos-ai/cloud-sdk';
verifyWebhookSignature(rawBody, request.headers, secret); // throws WebhookVerificationError
```

```python
from beeos_cloud_sdk import verify_webhook_signature, verify_task_push_signature
verify_webhook_signature(raw_body, headers, secret)  # raises WebhookVerificationError
```

```go
err := sdk.VerifyWebhookSignature(rawBody, r.Header, secret) // errors.Is(err, sdk.ErrInvalidWebhookSignature)
```

`verifyTaskPushSignature`, `verify_task_push_signature` and
`VerifyTaskPushSignature` take the same arguments. Options: `now`,
`toleranceSeconds` (TypeScript), `now`, `tolerance_seconds` (Python),
`WithNow`, `WithTolerance` (Go).

## Regeneration and verification

```sh
npm ci
npm run generate
npm run generate:check
npm test
npm run build
npm run typecheck:smoke
python3 -m pip install -e "./python[dev]"
PYTHONPATH=python mypy --strict --python-version 3.11 python/beeos_cloud_sdk python/examples/typed_smoke.py
cd go
go test ./...
go vet ./...
go build ./...
```

To refresh the pinned producer inputs first install the development-only
`spec/requirements-refresh.txt`, then run:

```sh
python3 generator/refresh-spec.py \
  --producer-root /path/to/beeos-cloud-backend --producer-ref <producer-commit> \
  --app-sdk-root /path/to/beeos-app-backend/services/beeos-app-service/third_party/beeos-cloud-sdk-go \
  --app-sdk-ref <app-backend-commit>
```

Both refs are required. Every input is listed and read with `git` at those
refs (never from the working trees) and the resolved SHAs are recorded in
`spec/sources.json`. The script fails when a live operation has no SDK resource
mapping or no summary
(`openapi/beeos-cloud/rest/server-operation-summaries.json` in the producer).

`generator/refresh-spec.py` and `spec/sources.json` describe the pinned producer
sources and contract refresh. Generated artifacts are committed and checked by
the generator snapshot test. The TypeScript schema generator is pinned in
`package-lock.json`; the Python and Go emitters preserve their native typed
resource interfaces. Generation requires Node and Go (`gofmt`). The Python development extra pins
`mypy==2.4.0`.

## Import a skill ZIP by URL

Use `client.files.importURL(input, idempotencyKey)` in TypeScript,
`client.files.import_url(...)` in Python, or `client.Files.ImportURL(...)` in Go.
Supply `source_url`, `filename`, `content_type: application/zip`, and
`checksum_sha256`; `size_bytes` is optional. The URL must be short-lived public
HTTPS on port 443. Cloud verifies the ZIP and returns a confirmed File; pass its
`file_id` to UHP as `blob`. A file import does not itself install the skill.
Configure the client transport timeout to at least 65 seconds. Do not log the
input URL or signatures. The backend route must be deployed before use;
generating this SDK does not publish a new package.

## Release

No package is published by regeneration. The existing **Publish
@beeos-ai/cloud-sdk** workflow (`.github/workflows/publish.yml`) publishes the root
npm package only when a matching `v3.1.0` tag is pushed; it uses GitHub secret
`NPM_TOKEN`. The Python package is published by
`.github/workflows/publish-python.yml` when a matching `python/v3.1.0` tag is
pushed. The Go module resides in `go/`, so its module release tag is
`go/v3.1.0`. The import path is `github.com/beeos-ai/beeos-cloud-sdks/go/v3`. Go discovery
needs no package-registry secret. These tags and registry writes require the
separate release authorization.

Go subdirectory tag rules follow the [Go Modules Reference](https://go.dev/ref/mod#vcs-version).

### Agent execution references

Agent list, get and update responses include a read-only `harness_id`. Use the
agent `id` for conversation APIs and the returned `harness_id` in UHP
`metadata.harness_id`. Both identify the same agent; clients must not construct
the reference from a name, list position or ID prefix. The reference does not
assert that the instance is online or execution is authorized. Older deployments
may not return this field; wait for the matching backend rollout before relying
on it. UHP request parameters are unchanged.
