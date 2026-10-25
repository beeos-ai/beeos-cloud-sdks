"""Accumulate ``/v2/responses/{id}/events`` text (U-1024-50)."""
from __future__ import annotations

from collections.abc import Mapping
from typing import Any

_TERMINAL = frozenset({"response.completed", "response.failed", "response.incomplete",
                       "response.cancelled", "response.unknown"})


class NativeResponseText:
    """``response.output_text.delta`` events are a live preview.

    Deltas of one ``item_id`` are appended in arrival order, items in
    first-seen order. The terminal Response ``output`` is authoritative and
    replaces the preview. Unknown future event types are ignored.
    """

    def __init__(self) -> None:
        self._items: dict[str, str] = {}
        self._final: str | None = None

    def apply(self, event: Mapping[str, Any]) -> str:
        """Apply one event and return the current text."""
        if self._final is not None:
            return self._final
        kind = event.get("type")
        if kind == "response.output_text.delta":
            self._items[event["item_id"]] = self._items.get(event["item_id"], "") + event["delta"]
        elif kind in _TERMINAL:
            self._final = "".join(item["text"] for item in event["response"]["output"] if item.get("type") == "output_text")
        return self.text

    @property
    def text(self) -> str:
        """Preview so far, or the authoritative terminal text once terminal."""
        return self._final if self._final is not None else self.streamed

    @property
    def streamed(self) -> str:
        """Concatenated deltas only, independent of the terminal snapshot."""
        return "".join(self._items.values())

    @property
    def terminal(self) -> bool:
        return self._final is not None
