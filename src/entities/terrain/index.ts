// Public API of the terrain entity: null-safe DEM sampling, corridor DEM tiles and the altitude rules on them.
export { loadDemTiles } from './api/load-dem-tiles';
export { sampleTerrainAhead } from './api/sample-terrain-ahead';
export { sampleTerrainElevation } from './api/sample-terrain-elevation';
export { computeDemTileRange } from './lib/compute-dem-tile-range';
export { createElevationSampler } from './lib/create-elevation-sampler';
export { easeAltitude } from './lib/ease-altitude';
export { computeTerrainFloor } from './lib/compute-terrain-floor';
export type { DemTile, DemTileRange } from './model/dem-tile.types';
