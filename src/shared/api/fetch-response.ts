// Sends one credential-free GET with a timeout and maps network, timeout and abort failures to typed errors.
import type { Result } from '../lib/result';
import type { FetchJsonError } from './fetch-json.types';
import { toFetchFailure } from './to-fetch-failure';

// Requests the URL and returns the raw response, or a typed error when no response arrived.
export async function fetchResponse(
  url: string,
  signal: AbortSignal | undefined,
  timeoutMs: number,
): Promise<Result<Response, FetchJsonError>> {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal =
    signal === undefined ? timeoutSignal : AbortSignal.any([signal, timeoutSignal]);
  try {
    const response = await fetch(url, { signal: combinedSignal, credentials: 'omit' });
    return { isOk: true, value: response };
  } catch (error) {
    if (signal?.aborted === true) {
      return toFetchFailure('aborted', 'The request was cancelled.');
    }
    if (timeoutSignal.aborted) {
      return toFetchFailure('timeout', `No response within ${String(timeoutMs)} ms.`);
    }
    return toFetchFailure('network', error instanceof Error ? error.message : String(error));
  }
}
