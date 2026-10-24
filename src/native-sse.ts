export interface NativeSSEEvent {
  id?: string;
  event?: string;
  data: string;
  retry?: number;
}

/** Decode a single connection. Reconnection and execution replay are caller decisions. */
export async function* parseNativeSSE(
  stream: ReadableStream<Uint8Array>,
  options: { signal?: AbortSignal; maxEventBytes?: number } = {},
): AsyncGenerator<NativeSSEEvent> {
  const limit = options.maxEventBytes ?? 1024 * 1024;
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError("maxEventBytes must be a positive integer");
  const signal = options.signal;
  const aborted = () => signal?.reason ?? new DOMException("The operation was aborted", "AbortError");
  if (signal?.aborted) throw aborted();
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let rejectAbort: (reason: unknown) => void = () => {};
  const abortPromise = new Promise<never>((_, reject) => { rejectAbort = reject; });
  const onAbort = () => { rejectAbort(aborted()); };
  signal?.addEventListener("abort", onAbort, { once: true });
  let line = "";
  let lineBytes = 0;
  let eventBytes = 0;
  let skipLF = false;
  let data: string[] = [];
  let event: string | undefined;
  let id: string | undefined;
  let retry: number | undefined;
  let completed = false;
  const acceptLine = (): NativeSSEEvent | undefined => {
    const value = line;
    line = "";
    lineBytes = 0;
    if (value === "") {
      const result = data.length ? { data: data.join("\n"), ...(id !== undefined && { id }), ...(event !== undefined && { event }), ...(retry !== undefined && { retry }) } : undefined;
      data = [];
      event = undefined;
      retry = undefined;
      eventBytes = 0;
      return result;
    }
    if (value.startsWith(":")) return;
    const colon = value.indexOf(":");
    const field = colon === -1 ? value : value.slice(0, colon);
    let content = colon === -1 ? "" : value.slice(colon + 1);
    if (content.startsWith(" ")) content = content.slice(1);
    switch (field) {
      case "data": data.push(content); break;
      case "event": event = content || undefined; break;
      case "id": if (!content.includes("\0")) id = content; break;
      case "retry": {
        if (/^[0-9]+$/.test(content)) {
          const parsed = Number(content);
          if (Number.isSafeInteger(parsed)) retry = parsed;
        }
        break;
      }
    }
  };
  try {
    for (;;) {
      const chunk = signal ? await Promise.race([reader.read(), abortPromise]) : await reader.read();
      if (signal?.aborted) throw aborted();
      if (chunk.done) { completed = true; break; }
      const text = decoder.decode(chunk.value, { stream: true });
      for (const character of text) {
        if (skipLF) { skipLF = false; if (character === "\n") continue; }
        if (character === "\r" || character === "\n") {
          skipLF = character === "\r";
          const result = acceptLine();
          if (result) yield result;
          continue;
        }
        const bytes = encoder.encode(character).byteLength;
        lineBytes += bytes;
        eventBytes += bytes;
        if (lineBytes > limit || eventBytes > limit) throw new RangeError("SSE event exceeds maxEventBytes");
        line += character;
      }
    }
    // A partial final event is not a durable event and must not be delivered.
  } finally {
    signal?.removeEventListener("abort", onAbort);
    if (!completed) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
