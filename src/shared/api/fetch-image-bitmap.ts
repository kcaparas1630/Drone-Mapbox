// The one binary fetch: an image with timeout, size cap and content-type check, decoded as-is (008, ADR 022).
import type { Result } from '../lib/result';
import type { FetchJsonError, FetchJsonOptions } from './fetch-json.types';
import { fetchResponse } from './fetch-response';
import { toFetchFailure } from './to-fetch-failure';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;

// Fetches an image and returns its bitmap without colour conversion, so encoded pixel values survive.
export async function fetchImageBitmap(
  url: string,
  options: FetchJsonOptions = {},
): Promise<Result<ImageBitmap, FetchJsonError>> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS, maxBytes = DEFAULT_MAX_BYTES } = options;
  const request = await fetchResponse(url, signal, timeoutMs);
  if (!request.isOk) {
    return request;
  }
  const response = request.value;
  if (!response.ok) {
    return toFetchFailure('http', `HTTP ${String(response.status)}`, response.status);
  }
  if (!(response.headers.get('content-type') ?? '').startsWith('image/')) {
    return toFetchFailure('content-type', 'The response is not an image.', response.status);
  }
  if (Number(response.headers.get('content-length') ?? '0') > maxBytes) {
    return toFetchFailure('too-large', `The response exceeds ${String(maxBytes)} bytes.`);
  }
  try {
    const blob = await response.blob();
    if (blob.size > maxBytes) {
      return toFetchFailure('too-large', `The response exceeds ${String(maxBytes)} bytes.`);
    }
    const bitmap = await createImageBitmap(blob, {
      colorSpaceConversion: 'none',
      premultiplyAlpha: 'none',
    });
    return { isOk: true, value: bitmap };
  } catch (error) {
    return toFetchFailure('parse', error instanceof Error ? error.message : 'Undecodable image.');
  }
}
