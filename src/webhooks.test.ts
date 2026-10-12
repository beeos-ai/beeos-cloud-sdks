import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { WebhookVerificationError, verifyTaskPushSignature, verifyWebhookSignature, type WebhookVerificationReason } from "./index.ts";

interface Vector { secret: string; timestamp: string; body: string; signature: string; headers?: Record<string, string>; header?: string }
const fixture = JSON.parse(readFileSync(new URL("../spec/webhook-signature-vectors.json", import.meta.url), "utf8")) as Record<"x-signature-test-vector" | "x-a2a-signature-test-vector", Vector>;
const developer = fixture["x-signature-test-vector"];
const a2a = fixture["x-a2a-signature-test-vector"];
const at = Number(developer.timestamp) * 1000;

function reasonOf(call: () => void): WebhookVerificationReason {
  try {
    call();
  } catch (error) {
    expect(error).toBeInstanceOf(WebhookVerificationError);
    return (error as WebhookVerificationError).reason;
  }
  throw new Error("expected WebhookVerificationError");
}

describe("verifyWebhookSignature", () => {
  const verify = (body: string | Uint8Array = developer.body, headers: Record<string, string> | Headers = developer.headers!, secret = developer.secret, options = { now: at }) =>
    () => verifyWebhookSignature(body, headers, secret, options);

  it("accepts the platform vector as a string, bytes, Headers and a mixed-case record", () => {
    expect(verify()).not.toThrow();
    expect(verify(new TextEncoder().encode(developer.body))).not.toThrow();
    expect(verify(developer.body, new Headers(developer.headers))).not.toThrow();
    expect(verify(developer.body, { "x-beeos-webhook-timestamp": developer.timestamp, "X-BEEOS-WEBHOOK-SIGNATURE": developer.signature })).not.toThrow();
    expect(() => verifyWebhookSignature(developer.body, { "X-BeeOS-Webhook-Timestamp": [developer.timestamp], "X-BeeOS-Webhook-Signature": [developer.signature] }, developer.secret, { now: at })).not.toThrow();
  });
  it("rejects a tampered body", () => expect(reasonOf(verify(developer.body + " "))).toBe("signature_mismatch"));
  it("rejects the wrong secret", () => expect(reasonOf(verify(developer.body, developer.headers, developer.secret.replace("docs", "evil")))).toBe("signature_mismatch"));
  it("rejects a signature of the wrong shape", () => {
    expect(reasonOf(verify(developer.body, { ...developer.headers!, "X-BeeOS-Webhook-Signature": "abc" }))).toBe("signature_mismatch");
    expect(reasonOf(verify(developer.body, { ...developer.headers!, "X-BeeOS-Webhook-Signature": "z".repeat(64) }))).toBe("signature_mismatch");
  });
  it("rejects a timestamp outside the tolerance, in both directions, and honors the option", () => {
    expect(reasonOf(verify(developer.body, developer.headers, developer.secret, { now: at + 301_000 }))).toBe("timestamp_out_of_tolerance");
    expect(reasonOf(verify(developer.body, developer.headers, developer.secret, { now: at - 301_000 }))).toBe("timestamp_out_of_tolerance");
    expect(verify(developer.body, developer.headers, developer.secret, { now: at + 300_000 })).not.toThrow();
    expect(reasonOf(() => verifyWebhookSignature(developer.body, developer.headers!, developer.secret, { now: at + 11_000, toleranceSeconds: 10 }))).toBe("timestamp_out_of_tolerance");
  });
  it("rejects a timestamp that is not integer unix seconds", () => {
    for (const timestamp of ["", "abc", "1700000000.5", "-1", "1e9", " 1700000000"]) {
      expect(reasonOf(verify(developer.body, { ...developer.headers!, "X-BeeOS-Webhook-Timestamp": timestamp })), timestamp).toBe("invalid_timestamp");
    }
  });
  it("rejects a missing header", () => {
    expect(reasonOf(verify(developer.body, { "X-BeeOS-Webhook-Signature": developer.signature }))).toBe("missing_header");
    expect(reasonOf(verify(developer.body, { "X-BeeOS-Webhook-Timestamp": developer.timestamp }))).toBe("missing_header");
    expect(reasonOf(verify(developer.body, {}))).toBe("missing_header");
  });
  it("rejects a repeated header", () => {
    expect(reasonOf(verify(developer.body, { "X-BeeOS-Webhook-Timestamp": developer.timestamp, "x-beeos-webhook-timestamp": developer.timestamp, "X-BeeOS-Webhook-Signature": developer.signature }))).toBe("invalid_header");
  });
  it("rejects a secret shorter than 32 bytes before looking at the request", () => {
    expect(reasonOf(verify(developer.body, {}, "s".repeat(31)))).toBe("secret_too_short");
    expect(reasonOf(verify(developer.body, developer.headers, "é".repeat(15)))).toBe("secret_too_short");
  });
});

describe("verifyTaskPushSignature", () => {
  const verify = (header: string | null = a2a.header!, body = a2a.body, secret = a2a.secret, options = { now: at }) =>
    () => verifyTaskPushSignature(body, header === null ? {} : { "X-BeeOS-Signature": header }, secret, options);
  const [timestampPart, signaturePart] = a2a.header!.split(",");
  const wrong = "0".repeat(64);

  it("accepts the platform vector", () => {
    expect(verify()).not.toThrow();
    expect(() => verifyTaskPushSignature(new TextEncoder().encode(a2a.body), new Headers({ "x-beeos-signature": a2a.header! }), a2a.secret, { now: at })).not.toThrow();
  });
  it("accepts unknown parts and several v1 values when one matches", () => {
    expect(verify(`${timestampPart},v0=${wrong},${signaturePart},unknown=1`)).not.toThrow();
    expect(verify(`${timestampPart},v1=${wrong},${signaturePart}`)).not.toThrow();
    expect(verify(`${signaturePart}, ${timestampPart}`)).not.toThrow();
  });
  it("rejects when no v1 matches", () => expect(reasonOf(verify(`${timestampPart},v1=${wrong},v1=abc`))).toBe("signature_mismatch"));
  it("rejects a tampered body and the wrong secret", () => {
    expect(reasonOf(verify(a2a.header, a2a.body.replace("true", "false")))).toBe("signature_mismatch");
    expect(reasonOf(verify(a2a.header, a2a.body, a2a.secret.replace("docs", "evil")))).toBe("signature_mismatch");
  });
  it("rejects a timestamp outside the tolerance and an invalid one", () => {
    expect(reasonOf(verify(a2a.header, a2a.body, a2a.secret, { now: at + 301_000 }))).toBe("timestamp_out_of_tolerance");
    expect(reasonOf(verify(`t=abc,${signaturePart}`))).toBe("invalid_timestamp");
  });
  it("rejects a missing or malformed header", () => {
    expect(reasonOf(verify(null))).toBe("missing_header");
    for (const header of ["", signaturePart, timestampPart, `${timestampPart},${timestampPart},${signaturePart}`, `${timestampPart},,${signaturePart}`, `${timestampPart},v1`, `${timestampPart},=${wrong}`, a2a.signature]) {
      expect(reasonOf(verify(header)), header).toBe("invalid_header");
    }
  });
  it("rejects a short secret", () => expect(reasonOf(verify(a2a.header, a2a.body, "short"))).toBe("secret_too_short"));
  it("does not accept the developer webhook framing", () => {
    expect(reasonOf(() => verifyTaskPushSignature(developer.body, developer.headers!, developer.secret, { now: at }))).toBe("missing_header");
  });
});
