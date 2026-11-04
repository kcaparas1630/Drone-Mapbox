// Reads a response body as text while enforcing a byte limit, so a huge feed cannot exhaust memory.

// Returns the decoded body, or null as soon as the declared or streamed size exceeds maxBytes.
export async function readBodyWithLimit(
  response: Response,
  maxBytes: number,
): Promise<string | null> {
  const declaredBytes = Number(response.headers.get('content-length') ?? '0');
  if (declaredBytes > maxBytes) {
    return null;
  }
  if (response.body === null) {
    return '';
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let receivedBytes = 0;
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) {
      return text + decoder.decode();
    }
    receivedBytes += chunk.value.byteLength;
    if (receivedBytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(chunk.value, { stream: true });
  }
}
