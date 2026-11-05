// Tests beacon sizing: log growth with hectares, clamping, distance growth and minimum width.
import { describe, expect, it } from 'vitest';

import { computeBeaconSize } from './compute-beacon-size';

// Returns the size for a fire of sizeHa seen from distanceM.
function readSize(sizeHa: number | null, distanceM: number) {
  const out = { heightM: 0, widthM: 0 };
  computeBeaconSize(out, sizeHa, distanceM);
  return out;
}

describe('computeBeaconSize', () => {
  it('starts at 150 m for tiny or unknown fires nearby', () => {
    expect(readSize(null, 1000)).toEqual({ heightM: 150, widthM: 12 });
  });

  it('grows with the logarithm of the size and clamps at 900 m', () => {
    expect(readSize(999, 1000).heightM).toBeCloseTo(510, 6);
    expect(readSize(1e12, 1000).heightM).toBe(900);
  });

  it('grows with distance up to 25 times so distant fires remain visible', () => {
    expect(readSize(null, 80_000).heightM).toBeCloseTo(1500, 6);
    expect(readSize(null, 10_000_000).heightM).toBe(3750);
    expect(readSize(null, 80_000).widthM).toBeCloseTo(90, 6);
  });
});
