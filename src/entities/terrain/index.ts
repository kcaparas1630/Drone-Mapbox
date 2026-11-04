// Public API of the terrain entity: null-safe DEM sampling and the altitude rules built on it.
export { sampleTerrainAhead } from './api/sample-terrain-ahead';
export { sampleTerrainElevation } from './api/sample-terrain-elevation';
export { easeAltitude } from './lib/ease-altitude';
export { computeTerrainFloor } from './lib/compute-terrain-floor';
export { updateFollowTarget } from './lib/update-follow-target';
export { createTerrainFollowState } from './model/terrain-follow-state';
export type { TerrainFollowState } from './model/terrain-follow-state';
