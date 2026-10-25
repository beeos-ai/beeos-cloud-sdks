import json
import unittest
from pathlib import Path
from typing import cast, get_args

from beeos_cloud_sdk.webhook_events import AgentWebhookEvent, AgentWebhookSnapshot, AgentWebhookType, SandboxWebhookEvent, SandboxWebhookSnapshot, SandboxWebhookStatus, SandboxWebhookType

EXAMPLES = json.loads((Path(__file__).resolve().parents[2] / "spec" / "sandbox-agent-webhook-examples.json").read_text(encoding="utf-8"))["examples"]


class WebhookEventTypeTests(unittest.TestCase):
    def test_every_published_example_fits_its_type(self) -> None:
        self.assertEqual(set(EXAMPLES), set(get_args(SandboxWebhookType)) | set(get_args(AgentWebhookType)))
        for kind, body in EXAMPLES.items():
            if kind in get_args(SandboxWebhookType):
                sandbox = cast(SandboxWebhookEvent, body)
                self.assertEqual(set(sandbox["event"]["data"]), SandboxWebhookSnapshot.__required_keys__)
                self.assertIn(sandbox["event"]["data"]["status"], get_args(SandboxWebhookStatus))
                self.assertEqual(sandbox["event"]["scope"]["sandboxId"], sandbox["event"]["data"]["id"])
            else:
                agent = cast(AgentWebhookEvent, body)
                self.assertEqual(agent["event"]["scope"]["agentId"], agent["event"]["data"]["id"])
                self.assertLessEqual(set(agent["event"]["data"]), AgentWebhookSnapshot.__required_keys__ | AgentWebhookSnapshot.__optional_keys__)
                self.assertEqual("publication" in agent["event"]["data"], kind != "agent.deleted")


if __name__ == "__main__":
    unittest.main()
