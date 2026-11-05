// Tests mercator projection against known coordinates and the altitude scale at 60° N.
import { describe, expect, it } from 'vitest';

import { projectToMercator } from './project-to-mercator';

describe('projectToMercator', () => {
  it('maps the origin to the centre of the world square', () => {
    const out = { x: 0, y: 0, z: 0 };
    projectToMercator(out, 0, 0, 0);
    expect(out.x).toBeCloseTo(0.5, 12);
    expect(out.y).toBeCloseTo(0.5, 12);
    expect(out.z).toBe(0);
  });

  it('maps 60° N to y ≈ 0.2904 and doubles the altitude scale there', () => {
    const atEquator = { x: 0, y: 0, z: 0 };
    const atSixty = { x: 0, y: 0, z: 0 };
    projectToMercator(atEquator, -180, 0, 1000);
    projectToMercator(atSixty, -180, 60, 1000);
    expect(atSixty.x).toBe(0);
    expect(atSixty.y).toBeCloseTo(0.2904, 4);
    expect(atSixty.z / atEquator.z).toBeCloseTo(2, 9);
  });
});
