import json
import unittest
from pathlib import Path
from typing import Any, Callable

from beeos_cloud_sdk import WebhookVerificationError, verify_task_push_signature, verify_webhook_signature

FIXTURE = json.loads((Path(__file__).resolve().parents[2] / "spec" / "webhook-signature-vectors.json").read_text(encoding="utf-8"))
DEVELOPER: dict[str, Any] = FIXTURE["x-signature-test-vector"]
A2A: dict[str, Any] = FIXTURE["x-a2a-signature-test-vector"]
NOW = float(DEVELOPER["timestamp"])
WRONG = "0" * 64


class WebhookTests(unittest.TestCase):
    def reason(self, call: Callable[[], None]) -> str:
        with self.assertRaises(WebhookVerificationError) as raised:
            call()
        return raised.exception.reason

    def developer(self, body: bytes | None = None, headers: dict[str, str] | None = None, secret: str | None = None, now: float = NOW, tolerance_seconds: int = 300) -> Callable[[], None]:
        return lambda: verify_webhook_signature(
            DEVELOPER["body"].encode() if body is None else body,
            DEVELOPER["headers"] if headers is None else headers,
            DEVELOPER["secret"] if secret is None else secret,
            now=now,
            tolerance_seconds=tolerance_seconds,
        )

    def task_push(self, header: str | None = A2A["header"], body: bytes | None = None, secret: str | None = None, now: float = NOW) -> Callable[[], None]:
        return lambda: verify_task_push_signature(
            A2A["body"].encode() if body is None else body,
            {} if header is None else {"X-BeeOS-Signature": header},
            A2A["secret"] if secret is None else secret,
            now=now,
        )

    def test_developer_vector_passes_with_any_header_case(self) -> None:
        self.developer()()
        lowered = {key.lower(): value for key, value in DEVELOPER["headers"].items()}
        self.developer(headers=lowered)()

    def test_developer_tampered_body_and_wrong_secret_fail(self) -> None:
        self.assertEqual(self.reason(self.developer(body=DEVELOPER["body"].encode() + b" ")), "signature_mismatch")
        self.assertEqual(self.reason(self.developer(secret=DEVELOPER["secret"].replace("docs", "evil"))), "signature_mismatch")

    def test_developer_malformed_signature_fails(self) -> None:
        for signature in ["abc", "z" * 64, ""]:
            headers = {**DEVELOPER["headers"], "X-BeeOS-Webhook-Signature": signature}
            self.assertEqual(self.reason(self.developer(headers=headers)), "signature_mismatch", signature)

    def test_developer_timestamp_tolerance(self) -> None:
        self.assertEqual(self.reason(self.developer(now=NOW + 301)), "timestamp_out_of_tolerance")
        self.assertEqual(self.reason(self.developer(now=NOW - 301)), "timestamp_out_of_tolerance")
        self.developer(now=NOW + 300)()
        self.assertEqual(self.reason(self.developer(now=NOW + 11, tolerance_seconds=10)), "timestamp_out_of_tolerance")

    def test_developer_timestamp_must_be_integer_seconds(self) -> None:
        for timestamp in ["", "abc", "1700000000.5", "-1", "1e9", " 1700000000", "１７００００００００"]:
            headers = {**DEVELOPER["headers"], "X-BeeOS-Webhook-Timestamp": timestamp}
            self.assertEqual(self.reason(self.developer(headers=headers)), "invalid_timestamp", timestamp)

    def test_developer_missing_or_repeated_header_fails(self) -> None:
        self.assertEqual(self.reason(self.developer(headers={"X-BeeOS-Webhook-Signature": DEVELOPER["signature"]})), "missing_header")
        self.assertEqual(self.reason(self.developer(headers={"X-BeeOS-Webhook-Timestamp": DEVELOPER["timestamp"]})), "missing_header")
        self.assertEqual(self.reason(self.developer(headers={})), "missing_header")
        repeated = {**DEVELOPER["headers"], "x-beeos-webhook-timestamp": DEVELOPER["timestamp"]}
        self.assertEqual(self.reason(self.developer(headers=repeated)), "invalid_header")

    def test_short_secret_fails_before_the_request_is_read(self) -> None:
        self.assertEqual(self.reason(self.developer(headers={}, secret="s" * 31)), "secret_too_short")
        self.assertEqual(self.reason(self.developer(secret="é" * 15)), "secret_too_short")
        self.assertEqual(self.reason(self.task_push(secret="short")), "secret_too_short")

    def test_task_push_vector_passes(self) -> None:
        self.task_push()()
        verify_task_push_signature(A2A["body"].encode(), {"x-beeos-signature": A2A["header"]}, A2A["secret"], now=NOW)

    def test_task_push_accepts_unknown_parts_and_multiple_v1(self) -> None:
        timestamp_part, signature_part = A2A["header"].split(",")
        self.task_push(f"{timestamp_part},v0={WRONG},{signature_part},unknown=1")()
        self.task_push(f"{timestamp_part},v1={WRONG},{signature_part}")()
        self.task_push(f"{signature_part}, {timestamp_part}")()
        self.assertEqual(self.reason(self.task_push(f"{timestamp_part},v1={WRONG},v1=abc")), "signature_mismatch")

    def test_task_push_tampered_body_wrong_secret_and_time_fail(self) -> None:
        self.assertEqual(self.reason(self.task_push(body=A2A["body"].replace("true", "false").encode())), "signature_mismatch")
        self.assertEqual(self.reason(self.task_push(secret=A2A["secret"].replace("docs", "evil"))), "signature_mismatch")
        self.assertEqual(self.reason(self.task_push(now=NOW + 301)), "timestamp_out_of_tolerance")
        self.assertEqual(self.reason(self.task_push(f"t=abc,v1={A2A['signature']}")), "invalid_timestamp")

    def test_task_push_missing_or_malformed_header_fails(self) -> None:
        timestamp_part, signature_part = A2A["header"].split(",")
        self.assertEqual(self.reason(self.task_push(None)), "missing_header")
        for header in ["", signature_part, timestamp_part, f"{timestamp_part},{timestamp_part},{signature_part}", f"{timestamp_part},,{signature_part}", f"{timestamp_part},v1", f"{timestamp_part},={WRONG}", A2A["signature"]]:
            self.assertEqual(self.reason(self.task_push(header)), "invalid_header", header)

    def test_task_push_does_not_accept_developer_headers(self) -> None:
        call = lambda: verify_task_push_signature(DEVELOPER["body"].encode(), DEVELOPER["headers"], DEVELOPER["secret"], now=NOW)
        self.assertEqual(self.reason(call), "missing_header")


if __name__ == "__main__":
    unittest.main()
