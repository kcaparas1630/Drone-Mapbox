// Tests the corridor box around several candidate curves.
import { describe, expect, it } from 'vitest';

import { computePathsBoundingBox } from './compute-paths-bounding-box';

describe('computePathsBoundingBox', () => {
  it('covers every point of every path', () => {
    const box = computePathsBoundingBox([
      { lngs: [-122, -121.5], lats: [54, 54.4] },
      { lngs: [-122, -122.3, -121.5], lats: [54, 54.2, 54.4] },
    ]);
    expect(box).toEqual({ WEST_LNG: -122.3, SOUTH_LAT: 54, EAST_LNG: -121.5, NORTH_LAT: 54.4 });
  });
});
