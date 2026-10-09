
function createForm(input: Record<string, string | number | boolean | Blob | undefined>): FormData {
  const form = new FormData();
  for (const [name, value] of Object.entries(input)) {
    if (value !== undefined) form.append(name, value instanceof Blob ? value : String(value));
  }
  return form;
}

async function* readEvents(response: Response): AsyncGenerator<JSONValue> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer = (buffer + decoder.decode(value, { stream: !done })).replace(/\r\n/g, "\n");
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const data = event.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
        if (data && data !== "[DONE]") yield JSON.parse(data) as JSONValue;
      }
      if (done) break;
    }
    const data = buffer.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
    if (data && data !== "[DONE]") yield JSON.parse(data) as JSONValue;
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
}
