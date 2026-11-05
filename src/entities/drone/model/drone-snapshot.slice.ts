// Throttled (≤ 4 Hz) copy of the simulation that React reads; the 60 fps SimWorld never enters Redux (ADR 011).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DroneSnapshot = {
  lng: number;
  lat: number;
  altitudeMsl: number;
  altitudeAgl: number | null;
  speedMps: number;
  verticalSpeedMps: number;
  headingDeg: number;
  isAtBcEdge: boolean;
  isAtCeiling: boolean;
  isTerrainMissing: boolean;
  routeRemainingM: number;
  routeRemainingS: number;
  publishedAtMs: number;
};

export type DroneSnapshotState = { snapshot: DroneSnapshot | null };

const initialState: DroneSnapshotState = { snapshot: null };

export const droneSnapshotSlice = createSlice({
  name: 'droneSnapshot',
  initialState,
  reducers: {
    droneSnapshotPublished(state, action: PayloadAction<DroneSnapshot>) {
      state.snapshot = action.payload;
    },
  },
  selectors: {
    selectDroneSnapshot: (state) => state.snapshot,
  },
});

export const { droneSnapshotPublished } = droneSnapshotSlice.actions;

export const { selectDroneSnapshot } = droneSnapshotSlice.selectors;
