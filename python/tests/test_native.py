from __future__ import annotations

import asyncio
import inspect
import json
import os
import re
import socket
import ssl
import subprocess
import tempfile
import threading
import time
import typing
import unittest
from collections.abc import Callable
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

import httpx
from websockets.sync.client import connect as real_ws_connect
from websockets.asyncio.server import serve

import beeos_cloud_sdk.native as native
from beeos_cloud_sdk.native import (
    AsyncNativeBeeOSClient,
    BeeOSAPIError,
    NativeBeeOSClient,
    OperationContext,
    SDKWaitError,
    SDKWaitTimeout,
    SDKTransportError,
    SDKRequestTimeout,
)


class LocalAPI:
    def __init__(self, route: Callable[..., Any]) -> None:
        self.requests: list[dict[str, Any]] = []
        self.route = route
        owner = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_args: Any) -> None:
                pass

            def handle_request(self) -> None:
                content = self.rfile.read(int(self.headers.get("content-length", "0")))
                request = {"method": self.command, "path": self.path, "headers": httpx.Headers(dict(self.headers)), "body": content}
                owner.requests.append(request)
                result = owner.route(request)
                if result is None:
                    self.close_connection = True
                    return
                status, headers, body = result
                self.send_response(status)
                for key, value in headers.items():
                    self.send_header(key, value)
                if not callable(body):
                    body = body if isinstance(body, bytes) else json.dumps(body).encode()
                    self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                try:
                    if callable(body):
                        body(self)
                    else:
                        self.wfile.write(body)
                except (BrokenPipeError, ConnectionResetError):
                    pass

            do_GET = do_POST = do_PATCH = do_PUT = do_DELETE = handle_request

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=lambda: self.server.serve_forever(poll_interval=0.02), daemon=True)

    def __enter__(self) -> LocalAPI:
        self.environment = patch.dict(os.environ, {"NO_PROXY": "*", "no_proxy": "*"})
        self.environment.__enter__()
        self.thread.start()
        self.url = f"http://127.0.0.1:{self.server.server_port}"
        return self

    def __exit__(self, *_args: Any) -> None:
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(2)
        self.environment.__exit__(None, None, None)


def reply(data: Any, status: int = 200, **headers: str) -> tuple[Any, ...]:
    return status, {"Content-Type": "application/json", **headers}, {"data": data}


def agent(revision: int = 8, state: str = "preparing", prepared: int = 7, *, kind: str = "managed", sandbox_id: str = "sb_target") -> dict[str, Any]:
    target = {"kind": kind, "sandbox_id": sandbox_id} if kind == "managed" else {"kind": "recipe"}
    return {"id": "ag_1", "desired_config_revision": revision, "configuration": {"target": target},
            "publication": {"accepted_config_revision": revision, "state": state, "changed_components": ["model"], "components": []},
            "binding": {"sandbox_id": sandbox_id, "prepared_config_revision": prepared, "credential_activation_revision": 3, "state": "ready", "persona_scope": "session"}}


def receipt(completion: str) -> dict[str, Any]:
    return {"receipt": {"receipt_id": "receipt_1", "read_watermark": "wm_1", "index_watermark": "iwm_1", "source_refs": [{"kind": "assertion", "assertion_id": "assertion_1"}]}, "completion": completion}


def credential_authorization_case() -> tuple[dict[str, Any], native.AuthorizationRevoke, dict[str, Any]]:
    selectors: native.AuthorizationRevoke = {
        "tool_ids": [f"tool_{i}" for i in range(256)],
        "mcp_server_refs": [f"mcp_{i}" for i in range(64)],
        "credential_slots": [f"credential_{i}" for i in range(64)],
    }
    slots = [{"slot": f"credential_{i}", "configured": i % 2 == 0} for i in range(64)]
    desired_slots = [{"slot": f"credential_{i}", "configured": False} for i in range(64)]
    observed = {
        "id": "ag_1", "resource_version": 8, "desired_config_revision": "c3",
        "configuration": {"name": "Observed", "engine": "openclaw", "instructions": "", "model_id": None, "skills": [], "mcp_servers": [], "disabled_tools": [], "run_timeout_seconds": 300, "target": {"kind": "managed", "sandbox_id": "sb_1"}, "credential_status": {"slots": desired_slots}},
        "binding": {"binding_id": "binding_1", "sandbox_id": "sb_1", "state": "ready", "prepared_config_revision": "c1", "credential_activation_revision": "c1", "credential_status": {"slots": slots}, "persona_scope": "session", "components": [], "error": None},
        "publication": {"accepted_config_revision": "c3", "changed_components": ["credentials"], "state": "preparing", "components": []},
        "authorization": {"authorization_revision": "auth_8", "state": "enforced", "affected_scopes": [], "error": None},
        "created_at": "2026-10-24T00:00:00Z", "updated_at": "2026-10-24T00:00:00Z",
    }
    scopes = [{"kind": kind, "id": scope_id, "state": "enforced"} for kind, ids in (
        ("tool", selectors["tool_ids"]), ("mcp", selectors["mcp_server_refs"]), ("credential", selectors["credential_slots"])
    ) for scope_id in ids]
    scopes += [{"kind": "binding", "id": "binding_1", "state": "enforced"}, {"kind": "sandbox", "id": "sb_1", "state": "pending"}, {"kind": "session", "id": "session_1", "state": "unknown"}]
    enforcement = {"authorization_revision": "auth_9", "state": "partial", "affected_scopes": scopes, "error": None}
    return observed, selectors, enforcement


