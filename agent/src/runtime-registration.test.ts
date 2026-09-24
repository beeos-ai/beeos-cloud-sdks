import { generateKeyPairSync, sign, verify } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runtimeIdentitySignatureMessage, type Sha256HexDigest } from "@beeos-ai/beeos-types/runtime";
import { RuntimeRegistrationCoordinator } from "./runtime-registration.js";

const digest = "d5db2c5e7c78cee73e5672a3c18a8e56179b28888f6fbb660d98ec021ca9de9b" as Sha256HexDigest;
afterEach(() => vi.useRealTimers());

function config(privateKey: ReturnType<typeof generateKeyPairSync>["privateKey"]) {
  return {
    registrationId: "registration-1", handlerIdentity: "handler-1", contractRevision: "revision-1",
    runtimeMethods: ["models/list"] as const, capabilities: ["models"] as const,
    manifestDigest: digest, journalStoreId: "journal-1", journalGeneration: "1" as const,
    instanceIdentityKeyId: "key-1", targetInstanceId: "inst_123",
    signIdentityProof: (message: Uint8Array) => sign(null, message, privateKey),
  };
}

const active = {
  status: "active" as const, instanceId: "inst_123", runtimeEpoch: "1" as const,
  journalStoreId: "journal-1", journalGeneration: "1" as const,
  leaseId: "lease-1", issuedAt: "2026-09-23T00:00:00.000Z",
  leaseExpiresAt: "2099-01-01T00:00:00.000Z", heartbeatIntervalMs: 20_000,
  runtimeLeaseCredential: "lease-jwt",
};

describe("Cloud runtime registration authority", () => {
  it("signs canonical target-bound registration and heartbeat without owning the key", async () => {
    vi.useFakeTimers();
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const register = vi.fn(async (request: any) => {
      const message = runtimeIdentitySignatureMessage({
        purpose: request.signaturePurpose, instanceIdentityKeyId: request.instanceIdentityKeyId,
        targetInstanceId: request.targetInstanceId, signedAt: request.signedAt,
        nonce: request.nonce, payloadHash: request.payloadHash,
      });
      expect(verify(null, message, publicKey, Buffer.from(request.signature, "base64url"))).toBe(true);
      return active;
    });
    const heartbeat = vi.fn(async () => ({ status: "expired" as const }));
    const lost = vi.fn();
    const coordinator = new RuntimeRegistrationCoordinator({ register, heartbeat },
      config(privateKey), lost, () => Date.parse("2026-09-23T00:00:00.000Z"));
    await coordinator.start();
    expect(coordinator.canClaimMutations).toBe(true);
    await vi.advanceTimersByTimeAsync(20_000);
    expect(heartbeat).toHaveBeenCalledOnce();
    expect(coordinator.canClaimMutations).toBe(false);
    coordinator.stop();
  });

  it("ignores a late registration after stop and rejects another target instance", async () => {
    const { privateKey } = generateKeyPairSync("ed25519");
    let complete!: (value: typeof active) => void;
    const register = vi.fn(() => new Promise<typeof active>((resolve) => { complete = resolve; }));
    const lost = vi.fn();
    const coordinator = new RuntimeRegistrationCoordinator({ register,
      heartbeat: async () => ({ status: "expired" }) }, config(privateKey), lost);
    const starting = coordinator.start();
    coordinator.stop();
    complete(active);
    expect(await starting).toBeNull();
    expect(coordinator.canClaimMutations).toBe(false);
    const wrong = new RuntimeRegistrationCoordinator({ register: async () =>
      ({ ...active, instanceId: "inst_other" }), heartbeat: async () => ({ status: "expired" }) },
    config(privateKey), lost);
    await wrong.start();
    expect(wrong.canClaimMutations).toBe(false);
    expect(lost).toHaveBeenCalledWith("fenced", expect.any(Error));
    wrong.stop();
  });
});
