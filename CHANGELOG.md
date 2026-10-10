# Changelog

## 3.0.0 — `@beeos-ai/cloud-sdk`, Python `beeos-cloud-sdk`, Go `go/v3`

### BREAKING

- The framework property and query parameter is renamed to `harness`
  on instances, instance and agent templates, file origins, agent binds, the
  deploy catalog, and `instances.create`. The value is unchanged: the product harness name (for
  example `openclaw`), not a UHP harness id (`chrn_*`).
- TypeScript and Python models expose `harness`; Go fields are `Harness` and
  the create enum is `CreateServerInstanceInputHarness`.
- The Go module path is `github.com/beeos-ai/beeos-cloud-sdks/go/v3`.
- Servers that predate the rename reject or ignore `harness`; use 3.0.0 only
  against a Cloud API that serves `harness`.
