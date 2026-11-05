// Tests flame heights: size growth, the on-screen minimum for far fires, and status scaling.
import { describe, expect, it } from 'vitest';

import { computeFlameHeight } from './compute-flame-height';

describe('computeFlameHeight', () => {
  it('grows with the burned area on a log scale when the fire is close', () => {
    expect(computeFlameHeight(0, 'Out of Control', 500, 900)).toBeCloseTo(60, 6);
    expect(computeFlameHeight(999, 'Out of Control', 500, 900)).toBeCloseTo(195, 6);
  });

  it('keeps a far fire at least 32 px tall: 50 km away on a 900 px viewport needs ~1.19 km', () => {
    expect(computeFlameHeight(10, 'New', 50_000, 900)).toBeCloseTo((32 * 50_000) / (1.5 * 900), 6);
  });

  it('scales the flame by status and hides fires that are out', () => {
    const full = computeFlameHeight(100, 'Out of Control', 500, 900);
    expect(computeFlameHeight(100, 'Being Held', 500, 900)).toBeCloseTo(full * 0.6, 6);
    expect(computeFlameHeight(100, 'Under Control', 500, 900)).toBeCloseTo(full * 0.35, 6);
    expect(computeFlameHeight(100, 'Out', 500, 900)).toBe(0);
  });
});
