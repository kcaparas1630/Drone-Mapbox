// Tests progress along a planned polyline: start, eased midpoint, planned altitude, bearing and arrival.
import { describe, expect, it } from 'vitest';

import type { RouteProgressInput, RouteProgressPoint } from '../model/route-progress.types';
import { stepAlongRoute } from './step-along-route';

// Builds a 3-point route: 11.1 km north climbing 1,000 → 2,000 m, then 7.3 km east holding 2,000 m.
function buildRoute(): RouteProgressInput {
  const capacity = 8;
  const route = {
    durationS: 40,
    pathCount: 3,
    pathLngs: new Float64Array(capacity),
    pathLats: new Float64Array(capacity),
    pathAltitudesMsl: new Float64Array(capacity),
    pathDistancesM: new Float64Array(capacity),
    segmentIndex: 0,
  };
  route.pathLngs.set([-122, -122, -121.9]);
  route.pathLats.set([54, 54.1, 54.1]);
  route.pathAltitudesMsl.set([1000, 2000, 2000]);
  route.pathDistancesM.set([0, 11_119, 17_642]);
  return route;
}

// Returns a fresh progress point.
function createPoint(): RouteProgressPoint {
  return {
    lng: 0,
    lat: 0,
    altitudeMsl: 0,
    profileSlope: 0,
    pathBearingRad: 0,
    remainingM: 0,
    isComplete: false,
  };
}

describe('stepAlongRoute', () => {
  it('starts at the first point heading along the path with its planned altitude', () => {
    const out = createPoint();
    stepAlongRoute(out, buildRoute(), 0);
    expect(out.lng).toBeCloseTo(-122, 9);
    expect(out.lat).toBeCloseTo(54, 9);
    expect(out.altitudeMsl).toBeCloseTo(1000, 6);
    expect(out.pathBearingRad).toBeCloseTo(0, 3);
    expect(out.profileSlope).toBeCloseTo(1000 / 11_119, 6);
    expect(out.isComplete).toBe(false);
  });

  it('is halfway along the path at half time and climbing on the first leg', () => {
    const route = buildRoute();
    const out = createPoint();
    stepAlongRoute(out, route, 20);
    expect(out.remainingM).toBeCloseTo(17_642 / 2, 0);
    expect(route.segmentIndex).toBe(0);
    expect(out.altitudeMsl).toBeCloseTo(1000 + (8821 / 11_119) * 1000, 0);
  });

  it('turns east after the corner and completes at the last point', () => {
    const route = buildRoute();
    const out = createPoint();
    stepAlongRoute(out, route, 36);
    expect(route.segmentIndex).toBe(1);
    expect((out.pathBearingRad * 180) / Math.PI).toBeCloseTo(90, 0);
    stepAlongRoute(out, route, 40);
    expect(out.lng).toBeCloseTo(-121.9, 9);
    expect(out.remainingM).toBeCloseTo(0, 6);
    expect(out.isComplete).toBe(true);
  });
});
