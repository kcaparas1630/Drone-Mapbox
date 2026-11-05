// Tests the planned profile: ridge clearance, an early climb, a gentle descent and the arrival height.
import { describe, expect, it } from 'vitest';

import { buildAltitudeProfile } from './build-altitude-profile';

const DISTANCES_M = [...Array(41).keys()].map((index) => index * 1000);

// Returns flat 500 m terrain with a 2,000 m ridge between 20 and 22 km.
function buildRidgeTerrain(): number[] {
  return DISTANCES_M.map((distanceM) => (distanceM >= 20_000 && distanceM <= 22_000 ? 2000 : 500));
}

describe('buildAltitudeProfile', () => {
  it('starts at the drone altitude, clears the ridge by 300 m and arrives 300 m up', () => {
    const profile = buildAltitudeProfile(DISTANCES_M, buildRidgeTerrain(), 1000);
    expect(profile[0]).toBe(1000);
    expect(profile[21] ?? 0).toBeGreaterThanOrEqual(2300);
    expect(profile[40] ?? 0).toBeCloseTo(800, 0);
  });

  it('climbs before the ridge instead of at it, and descends more gently after it', () => {
    const profile = buildAltitudeProfile(DISTANCES_M, buildRidgeTerrain(), 1000);
    expect(profile[16] ?? 0).toBeGreaterThan(1700);
    expect(profile[30] ?? 0).toBeGreaterThan(1100);
    for (let index = 2; index < profile.length; index += 1) {
      expect(Math.abs((profile[index] ?? 0) - (profile[index - 1] ?? 0))).toBeLessThanOrEqual(260);
    }
  });

  it('follows the envelope and ends at the start height when no terrain is known', () => {
    const unknownTerrain = DISTANCES_M.map(() => null);
    const profile = buildAltitudeProfile(DISTANCES_M, unknownTerrain, 1000);
    expect(profile[40]).toBeCloseTo(1000, 0);
    expect(Math.max(...profile)).toBeGreaterThan(1700);
    expect(Math.max(...profile)).toBeLessThanOrEqual(1800);
  });
});
