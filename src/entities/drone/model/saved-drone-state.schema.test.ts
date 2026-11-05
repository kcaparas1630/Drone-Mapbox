// Tests the saved drone state schema: version 1 numbers only, no infinities, no extra versions.
import { describe, expect, it } from 'vitest';

import { savedDroneStateSchema } from './saved-drone-state.schema';

const VALID = { v: 1, lng: -122.75, lat: 53.92, altMsl: 1200, headingRad: 0.5, savedAt: 1 };

describe('savedDroneStateSchema', () => {
  it('accepts a version 1 state', () => {
    expect(savedDroneStateSchema.safeParse(VALID).success).toBe(true);
  });

  it('rejects other versions, missing fields and non-finite numbers', () => {
    expect(savedDroneStateSchema.safeParse({ ...VALID, v: 2 }).success).toBe(false);
    expect(savedDroneStateSchema.safeParse({ ...VALID, lat: undefined }).success).toBe(false);
    expect(savedDroneStateSchema.safeParse({ ...VALID, altMsl: Infinity }).success).toBe(false);
    expect(savedDroneStateSchema.safeParse({ ...VALID, lng: '-122' }).success).toBe(false);
  });
});
