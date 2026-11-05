// Tests elevation lookups inside a tile, between pixels, outside the tiles and on bad pixels.
import { describe, expect, it } from 'vitest';

import type { DemTile } from '../model/dem-tile.types';
import { createElevationSampler } from './create-elevation-sampler';

// Builds a zoom-1 tile 0/0 (north-west quarter of the world) whose height grows 10 m per column.
function buildRampTile(): DemTile {
  const size = 4;
  const heightsM = new Float32Array(size * size);
  heightsM.forEach((unused, index) => {
    heightsM[index] = (index % size) * 10;
  });
  return { zoom: 1, x: 0, y: 0, size, heightsM };
}

describe('createElevationSampler', () => {
  it('interpolates between pixel centres and clamps at the tile edge', () => {
    const sample = createElevationSampler([buildRampTile()]);
    expect(sample(-90, 45)).toBeCloseTo(15, 3);
    expect(sample(-179.9, 45)).toBeCloseTo(0, 3);
  });

  it('returns null outside the loaded tiles and on NaN pixels', () => {
    const tile = buildRampTile();
    expect(createElevationSampler([tile])(90, 45)).toBeNull();
    tile.heightsM.fill(Number.NaN);
    expect(createElevationSampler([tile])(-90, 45)).toBeNull();
    expect(createElevationSampler([])(0, 0)).toBeNull();
  });
});
