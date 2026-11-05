// Tests bounding-box membership, edges and invalid coordinates.
import { describe, expect, it } from 'vitest';

import { isInsideBoundingBox } from './is-inside-bounding-box';

const BOX = { WEST_LNG: -139.06, SOUTH_LAT: 48.3, EAST_LNG: -114.03, NORTH_LAT: 60 };

describe('isInsideBoundingBox', () => {
  it('accepts a point inside and on the edge', () => {
    expect(isInsideBoundingBox(-122.75, 53.92, BOX)).toBe(true);
    expect(isInsideBoundingBox(-114.03, 60, BOX)).toBe(true);
  });

  it('rejects points outside the box', () => {
    expect(isInsideBoundingBox(-113.5, 53, BOX)).toBe(false);
    expect(isInsideBoundingBox(-122, 47.6, BOX)).toBe(false);
  });

  it('rejects non-finite coordinates', () => {
    expect(isInsideBoundingBox(Number.NaN, 53, BOX)).toBe(false);
    expect(isInsideBoundingBox(-122, Number.POSITIVE_INFINITY, BOX)).toBe(false);
  });
});
