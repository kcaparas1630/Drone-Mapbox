// Tests feed pagination, the 10-page cap and error propagation with a stubbed network.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchActiveFires } from './fetch-active-fires';

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };

// Builds one page body with a single in-BC fire and the paging flag.
function buildPage(fireNumber: string, hasMore: boolean): string {
  return JSON.stringify({
    type: 'FeatureCollection',
    ...(hasMore ? { properties: { exceededTransferLimit: true } } : {}),
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-121.45, 49.89] },
        properties: { FIRE_NUMBER: fireNumber, FIRE_STATUS: 'Being Held' },
      },
    ],
  });
}

// Replaces fetch with one that serves the given bodies in order.
function setPages(bodies: string[]): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn((url: string) => {
    const offset = Number(new URL(url).searchParams.get('resultOffset')) / 1000;
    return Promise.resolve(new Response(bodies[offset] ?? '{}', { headers: JSON_HEADERS }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchActiveFires', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('follows exceededTransferLimit across pages until the last page', async () => {
    const fetchMock = setPages([buildPage('A1', true), buildPage('A2', false)]);
    const result = await fetchActiveFires(false, undefined);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.isOk && result.value.fires.map((fire) => fire.fireNumber)).toEqual(['A1', 'A2']);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('FIRE_STATUS%3C%3E%27Out%27');
  });

  it('stops at ten pages and flags the snapshot as truncated', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const pages = Array.from({ length: 12 }, (_unused, index) =>
      buildPage(`P${String(index)}`, true),
    );
    const fetchMock = setPages(pages);
    const result = await fetchActiveFires(true, undefined);
    expect(fetchMock).toHaveBeenCalledTimes(10);
    expect(result.isOk && result.value.isTruncated).toBe(true);
  });

  it('returns the page error, such as an ArcGIS error body', async () => {
    setPages([JSON.stringify({ error: { code: 400 } })]);
    const result = await fetchActiveFires(false, undefined);
    expect(result).toMatchObject({ isOk: false, error: { kind: 'schema' } });
  });
});
