"""Strictly typed, compile-only usage. Importing this module sends no requests."""
from beeos_cloud_sdk import (
    BeeOSClient,
    CreateServerInstanceInput,
    ListHarnessesResponse,
    RuntimeInstanceResult,
    UHPCreateResponseJSONRequest,
    UHPCreateResponseJSONRequestMetadataOpen,
    UHPDiscovery,
    UHPResponse,
)


def typed_usage(client: BeeOSClient) -> tuple[RuntimeInstanceResult, UHPResponse, ListHarnessesResponse, UHPDiscovery]:
    instance_input: CreateServerInstanceInput = {
        "name": "typed-example",
        "variant_id": "variant-from-catalog",
        "llm": {
            "providers": [{"id": "custom", "protocol": "openai", "base_url": "https://provider.example/v1", "api_key": "provided-at-runtime"}],
            "models": [{"provider_id": "custom", "model": "example-model", "role": "primary", "order": 0}],
        },
    }
    instance = client.with_external_user("customer-42").instances.create(instance_input, {"Idempotency-Key": "example-operation-42"})
    response_input: UHPCreateResponseJSONRequest = {"input": "Hello", "stream": False, "metadata": UHPCreateResponseJSONRequestMetadataOpen(harness_id="harness-1", trace_id="trace-1")}
    response = client.responses.create(response_input)
    client.responses.get(response["id"])
    client.responses.get_input_items(response["id"])
    return instance, response, client.harnesses.list(), client.catalog.get_discovery()


# Constructing a client never performs a network request.
client = BeeOSClient("https://cloud.example/v1", "provided-at-runtime")


def typed_stream_usage(client: BeeOSClient) -> None:
    for event in client.responses.create_stream({"input": "Hello"}):
        sequence: int = event["sequence_number"]
        event_type: str = event["type"]
        print(sequence, event_type)


def typed_runtime_documents(client: BeeOSClient) -> tuple[str, str, str]:
    terminal = client.instances.create_terminal_session("instance-1", {"platformAgentId": "agent-1"})
    websocket_url: str = terminal["websocketUrl"]
    canvas = client.instances.create_canvas_session("instance-1", {"platformAgentId": "agent-1", "conversationId": "conversation-1"})
    relay_url: str = canvas["relayUrl"]
    harness = client.harnesses.update("chrn_1", {"base": "openclaw"})
    harness_id: str = harness["id"]
    return harness_id, websocket_url, relay_url
