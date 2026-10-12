import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verification of BeeOS Cloud webhook requests (hand-written, not generated).
 *
 * Developer webhook: `X-BeeOS-Webhook-Timestamp` (unix seconds) and
 * `X-BeeOS-Webhook-Signature` = lowercase hex HMAC-SHA256(secret, `<timestamp>.<raw body>`).
 * A2A task push: `X-BeeOS-Signature: t=<unix>,v1=<hex>` with the same MAC.
 * The secret is used as its literal UTF-8 bytes. Pass the raw request body, not re-serialized JSON.
 */

export type WebhookVerificationReason =
  | "secret_too_short"
  | "missing_header"
  | "invalid_header"
  | "invalid_timestamp"
  | "timestamp_out_of_tolerance"
  | "signature_mismatch";

export class WebhookVerificationError extends Error {
  constructor(readonly reason: WebhookVerificationReason, message: string) {
    super(message);
    this.name = "WebhookVerificationError";
  }
}

export interface WebhookVerificationOptions {
  /** Current time in milliseconds since the epoch. Defaults to Date.now(). */
  now?: number;
  /** Largest accepted distance between the signed timestamp and now. Defaults to 300. */
  toleranceSeconds?: number;
}

export type WebhookHeaders = Headers | Record<string, string | string[] | undefined>;

const MIN_SECRET_BYTES = 32;
const DEFAULT_TOLERANCE_SECONDS = 300;
const SHA256_HEX = /^[0-9a-fA-F]{64}$/;
const UNIX_SECONDS = /^[0-9]{1,15}$/;

function fail(reason: WebhookVerificationReason, message: string): never {
  throw new WebhookVerificationError(reason, message);
}

function headerValue(headers: WebhookHeaders, name: string): string | undefined {
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  const wanted = name.toLowerCase();
  let found: string | undefined;
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== wanted || value === undefined) continue;
    if (found !== undefined || (Array.isArray(value) && value.length !== 1)) fail("invalid_header", `${name} must be sent once`);
    found = Array.isArray(value) ? value[0] : value;
  }
  return found;
}

function requireHeader(headers: WebhookHeaders, name: string): string {
  return headerValue(headers, name) ?? fail("missing_header", `${name} header is missing`);
}

function verifyMac(rawBody: Uint8Array | string, timestamp: string, signatures: string[], secret: string, options: WebhookVerificationOptions): void {
  if (!UNIX_SECONDS.test(timestamp)) fail("invalid_timestamp", "timestamp must be integer unix seconds");
  const distance = Math.abs((options.now ?? Date.now()) / 1000 - Number(timestamp));
  if (distance > (options.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS)) fail("timestamp_out_of_tolerance", "timestamp is outside the tolerance window");
  const expected = createHmac("sha256", secret).update(`${timestamp}.`).update(rawBody).digest();
  let matched = false;
  for (const signature of signatures) {
    if (!SHA256_HEX.test(signature)) continue;
    const actual = Buffer.from(signature, "hex");
    if (actual.length === expected.length && timingSafeEqual(actual, expected)) matched = true;
  }
  if (!matched) fail("signature_mismatch", "signature does not match");
}

function requireSecret(secret: string): void {
  if (Buffer.byteLength(secret, "utf8") < MIN_SECRET_BYTES) fail("secret_too_short", `secret must be at least ${MIN_SECRET_BYTES} bytes`);
}

/** Verifies a developer webhook request; throws WebhookVerificationError when it must be rejected. */
export function verifyWebhookSignature(rawBody: Uint8Array | string, headers: WebhookHeaders, secret: string, options: WebhookVerificationOptions = {}): void {
  requireSecret(secret);
  const timestamp = requireHeader(headers, "X-BeeOS-Webhook-Timestamp");
  const signature = requireHeader(headers, "X-BeeOS-Webhook-Signature");
  verifyMac(rawBody, timestamp, [signature], secret, options);
}

/** Verifies an A2A task push request (`X-BeeOS-Signature: t=<unix>,v1=<hex>[,v1=<hex>...]`). */
export function verifyTaskPushSignature(rawBody: Uint8Array | string, headers: WebhookHeaders, secret: string, options: WebhookVerificationOptions = {}): void {
  requireSecret(secret);
  const value = requireHeader(headers, "X-BeeOS-Signature");
  let timestamp: string | undefined;
  const signatures: string[] = [];
  for (const part of value.split(",")) {
    const separator = part.indexOf("=");
    if (separator <= 0) fail("invalid_header", "X-BeeOS-Signature must be t=<unix>,v1=<hex>");
    const key = part.slice(0, separator).trim();
    const item = part.slice(separator + 1).trim();
    if (key === "t") {
      if (timestamp !== undefined) fail("invalid_header", "X-BeeOS-Signature has more than one t");
      timestamp = item;
    } else if (key === "v1") {
      signatures.push(item);
    }
  }
  if (timestamp === undefined || signatures.length === 0) fail("invalid_header", "X-BeeOS-Signature needs t and at least one v1");
  verifyMac(rawBody, timestamp, signatures, secret, options);
}
