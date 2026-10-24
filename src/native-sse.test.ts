import { describe, expect, it } from "vitest";
import { parseNativeSSE } from "./native-sse.js";

const encoder = new TextEncoder();
function source(chunks: Uint8Array[], cancel?: () => void): ReadableStream<Uint8Array> {
  return new ReadableStream({ start(controller) { for (const chunk of chunks) controller.enqueue(chunk); controller.close(); }, cancel });
}
async function collect(stream: ReadableStream<Uint8Array>, options = {}) {
  const result = [];
  for await (const item of parseNativeSSE(stream, options)) result.push(item);
  return result;
}
describe("native SSE connection parser", () => {
  it("decodes fragmented UTF-8, mixed line endings and multiline data", async () => {
    const bytes = encoder.encode(": heartbeat\r\nid: cursor-1\revent: delta\ndata: 你好\r\ndata: world\r\nretry: 12\r\n\r\n");
    expect(await collect(source(Array.from(bytes, byte => new Uint8Array([byte]))))).toEqual([
      { id: "cursor-1", event: "delta", data: "你好\nworld", retry: 12 },
    ]);
  });
  it("persists cursor, ignores NUL ids and invalid retry and drops incomplete EOF", async () => {
    expect(await collect(source([encoder.encode("id: a\ndata: first\n\nid: bad\0id\nretry: -1\ndata: second\n\ndata: incomplete\n")]))).toEqual([
      { id: "a", data: "first" }, { id: "a", data: "second" },
    ]);
  });
  it("dispatches an empty data field but not comments or id-only events", async () => {
    expect(await collect(source([encoder.encode("id: a\n\n: ping\n\ndata:\n\nid:\ndata: reset\n\n")]))).toEqual([
      { id: "a", data: "" }, { id: "", data: "reset" },
    ]);
  });
  it("bounds event bytes across individually short lines and bounds UTF-8 line bytes", async () => {
    await expect(collect(source([encoder.encode("data: a\ndata: b\n\n")]), { maxEventBytes: 10 })).rejects.toThrow("maxEventBytes");
    await expect(collect(source([encoder.encode("data: 你好\n\n")]), { maxEventBytes: 10 })).rejects.toThrow("maxEventBytes");
  });
  it("resets the byte limit at event boundaries", async () => {
    expect(await collect(source([encoder.encode("data: a\n\ndata: b\n\n")]), { maxEventBytes: 7 })).toHaveLength(2);
  });
  it("aborts a pending read, cancels its source and releases the reader", async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({ cancel() { cancelled = true; } });
    const controller = new AbortController();
    const result = collect(stream, { signal: controller.signal });
    controller.abort();
    await expect(result).rejects.toMatchObject({ name: "AbortError" });
    expect(cancelled).toBe(true);
    expect(stream.locked).toBe(false);
  });
  it("cancels the connection on early iterator return", async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(encoder.encode("data: one\n\n")); }, cancel() { cancelled = true; } });
    for await (const _ of parseNativeSSE(stream)) break;
    expect(cancelled).toBe(true);
    expect(stream.locked).toBe(false);
  });
});
