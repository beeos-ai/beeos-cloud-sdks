"""SDK-1/SDK-2 live entry: sync and genuinely async Python clients against an
actually running isolated public Gateway. Unconfigured is UNQUALIFIED (skipped).

BEEOS_NATIVE_SDK_LIVE_URL=http://127.0.0.1:<port>
BEEOS_NATIVE_SDK_LIVE_API_KEY_FILE=<isolated bsk_ server key file>
"""
from __future__ import annotations

import asyncio
import os
import re
import time
import unittest
import uuid
from pathlib import Path
from typing import Any, cast

from beeos_cloud_sdk.native import (
    AsyncNativeBeeOSClient,
    BeeOSAPIError,
    NativeBeeOSClient,
    OperationContext,
    SDKWaitTimeout,
)

ORIGIN = os.environ.get("BEEOS_NATIVE_SDK_LIVE_URL", "")
KEY_FILE = os.environ.get("BEEOS_NATIVE_SDK_LIVE_API_KEY_FILE", "")
TERMINAL = {"response.completed", "response.failed", "response.cancelled", "response.unknown"}
RECIPE_TARGET: Any = {"kind": "recipe", "template": "beeos/base"}


def _key() -> str:
    if not re.fullmatch(r"https?://127\.0\.0\.1:\d+", ORIGIN):
        raise AssertionError("live SDK origin must be loopback")
    key = Path(KEY_FILE).read_text().strip()
    if not key.startswith("bsk_"):
        raise AssertionError("isolated server key required")
    return key


