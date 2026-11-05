// Tests the route line: endpoints, sample count and a short route.
import turfDistance from '@turf/distance';
import { describe, expect, it } from 'vitest';

import { buildRouteLine } from './build-route-line';

describe('buildRouteLine', () => {
  it('runs from origin to destination with one vertex per 5 km', () => {
    const distanceM = turfDistance([-123.12, 49.28], [-119.68, 49.6], { units: 'meters' });
    const line = buildRouteLine(-123.12, 49.28, -119.68, 49.6, distanceM);
    const { coordinates } = line.geometry;
    expect(coordinates).toHaveLength(52);
    expect(coordinates[0]?.[0]).toBeCloseTo(-123.12, 6);
    expect(coordinates.at(-1)?.[0]).toBeCloseTo(-119.68, 6);
    expect(coordinates.at(-1)?.[1]).toBeCloseTo(49.6, 6);
  });

  it('uses a single segment for very short routes', () => {
    expect(buildRouteLine(-120, 50, -120, 50.001, 111).geometry.coordinates).toHaveLength(2);
  });
});
