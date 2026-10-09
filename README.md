# BeeOS Cloud Server SDKs

The TypeScript package `@beeos-ai/cloud-sdk`, Python distribution
`beeos-cloud-sdk`, and Go module `github.com/beeos-ai/beeos-cloud-sdks/go` share
one contract: [`spec/server.openapi.json`](spec/server.openapi.json). Version
1.1.0 adds generated request, response, query, and error models, with the existing
TypeScript constructor and resource helpers preserved.

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
uses multipart upload. HTTP errors expose typed wire bodies; JSON and transport
failures propagate without retries or fallback values.

`JSONValue` is reserved for genuinely open protocol extension fields and the
previously shipped image APIs whose producer schemas are absent. The spec marks
`legacy-undocumented` and `not-routed` operations explicitly; their
continued presence preserves public SDK methods and does not imply a live server
route.

## Regeneration and verification

```sh
npm ci
npm run generate
npm run generate:check
npm test
npm run build
npm run typecheck:smoke
PYTHONPATH=python mypy --strict python/beeos_cloud_sdk python/examples/typed_smoke.py
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
resource interfaces. Generation requires Node and Go (`gofmt`).

## Release

No package is published by regeneration. The existing **Publish
@beeos-ai/cloud-sdk** workflow (`.github/workflows/publish.yml`) publishes the root
npm package only when a matching `v1.1.0` tag is pushed; it uses GitHub secret
`NPM_TOKEN`. The Python package has no publishing workflow in this repository.
Its wheel must be built and published separately after coordinator approval. The
Go module resides in `go/`, so its module release tag is `go/v1.1.0`. Go discovery
needs no package-registry secret. These tags and registry writes require the
separate release authorization.

Go subdirectory tag rules follow the [Go Modules Reference](https://go.dev/ref/mod#vcs-version).
