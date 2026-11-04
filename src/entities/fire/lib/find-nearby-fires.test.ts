// Tests counting fires within 25 km and picking the nearest.
import { describe, expect, it } from 'vitest';

import type { Fire } from '../model/fire.types';
import { findNearbyFires } from './find-nearby-fires';

// Builds a minimal fire at a point.
function buildFire(fireNumber: string, lng: number, lat: number): Fire {
  return {
    fireNumber,
    incidentName: fireNumber,
    status: 'Being Held',
    rawStatus: 'Being Held',
    isFireOfNote: false,
    sizeHa: 10,
    ignitionDateMs: null,
    location: null,
    cause: null,
    incidentUrl: null,
    lng,
    lat,
  };
}

describe('findNearbyFires', () => {
  it('counts fires inside the radius and returns the nearest with its distance', () => {
    const fires = [
      buildFire('FAR', -119.68, 49.8),
      buildFire('NEAR', -119.68, 49.65),
      buildFire('AWAY', -122, 53),
    ];
    const result = findNearbyFires(fires, -119.68, 49.6, 25_000);
    expect(result.count).toBe(2);
    expect(result.nearest?.fire.fireNumber).toBe('NEAR');
    expect((result.nearest?.distanceM ?? 0) / 1000).toBeCloseTo(5.56, 1);
  });

  it('returns zero and no nearest fire when none are close', () => {
    expect(findNearbyFires([], -119.68, 49.6, 25_000)).toEqual({ count: 0, nearest: null });
  });
});
