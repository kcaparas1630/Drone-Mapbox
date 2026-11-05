// Tests choosing the launch spawn from a saved state, an outside-BC state or nothing.
import { describe, expect, it } from 'vitest';

import { restoreDroneSpawn } from './restore-drone-spawn';

const SAVED = { v: 1 as const, lng: -119.68, lat: 49.6, altMsl: 900, headingRad: 1, savedAt: 1 };

describe('restoreDroneSpawn', () => {
  it('spawns at BC centre heading north with a pending altitude when nothing is saved', () => {
    expect(restoreDroneSpawn(null)).toEqual({
      spawn: { lng: -122.75, lat: 53.92, altitudeMsl: null, headingRad: 0 },
      rejectionReason: null,
    });
  });

  it('restores a saved position inside BC', () => {
    expect(restoreDroneSpawn(SAVED).spawn).toEqual({
      lng: -119.68,
      lat: 49.6,
      altitudeMsl: 900,
      headingRad: 1,
    });
  });

  it('rejects a saved position outside BC with a reason', () => {
    const restored = restoreDroneSpawn({ ...SAVED, lng: -100 });
    expect(restored.spawn.lng).toBe(-122.75);
    expect(restored.rejectionReason).toBe('Saved drone position is outside BC.');
  });

  it('clamps a saved altitude above the ceiling', () => {
    expect(restoreDroneSpawn({ ...SAVED, altMsl: 50_000 }).spawn.altitudeMsl).toBe(12_000);
  });
});
