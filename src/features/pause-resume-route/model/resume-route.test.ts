// Tests resuming: re-planning from the current position, arriving at once, and nothing to resume.
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import {
  autoRouteStarted,
  droneInputStarted,
  droneModeSlice,
  droneSnapshotPublished,
  droneSnapshotSlice,
} from '@/entities/drone';
import { routePlanned, routeSlice } from '@/entities/route';

import { resumeRoute } from './resume-route';

const SUMMERLAND = { name: 'Summerland', lng: -119.68, lat: 49.6 };

// Builds a paused store whose drone snapshot is at the given position.
function buildPausedStore(lng: number, lat: number) {
  const store = configureStore({
    reducer: combineSlices(droneModeSlice, droneSnapshotSlice, routeSlice),
  });
  store.dispatch(
    routePlanned({
      destination: SUMMERLAND,
      originLng: -123.12,
      originLat: 49.28,
      distanceM: 251_000,
      durationS: 45,
      initialBearingRad: 1.4,
    }),
  );
  store.dispatch(autoRouteStarted());
  store.dispatch(droneInputStarted());
  store.dispatch(
    droneSnapshotPublished({
      lng,
      lat,
      altitudeMsl: 1500,
      altitudeAgl: 900,
      speedMps: 0,
      verticalSpeedMps: 0,
      headingDeg: 90,
      isAtBcEdge: false,
      isAtCeiling: false,
      isTerrainMissing: false,
      publishedAtMs: 0,
    }),
  );
  return store;
}

describe('resumeRoute', () => {
  it('re-plans from the current position with a fresh route id', () => {
    const store = buildPausedStore(-121, 49.5);
    expect(store.getState().droneMode.mode).toBe('paused');
    store.dispatch(resumeRoute() as never);
    const { droneMode, route } = store.getState();
    expect(droneMode.mode).toBe('autoRoute');
    expect(route.activeRoute).toMatchObject({ routeId: 2, originLng: -121, originLat: 49.5 });
  });

  it('arrives immediately when the drone is already at the destination', () => {
    const store = buildPausedStore(SUMMERLAND.lng, SUMMERLAND.lat);
    store.dispatch(resumeRoute() as never);
    expect(store.getState().droneMode.mode).toBe('arrived');
  });

  it('falls back to free flight when there is no route to resume', () => {
    const store = configureStore({
      reducer: combineSlices(droneModeSlice, droneSnapshotSlice, routeSlice),
    });
    store.dispatch(autoRouteStarted());
    store.dispatch(resumeRoute() as never);
    expect(store.getState().droneMode.mode).toBe('freeFlight');
  });
});
