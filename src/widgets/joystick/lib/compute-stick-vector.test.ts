// Tests stick vectors: direction, clamping to the unit circle and the dead zone.
import { describe, expect, it } from 'vitest';

import { computeStickVector } from './compute-stick-vector';

describe('computeStickVector', () => {
  it('maps up and right drags to positive y and x', () => {
    expect(computeStickVector(30, -40, 100)).toEqual({ x: 0.3, y: 0.4 });
  });

  it('clamps drags beyond the radius to length 1', () => {
    const vector = computeStickVector(300, 400, 50);
    expect(Math.hypot(vector.x, vector.y)).toBeCloseTo(1, 12);
    expect(vector.y).toBeLessThan(0);
  });

  it('ignores tiny drags and a zero radius', () => {
    expect(computeStickVector(2, 1, 60)).toEqual({ x: 0, y: 0 });
    expect(computeStickVector(20, 20, 0)).toEqual({ x: 0, y: 0 });
  });
});