@unittest.skipIf(not ORIGIN and not KEY_FILE, "UNQUALIFIED: live Gateway not configured")
class LiveGatewayTest(unittest.TestCase):
    def test_sync_client(self) -> None:
        key, intent = _key(), str(uuid.uuid4())
        name = "sdk-py-sync-live-" + intent
        with NativeBeeOSClient(ORIGIN, "bsk_invalid") as anonymous:
            with self.assertRaises(BeeOSAPIError) as caught:
                anonymous.agents.list()
            self.assertEqual((caught.exception.http_status, bool(caught.exception.code), bool(caught.exception.request_id)), (401, True, True))
        with NativeBeeOSClient(ORIGIN, key) as client:
            with self.assertRaises(BeeOSAPIError) as caught:
                client.agents.get("00000000-0000-4000-8000-000000000000")
            self.assertEqual((caught.exception.http_status, bool(caught.exception.code), bool(caught.exception.request_id)), (404, True, True))
            agent_key = intent + "-agent"
            body: Any = {"engine": "openclaw", "target": RECIPE_TARGET, "name": name, "instructions": "SDK live check."}
            created = client.agents.create(body, {"idempotency_key": agent_key})
            agent = created.body["data"]
            try:
                assert created.acceptance is not None
                self.assertEqual(created.acceptance.idempotency_key, agent_key)
                self.assertTrue(created.acceptance.request_id and created.headers.request_id and created.headers.etag)
                self.assertEqual((agent["binding"], agent["publication"]["state"]), (None, "deferred"))
                replay = client.agents.create(body, {"idempotency_key": agent_key})
                self.assertEqual((replay.body["data"]["id"], replay.headers.etag), (agent["id"], created.headers.etag))
                with self.assertRaises(BeeOSAPIError) as caught:
                    client.agents.create({**body, "name": name + "-changed"}, {"idempotency_key": agent_key})
                self.assertEqual(caught.exception.http_status, 409)
                # Local deadline keeps the retry key; replaying it recovers.
                context = OperationContext()
                with self.assertRaises(SDKWaitTimeout) as timeout:
                    client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name + "-deadline"}), {"idempotency_key": intent + "-deadline", "wait_timeout_seconds": 0.000001, "context": context})
                self.assertEqual(timeout.exception.idempotency_key, intent + "-deadline")
                recovered = client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name + "-deadline"}), {"idempotency_key": intent + "-deadline"})
                client.agents.delete(recovered.body["data"]["id"], {"idempotency_key": intent + "-deadline-delete"})
                remembered = client.agents.memory.remember(agent["id"], {"content": name + " memory", "kind": "semantic", "source": {"kind": "explicit"}}, {"idempotency_key": intent + "-remember"})
                self.assertIn(remembered.body["data"]["completion"], ("durable", "recallable"))
                self.assertTrue(remembered.body["data"]["receipt"]["read_watermark"])
                session = client.sessions.create({"agent_id": agent["id"], "name": name}, {"idempotency_key": intent + "-session"}).body["data"]
                response_key = intent + "-response"
                try:
                    admitted = client.responses.create({"session_id": session["id"], "input": [{"type": "input_text", "text": name}], "timeout_seconds": 60}, {"idempotency_key": response_key})
                    self.assertEqual(admitted.status, 202)
                except BeeOSAPIError as error:  # recorded State/CP-9 behaviour without execution
                    self.assertEqual((error.http_status, error.code, bool(error.request_id)), (503, "outcome_unknown", True))
                    assert error.acceptance is None or error.acceptance.idempotency_key == response_key
                history = client.sessions.list_responses(session["id"]).body["data"]
                self.assertEqual(len(history), 1)
                response_id = history[0]["id"]
                current = client.responses.cancel(response_id, {"idempotency_key": intent + "-cancel-response"}).body["data"]
                while not current["terminal"]:
                    time.sleep(0.2)
                    current = client.responses.get(response_id).body["data"]
                self.assertEqual(current["status"], "cancelled")
                stream = client.responses.events(response_id)
                terminal = None
                for event in stream:
                    if event["type"] in TERMINAL:
                        terminal = event
                        break
                last_id = stream.last_event_id
                stream.close()
                assert terminal is not None and last_id
                self.assertEqual(terminal["type"], "response.cancelled")
                self.assertEqual(list(client.responses.events(response_id, {"last_event_id": last_id})), [])
            finally:
                client.agents.delete(agent["id"], {"idempotency_key": intent + "-agent-delete"})

    def test_async_client(self) -> None:
        asyncio.run(self._async_client())

    async def _async_client(self) -> None:
        key, intent = _key(), str(uuid.uuid4())
        name = "sdk-py-async-live-" + intent
        async with AsyncNativeBeeOSClient(ORIGIN, key) as client:
            with self.assertRaises(BeeOSAPIError) as caught:
                await client.agents.get("00000000-0000-4000-8000-000000000000")
            self.assertEqual((caught.exception.http_status, bool(caught.exception.request_id)), (404, True))
            # Two concurrent requests on one loop prove a genuinely async transport.
            first, second = await asyncio.gather(client.agents.list(), client.sessions.list())
            self.assertEqual((first.status, second.status), (200, 200))
            created = await client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name}), {"idempotency_key": intent + "-agent"})
            agent = created.body["data"]
            try:
                self.assertEqual(agent["publication"]["state"], "deferred")
                # Local task cancellation is CancelledError, not a server cancel;
                # the operation context retains the key for recovery.
                context = OperationContext()
                task = asyncio.create_task(client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name + "-cancel"}), {"idempotency_key": intent + "-cancel", "context": context}))
                await asyncio.sleep(0)
                task.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await task
                self.assertEqual(context.idempotency_key, intent + "-cancel")
                recovered = await client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name + "-cancel"}), {"idempotency_key": intent + "-cancel"})
                await client.agents.delete(recovered.body["data"]["id"], {"idempotency_key": intent + "-cancel-delete"})
                with self.assertRaises(SDKWaitTimeout):
                    await client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name + "-deadline"}), {"idempotency_key": intent + "-deadline", "wait_timeout_seconds": 0.000001})
                recovered = await client.agents.create(cast(Any, {"engine": "openclaw", "target": RECIPE_TARGET, "name": name + "-deadline"}), {"idempotency_key": intent + "-deadline"})
                await client.agents.delete(recovered.body["data"]["id"], {"idempotency_key": intent + "-deadline-delete"})
                remembered = await client.agents.memory.remember(agent["id"], {"content": name + " memory", "kind": "semantic", "source": {"kind": "explicit"}}, {"idempotency_key": intent + "-remember"})
                self.assertIn(remembered.body["data"]["completion"], ("durable", "recallable"))
                session = (await client.sessions.create({"agent_id": agent["id"], "name": name}, {"idempotency_key": intent + "-session"})).body["data"]
                try:
                    await client.responses.create({"session_id": session["id"], "input": [{"type": "input_text", "text": name}], "timeout_seconds": 60}, {"idempotency_key": intent + "-response"})
                except BeeOSAPIError as error:
                    self.assertEqual((error.http_status, error.code), (503, "outcome_unknown"))
                history = (await client.sessions.list_responses(session["id"])).body["data"]
                self.assertEqual(len(history), 1)
                response_id = history[0]["id"]
                current = (await client.responses.cancel(response_id, {"idempotency_key": intent + "-cancel-response"})).body["data"]
                while not current["terminal"]:
                    await asyncio.sleep(0.2)
                    current = (await client.responses.get(response_id)).body["data"]
                self.assertEqual(current["status"], "cancelled")
                stream = await client.responses.events(response_id)
                terminal = None
                async for event in stream:
                    if event["type"] in TERMINAL:
                        terminal = event
                        break
                last_id = stream.last_event_id
                await stream.aclose()
                assert terminal is not None and last_id
                self.assertEqual(terminal["type"], "response.cancelled")
                resumed = await client.responses.events(response_id, {"last_event_id": last_id})
                self.assertEqual([event async for event in resumed], [])
            finally:
                await client.agents.delete(agent["id"], {"idempotency_key": intent + "-agent-delete"})


if __name__ == "__main__":
    unittest.main()
