// Tests flame picking with a simple perspective: hits on the flame, misses beside it, and the nearer flame wins.
import { describe, expect, it } from 'vitest';

import type { FlamePicks } from '../model/flame-picks.types';
import { findFlameAtPoint } from './find-flame-at-point';

// Returns a column-major projection looking down -Y from the origin: x → right, z → up, depth = y.
function buildProjection(): Float64Array {
  const projection = new Float64Array(16);
  projection[0] = 1;
  projection[6] = 1;
  projection[9] = 1;
  projection[7] = 1;
  return projection;
}

// Builds pick buffers for flames given as [x, y, z, width, height, fireIndex].
function buildPicks(flames: number[][]): FlamePicks {
  const placements = new Float64Array(flames.length * 5);
  const fireIndices = new Int32Array(flames.length);
  flames.forEach((flame, slot) => {
    placements.set(flame.slice(0, 5), slot * 5);
    fireIndices[slot] = flame[5] ?? -1;
  });
  return { count: flames.length, placements, fireIndices, projection: buildProjection() };
}

describe('findFlameAtPoint', () => {
  it('hits a flame straight ahead and misses beside it', () => {
    const picks = buildPicks([[0, 10, -2, 3, 4, 7]]);
    expect(findFlameAtPoint(picks, 500, 500, 1000, 1000)).toBe(7);
    expect(findFlameAtPoint(picks, 900, 500, 1000, 1000)).toBe(-1);
  });

  it('prefers the nearer of two overlapping flames and ignores flames behind the camera', () => {
    const picks = buildPicks([
      [0, 20, -4, 6, 8, 1],
      [0, 10, -2, 3, 4, 2],
      [0, -10, -2, 3, 4, 3],
    ]);
    expect(findFlameAtPoint(picks, 500, 500, 1000, 1000)).toBe(2);
  });
});
