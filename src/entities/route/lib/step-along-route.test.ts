// Tests progress along a great-circle route: start, midpoint, arrival and the changing bearing.
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import { describe, expect, it } from 'vitest';

import type { RouteProgressPoint } from '../model/route-progress.types';
import { stepAlongRoute } from './step-along-route';

const SUMMERLAND = { name: 'Summerland', lng: -119.68, lat: 49.6 };
const VANCOUVER: [number, number] = [-123.12, 49.28];
const TARGET: [number, number] = [SUMMERLAND.lng, SUMMERLAND.lat];
const PLAN = {
  originLng: VANCOUVER[0],
  originLat: VANCOUVER[1],
  distanceM: turfDistance(VANCOUVER, TARGET, { units: 'meters' }),
  durationS: 45,
  initialBearingRad: (((turfBearing(VANCOUVER, TARGET) + 360) % 360) * Math.PI) / 180,
};
const ROUTE = { ...PLAN, destinationLng: SUMMERLAND.lng, destinationLat: SUMMERLAND.lat };

// Returns the progress point after the given flight time.
function readProgressAt(elapsedS: number): RouteProgressPoint {
  const out = { lng: 0, lat: 0, pathBearingRad: 0, remainingM: 0, isComplete: false };
  stepAlongRoute(out, ROUTE, elapsedS);
  return out;
}

describe('stepAlongRoute', () => {
  it('starts at the origin on the initial bearing', () => {
    const start = readProgressAt(0);
    expect(start.lng).toBeCloseTo(-123.12, 9);
    expect(start.lat).toBeCloseTo(49.28, 9);
    expect(start.pathBearingRad).toBeCloseTo(PLAN.initialBearingRad, 6);
    expect(start.isComplete).toBe(false);
  });

  it('is halfway at half time and the bearing has turned along the great circle', () => {
    const middle = readProgressAt(PLAN.durationS / 2);
    expect(middle.remainingM / PLAN.distanceM).toBeCloseTo(0.5, 3);
    expect(middle.pathBearingRad).not.toBeCloseTo(PLAN.initialBearingRad, 3);
  });

  it('reaches the destination at the end and reports completion', () => {
    const end = readProgressAt(PLAN.durationS + 1);
    expect(end.remainingM).toBeLessThan(1);
    expect(end.isComplete).toBe(true);
    expect(end.pathBearingRad).toBe(PLAN.initialBearingRad);
  });

  it('completes immediately for a zero-duration route', () => {
    const out = { lng: 0, lat: 0, pathBearingRad: 0, remainingM: 0, isComplete: false };
    stepAlongRoute(out, { ...ROUTE, durationS: 0 }, 0);
    expect(out.isComplete).toBe(true);
  });
});
