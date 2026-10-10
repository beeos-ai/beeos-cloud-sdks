# BeeOS Cloud Server SDKs

The TypeScript package `@beeos-ai/cloud-sdk`, Python distribution
`beeos-cloud-sdk`, and Go module `github.com/beeos-ai/beeos-cloud-sdks/go/v3` share
one contract: [`spec/server.openapi.json`](spec/server.openapi.json). Version
3.0.0 generates typed request, response, query, and error models for the 108
registered Server operations. Inactive API methods and their models are removed.

```ts
import { BeeOSClient } from '@beeos-ai/cloud-sdk';
const client = new BeeOSClient({
  baseURL: 'https://api.cloud.beeos.ai/v1',
  apiKey: () => process.env.BEEOS_API_KEY!,
}).withExternalUser('customer-42');
const instance = await client.instances.create({
  name: 'example', variant_id: 'variant-from-catalog',
}, 'example-operation-42');
const response = await client.responses.create({
  input: 'Hello', metadata: { harness_id: 'configured-harness' },
});
console.log(instance.data.id, response.id);
```

Python uses `BeeOSClient(base_url, api_key).with_external_user(id)`. Go uses
`NewBeeOSClient(baseURL, keyProvider, transport)` and `WithExternalUser(id)`.
Both expose the same spec operations through typed resources. Compile-only
examples are in `examples/typescript.ts`, `python/examples/typed_smoke.py`, and
`go/examples/typed_smoke/main.go`.

Instance creation preserves the complete variant and LLM/BYOK request. Responses,
harnesses, and discovery use the producer's `/uhp/v1` surface on the same host;
other server operations use the configured `/v1` base. Non-streaming Responses
use `responses.create` / `Responses.Create`; streaming uses `createStream`,
`create_stream`, or `CreateStream`, with typed SSE events. Audio transcription
uses multipart upload. HTTP errors expose typed wire bodies; every failed HTTP response raises a typed API error with its original status.
Malformed or unrecognized error bodies use `invalid_response` and retain raw
diagnostics; transport failures without an HTTP response remain transport errors.
Python uses a 30-second default timeout, configurable with `timeout=...` and
preserved by `with_external_user`.

### Harness management (UHP)

Instance agents are managed only through UHP harnesses (`client.harnesses`,
`/uhp/v1/harnesses`): `create` (BeeOS extension `instance_id` selects the
hosting instance), `update` (PUT with a full `HarnessCreate` body), `delete`,
`get`, `list`, and `listModels`. Skills go in `skills[]` as `files[]` or as
`blob` (a Cloud Files `file_...` id, with BeeOS extensions `sha256` and
`size_bytes`); MCP servers go in `mcp_servers[]` with short-lived `headers` or
`auth` plus `expires_at`. Cloud never stores or refreshes MCP credentials: send
another PUT with fresh credentials before `expires_at`. `template_id` applies an
agent template; `default_model` sets the harness model, and a single turn can
override it with the Responses `model` field.

Harness writes are synchronous. Cloud submits the runtime operations and waits
up to 45 seconds before answering, so use an HTTP timeout of at least 60
seconds for these calls (the Python default of 30 seconds is too short). Results:

- `200`: every change is applied; the body is the resulting harness.
- `422`: validation failed and nothing was submitted; fix the request.
- `502` `harness_error`: some items failed; `error.detail.operations[]` lists
  each item's `kind`, `name` and `status`. Succeeded items are applied; resend
  the corrected request to retry the rest.
- `504` `beeos_harness_update_in_progress`: the work is still running. Wait for
  `Retry-After` and resend the identical request; Cloud re-attaches to the
  in-flight operations instead of starting new ones.

Concurrent writers are not locked; the last write wins. There is no ETag or
`If-Match` support and no skill files endpoint.

### Removed runtime methods

3.0.0 removes the runtime methods module (`/instances/{instanceId}/methods`
and its skills, models, MCP, cron, agent, session and canvas facades), the
runtime operations module and runtime capabilities. Cron has no replacement;
conversation turns use `client.responses`.

### Removed catalog modules

3.0.0 removes the skill catalog, featured skills, skill sets, MCP server catalog
and connector (connected account) modules. Those catalogs belong to the calling
product.

`JSONValue` represents genuinely open protocol extension fields. The SDK exposes
only operations registered by the pinned producer; the 14 unregistered operations
and 10 image operations without producer routes are absent from all three clients.

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
python3 generator/refresh-spec.py --producer-root /path/to/beeos-cloud-backend \
  --app-sdk-root /path/to/beeos-app-backend/services/beeos-app-service/third_party/beeos-cloud-sdk-go
```

`generator/refresh-spec.py` and `spec/sources.json` describe the pinned producer
sources and contract refresh. Generated artifacts are committed and checked by
the generator snapshot test. The TypeScript schema generator is pinned in
`package-lock.json`; the Python and Go emitters preserve their native typed
resource interfaces. Generation requires Node and Go (`gofmt`). The Python development extra pins
`mypy==2.4.0`.

## Release

No package is published by regeneration. The existing **Publish
@beeos-ai/cloud-sdk** workflow (`.github/workflows/publish.yml`) publishes the root
npm package only when a matching `v3.0.0` tag is pushed; it uses GitHub secret
`NPM_TOKEN`. The Python package has no publishing workflow in this repository.
Its wheel must be built and published separately after coordinator approval. The
Go module resides in `go/`, so its module release tag is `go/v3.0.0`. The import path is `github.com/beeos-ai/beeos-cloud-sdks/go/v3`. Go discovery
needs no package-registry secret. These tags and registry writes require the
separate release authorization.

Go subdirectory tag rules follow the [Go Modules Reference](https://go.dev/ref/mod#vcs-version).
