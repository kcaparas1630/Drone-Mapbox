// Tests that moving along a bearing lands where distance and bearing say it should, without allocating.
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import { describe, expect, it } from 'vitest';

import { computeDestinationPoint } from './compute-destination-point';

describe('computeDestinationPoint', () => {
  it('round-trips with bearing and distance between two BC towns', () => {
    const bearingRad = (turfBearing([-123.12, 49.28], [-119.68, 49.6]) * Math.PI) / 180;
    const distanceM = turfDistance([-123.12, 49.28], [-119.68, 49.6], { units: 'meters' });
    const out = { lng: 0, lat: 0 };
    computeDestinationPoint(out, -123.12, 49.28, bearingRad, distanceM);
    expect(out.lng).toBeCloseTo(-119.68, 6);
    expect(out.lat).toBeCloseTo(49.6, 6);
  });

  it('moves north by about 1 km per 0.009 degrees near 60° N', () => {
    const out = { lng: 0, lat: 0 };
    computeDestinationPoint(out, -125, 59.9, 0, 1000);
    expect(out.lng).toBeCloseTo(-125, 9);
    expect(out.lat - 59.9).toBeCloseTo(0.008993, 5);
  });

  it('writes into the same object it was given', () => {
    const out = { lng: 1, lat: 1 };
    computeDestinationPoint(out, -120, 50, Math.PI / 2, 0);
    expect(out).toEqual({ lng: -120, lat: 50 });
  });

  it('wraps longitude across the antimeridian', () => {
    const out = { lng: 0, lat: 0 };
    computeDestinationPoint(out, 179.99, 0, Math.PI / 2, 5000);
    expect(out.lng).toBeLessThan(-179.9);
  });
});
