// Tests every transition and guard of the flight mode state machine (behaviour §2).
import { describe, expect, it } from 'vitest';

import {
  arrivalDismissed,
  autoRouteStarted,
  droneInputStarted,
  droneModeSlice,
  type DroneMode,
  destinationReached,
  routeCancelled,
  selectDroneMode,
} from './drone-mode.slice';

// Runs the reducer from a given mode with one action and returns the resulting mode.
function applyFrom(
  mode: DroneMode,
  action: Parameters<typeof droneModeSlice.reducer>[1],
): DroneMode {
  return droneModeSlice.reducer({ mode }, action).mode;
}

describe('droneModeSlice', () => {
  it('starts idle', () => {
    expect(droneModeSlice.getInitialState()).toEqual({ mode: 'idle' });
  });

  it('moves to free flight on the first input from idle or arrived', () => {
    expect(applyFrom('idle', droneInputStarted())).toBe('freeFlight');
    expect(applyFrom('arrived', droneInputStarted())).toBe('freeFlight');
    expect(applyFrom('freeFlight', droneInputStarted())).toBe('freeFlight');
  });

  it('pauses an auto-route on manual input and keeps paused paused', () => {
    expect(applyFrom('autoRoute', droneInputStarted())).toBe('paused');
    expect(applyFrom('paused', droneInputStarted())).toBe('paused');
  });

  it('starts an auto-route from any mode', () => {
    for (const mode of ['idle', 'freeFlight', 'arrived', 'paused', 'autoRoute'] as const) {
      expect(applyFrom(mode, autoRouteStarted())).toBe('autoRoute');
    }
  });

  it('cancels a paused or running route into free flight only', () => {
    expect(applyFrom('paused', routeCancelled())).toBe('freeFlight');
    expect(applyFrom('autoRoute', routeCancelled())).toBe('freeFlight');
    expect(applyFrom('idle', routeCancelled())).toBe('idle');
  });

  it('arrives only from an auto-route and dismisses only from arrived', () => {
    expect(applyFrom('autoRoute', destinationReached())).toBe('arrived');
    expect(applyFrom('paused', destinationReached())).toBe('paused');
    expect(applyFrom('arrived', arrivalDismissed())).toBe('freeFlight');
    expect(applyFrom('idle', arrivalDismissed())).toBe('idle');
  });

  it('selects the mode from the root state', () => {
    expect(selectDroneMode({ droneMode: { mode: 'paused' } })).toBe('paused');
  });
});
