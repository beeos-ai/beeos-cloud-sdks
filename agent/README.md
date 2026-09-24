# @beeos-ai/cloud-agent-sdk

TypeScript SDK for managed BeeOS Cloud runtime registration, lease renewal, and durable command delivery.

The host retains its Ed25519 private key and supplies `signIdentityProof`. The SDK signs canonical registration and heartbeat requests through that callback and uses only the current Cloud lease for Message Service delivery. It owns the single read/renew/ack loop and reconciles ambiguous append outcomes through history without retrying an uncertain write.

OpenClaw owns command execution, WAL, poison policy, and framework adaptation. Product chat and independent Device Agent identity are not in this package. No legacy Gateway or personal messaging token fallback is provided for the managed Cloud runtime transport.

This is not `@beeos-ai/message-sdk`, `@beeos-ai/sdk`, or `@beeos-ai/cloud-sdk`. `@beeos-ai/cloud-app-sdk` is not published.
