import { describe, expect, it } from "vitest";
import { NativeResponseText } from "./index.js";

const delta = (item_id: string, text: string) => ({ type: "response.output_text.delta" as const, response_id: "r", item_id, output_index: 0, content_index: 0, delta: text });

describe("NativeResponseText", () => {
  it("previews deltas in order and lets the terminal snapshot win", () => {
    const text = new NativeResponseText();
    expect(text.apply({ type: "response.phase" })).toBe("");
    text.apply(delta("r:message:0", "Hel"));
    text.apply(delta("r:message:1", "Second"));
    expect(text.apply(delta("r:message:0", "lo"))).toBe("HelloSecond");
    expect(text.apply({ type: "response.future" })).toBe("HelloSecond");
    const final = text.apply({ type: "response.completed", response_id: "r", sequence: 3,
      response: { output: [{ type: "output_text", text: "Hello" }, { type: "tool_summary" }, { type: "output_text", text: "Second!" }] } } as any);
    expect(final).toBe("HelloSecond!");
    expect(text.terminal).toBe(true);
    expect(text.streamed).toBe("HelloSecond");
    expect(text.apply(delta("r:message:0", "late"))).toBe("HelloSecond!");
  });
});
