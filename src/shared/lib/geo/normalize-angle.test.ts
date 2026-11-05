// Tests wrapping angles into (-π, π].
import { describe, expect, it } from 'vitest';

import { normalizeAngle } from './normalize-angle';

describe('normalizeAngle', () => {
  it('keeps angles already in range', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(Math.PI / 2)).toBeCloseTo(Math.PI / 2, 12);
  });

  it('maps both ends of the half turn to +π', () => {
    expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI, 12);
    expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI, 12);
  });

  it('wraps multiples of a full turn', () => {
    expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI, 12);
    expect(normalizeAngle((-3 * Math.PI) / 2)).toBeCloseTo(Math.PI / 2, 12);
  });
});
