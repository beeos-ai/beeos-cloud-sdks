import type { NativeResponseEvent } from "./native.js";

const TERMINAL = new Set(["response.completed", "response.failed", "response.incomplete", "response.cancelled", "response.unknown"]);

/**
 * Accumulates `/v2/responses/{id}/events` text (U-1024-50).
 *
 * `response.output_text.delta` events are a live preview: deltas of one
 * `item_id` are appended in arrival order, items in first-seen order. The
 * terminal Response `output` is authoritative and replaces the preview. Unknown
 * future event types are ignored.
 */
export class NativeResponseText {
  private readonly items = new Map<string, string>();
  private final: string | undefined;

  /** Applies one event and returns the current text. */
  apply(event: NativeResponseEvent | { type: string }): string {
    if (this.final !== undefined) return this.final;
    if (event.type === "response.output_text.delta" && "delta" in event) {
      this.items.set(event.item_id, (this.items.get(event.item_id) ?? "") + event.delta);
    } else if (TERMINAL.has(event.type) && "response" in event) {
      this.final = event.response.output.map(item => item.type === "output_text" ? item.text : "").join("");
    }
    return this.text;
  }

  /** Preview so far, or the authoritative terminal text once terminal. */
  get text(): string {
    return this.final ?? [...this.items.values()].join("");
  }

  /** Concatenated deltas only, independent of the terminal snapshot. */
  get streamed(): string {
    return [...this.items.values()].join("");
  }

  get terminal(): boolean {
    return this.final !== undefined;
  }
}
