// Tests eased, rate-limited altitude changes without overshoot.
import { describe, expect, it } from 'vitest';

import { easeAltitude } from './ease-altitude';

describe('easeAltitude', () => {
  it('caps the climb rate far from the target', () => {
    expect(easeAltitude(1000, 5000, 120, 1.5, 1)).toBe(1120);
  });

  it('slows down near the target', () => {
    expect(easeAltitude(1000, 1010, 120, 1.5, 0.1)).toBeCloseTo(1001.5, 9);
  });

  it('descends with the same limits and never overshoots', () => {
    expect(easeAltitude(5000, 1000, 120, 1.5, 1)).toBe(4880);
    expect(easeAltitude(1000, 1000.5, 120, 1.5, 1)).toBe(1000.5);
  });
});
