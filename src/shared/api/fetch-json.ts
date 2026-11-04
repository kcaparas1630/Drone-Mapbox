// The only network entry point: fetches JSON with timeout, size cap and content-type check, then zod (008).
import type { z } from 'zod';

import type { Result } from '../lib/result';
import type { FetchJsonError, FetchJsonErrorKind, FetchJsonOptions } from './fetch-json.types';
import { readBodyWithLimit } from './read-body-with-limit';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;
const MAX_REPORTED_ISSUES = 3;

// Builds the failed Result for one error kind.
function toFailure(kind: FetchJsonErrorKind, message: string, status: number | null = null) {
  return { isOk: false, error: { kind, message, status } } as const;
}

// Requests the URL and maps network, timeout and abort failures to typed errors.
async function fetchResponse(
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
      return toFailure('aborted', 'The request was cancelled.');
    }
    if (timeoutSignal.aborted) {
      return toFailure('timeout', `No response within ${String(timeoutMs)} ms.`);
    }
    return toFailure('network', error instanceof Error ? error.message : String(error));
  }
}

// Fetches a URL and returns the schema-validated JSON body, or a typed, serialisable error.
export async function fetchJson<Schema extends z.ZodType>(
  url: string,
  schema: Schema,
  options: FetchJsonOptions = {},
): Promise<Result<z.output<Schema>, FetchJsonError>> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS, maxBytes = DEFAULT_MAX_BYTES } = options;
  const request = await fetchResponse(url, signal, timeoutMs);
  if (!request.isOk) {
    return request;
  }
  const response = request.value;
  if (!response.ok) {
    return toFailure('http', `HTTP ${String(response.status)}`, response.status);
  }
  if (!(response.headers.get('content-type') ?? '').includes('json')) {
    return toFailure('content-type', 'The response is not JSON.', response.status);
  }
  const body = await readBodyWithLimit(response, maxBytes);
  if (body === null) {
    return toFailure('too-large', `The response exceeds ${String(maxBytes)} bytes.`);
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(body);
  } catch (error) {
    return toFailure('parse', error instanceof Error ? error.message : 'Invalid JSON.');
  }
  const validated = schema.safeParse(parsedJson);
  if (!validated.success) {
    const issues = validated.error.issues.slice(0, MAX_REPORTED_ISSUES);
    const summary = issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
    return toFailure('schema', summary.join('; '));
  }
  return { isOk: true, value: validated.data };
}
