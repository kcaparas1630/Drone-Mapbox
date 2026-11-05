// Tests every failure mode of the fetch boundary and the validated success path.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { fetchJson } from './fetch-json';

const pointSchema = z.object({ x: z.number() });
const JSON_HEADERS = { 'content-type': 'application/geo+json; charset=utf-8' };

// Replaces the global fetch with one that resolves to the given response.
function setFetchResponse(body: BodyInit | null, init: ResponseInit = {}): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(body, init))),
  );
}

describe('fetchJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the validated body', async () => {
    setFetchResponse('{"x": 1, "extra": true}', { headers: JSON_HEADERS });
    await expect(fetchJson('https://a.test', pointSchema)).resolves.toEqual({
      isOk: true,
      value: { x: 1 },
    });
  });

  it('refuses without fetching when the budget is spent, and fetches when it has room', async () => {
    setFetchResponse('{"x": 1}', { headers: JSON_HEADERS });
    const spent = { reserve: () => ({ isAllowed: false, exceededWindow: 'minute' }) as const };
    const result = await fetchJson('https://a.test', pointSchema, { budget: spent });
    expect(result).toMatchObject({ isOk: false, error: { kind: 'rate-limited', status: null } });
    expect(fetch).not.toHaveBeenCalled();
    const open = { reserve: vi.fn(() => ({ isAllowed: true }) as const) };
    await expect(fetchJson('https://a.test', pointSchema, { budget: open })).resolves.toEqual({
      isOk: true,
      value: { x: 1 },
    });
    expect(open.reserve).toHaveBeenCalledOnce();
  });

  it('rejects a 200 response whose shape fails the schema, like an ArcGIS {error}', async () => {
    setFetchResponse('{"error": {"code": 400}}', { headers: JSON_HEADERS });
    const result = await fetchJson('https://a.test', pointSchema);
    expect(result).toMatchObject({ isOk: false, error: { kind: 'schema' } });
  });

  it('reports HTTP errors with their status', async () => {
    setFetchResponse('oops', { status: 503, headers: JSON_HEADERS });
    const result = await fetchJson('https://a.test', pointSchema);
    expect(result).toEqual({
      isOk: false,
      error: { kind: 'http', message: 'HTTP 503', status: 503 },
    });
  });

  it('rejects non-JSON content types and unparseable JSON', async () => {
    setFetchResponse('<html>', { headers: { 'content-type': 'text/html' } });
    expect(await fetchJson('https://a.test', pointSchema)).toMatchObject({
      error: { kind: 'content-type' },
    });
    setFetchResponse('{nope', { headers: JSON_HEADERS });
    expect(await fetchJson('https://a.test', pointSchema)).toMatchObject({
      error: { kind: 'parse' },
    });
  });

  it('rejects bodies larger than the limit, declared or streamed', async () => {
    setFetchResponse('{"x": 1}', { headers: { ...JSON_HEADERS, 'content-length': '999' } });
    expect(await fetchJson('https://a.test', pointSchema, { maxBytes: 10 })).toMatchObject({
      error: { kind: 'too-large' },
    });
    setFetchResponse('{"x": 12345678}', { headers: JSON_HEADERS });
    expect(await fetchJson('https://a.test', pointSchema, { maxBytes: 5 })).toMatchObject({
      error: { kind: 'too-large' },
    });
  });

  it('maps network failures, caller aborts and timeouts to distinct kinds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );
    expect(await fetchJson('https://a.test', pointSchema)).toMatchObject({
      error: { kind: 'network', message: 'Failed to fetch' },
    });
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new DOMException('x', 'AbortError'))),
    );
    expect(
      await fetchJson('https://a.test', pointSchema, { signal: controller.signal }),
    ).toMatchObject({ error: { kind: 'aborted' } });
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener('abort', () => {
              reject(new DOMException('x', 'TimeoutError'));
            });
          }),
      ),
    );
    expect(await fetchJson('https://a.test', pointSchema, { timeoutMs: 5 })).toMatchObject({
      error: { kind: 'timeout' },
    });
  });
});
