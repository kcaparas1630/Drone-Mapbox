// Tests heading unit vectors for the cardinal directions.
import { describe, expect, it } from 'vitest';

import { computeHeadingVector } from './compute-heading-vector';

describe('computeHeadingVector', () => {
  it('points north at 0 and east at a quarter turn', () => {
    const out = { east: 0, north: 0 };
    computeHeadingVector(out, 0);
    expect(out).toEqual({ east: 0, north: 1 });
    computeHeadingVector(out, Math.PI / 2);
    expect(out.east).toBeCloseTo(1, 12);
    expect(out.north).toBeCloseTo(0, 12);
  });
});
