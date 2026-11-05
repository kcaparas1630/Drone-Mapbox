// Tests the perimeter schema: polygons and multipolygons pass, other geometries and error bodies fail.
import { describe, expect, it } from 'vitest';

import { firePerimeterPageSchema } from './fire-perimeter.schema';

const RING = [
  [-122.2, 51.6],
  [-122.3, 51.6],
  [-122.3, 51.7],
  [-122.2, 51.6],
];

describe('firePerimeterPageSchema', () => {
  it('accepts Polygon and MultiPolygon features with a fire number', () => {
    const parsed = firePerimeterPageSchema.safeParse({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [RING] },
          properties: { FIRE_NUMBER: 'C20001', FIRE_SIZE_HECTARES: 7.5, FIRE_STATUS: 'Being Held' },
        },
        {
          type: 'Feature',
          geometry: { type: 'MultiPolygon', coordinates: [[RING], [RING]] },
          properties: { FIRE_NUMBER: 'C20002' },
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an ArcGIS error body and a point geometry', () => {
    expect(firePerimeterPageSchema.safeParse({ error: { code: 400 } }).success).toBe(false);
    const withPoint = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-122, 51] },
          properties: { FIRE_NUMBER: 'C1' },
        },
      ],
    };
    expect(firePerimeterPageSchema.safeParse(withPoint).success).toBe(false);
  });
});
