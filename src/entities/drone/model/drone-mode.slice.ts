// Flight mode state machine: idle, freeFlight, autoRoute, paused and arrived (ADR 004, behaviour §2).
import { createSlice } from '@reduxjs/toolkit';

export const DRONE_MODES = ['idle', 'freeFlight', 'autoRoute', 'paused', 'arrived'] as const;

export type DroneMode = (typeof DRONE_MODES)[number];

export type DroneModeState = { mode: DroneMode };

const initialState: DroneModeState = { mode: 'idle' };

export const droneModeSlice = createSlice({
  name: 'droneMode',
  initialState,
  reducers: {
    droneInputStarted(state) {
      if (state.mode === 'idle' || state.mode === 'arrived') {
        state.mode = 'freeFlight';
      } else if (state.mode === 'autoRoute') {
        state.mode = 'paused';
      }
    },
    autoRouteStarted(state) {
      state.mode = 'autoRoute';
    },
    routeCancelled(state) {
      if (state.mode === 'paused' || state.mode === 'autoRoute') {
        state.mode = 'freeFlight';
      }
    },
    destinationReached(state) {
      if (state.mode === 'autoRoute') {
        state.mode = 'arrived';
      }
    },
    arrivalDismissed(state) {
      if (state.mode === 'arrived') {
        state.mode = 'freeFlight';
      }
    },
  },
  selectors: {
    selectDroneMode: (state) => state.mode,
  },
});

export const {
  droneInputStarted,
  autoRouteStarted,
  routeCancelled,
  destinationReached,
  arrivalDismissed,
} = droneModeSlice.actions;

export const { selectDroneMode } = droneModeSlice.selectors;
