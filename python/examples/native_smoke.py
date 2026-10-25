"""Typed native SDK examples. Importing this module performs no network requests.

The caller supplies a Server Key, persists each business intent's idempotency key,
and explicitly decides whether to execute these examples against an authorized API.
"""
from beeos_cloud_sdk.native import (
    AsyncNativeBeeOSClient,
    BeeOSHTTPResponse,
    NativeBeeOSClient,
    NativeMemoryReceiptResult,
    NativeResponse,
    NativeResponsePage,
    OperationContext,
)

# Every terminal NativeResponseEvent, including response.incomplete (deadline and
# max-token truncation); a missing member makes the example wait forever.
TERMINAL_EVENTS = frozenset(
    {
        "response.completed",
        "response.failed",
        "response.incomplete",
        "response.cancelled",
        "response.unknown",
    }
)


def remember_preference(
    client: NativeBeeOSClient, agent_id: str, intent: str
) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
    result = client.agents.memory.remember(
        agent_id,
        {"content": "Use UTC for reports.", "kind": "semantic", "source": {"kind": "explicit"}},
        {"idempotency_key": intent},
    )
    watermark = result.body["data"]["receipt"]["read_watermark"]
    if watermark is not None:
        client.agents.memory.recall(
            agent_id,
            {"query": "Timezone preference", "kinds": ["semantic"], "min_read_watermark": watermark},
        )
    return result


async def remember_preference_async(
    client: AsyncNativeBeeOSClient, agent_id: str, intent: str
) -> BeeOSHTTPResponse[NativeMemoryReceiptResult]:
    result = await client.agents.memory.remember(
        agent_id,
        {"content": "Use UTC for reports.", "kind": "semantic", "source": {"kind": "explicit"}},
        {"idempotency_key": intent},
    )
    watermark = result.body["data"]["receipt"]["read_watermark"]
    if watermark is not None:
        await client.agents.memory.recall(
            agent_id,
            {"query": "Timezone preference", "kinds": ["semantic"], "min_read_watermark": watermark},
        )
    return result


def one_turn(client: NativeBeeOSClient, session_id: str, intent: str) -> NativeResponse:
    context = OperationContext(idempotency_key=intent)
    stream = client.responses.create_stream(
        {"session_id": session_id, "input": [{"type": "input_text", "text": "Hello"}]},
        {"context": context},
    )
    with stream.events as events:
        for event in events:
            if event["type"] in TERMINAL_EVENTS:
                return event["response"]
    raise RuntimeError(f"Resume response {stream.response_id} events; preserve intent {intent}")


async def one_turn_async(
    client: AsyncNativeBeeOSClient, session_id: str, intent: str
) -> NativeResponse:
    # Keep context if the task is cancelled: it holds the original key and any
    # accepted resource. Reuse that intent; do not replay the prompt with a new key.
    context = OperationContext(idempotency_key=intent)
    stream = await client.responses.create_stream(
        {"session_id": session_id, "input": [{"type": "input_text", "text": "Hello"}]},
        {"context": context},
    )
    async with stream.events as events:
        async for event in events:
            if event["type"] in TERMINAL_EVENTS:
                return event["response"]
    raise RuntimeError(f"Resume response {stream.response_id} events; preserve intent {intent}")


def retain_history_after_agent_delete(
    client: NativeBeeOSClient, agent_id: str, session_id: str, intent: str
) -> BeeOSHTTPResponse[NativeResponsePage]:
    # D1 erases Agent-private state while this independently authorized history remains.
    client.agents.delete(agent_id, {"idempotency_key": intent})
    return client.sessions.list_responses(session_id)


async def create_recipe_without_compute(client: AsyncNativeBeeOSClient, intent: str) -> str:
    agent = await client.agents.create({"engine": "openclaw", "sandbox": {"template_id": "beeos/base"}}, {"idempotency_key": intent})
    # A deferred recipe is persisted without creating or waking a Sandbox.
    return agent.body["data"]["id"]
