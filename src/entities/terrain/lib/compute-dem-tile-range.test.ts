// Tests the DEM zoom choice: fine for short routes, coarser for long ones, always within 12 tiles.
import { describe, expect, it } from 'vitest';

import { computeDemTileRange } from './compute-dem-tile-range';

// Returns how many tiles a range covers.
function computeTileCount(range: ReturnType<typeof computeDemTileRange>): number {
  return (range.xMax - range.xMin + 1) * (range.yMax - range.yMin + 1);
}

describe('computeDemTileRange', () => {
  it('uses zoom 10 for a corridor a few kilometres wide', () => {
    const range = computeDemTileRange({
      WEST_LNG: -122.8,
      SOUTH_LAT: 53.9,
      EAST_LNG: -122.7,
      NORTH_LAT: 53.95,
    });
    expect(range.zoom).toBe(10);
    expect(computeTileCount(range)).toBeLessThanOrEqual(12);
  });

  it('drops to a coarser zoom for Vancouver to Prince George and stays within 12 tiles', () => {
    const range = computeDemTileRange({
      WEST_LNG: -124.5,
      SOUTH_LAT: 49.2,
      EAST_LNG: -121.4,
      NORTH_LAT: 53.95,
    });
    expect(range.zoom).toBeLessThan(8);
    expect(computeTileCount(range)).toBeLessThanOrEqual(12);
    expect(range.yMin).toBeLessThanOrEqual(range.yMax);
  });
});
