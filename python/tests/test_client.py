import io
import json
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

from beeos_cloud_sdk import APIError, BeeOSClient, UHPCreateResponseJSONRequestMetadataOpen


class ClientTests(unittest.TestCase):
    def test_create_keeps_variant_llm_and_external_user(self):
        response = io.BytesIO(b'{"data":{"id":"instance-1"},"operation":{"id":"op-1","kind":"create","phase":"queued"}}')
        base_client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        client = base_client.with_external_user("user-1")
        self.assertIsNone(base_client.external_user_id)
        body = {"name": "example", "variant_id": "variant-1", "llm": {"providers": [{"id": "custom", "protocol": "openai", "base_url": "https://provider.example/v1", "api_key": "provided-at-runtime"}], "models": []}}
        with patch("beeos_cloud_sdk.urlopen", return_value=response) as send:
            result = client.instances.create(body, {"Idempotency-Key": "operation-1"})
            request = send.call_args.args[0]
            self.assertEqual(request.full_url, "https://cloud.example/v1/instances")
            self.assertEqual(json.loads(request.data), body)
            self.assertEqual(request.get_header("X-beeos-external-user-id"), "user-1")
            self.assertEqual(request.get_header("Authorization"), "Bearer provided-at-runtime")
            self.assertEqual(result["data"]["id"], "instance-1")

    def test_uhp_host_path_and_typed_stream(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        response = io.BytesIO(b'data: {"type":"response.created","sequence_number":0}\r\n\r\ndata: {"type":"response.completed","sequence_number":1}\n\n')
        with patch("beeos_cloud_sdk.urlopen", return_value=response) as send:
            events = list(client.responses.create_stream({"input": "hello"}))
            request = send.call_args.args[0]
            self.assertEqual(request.full_url, "https://cloud.example/uhp/v1/responses")
            self.assertTrue(json.loads(request.data)["stream"])
            self.assertEqual([event["sequence_number"] for event in events], [0, 1])

    def test_typed_error_is_visible(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        error = HTTPError("https://cloud.example/uhp/v1/responses/response-1", 404, "missing", {"Content-Type": "application/json"}, io.BytesIO(b'{"error":{"code":"not_found","message":"missing"}}'))
        with patch("beeos_cloud_sdk.urlopen", side_effect=error), self.assertRaises(APIError) as raised:
            client.responses.get("response-1")
        self.assertEqual(raised.exception.status, 404)
        self.assertEqual(raised.exception.body["error"]["code"], "not_found")

    def test_response_events_are_incremental_and_typed(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        response = io.BytesIO(b'data: {"type":"response.created","sequence_number":0}\n\ndata: {"type":"response.completed","sequence_number":1}\n\n')
        with patch("beeos_cloud_sdk.urlopen", return_value=response) as send:
            events = client.responses.get_events("response-1", {"Last-Event-ID": "0"})
            event = next(events)
            self.assertEqual(event["sequence_number"], 0)
            self.assertLess(response.tell(), len(response.getvalue()))
            self.assertEqual(send.call_args.args[0].full_url, "https://cloud.example/uhp/v1/responses/response-1/events")
            self.assertEqual(send.call_args.args[0].get_header("Last-event-id"), "0")
            events.close()

    def test_runtime_events_keep_v1_base_path(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        response = io.BytesIO(b'data: {"id":"1","operationId":"op-1","method":"agent.invoke","event":{"type":"runtime_operation_started","sequence":"1","recordedAt":"2026-10-09T00:00:00Z"}}\n\n')
        with patch("beeos_cloud_sdk.urlopen", return_value=response) as send:
            events = client.operations.get_events("op-1", "instance-1")
            self.assertEqual(next(events)["event"]["sequence"], "1")
            self.assertEqual(send.call_args.args[0].full_url, "https://cloud.example/v1/instances/instance-1/operations/op-1/events")
            events.close()

    def test_boolean_query_uses_lowercase(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        with patch("beeos_cloud_sdk.urlopen", return_value=io.BytesIO(b'{"data":[]}')) as send:
            client.catalog.list_regions({"available": True})
            self.assertIn("available=true", send.call_args.args[0].full_url)

    def test_scoped_client_session_does_not_repeat_actor_in_options(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime").with_external_user("user-1")
        with patch("beeos_cloud_sdk.urlopen", return_value=io.BytesIO(b'{}')) as send:
            client.identity.create_client_session({"client_type": "web", "requested_capabilities": []}, {"Idempotency-Key": "operation-1"})
            self.assertEqual(send.call_args.args[0].get_header("X-beeos-external-user-id"), "user-1")

    def test_rpc_string_id_and_required_idempotency(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        with patch("beeos_cloud_sdk.urlopen", return_value=io.BytesIO(b'{"jsonrpc":"2.0","id":"rpc-1","result":{}}')) as send:
            client.methods.invoke("instance-1", {"jsonrpc": "2.0", "id": "rpc-1", "method": "agent.invoke", "params": {}}, {"Idempotency-Key": "operation-1"})
            request = send.call_args.args[0]
            self.assertEqual(json.loads(request.data)["id"], "rpc-1")
            self.assertEqual(request.get_header("Idempotency-key"), "operation-1")

    def test_optional_task_cancel_body_can_be_omitted(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime").with_external_user("user-1")
        with patch("beeos_cloud_sdk.urlopen", return_value=io.BytesIO(b'{}')) as send:
            client.tasks.cancel("agent-1", "task-1", options={"Idempotency-Key": "operation-1"})
            self.assertIsNone(send.call_args.args[0].data)

    def test_cloud_and_device_binding_error_shapes(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        cloud_error = HTTPError("https://cloud.example/v1/deploy/regions", 400, "bad", {"Content-Type": "application/json"}, io.BytesIO(b'{"code":"bad_request","message":"bad","request_id":"request-1"}'))
        with patch("beeos_cloud_sdk.urlopen", side_effect=cloud_error), self.assertRaises(APIError) as raised:
            client.catalog.list_regions()
        self.assertEqual(raised.exception.body["code"], "bad_request")
        binding_error = HTTPError("https://cloud.example/v1/agent/portal/bind-sessions/missing", 404, "missing", {"Content-Type": "application/json"}, io.BytesIO(b'{"error":"not_found","message":"missing"}'))
        with patch("beeos_cloud_sdk.urlopen", side_effect=binding_error), self.assertRaises(APIError) as raised:
            client.device_bindings.get_portal("missing")
        self.assertEqual(raised.exception.body["error"], "not_found")

    def test_plaintext_http_error_keeps_status_and_body(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        error = HTTPError("https://cloud.example/v1/legacy", 404, "missing", {"Content-Type": "text/plain; charset=utf-8"}, io.BytesIO(b'404 page not found\n'))
        with patch("beeos_cloud_sdk.urlopen", side_effect=error), self.assertRaises(APIError) as raised:
            client.catalog.list_regions()
        self.assertEqual(raised.exception.status, 404)
        self.assertEqual(raised.exception.body["content_type"], "text/plain; charset=utf-8")
        self.assertEqual(raised.exception.body["body"], "404 page not found\n")

    def test_malformed_json_error_remains_visible(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        error = HTTPError("https://cloud.example/v1/deploy/regions", 400, "bad", {"Content-Type": "application/json"}, io.BytesIO(b'not-json'))
        with patch("beeos_cloud_sdk.urlopen", side_effect=error), self.assertRaises(json.JSONDecodeError):
            client.catalog.list_regions()

    def test_open_metadata_keeps_typed_fields_and_extensions(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        metadata = UHPCreateResponseJSONRequestMetadataOpen(harness_id="harness-1", trace_id="trace-1")
        with patch("beeos_cloud_sdk.urlopen", return_value=io.BytesIO(b'{}')) as send:
            client.responses.create({"input": "hello", "metadata": metadata})
            self.assertEqual(json.loads(send.call_args.args[0].data)["metadata"], {"harness_id": "harness-1", "trace_id": "trace-1"})

    def test_multipart_file(self):
        client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")
        with patch("beeos_cloud_sdk.urlopen", return_value=io.BytesIO(b'{"success":true,"data":{"text":"hello","duration_seconds":1.5}}')) as send:
            result = client.audio.transcribe({"file": b"audio-bytes"})
            request = send.call_args.args[0]
            self.assertIn("multipart/form-data; boundary=", request.get_header("Content-type"))
            self.assertIn(b"audio-bytes", request.data)
            self.assertEqual(result["data"]["text"], "hello")


if __name__ == "__main__":
    unittest.main()