def snake(value: str) -> str:
    """native-python.mjs `snake`: the Python identifier used for resources/methods."""
    return re.sub(r"[^a-zA-Z0-9_]", "_", re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", value)).lower()


class NativeSyncTests(unittest.TestCase):
    def test_all_canonical_operations_have_typed_sync_async_wrappers(self) -> None:
        # The published spec copy in this repository is the SDK contract; its
        # x-sdk-* annotations are what native-python.mjs turns into wrappers, so
        # this test needs no sibling (meta-layout) repository checkout.
        base = Path(__file__).resolve().parents[2]
        spec = json.loads((base / "spec/native.openapi.json").read_text())
        operations = [
            (path, method, operation)
            for path, item in spec["paths"].items()
            for method, operation in item.items()
            if method in {"get", "post", "put", "patch", "delete"} and operation.get("operationId")
        ]
        with NativeBeeOSClient("http://localhost/v2", "key") as sync:
            async_client = AsyncNativeBeeOSClient("http://localhost/v2", "key")
            try:
                count = 0
                for path, method, operation in operations:
                    resource = ".".join(snake(part) for part in operation["x-sdk-resource"].split("."))
                    name = operation.get("x-sdk-python-method") or snake(operation.get("x-sdk-method") or operation["operationId"])
                    sync_resource, async_resource = sync, async_client
                    for segment in resource.split("."):
                        sync_resource = getattr(sync_resource, segment)
                        async_resource = getattr(async_resource, segment)
                    sync_method = getattr(sync_resource, name)
                    async_method = getattr(async_resource, name)
                    self.assertFalse(inspect.iscoroutinefunction(sync_method))
                    self.assertTrue(inspect.iscoroutinefunction(async_method))
                    self.assertIn("return", sync_method.__annotations__)
                    self.assertIn("options", sync_method.__annotations__)
                    self.assertEqual(native._OPERATIONS[operation["operationId"]].path, path)
                    self.assertEqual(native._OPERATIONS[operation["operationId"]].method, method.upper())
                    count += 1
                self.assertEqual(count, 58)
                self.assertTrue(callable(sync.sandboxes.pty.connect))
                self.assertTrue(callable(sync.sandboxes.desktop.connect))
                self.assertTrue(callable(sync.responses.create_stream))
                for model in vars(native).values():
                    if typing.is_typeddict(model):
                        typing.get_type_hints(model, vars(native), vars(native), include_extras=True)
                self.assertIn("source_refs", native.Receipt.__annotations__)
                self.assertEqual(set(native.ResponseInputItem.__annotations__), {"id", "content"})
                self.assertIn("credentials", native.NativeAgentCreate.__annotations__)
                self.assertNotIn("credentials", native.NativeAgentConfiguration.__annotations__)
                self.assertIn("credential_status", native.NativeAgentConfiguration.__annotations__)
                self.assertEqual(set(native.CredentialBindingStatus.__annotations__), {"slots"})
                self.assertEqual(set(native.CredentialPublicStatus.__annotations__), {"slot", "configured"})
            finally:
                asyncio.run(async_client.aclose())

    def test_credential_slots_and_full_combined_authorization_scopes_survive_sync_transport(self) -> None:
        observed, selectors, enforcement = credential_authorization_case()
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "GET":
                self.assertEqual(req["path"], "/v2/agents/ag_1")
                return reply(observed, ETag='"8"')
            self.assertEqual(req["path"], "/v2/agents/ag_1/authorizations/revoke")
            self.assertEqual(req["headers"]["Idempotency-Key"], "revoke_combined")
            self.assertEqual(json.loads(req["body"]), selectors)
            return reply(enforcement)
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            result = client.agents.get("ag_1")
            statuses = result.body["data"]["binding"]["credential_status"]
            self.assertEqual(statuses, observed["binding"]["credential_status"])
            self.assertEqual(len(statuses["slots"]), 64)
            self.assertEqual(statuses["slots"][:2], [{"slot": "credential_0", "configured": True}, {"slot": "credential_1", "configured": False}])
            self.assertEqual(json.loads(result.raw_body)["data"]["binding"]["credential_status"], statuses)
            desired = result.body["data"]["configuration"]["credential_status"]
            self.assertEqual(desired, observed["configuration"]["credential_status"])
            self.assertEqual(desired["slots"][0], {"slot": "credential_0", "configured": False})
            self.assertTrue(statuses["slots"][0]["configured"])
            self.assertEqual(result.body["data"]["desired_config_revision"], "c3")
            self.assertEqual(result.body["data"]["binding"]["prepared_config_revision"], "c1")
            self.assertEqual(result.body["data"]["binding"]["credential_activation_revision"], "c1")
            revoked = client.agents.revoke_authorizations("ag_1", selectors, {"idempotency_key": "revoke_combined"})
            self.assertEqual(revoked.body["data"], enforcement)
            self.assertEqual(len(revoked.body["data"]["affected_scopes"]), 387)
            self.assertEqual(revoked.body["data"]["affected_scopes"][-1], {"kind": "session", "id": "session_1", "state": "unknown"})
            observed["binding"]["credential_status"] = {"slots": []}
            observed["binding"].update(state="preparing", prepared_config_revision=None, credential_activation_revision=None)
            unprepared = client.agents.get("ag_1").body["data"]
            self.assertEqual(unprepared["binding"]["credential_status"], {"slots": []})
            self.assertEqual(unprepared["configuration"]["credential_status"], desired)
            observed["binding"] = None
            without_binding = client.agents.get("ag_1").body["data"]
            self.assertIsNone(without_binding["binding"])
            self.assertEqual(without_binding["configuration"]["credential_status"], desired)
            observed["configuration"]["credential_status"] = {"slots": []}
            empty = client.agents.get("ag_1").body["data"]
            self.assertEqual(empty["configuration"]["credential_status"], {"slots": []})
            self.assertIsNone(empty["binding"])
            self.assertEqual(len(api.requests), 5)

    def test_committed_input_source_identity_is_preserved_for_memory(self) -> None:
        source_id = "input_source_7"
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "GET":
                self.assertEqual(req["path"], "/v2/responses/resp_1/input-items")
                return 200, {"Content-Type": "application/json"}, {"data": [{"id": source_id, "content": {"type": "input_text", "text": "Use UTC"}}], "next_cursor": None, "has_more": False}
            self.assertEqual(req["path"], "/v2/agents/ag_1/memory/remember")
            self.assertEqual(json.loads(req["body"])["source"], {"kind": "response", "response_id": "resp_1", "item_id": source_id})
            return reply(receipt("durable"))
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            items = client.responses.list_input_items("resp_1")
            item = items.body["data"][0]
            self.assertEqual(item["id"], source_id)
            self.assertEqual(item["content"], {"type": "input_text", "text": "Use UTC"})
            client.agents.memory.remember("ag_1", {"content": "Use UTC", "kind": "semantic", "source": {"kind": "response", "response_id": "resp_1", "item_id": item["id"]}}, {"idempotency_key": "remember_source"})
            self.assertEqual(len(api.requests), 2)

    def test_raw_acceptance_final_headers_origin_and_progress(self) -> None:
        polls = 0
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            nonlocal polls
            self.assertEqual(req["headers"]["Authorization"], "Bearer key")
            self.assertEqual(req["path"], "/v1/sandboxes" if req["method"] == "POST" else "/v1/sandboxes/sb_1")
            if req["method"] == "POST":
                return reply({"id": "sb_1", "status": "pending"}, 202, ETag='"1"', **{"X-Request-ID": "first", "Location": "/v1/sandboxes/sb_1"})
            polls += 1
            return reply({"id": "sb_1", "status": "pending" if polls == 1 else "running"}, ETag='"2"', **{"X-Request-ID": "final"})
        with LocalAPI(route) as api, NativeBeeOSClient(api.url + "/v2", "key") as client:
            progress = []
            result = client.sandboxes.create({"template": "beeos/base"}, {"idempotency_key": "intent", "on_progress": progress.append, "poll_interval_seconds": 0})
            self.assertEqual(result.status, 200)
            self.assertEqual(result.headers.etag, '"2"')
            self.assertEqual(result.headers.request_id, "final")
            self.assertEqual(result.acceptance.status, 202)
            self.assertEqual(result.acceptance.request_id, "first")
            self.assertEqual(result.acceptance.etag, '"1"')
            self.assertEqual(result.acceptance.idempotency_key, "intent")
            self.assertEqual(len(progress), 2)
            self.assertEqual(json.loads(result.raw_body), result.body)
            self.assertNotIn("on_progress", api.requests[0]["headers"])
            self.assertNotIn("Idempotency-Key", api.requests[1]["headers"])

    def test_wait_false_and_deferred_agent_do_not_poll_or_allocate(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            self.assertEqual(req["method"], "POST")
            return reply(agent(state="deferred", kind="recipe"), 202)
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            created = client.agents.create({"engine": "openclaw"})
            self.assertEqual(created.status, 202)
            self.assertEqual(len(api.requests), 1)
            self.assertEqual(api.requests[0]["path"], "/v2/agents")
            self.assertTrue(api.requests[0]["headers"]["Idempotency-Key"])
            result = client.sandboxes.create({"template": "beeos/desktop"}, {"wait": False})
            self.assertEqual(result.status, 202)
            self.assertEqual(len(api.requests), 2)

    def test_metadata_only_agent_update_returns_without_activation_wait(self) -> None:
        current = agent(state="preparing")
        current["publication"]["changed_components"] = []
        with LocalAPI(lambda _req: reply(current)) as api, NativeBeeOSClient(api.url, "key") as client:
            result = client.agents.update("ag_1", {"name": "Updated"}, {"if_match": '"1"'})
            self.assertEqual(result.body["data"]["publication"]["state"], "preparing")
            self.assertEqual(len(api.requests), 1)

    def test_pause_omission_does_not_select_filesystem_or_fallback_after_failure(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            self.assertEqual(req["body"], b"")
            self.assertEqual(req["headers"]["If-Match"], '"1"')
            return 422, {"Content-Type": "application/json"}, {"code": "capability_unsupported", "reason": "full_state_unsupported", "message": "unavailable"}
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            with self.assertRaises(BeeOSAPIError) as caught:
                client.sandboxes.pause("sb_1", options={"if_match": '"1"'})
            self.assertEqual(caught.exception.reason, "full_state_unsupported")
            self.assertEqual(len(api.requests), 1)

    def test_agent_wait_rejects_stale_ready_and_accepts_current_revision_with_older_credentials(self) -> None:
        count = 0
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            nonlocal count
            if req["method"] == "PATCH":
                self.assertEqual(req["headers"]["If-Match"], '"17"')
                return reply(agent(state="accepted"), 202)
            count += 1
            return reply(agent(state="ready", prepared=7 if count == 1 else 8))
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            result = client.agents.update("ag_1", {"instructions": "New persona"}, {"if_match": '"17"', "poll_interval_seconds": 0})
            self.assertEqual(count, 2)
            self.assertEqual(result.status, 200)
            self.assertEqual(result.body["data"]["binding"]["credential_activation_revision"], 3)

    def test_superseded_publication_and_target_are_visible(self) -> None:
        for changed, reason in [(agent(revision=9), "publication_superseded"), (agent(sandbox_id="different"), "target_superseded")]:
            with self.subTest(reason=reason):
                with LocalAPI(lambda req: reply(agent(), 202) if req["method"] == "POST" else reply(changed)) as api, NativeBeeOSClient(api.url, "key") as client:
                    with self.assertRaises(SDKWaitError) as caught:
                        client.agents.create({"engine": "openclaw"}, {"poll_interval_seconds": 0})
                    self.assertEqual(caught.exception.reason, reason)
                    self.assertEqual(caught.exception.acceptance.status, 202)

    def test_memory_waits_only_for_canonical_durable_receipt_and_forget_returns_barrier(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["path"].endswith("/receipts/receipt_1"):
                return reply(receipt("durable"))
            body = json.loads(req["body"])
            if req["path"].endswith("/forget"):
                return reply(receipt("erasure_barrier"), 202)
            self.assertEqual(body["source"], {"kind": "explicit"})
            return reply(receipt("accepted"), 202)
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            result = client.agents.memory.remember("ag_1", {"content": "Use UTC.", "kind": "semantic", "source": {"kind": "explicit"}}, {"poll_interval_seconds": 0})
            self.assertEqual(result.body["data"]["completion"], "durable")
            self.assertEqual(result.body["data"]["receipt"]["source_refs"], [{"kind": "assertion", "assertion_id": "assertion_1"}])
            self.assertEqual(api.requests[1]["path"], "/v2/agents/ag_1/memory/receipts/receipt_1")
            count = len(api.requests)
            result = client.agents.memory.forget("ag_1", "record_1", {"expected_revision": 1, "reason": "Outdated"})
            self.assertEqual(result.status, 202)
            self.assertEqual(result.body["data"]["completion"], "erasure_barrier")
            self.assertEqual(len(api.requests), count + 1)

    def test_command_unknown_and_capture_failure_remain_honest_terminal_snapshots(self) -> None:
        for outcome in [{"id": "cmd_1", "state": "unknown"}, {"id": "cmd_1", "state": "completed", "exit_code": 0, "capture_status": "failed", "result": {"status": "invalid"}}]:
            with self.subTest(outcome=outcome):
                with LocalAPI(lambda req: reply({"id": "cmd_1", "state": "running"}, 202) if req["method"] == "POST" else reply(outcome)) as api, NativeBeeOSClient(api.url, "key") as client:
                    result = client.sandboxes.commands.run("sb_1", {"argv": ["echo", "hi"]}, {"poll_interval_seconds": 0})
                    self.assertEqual(result.body["data"], outcome)
                    self.assertEqual(api.requests[1]["path"], "/v1/sandboxes/sb_1/commands/cmd_1")
                    self.assertEqual(len(api.requests), 2)

    def test_query_headers_binary_no_content_and_retained_history_paths(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "PUT":
                self.assertEqual(req["body"], b"\x00\xff")
                self.assertEqual(req["headers"]["Content-SHA256"], "hash")
                self.assertEqual(parse_qs(urlsplit(req["path"]).query), {"path": ["/workspace/a b"]})
                return reply({"path": "/workspace/a b"})
            if req["method"] == "POST":
                return 204, {"ETag": '"3"'}, b""
            if req["path"].startswith("/v1/sandboxes?"):
                self.assertEqual(parse_qs(urlsplit(req["path"]).query)["label"], ["x=1", "y=2"])
            return reply([])
        with LocalAPI(route) as api, NativeBeeOSClient(api.url + "/v1", "key") as client:
            client.sandboxes.files.write("sb_1", b"\x00\xff", {"path": "/workspace/a b", "content_length": 2, "content_sha256": "hash"})
            client.sandboxes.list({"label": ["x=1", "y=2"]})
            result = client.sandboxes.terminate("sb_1", {"if_match": '"2"'})
            self.assertEqual((result.status, result.body), (204, None))
            client.sessions.list_responses("retained_session")
            self.assertEqual(api.requests[-1]["path"], "/v2/sessions/retained_session/responses")
            with self.assertRaises(ValueError):
                client.agents.update("ag_1", {"name": "N"}, {})
            self.assertEqual(len(api.requests), 4)

    def test_flat_and_legacy_errors_preserve_raw_envelope_without_retry(self) -> None:
        for error in [{"code": "future_code", "details": {"reason": "future_reason"}, "message": "no"}, {"error": {"code": "legacy", "reason": "old", "message": "no"}}]:
            with self.subTest(error=error):
                with LocalAPI(lambda _req: (409, {"Content-Type": "application/json", "Should-Retry": "false", "Retry-After": "7", "X-Request-ID": "req_1"}, error)) as api, NativeBeeOSClient(api.url, "key") as client:
                    with self.assertRaises(BeeOSAPIError) as caught:
                        client.responses.create({"session_id": "s_1", "input": []}, {"idempotency_key": "same"})
                    failure = caught.exception
                    self.assertEqual(failure.raw_envelope, error)
                    self.assertEqual(failure.http_status, 409)
                    self.assertFalse(failure.should_retry)
                    self.assertEqual(failure.retry_after, "7")
                    self.assertEqual(failure.request_id, "req_1")
                    self.assertIn(failure.reason, ("future_reason", "old"))
                    self.assertEqual(json.loads(failure.raw_body), error)
                    self.assertEqual(len(api.requests), 1)

    def test_failed_response_error_keeps_undeclared_detail_keys(self) -> None:
        # INT-2: an accepted turn fails with details.reason=compute_preparation_failed and the open details.runtime_code.
        error = {"code": "runtime_error", "message": "compute preparation failed", "request_id": "req_1",
                 "details": {"reason": "compute_preparation_failed", "runtime_code": "unsupported_capability"}}
        with LocalAPI(lambda _req: (200, {"Content-Type": "application/json"}, {"id": "resp_1", "status": "failed", "error": error})) as api, NativeBeeOSClient(api.url, "key") as client:
            result = client.responses.get("resp_1")
        self.assertEqual(result.body["error"]["details"], error["details"])

    def test_non_json_and_malformed_json_http_errors_keep_original_status_bytes(self) -> None:
        for content_type, payload in [("text/html", b"<h1>unavailable</h1>"), ("application/json", b"{broken")]:
            with LocalAPI(lambda _req: (503, {"Content-Type": content_type}, payload)) as api, NativeBeeOSClient(api.url, "key") as client:
                with self.assertRaises(BeeOSAPIError) as caught:
                    client.sessions.get("session_1")
                self.assertEqual(caught.exception.http_status, 503)
                self.assertEqual(caught.exception.raw_body, payload)
                self.assertEqual(caught.exception.raw_envelope, payload)
                self.assertEqual(len(api.requests), 1)

    def test_callback_error_is_preserved_with_operation_context(self) -> None:
        problem = ValueError("callback stopped")
        context = OperationContext()
        def progress(_response: Any) -> None:
            raise problem
        with LocalAPI(lambda _req: reply({"id": "sb_1", "status": "pending"}, 202)) as api, NativeBeeOSClient(api.url, "key") as client:
            with self.assertRaises(ValueError) as caught:
                client.sandboxes.create({"template": "beeos/base"}, {"context": context, "on_progress": progress})
            self.assertIs(caught.exception, problem)
            self.assertEqual(context.acceptance.resource_id, "sb_1")
            self.assertEqual(len(api.requests), 1)

    def test_sync_request_timeout_and_unknown_ack_carry_per_call_context(self) -> None:
        with LocalAPI(lambda _req: None) as api, NativeBeeOSClient(api.url, "key") as client:
            with self.assertRaises(SDKTransportError) as caught:
                client.responses.create({"session_id": "session_1", "input": []})
            error = caught.exception
            self.assertEqual(error.idempotency_key, api.requests[0]["headers"]["Idempotency-Key"])
            self.assertIsNone(error.acceptance)
            self.assertIsInstance(error.__cause__, httpx.RequestError)
        def delayed(_req: Any) -> Any:
            time.sleep(0.1)
            return reply({"id": "response_1"}, 202)
        with LocalAPI(delayed) as api, NativeBeeOSClient(api.url, "key") as client:
            with self.assertRaises(SDKRequestTimeout) as caught:
                client.responses.create({"session_id": "session_1", "input": []}, {"request_timeout_seconds": 0.02})
            self.assertTrue(caught.exception.idempotency_key)
            self.assertIsInstance(caught.exception.__cause__, httpx.TimeoutException)

    def test_sync_sse_replays_same_response_cursor_and_discards_incomplete_event(self) -> None:
        def sse(handler: Any) -> None:
            handler.wfile.write(b': heartbeat\r\nid: ev_2\r\nevent: response.phase\r\ndata: {"type":\r\ndata: "response.phase"}\r\n\r\nid: unfinished\ndata: {"unfinished": true}\n')
            handler.wfile.flush()
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "POST":
                return reply({"id": "resp_1"}, 202)
            self.assertEqual(req["path"], "/v2/responses/resp_1/events")
            return 200, {"Content-Type": "text/event-stream", "X-Request-ID": "stream"}, sse
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            created = client.responses.create_stream({"session_id": "s_1", "input": []}, {"idempotency_key": "turn_1"})
            self.assertEqual(created.response_id, "resp_1")
            with created.events as events:
                self.assertEqual(next(events), {"type": "response.phase"})
                self.assertEqual(events.last_event_id, "ev_2")
                self.assertEqual(list(events), [])
                self.assertEqual(events.last_event_id, "ev_2")
            self.assertTrue(events.closed)
            with client.responses.events("resp_1", {"last_event_id": "ev_2"}) as stream:
                next(stream)
            self.assertEqual(api.requests[-1]["headers"]["Last-Event-ID"], "ev_2")
            self.assertEqual(len([r for r in api.requests if r["method"] == "POST"]), 1)

    def test_sync_response_events_skip_unknown_types_without_closing(self) -> None:
        def sse(handler: Any) -> None:
            handler.wfile.write(b'id: 1\ndata: {"type":"response.output_text.delta","delta":"x"}\n\n'
                                b'id: 2\ndata: {"type":"response.beeos.part","kind":"assistant"}\n\n'
                                b'id: 3\ndata: {"type":"response.output","item":{"type":"output_text","text":"done"}}\n\n'
                                b'id: 4\ndata: {"type":"response.completed"}\n\n')
            handler.wfile.flush()
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            self.assertEqual(req["path"], "/v2/responses/resp_1/events")
            return 200, {"Content-Type": "text/event-stream"}, sse
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            with client.responses.events("resp_1") as events:
                self.assertEqual([event["type"] for event in events], ["response.output", "response.completed"])
                self.assertEqual(events.last_event_id, "4")
            self.assertTrue(events.closed)
            self.assertEqual(len(api.requests), 1)

    def test_create_stream_failure_keeps_original_acceptance(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "POST":
                return reply({"id": "resp_1"}, 202)
            return 410, {"Content-Type": "application/json"}, {"code": "cursor_expired", "message": "gone"}
        with LocalAPI(route) as api, NativeBeeOSClient(api.url, "key") as client:
            with self.assertRaises(BeeOSAPIError) as caught:
                client.responses.create_stream({"session_id": "s_1", "input": []}, {"idempotency_key": "turn_1"})
            self.assertEqual(caught.exception.acceptance.resource_id, "resp_1")
            self.assertEqual(caught.exception.acceptance.idempotency_key, "turn_1")
            self.assertEqual(len(api.requests), 2)


class NativeAsyncTests(unittest.IsolatedAsyncioTestCase):
    async def test_credential_slots_and_full_combined_authorization_scopes_survive_async_transport(self) -> None:
        observed, selectors, enforcement = credential_authorization_case()
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "GET":
                self.assertEqual(req["path"], "/v2/agents/ag_1")
                return reply(observed)
            self.assertEqual(req["path"], "/v2/agents/ag_1/authorizations/revoke")
            self.assertEqual(json.loads(req["body"]), selectors)
            self.assertEqual(req["headers"]["Idempotency-Key"], "revoke_combined_async")
            return reply(enforcement)
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                result = await client.agents.get("ag_1")
                statuses = result.body["data"]["binding"]["credential_status"]
                self.assertEqual(statuses, observed["binding"]["credential_status"])
                self.assertEqual(len(statuses["slots"]), 64)
                self.assertTrue(statuses["slots"][0]["configured"])
                self.assertFalse(statuses["slots"][1]["configured"])
                desired = result.body["data"]["configuration"]["credential_status"]
                self.assertEqual(desired, observed["configuration"]["credential_status"])
                self.assertFalse(desired["slots"][0]["configured"])
                self.assertEqual(result.body["data"]["desired_config_revision"], "c3")
                self.assertEqual(result.body["data"]["binding"]["prepared_config_revision"], "c1")
                self.assertEqual(result.body["data"]["binding"]["credential_activation_revision"], "c1")
                revoked = await client.agents.revoke_authorizations("ag_1", selectors, {"idempotency_key": "revoke_combined_async"})
                self.assertEqual(revoked.body["data"], enforcement)
                self.assertEqual(len(revoked.body["data"]["affected_scopes"]), 387)
                self.assertEqual(json.loads(revoked.raw_body)["data"]["affected_scopes"], enforcement["affected_scopes"])
                observed["binding"]["credential_status"] = {"slots": []}
                observed["binding"].update(state="preparing", prepared_config_revision=None, credential_activation_revision=None)
                unprepared = (await client.agents.get("ag_1")).body["data"]
                self.assertEqual(unprepared["binding"]["credential_status"], {"slots": []})
                self.assertEqual(unprepared["configuration"]["credential_status"], desired)
                observed["binding"] = None
                without_binding = (await client.agents.get("ag_1")).body["data"]
                self.assertIsNone(without_binding["binding"])
                self.assertEqual(without_binding["configuration"]["credential_status"], desired)
                observed["configuration"]["credential_status"] = {"slots": []}
                empty = (await client.agents.get("ag_1")).body["data"]
                self.assertEqual(empty["configuration"]["credential_status"], {"slots": []})
                self.assertIsNone(empty["binding"])
                self.assertEqual(len(api.requests), 5)

    async def test_concurrent_unknown_ack_failures_keep_distinct_keys_and_restore_same_intents(self) -> None:
        accepted: dict[str, str] = {}
        def route(req: dict[str, Any]) -> Any:
            key = req["headers"]["Idempotency-Key"]
            if key not in accepted:
                accepted[key] = "response_" + str(len(accepted) + 1)
                return None
            return reply({"id": accepted[key]}, 202)
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                outcomes = await asyncio.gather(
                    client.responses.create({"session_id": "session_a", "input": []}),
                    client.responses.create({"session_id": "session_b", "input": []}),
                    return_exceptions=True,
                )
                errors = []
                for outcome in outcomes:
                    self.assertIsInstance(outcome, SDKTransportError)
                    errors.append(outcome)
                    self.assertIsInstance(outcome.__cause__, httpx.RequestError)
                    self.assertIsNone(outcome.acceptance)
                    self.assertIsNone(outcome.last_response)
                self.assertNotEqual(errors[0].idempotency_key, errors[1].idempotency_key)
                for error in errors:
                    original = next(req for req in api.requests if req["headers"]["Idempotency-Key"] == error.idempotency_key)
                    restored = await client.responses.create(json.loads(original["body"]), {"context": error.operation_context})
                    self.assertEqual(restored.body["data"]["id"], accepted[error.idempotency_key])
                self.assertEqual(len(accepted), 2)
                self.assertEqual(len(api.requests), 4)

    async def test_async_request_timeout_and_stream_admission_keep_original_context(self) -> None:
        def delayed(_req: Any) -> Any:
            time.sleep(0.1)
            return reply({"id": "response_1"}, 202)
        with LocalAPI(delayed) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                with self.assertRaises(SDKRequestTimeout) as caught:
                    await client.responses.create({"session_id": "session_1", "input": []}, {"request_timeout_seconds": 0.02})
                self.assertTrue(caught.exception.idempotency_key)
                self.assertIsInstance(caught.exception.__cause__, (TimeoutError, httpx.TimeoutException))
        with LocalAPI(lambda req: reply({"id": "response_1"}, 202) if req["method"] == "POST" else None) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                with self.assertRaises(SDKTransportError) as caught:
                    await client.responses.create_stream({"session_id": "session_1", "input": []})
                error = caught.exception
                self.assertEqual(error.acceptance.resource_id, "response_1")
                self.assertEqual(error.idempotency_key, api.requests[0]["headers"]["Idempotency-Key"])
                self.assertEqual(error.last_response.status, 202)
                self.assertEqual(error.operation_context.operation_id, "createNativeResponse")
                self.assertEqual(len(api.requests), 2)

    async def test_cancel_after_acceptance_headers_preserves_status_without_inventing_id(self) -> None:
        headers_sent = threading.Event()
        def body(handler: Any) -> None:
            headers_sent.set()
            time.sleep(0.2)
            handler.wfile.write(b'{"data":{"id":"resp_1"}}')
        with LocalAPI(lambda _req: (202, {"Content-Type": "application/json", "ETag": '"1"'}, body)) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                context = OperationContext(idempotency_key="turn")
                task = asyncio.create_task(client.responses.create({"session_id": "s_1", "input": []}, {"context": context}))
                while context.acceptance is None:
                    await asyncio.sleep(0.005)
                self.assertTrue(headers_sent.is_set())
                task.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await task
                self.assertEqual(context.acceptance.status, 202)
                self.assertIsNone(context.acceptance.resource_id)
                self.assertEqual(context.acceptance.etag, '"1"')
                self.assertEqual(len(api.requests), 1)

    async def test_timeout_before_acceptance_keeps_null_id_and_original_key(self) -> None:
        def route(_req: dict[str, Any]) -> tuple[Any, ...]:
            time.sleep(0.2)
            return reply({"id": "sb_1", "status": "running"}, 202)
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                context = OperationContext(idempotency_key="persisted_intent")
                with self.assertRaises(SDKWaitTimeout) as caught:
                    await client.sandboxes.create({"template": "beeos/base"}, {"context": context, "wait_timeout_seconds": 0.04})
                self.assertIsNone(caught.exception.acceptance)
                self.assertEqual(caught.exception.idempotency_key, "persisted_intent")
                self.assertEqual(api.requests[0]["headers"]["Idempotency-Key"], "persisted_intent")

    async def test_async_http_cancellation_is_nonblocking_and_same_key_context_recovers(self) -> None:
        started = threading.Event()
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            started.set()
            if len(api.requests) == 1:
                time.sleep(0.3)
            return reply({"id": "resp_1", "terminal": False}, 202)
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                context = OperationContext()
                task = asyncio.create_task(client.responses.create({"session_id": "s_1", "input": []}, {"context": context}))
                ticks = 0
                while not started.is_set():
                    ticks += 1
                    await asyncio.sleep(0.005)
                before = time.monotonic()
                task.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await task
                self.assertLess(time.monotonic() - before, 0.15)
                self.assertGreater(ticks, 0)
                self.assertIsNone(context.acceptance)
                self.assertTrue(context.idempotency_key)
                result = await client.responses.create({"session_id": "s_1", "input": []}, {"context": context})
                self.assertEqual(result.body["data"]["id"], "resp_1")
                self.assertEqual(api.requests[0]["headers"]["Idempotency-Key"], api.requests[1]["headers"]["Idempotency-Key"])
                self.assertEqual(api.requests[0]["body"], api.requests[1]["body"])
                self.assertTrue(all(r["path"] == "/v2/responses" for r in api.requests))

    async def test_deadline_includes_initial_http_and_polling_and_preserves_acceptance(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "POST":
                time.sleep(0.04)
                return reply({"id": "sb_1", "status": "pending"}, 202)
            time.sleep(0.3)
            return reply({"id": "sb_1", "status": "running"})
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                before = time.monotonic()
                with self.assertRaises(SDKWaitTimeout) as caught:
                    await client.sandboxes.create({"template": "beeos/base"}, {"wait_timeout_seconds": 0.12, "poll_interval_seconds": 0})
                self.assertLess(time.monotonic() - before, 0.25)
                self.assertEqual(caught.exception.acceptance.status, 202)
                self.assertEqual(caught.exception.last_response.body["data"]["id"], "sb_1")
                self.assertEqual(len(api.requests), 2)

    async def test_poll_sleep_cancellation_does_not_send_remote_cancel(self) -> None:
        with LocalAPI(lambda _req: reply({"id": "sb_1", "status": "pending"}, 202)) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                context = OperationContext()
                accepted = asyncio.Event()
                task = asyncio.create_task(client.sandboxes.create({"template": "beeos/base"}, {"context": context, "on_progress": lambda _r: accepted.set(), "poll_interval_seconds": 10}))
                await asyncio.wait_for(accepted.wait(), 1)
                task.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await task
                self.assertEqual(context.acceptance.resource_id, "sb_1")
                self.assertEqual(len(api.requests), 1)

    async def test_async_sse_cancellation_closes_stream_and_no_remote_mutation(self) -> None:
        disconnected = threading.Event()
        def stream(handler: Any) -> None:
            handler.wfile.write(b'id: 1\ndata: {"type":"response.phase"}\n\n')
            handler.wfile.flush()
            handler.connection.settimeout(2)
            try:
                if handler.connection.recv(1) == b"":
                    disconnected.set()
            except (TimeoutError, OSError):
                pass
        with LocalAPI(lambda _req: (200, {"Content-Type": "text/event-stream"}, stream)) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                events = await client.responses.events("resp_1")
                self.assertEqual(await anext(events), {"type": "response.phase"})
                pending = asyncio.create_task(anext(events))
                await asyncio.sleep(0.03)
                pending.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await pending
                self.assertTrue(events.closed)
                for _ in range(50):
                    if disconnected.is_set():
                        break
                    await asyncio.sleep(0.01)
                self.assertTrue(disconnected.is_set())
                self.assertEqual(len(api.requests), 1)
                self.assertEqual(api.requests[0]["method"], "GET")

    async def test_async_composed_stream_accepts_once(self) -> None:
        def route(req: dict[str, Any]) -> tuple[Any, ...]:
            if req["method"] == "POST":
                return reply({"id": "resp_1"}, 202)
            return 200, {"Content-Type": "text/event-stream"}, b'id: end\ndata: {"type":"response.completed"}\n\n'
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                result = await client.responses.create_stream({"session_id": "s_1", "input": []})
                async with result.events as events:
                    self.assertEqual([event async for event in events], [{"type": "response.completed"}])
                self.assertEqual(result.response.acceptance.status, 202)
                self.assertTrue(events.closed)
                self.assertEqual(len(api.requests), 2)


    async def test_async_response_events_skip_unknown_types_without_closing(self) -> None:
        def route(_req: dict[str, Any]) -> tuple[Any, ...]:
            return 200, {"Content-Type": "text/event-stream"}, b'id: 1\ndata: {"type":"response.output_text.delta"}\n\nid: 2\ndata: {"type":"response.phase"}\n\n'
        with LocalAPI(route) as api:
            async with AsyncNativeBeeOSClient(api.url, "key") as client:
                events = await client.responses.events("resp_1")
                self.assertEqual([event async for event in events], [{"type": "response.phase"}])
                self.assertEqual(events.last_event_id, "2")
                self.assertTrue(events.closed)
                self.assertEqual(len(api.requests), 1)


@contextmanager
def secure_websocket_server(frames: list[dict[str, Any]], purpose: str = "pty") -> Any:
    with tempfile.TemporaryDirectory() as directory:
        cert, key = Path(directory) / "cert.pem", Path(directory) / "key.pem"
        subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-keyout", str(key), "-out", str(cert), "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        server_ssl = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        server_ssl.load_cert_chain(cert, key)
        client_ssl = ssl.create_default_context(cafile=str(cert))
        profile = "beeos-terminal-v2" if purpose == "pty" else "beeos-desktop-v1"
        async def handler(ws: Any) -> None:
            assert "Authorization" not in ws.request.headers
            assert "?" not in ws.request.path
            auth = json.loads(await ws.recv())
            frames.append(auth)
            assert auth == {"type": "authenticate", "profile": profile, "ticket": "one-use"}
            admission = {"type": "authenticated", "profile": profile, "client_id": "client_1", "sandbox_id": "sb_1"}
            if purpose == "pty":
                admission["terminal_id"] = "pty_1"
            await ws.send(json.dumps(admission))
            if purpose == "pty":
                opened = json.loads(await ws.recv())
                frames.append(opened)
                await ws.send(json.dumps({"type": "terminal.opened", "protocolVersion": 1, "clientId": "client_1", "terminalId": "pty_1", "sequence": "1", "resumed": False, "columns": 80, "rows": 24}))
                frames.append(json.loads(await ws.recv()))
            else:
                start = json.loads(await ws.recv())
                frames.append(start)
                assert start == {"type": "start", "transport_generation": 1}
                await ws.send(json.dumps({"type": "desktop_ready", "transport_generation": 1}))
            async for message in ws:
                frames.append(json.loads(message))
        ready = threading.Event()
        state: dict[str, Any] = {}
        async def run_server() -> None:
            state["loop"] = asyncio.get_running_loop()
            state["stop"] = asyncio.Event()
            async with serve(handler, "127.0.0.1", 0, ssl=server_ssl, subprotocols=[profile]) as server:
                state["port"] = server.sockets[0].getsockname()[1]
                ready.set()
                await state["stop"].wait()
        thread = threading.Thread(target=lambda: asyncio.run(run_server()), daemon=True)
        thread.start()
        assert ready.wait(2)
        try:
            yield f'wss://localhost:{state["port"]}/connect', client_ssl
        finally:
            state["loop"].call_soon_threadsafe(state["stop"].set)
            thread.join(2)


class ConnectionHelperTests(unittest.TestCase):
    def test_sync_desktop_real_tls_starts_actual_generation_one_stream(self) -> None:
        frames: list[dict[str, Any]] = []
        with secure_websocket_server(frames, "desktop") as (url, tls):
            ticket = {"id": "ticket_1", "sandbox_id": "sb_1", "purpose": "desktop", "profile": "beeos-desktop-v1", "client_id": "client_1", "ticket": "one-use", "connect_url": url}
            with LocalAPI(lambda _req: reply(ticket, 201)) as api, NativeBeeOSClient(api.url, "SERVER_SECRET") as client:
                def connect(target: str, **kwargs: Any) -> Any:
                    return real_ws_connect(target, ssl=tls, proxy=None, **kwargs)
                with patch.object(native, "sync_ws_connect", connect):
                    with client.sandboxes.desktop.connect("sb_1") as connection:
                        connection.start_desktop_stream()
                        self.assertEqual(connection.receive()["type"], "desktop_ready")
            self.assertEqual([f["type"] for f in frames], ["authenticate", "start"])
            self.assertNotIn("SERVER_SECRET", json.dumps(frames))

    def test_sync_pty_real_tls_first_frame_open_input_and_local_close(self) -> None:
        frames: list[dict[str, Any]] = []
        with secure_websocket_server(frames) as (url, tls):
            ticket = {"id": "ticket_1", "sandbox_id": "sb_1", "purpose": "pty", "profile": "beeos-terminal-v2", "client_id": "client_1", "pty_id": "pty_1", "ticket": "one-use", "connect_url": url}
            with LocalAPI(lambda _req: reply(ticket, 201)) as api, NativeBeeOSClient(api.url, "SERVER_SECRET") as client:
                def connect(target: str, **kwargs: Any) -> Any:
                    return real_ws_connect(target, ssl=tls, proxy=None, **kwargs)
                with patch.object(native, "sync_ws_connect", connect):
                    with client.sandboxes.pty.connect("sb_1", {"cols": 80, "rows": 24}) as terminal:
                        self.assertEqual(terminal.opened["type"], "terminal.opened")
                        terminal.write("echo hello\n")
            self.assertEqual([f["type"] for f in frames], ["authenticate", "terminal.open", "terminal.input"])
            self.assertEqual(frames[-1]["clientSequence"], "2")
            self.assertNotIn("SERVER_SECRET", json.dumps(frames))

    def test_async_desktop_real_tls_admission_and_renderer_owned_signaling(self) -> None:
        frames: list[dict[str, Any]] = []
        with secure_websocket_server(frames, "desktop") as (url, tls):
            ticket = {"id": "ticket_1", "sandbox_id": "sb_1", "purpose": "desktop", "profile": "beeos-desktop-v1", "client_id": "client_1", "ticket": "one-use", "connect_url": url}
            with LocalAPI(lambda _req: reply(ticket, 201)) as api:
                async def scenario() -> None:
                    async with AsyncNativeBeeOSClient(api.url, "SERVER_SECRET") as client:
                        class Connect(native._ExactAsyncConnect):
                            def __init__(self, target: str, **kwargs: Any) -> None:
                                super().__init__(target, ssl=tls, proxy=None, **kwargs)
                        with patch.object(native, "_ExactAsyncConnect", Connect):
                            connection = await client.sandboxes.desktop.connect("sb_1")
                            async with connection:
                                await connection.start_desktop_stream()
                                ready = await connection.receive()
                                self.assertEqual(ready["type"], "desktop_ready")
                asyncio.run(scenario())
            self.assertEqual([f["type"] for f in frames], ["authenticate", "start"])
            self.assertNotIn("SERVER_SECRET", json.dumps(frames))


if __name__ == "__main__":
    unittest.main()
