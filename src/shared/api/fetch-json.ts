// The JSON network entry point: fetches with timeout, size cap and content-type check, then zod (008).
import type { z } from 'zod';

import type { Result } from '../lib/result';
import type { FetchJsonError, FetchJsonOptions } from './fetch-json.types';
import { fetchResponse } from './fetch-response';
import { readBodyWithLimit } from './read-body-with-limit';
import { toFetchFailure as toFailure } from './to-fetch-failure';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;
const MAX_REPORTED_ISSUES = 3;

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
