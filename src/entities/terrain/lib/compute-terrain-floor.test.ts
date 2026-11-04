// Tests the free-flight floor from lookahead samples, including partly and fully missing terrain.
import { describe, expect, it } from 'vitest';

import { computeTerrainFloor } from './compute-terrain-floor';

describe('computeTerrainFloor', () => {
  it('uses the highest sample ahead plus 30 m', () => {
    expect(computeTerrainFloor([400, 900, 2100, 1500])).toBe(2130);
  });

  it('ignores null samples', () => {
    expect(computeTerrainFloor([null, 800, null, null])).toBe(830);
  });

  it('returns null when every sample is missing', () => {
    expect(computeTerrainFloor([null, null, null, null])).toBeNull();
  });
});
