// Tests the route easing curve: fixed ends, symmetric middle, clamped input.
import { describe, expect, it } from 'vitest';

import { easeRouteProgress } from './ease-route-progress';

describe('easeRouteProgress', () => {
  it('starts at 0, ends at 1 and passes through the midpoint', () => {
    expect(easeRouteProgress(0)).toBe(0);
    expect(easeRouteProgress(1)).toBe(1);
    expect(easeRouteProgress(0.5)).toBeCloseTo(0.5, 12);
  });

  it('is slow at the start and end', () => {
    expect(easeRouteProgress(0.1)).toBeLessThan(0.1);
    expect(easeRouteProgress(0.9)).toBeGreaterThan(0.9);
  });

  it('clamps times outside 0..1', () => {
    expect(easeRouteProgress(-1)).toBe(0);
    expect(easeRouteProgress(2)).toBe(1);
  });
});
