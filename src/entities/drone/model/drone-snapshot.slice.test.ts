// Tests that published snapshots replace the previous one and are selectable.
import { describe, expect, it } from 'vitest';

import {
  type DroneSnapshot,
  droneSnapshotPublished,
  droneSnapshotSlice,
  selectDroneSnapshot,
} from './drone-snapshot.slice';

const SNAPSHOT: DroneSnapshot = {
  lng: -122.75,
  lat: 53.92,
  altitudeMsl: 1200,
  altitudeAgl: 500,
  speedMps: 42,
  verticalSpeedMps: 0,
  headingDeg: 90,
  isAtBcEdge: false,
  isAtCeiling: false,
  isTerrainMissing: false,
  routeRemainingM: 0,
  routeRemainingS: 0,
  publishedAtMs: 1000,
};

describe('droneSnapshotSlice', () => {
  it('has no snapshot before the loop publishes one', () => {
    expect(droneSnapshotSlice.getInitialState()).toEqual({ snapshot: null });
  });

  it('stores the latest published snapshot', () => {
    const state = droneSnapshotSlice.reducer(undefined, droneSnapshotPublished(SNAPSHOT));
    expect(selectDroneSnapshot({ droneSnapshot: state })).toEqual(SNAPSHOT);
  });
});
