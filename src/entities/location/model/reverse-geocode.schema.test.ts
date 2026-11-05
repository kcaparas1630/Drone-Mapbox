// Tests that the reverse geocode schema keeps place names and rejects other shapes.
import { describe, expect, it } from 'vitest';

import { reverseGeocodeSchema } from './reverse-geocode.schema';

// Builds a Mapbox-shaped feature; snake_case keys come from the API, so they are built from pairs.
function buildFeature(featureType: string, name: string, extra: [string, unknown][] = []) {
  return {
    type: 'Feature',
    properties: Object.fromEntries([['feature_type', featureType], ['name', name], ...extra]),
  };
}

describe('reverseGeocodeSchema', () => {
  it('accepts a feature collection and keeps the name, type and region', () => {
    const region = Object.fromEntries([
      ['name', 'British Columbia'],
      ['region_code', 'BC'],
    ]);
    const parsed = reverseGeocodeSchema.parse({
      type: 'FeatureCollection',
      features: [
        buildFeature('place', 'Prince George', [
          ['full_address', 'Prince George, British Columbia, Canada'],
          ['context', { region }],
        ]),
      ],
    });
    expect(parsed.features[0]?.properties).toEqual(
      Object.fromEntries([
        ['feature_type', 'place'],
        ['name', 'Prince George'],
        ['context', { region: { name: 'British Columbia' } }],
      ]),
    );
  });

  it('rejects an error body and a feature without a name', () => {
    expect(reverseGeocodeSchema.safeParse({ message: 'Not Authorized' }).success).toBe(false);
    expect(
      reverseGeocodeSchema.safeParse({
        type: 'FeatureCollection',
        features: [buildFeature('place', '')],
      }).success,
    ).toBe(false);
  });
});
