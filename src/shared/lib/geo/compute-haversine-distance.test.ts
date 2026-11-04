// Tests great-circle distances against turf and simple known values.
import turfDistance from '@turf/distance';
import { describe, expect, it } from 'vitest';

import { computeHaversineDistance } from './compute-haversine-distance';

const VANCOUVER: [number, number] = [-123.1207, 49.2827];
const SUMMERLAND: [number, number] = [-119.6773, 49.6006];

describe('computeHaversineDistance', () => {
  it('matches turf for Vancouver to Summerland', () => {
    const expectedM = turfDistance(VANCOUVER, SUMMERLAND, { units: 'meters' });
    const actualM = computeHaversineDistance(...VANCOUVER, ...SUMMERLAND);
    expect(actualM).toBeCloseTo(expectedM, 3);
  });

  it('returns zero for the same point and is symmetric', () => {
    expect(computeHaversineDistance(-120, 55, -120, 55)).toBe(0);
    expect(computeHaversineDistance(...SUMMERLAND, ...VANCOUVER)).toBeCloseTo(
      computeHaversineDistance(...VANCOUVER, ...SUMMERLAND),
      6,
    );
  });

  it('measures one degree of latitude as about 111.2 km', () => {
    expect(computeHaversineDistance(-120, 59, -120, 60) / 1000).toBeCloseTo(111.2, 1);
  });
});
