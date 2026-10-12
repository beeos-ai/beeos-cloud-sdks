"""Verification of BeeOS Cloud webhook requests (hand-written, not generated).

Developer webhook: ``X-BeeOS-Webhook-Timestamp`` (unix seconds) and
``X-BeeOS-Webhook-Signature`` = lowercase hex HMAC-SHA256(secret, ``<timestamp>.<raw body>``).
A2A task push: ``X-BeeOS-Signature: t=<unix>,v1=<hex>`` with the same MAC.
The secret is used as its literal UTF-8 bytes. Pass the raw request body, not re-serialized JSON.
"""
from __future__ import annotations

import hashlib
import hmac
import re
import time
from collections.abc import Mapping
from typing import Literal

WebhookVerificationReason = Literal[
    "secret_too_short",
    "missing_header",
    "invalid_header",
    "invalid_timestamp",
    "timestamp_out_of_tolerance",
    "signature_mismatch",
]

_MIN_SECRET_BYTES = 32
_SHA256_HEX = re.compile(r"[0-9a-fA-F]{64}")
_UNIX_SECONDS = re.compile(r"[0-9]{1,15}")


class WebhookVerificationError(Exception):
    """The request must be rejected; ``reason`` says why."""

    def __init__(self, reason: WebhookVerificationReason, message: str) -> None:
        super().__init__(message)
        self.reason: WebhookVerificationReason = reason


def _header(headers: Mapping[str, str], name: str) -> str:
    wanted = name.lower()
    found: str | None = None
    for key, value in headers.items():
        if key.lower() != wanted:
            continue
        if found is not None:
            raise WebhookVerificationError("invalid_header", f"{name} must be sent once")
        found = value
    if found is None:
        raise WebhookVerificationError("missing_header", f"{name} header is missing")
    return found


def _require_secret(secret: str) -> None:
    if len(secret.encode("utf-8")) < _MIN_SECRET_BYTES:
        raise WebhookVerificationError("secret_too_short", f"secret must be at least {_MIN_SECRET_BYTES} bytes")


def _verify_mac(raw_body: bytes, timestamp: str, signatures: list[str], secret: str, now: float | None, tolerance_seconds: int) -> None:
    if _UNIX_SECONDS.fullmatch(timestamp) is None:
        raise WebhookVerificationError("invalid_timestamp", "timestamp must be integer unix seconds")
    if abs((time.time() if now is None else now) - int(timestamp)) > tolerance_seconds:
        raise WebhookVerificationError("timestamp_out_of_tolerance", "timestamp is outside the tolerance window")
    expected = hmac.new(secret.encode("utf-8"), timestamp.encode("ascii") + b"." + raw_body, hashlib.sha256).digest()
    matched = False
    for signature in signatures:
        if _SHA256_HEX.fullmatch(signature) is not None and hmac.compare_digest(bytes.fromhex(signature), expected):
            matched = True
    if not matched:
        raise WebhookVerificationError("signature_mismatch", "signature does not match")


def verify_webhook_signature(raw_body: bytes, headers: Mapping[str, str], secret: str, *, now: float | None = None, tolerance_seconds: int = 300) -> None:
    """Verify a developer webhook request; raise WebhookVerificationError when it must be rejected."""
    _require_secret(secret)
    timestamp = _header(headers, "X-BeeOS-Webhook-Timestamp")
    signature = _header(headers, "X-BeeOS-Webhook-Signature")
    _verify_mac(raw_body, timestamp, [signature], secret, now, tolerance_seconds)


def verify_task_push_signature(raw_body: bytes, headers: Mapping[str, str], secret: str, *, now: float | None = None, tolerance_seconds: int = 300) -> None:
    """Verify an A2A task push request (``X-BeeOS-Signature: t=<unix>,v1=<hex>[,v1=<hex>...]``)."""
    _require_secret(secret)
    value = _header(headers, "X-BeeOS-Signature")
    timestamp: str | None = None
    signatures: list[str] = []
    for part in value.split(","):
        key, separator, item = part.partition("=")
        if separator == "" or key == "":
            raise WebhookVerificationError("invalid_header", "X-BeeOS-Signature must be t=<unix>,v1=<hex>")
        key, item = key.strip(), item.strip()
        if key == "t":
            if timestamp is not None:
                raise WebhookVerificationError("invalid_header", "X-BeeOS-Signature has more than one t")
            timestamp = item
        elif key == "v1":
            signatures.append(item)
    if timestamp is None or not signatures:
        raise WebhookVerificationError("invalid_header", "X-BeeOS-Signature needs t and at least one v1")
    _verify_mac(raw_body, timestamp, signatures, secret, now, tolerance_seconds)
