// Tests choosing the most specific place and wording the location readout.
import { describe, expect, it } from 'vitest';

import type { ReverseGeocodeResponse } from '../model/reverse-geocode.schema';
import { formatPlaceName } from './format-place-name';

// Builds a response from feature type/name pairs, all inside British Columbia.
function buildResponse(entries: [string, string][]): ReverseGeocodeResponse {
  return {
    type: 'FeatureCollection',
    features: entries.map(([featureType, name]) => ({
      properties: {
        ...Object.fromEntries([['feature_type', featureType]]),
        name,
        ...(featureType === 'region' ? {} : { context: { region: { name: 'British Columbia' } } }),
      } as ReverseGeocodeResponse['features'][number]['properties'],
    })),
  };
}

describe('formatPlaceName', () => {
  it('prefers a town over the regional district and adds the province', () => {
    const response = buildResponse([
      ['district', 'Fraser-Fort George'],
      ['place', 'Prince George'],
      ['region', 'British Columbia'],
    ]);
    expect(formatPlaceName(response)).toBe('Near Prince George, British Columbia');
  });

  it('names the neighbourhood with its town when both are known', () => {
    const response = buildResponse([
      ['neighborhood', 'Millar Addition'],
      ['place', 'Prince George'],
      ['region', 'British Columbia'],
    ]);
    expect(formatPlaceName(response)).toBe('Near Millar Addition, Prince George');
  });

  it('falls back to the regional district, then the province, over wilderness', () => {
    expect(formatPlaceName(buildResponse([['district', 'Stikine']]))).toBe(
      'Over Stikine, British Columbia',
    );
    expect(formatPlaceName(buildResponse([['region', 'British Columbia']]))).toBe(
      'Over British Columbia',
    );
  });

  it('returns null when nothing usable came back', () => {
    expect(formatPlaceName(buildResponse([]))).toBeNull();
    expect(formatPlaceName(buildResponse([['country', 'Canada']]))).toBeNull();
  });
});
