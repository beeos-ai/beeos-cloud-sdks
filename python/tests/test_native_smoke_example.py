"""Dependency-free regression for the native SDK example's terminal set.

The example imports the SDK (httpx/websockets), so this test reads its syntax
tree instead of importing it. A missing response.incomplete makes one_turn and
one_turn_async wait forever on deadline or max-token terminals.
"""

import ast
import unittest
from pathlib import Path

EXAMPLE = Path(__file__).resolve().parents[1] / "examples" / "native_smoke.py"
EXPECTED = {
    "response.completed",
    "response.failed",
    "response.incomplete",
    "response.cancelled",
    "response.unknown",
}


class NativeSmokeTerminalSetTests(unittest.TestCase):
    def setUp(self):
        self.tree = ast.parse(EXAMPLE.read_text(encoding="utf-8"))

    def _terminal_events(self):
        for node in self.tree.body:
            if not isinstance(node, ast.Assign):
                continue
            if not any(isinstance(target, ast.Name) and target.id == "TERMINAL_EVENTS" for target in node.targets):
                continue
            value = node.value
            self.assertIsInstance(value, ast.Call)
            self.assertIsInstance(value.func, ast.Name)
            self.assertEqual(value.func.id, "frozenset")
            self.assertEqual(len(value.args), 1)
            return ast.literal_eval(value.args[0])
        self.fail("native_smoke.py must define TERMINAL_EVENTS")

    def test_terminal_events_include_incomplete(self):
        self.assertEqual(self._terminal_events(), EXPECTED)

    def test_both_turn_examples_use_the_shared_set(self):
        uses = [
            node
            for node in ast.walk(self.tree)
            if isinstance(node, ast.Name) and node.id == "TERMINAL_EVENTS" and isinstance(node.ctx, ast.Load)
        ]
        self.assertEqual(len(uses), 2, "both one_turn and one_turn_async must use TERMINAL_EVENTS")


if __name__ == "__main__":
    unittest.main()
