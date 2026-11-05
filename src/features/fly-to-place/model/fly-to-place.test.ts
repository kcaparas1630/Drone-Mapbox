// Tests that flying to a place plans a route, starts auto-route and records the place in recents.
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import { droneModeSlice, droneSnapshotPublished, droneSnapshotSlice } from '@/entities/drone';
import { recentPlacesSlice, routeSlice } from '@/entities/route';

import { flyToPlace } from './fly-to-place';

const SUMMERLAND = { name: 'Summerland', lng: -119.68, lat: 49.6 };

// Builds a store with the slices the thunk touches.
function buildStore() {
  const reducer = combineSlices(droneModeSlice, droneSnapshotSlice, routeSlice, recentPlacesSlice);
  return configureStore({ reducer });
}

describe('flyToPlace', () => {
  it('plans from the latest snapshot, enters autoRoute and adds the place to recents', () => {
    const store = buildStore();
    store.dispatch(
      droneSnapshotPublished({
        lng: -123.12,
        lat: 49.28,
        altitudeMsl: 500,
        altitudeAgl: 400,
        speedMps: 0,
        verticalSpeedMps: 0,
        headingDeg: 0,
        isAtBcEdge: false,
        isAtCeiling: false,
        isTerrainMissing: false,
        routeRemainingM: 0,
        routeRemainingS: 0,
        publishedAtMs: 0,
      }),
    );
    store.dispatch(flyToPlace(SUMMERLAND) as never);
    const state = store.getState();
    expect(state.droneMode.mode).toBe('autoRoute');
    expect(state.route.activeRoute).toMatchObject({
      routeId: 1,
      destination: SUMMERLAND,
      durationS: 45,
    });
    expect(state.route.activeRoute?.originLng).toBe(-123.12);
    expect(state.recentPlaces.places).toEqual([SUMMERLAND]);
  });

  it('still starts a route before the first snapshot exists', () => {
    const store = buildStore();
    store.dispatch(flyToPlace(SUMMERLAND) as never);
    expect(store.getState().route.activeRoute?.distanceM).toBe(0);
  });
});
