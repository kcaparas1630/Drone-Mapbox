// Tests converting retrieve responses: valid BC place, outside BC, and malformed or hostile payloads.
import { describe, expect, it } from 'vitest';

import { toRetrievedPlace } from './to-retrieved-place';

// Builds a retrieve response with one point feature.
function buildResponse(lng: number, lat: number, name: string) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { name },
      },
    ],
  };
}

describe('toRetrievedPlace', () => {
  it('returns the place for a feature inside BC', () => {
    expect(toRetrievedPlace(buildResponse(-119.68, 49.6, ' Summerland '))).toEqual({
      isOk: true,
      value: { name: 'Summerland', lng: -119.68, lat: 49.6 },
    });
  });

  it('rejects places outside British Columbia', () => {
    expect(toRetrievedPlace(buildResponse(-79.38, 43.65, 'Toronto'))).toEqual({
      isOk: false,
      error: 'outside-bc',
    });
  });

  it('rejects malformed responses and empty feature lists', () => {
    expect(toRetrievedPlace({ features: [] }).isOk).toBe(false);
    expect(toRetrievedPlace({ error: 'nope' }).isOk).toBe(false);
    expect(toRetrievedPlace(buildResponse(Number.NaN, 49, 'X')).isOk).toBe(false);
  });

  it('keeps hostile names as plain text', () => {
    const result = toRetrievedPlace(buildResponse(-123, 49.3, '<script>alert(1)</script>'));
    expect(result.isOk && result.value.name).toBe('<script>alert(1)</script>');
  });
});
