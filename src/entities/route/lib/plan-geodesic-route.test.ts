// Tests geodesic planning: distance, duration and bearing for a real BC trip and a zero-length one.
import { describe, expect, it } from 'vitest';

import { planGeodesicRoute } from './plan-geodesic-route';

const SUMMERLAND = { name: 'Summerland', lng: -119.68, lat: 49.6 };

describe('planGeodesicRoute', () => {
  it('plans Vancouver to Summerland as about 251 km, 45 s, heading east', () => {
    const plan = planGeodesicRoute(-123.12, 49.28, SUMMERLAND);
    expect(plan.distanceM / 1000).toBeCloseTo(251, 0);
    expect(plan.durationS).toBe(45);
    expect(plan.initialBearingRad).toBeGreaterThan(1.3);
    expect(plan.initialBearingRad).toBeLessThan(1.6);
    expect(plan.destination).toBe(SUMMERLAND);
  });

  it('returns a minimum-length trip when already at the destination', () => {
    const plan = planGeodesicRoute(SUMMERLAND.lng, SUMMERLAND.lat, SUMMERLAND);
    expect(plan.distanceM).toBe(0);
    expect(plan.durationS).toBe(5);
  });

  it('expresses westward bearings in [0, 2π)', () => {
    const plan = planGeodesicRoute(-119.68, 49.6, { name: 'Vancouver', lng: -123.12, lat: 49.28 });
    expect(plan.initialBearingRad).toBeGreaterThan(Math.PI);
    expect(plan.initialBearingRad).toBeLessThan(2 * Math.PI);
  });
});
