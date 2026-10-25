import json
import unittest
from pathlib import Path
from typing import get_type_hints

from beeos_cloud_sdk import webhooks

EVENTS = json.loads((Path(__file__).resolve().parents[2] / "spec" / "native-webhook-events.json").read_text(encoding="utf-8"))["events"]


def keys(typed):
    return typed.__required_keys__, typed.__required_keys__ | typed.__optional_keys__


class NativeWebhookEventTests(unittest.TestCase):
    def check(self, value, typed):
        required, allowed = keys(typed)
        self.assertTrue(required <= set(value) <= allowed, (typed.__name__, sorted(value)))
        hints = get_type_hints(typed)
        for key, item in value.items():
            hint = hints[key]
            if isinstance(hint, type) and hasattr(hint, "__required_keys__"):
                self.check(item, hint)

    def test_examples_match_typed_dicts(self):
        self.assertTrue(EVENTS)
        for event in EVENTS:
            kind = event["event"]["type"]
            typed = webhooks.NativeResponseTerminalWebhookEvent if kind == "response.terminal" else webhooks.NativeSessionWebhookEvent
            self.check(event, typed)


if __name__ == "__main__":
    unittest.main()
