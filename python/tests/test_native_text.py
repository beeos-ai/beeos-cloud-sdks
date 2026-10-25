import unittest

from beeos_cloud_sdk.native_text import NativeResponseText


def delta(item, text):
    return {"type": "response.output_text.delta", "response_id": "r", "item_id": item,
            "output_index": 0, "content_index": 0, "delta": text}


class NativeResponseTextTest(unittest.TestCase):
    def test_preview_then_authoritative_terminal(self):
        text = NativeResponseText()
        self.assertEqual(text.apply({"type": "response.phase"}), "")
        text.apply(delta("r:message:0", "Hel"))
        text.apply(delta("r:message:1", "Second"))
        self.assertEqual(text.apply(delta("r:message:0", "lo")), "HelloSecond")
        self.assertEqual(text.apply({"type": "response.future"}), "HelloSecond")
        final = text.apply({"type": "response.completed", "response": {"output": [
            {"type": "output_text", "text": "Hello"}, {"type": "tool_summary"}, {"type": "output_text", "text": "Second!"}]}})
        self.assertEqual(final, "HelloSecond!")
        self.assertTrue(text.terminal)
        self.assertEqual(text.streamed, "HelloSecond")
        self.assertEqual(text.apply(delta("r:message:0", "late")), "HelloSecond!")


if __name__ == "__main__":
    unittest.main()
