// Tests that each plan gets a new route id and that clearing removes the active route.
import { describe, expect, it } from 'vitest';

import { routeCleared, routePlanned, routeSlice, selectActiveRoute } from './route.slice';

const DRAFT = {
  destination: { name: 'Summerland', lng: -119.68, lat: 49.6 },
  originLng: -123.12,
  originLat: 49.28,
  distanceM: 251_000,
  durationS: 45,
  initialBearingRad: 1.4,
};

describe('routeSlice', () => {
  it('assigns increasing route ids so the loop can detect re-plans', () => {
    const first = routeSlice.reducer(undefined, routePlanned(DRAFT));
    const second = routeSlice.reducer(first, routePlanned(DRAFT));
    expect(first.activeRoute?.routeId).toBe(1);
    expect(second.activeRoute?.routeId).toBe(2);
  });

  it('clears the active route but keeps the id counter', () => {
    const planned = routeSlice.reducer(undefined, routePlanned(DRAFT));
    const cleared = routeSlice.reducer(planned, routeCleared());
    expect(selectActiveRoute({ route: cleared })).toBeNull();
    expect(cleared.lastRouteId).toBe(1);
  });
});
