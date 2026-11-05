// Tests that the follow distance defaults to 60 m and stays within 30–400 m.
import { describe, expect, it } from 'vitest';

import {
  cameraPrefsSlice,
  followDistanceChanged,
  selectFollowDistanceM,
} from './camera-prefs.slice';

// Applies one follow-distance change to the default state and returns the stored distance.
function readDistanceAfterChange(distanceM: number): number {
  return cameraPrefsSlice.reducer(undefined, followDistanceChanged(distanceM)).followDistanceM;
}

describe('cameraPrefsSlice', () => {
  it('defaults to 60 m', () => {
    expect(selectFollowDistanceM({ cameraPrefs: cameraPrefsSlice.getInitialState() })).toBe(60);
  });

  it('clamps the distance to 30–400 m and ignores non-finite values', () => {
    expect(readDistanceAfterChange(120)).toBe(120);
    expect(readDistanceAfterChange(5)).toBe(30);
    expect(readDistanceAfterChange(9000)).toBe(400);
    expect(readDistanceAfterChange(Number.NaN)).toBe(60);
  });
});
