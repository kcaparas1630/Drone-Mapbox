// Tests initial bearings against turf and the cardinal directions.
import turfBearing from '@turf/bearing';
import { describe, expect, it } from 'vitest';

import { computeInitialBearing } from './compute-initial-bearing';

describe('computeInitialBearing', () => {
  it('matches turf for a long BC flight', () => {
    const expectedDeg = (turfBearing([-123.12, 49.28], [-119.68, 49.6]) + 360) % 360;
    const expectedRad = (expectedDeg * Math.PI) / 180;
    expect(computeInitialBearing(-123.12, 49.28, -119.68, 49.6)).toBeCloseTo(expectedRad, 9);
  });

  it('returns north, east, south and west in [0, 2π)', () => {
    expect(computeInitialBearing(-120, 50, -120, 51)).toBeCloseTo(0, 9);
    expect(computeInitialBearing(-120, 0, -119, 0)).toBeCloseTo(Math.PI / 2, 9);
    expect(computeInitialBearing(-120, 51, -120, 50)).toBeCloseTo(Math.PI, 9);
    expect(computeInitialBearing(-119, 0, -120, 0)).toBeCloseTo((3 * Math.PI) / 2, 9);
  });
});
