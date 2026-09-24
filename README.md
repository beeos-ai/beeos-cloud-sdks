# @beeos-ai/cloud-sdk

BeeOS Cloud server SDK for ISV backends. One package, credential is `bsk_` only.

This is not `@beeos-ai/sdk` and not an App client SDK. `@beeos-ai/cloud-app-sdk` is not published.

```ts
import { BeeOSClient } from "@beeos-ai/cloud-sdk";

const client = new BeeOSClient({
  baseURL: "https://api.cloud.beeos.ai/v1",
  apiKey: process.env.BEEOS_API_KEY!,
});
```
