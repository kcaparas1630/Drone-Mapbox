// Tests cumulative distances along a short polyline.
import { describe, expect, it } from 'vitest';

import { computePathDistances } from './compute-path-distances';

describe('computePathDistances', () => {
  it('starts at zero and adds each segment, about 11.1 km per 0.1° of latitude', () => {
    const distances = computePathDistances({ lngs: [-122, -122, -122], lats: [54, 54.1, 54.2] });
    expect(distances[0]).toBe(0);
    expect((distances[1] ?? 0) / 1000).toBeCloseTo(11.12, 1);
    expect((distances[2] ?? 0) / 1000).toBeCloseTo(22.24, 1);
  });
});
