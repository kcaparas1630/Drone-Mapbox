// Tests route ids, attaching the planned path to the right route, and clearing the active route.
import { describe, expect, it } from 'vitest';

import {
  routeCleared,
  routePathPlanned,
  routePlanned,
  routeSlice,
  selectActiveRoute,
} from './route.slice';

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

  it('attaches a planned path only to the route it was planned for', () => {
    const path = { lngs: [-123.12, -119.68], lats: [49.28, 49.6], altitudesMsl: [500, 800] };
    const planned = routeSlice.reducer(undefined, routePlanned(DRAFT));
    expect(planned.activeRoute?.path).toBeNull();
    const stale = routeSlice.reducer(planned, routePathPlanned({ routeId: 99, path }));
    expect(stale.activeRoute?.path).toBeNull();
    const attached = routeSlice.reducer(planned, routePathPlanned({ routeId: 1, path }));
    expect(attached.activeRoute?.path).toEqual(path);
  });
});
