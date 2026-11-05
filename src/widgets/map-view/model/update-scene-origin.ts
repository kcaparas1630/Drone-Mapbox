// Re-bases the scene origin when the drone has flown far from it, keeping float32 coordinates small and precise.
import {
  computeHaversineDistance,
  computeMercatorUnitsPerMeter,
  type MercatorPoint,
  projectToMercator,
} from '@/shared/lib/geo';

import type { SceneOrigin } from './scene-origin';

const REBASE_DISTANCE_M = 20_000;
const scratchMercator: MercatorPoint = { x: 0, y: 0, z: 0 };

// Moves the origin to lng/lat when it is more than 20 km away; returns true when it moved.
export function updateSceneOrigin(origin: SceneOrigin, lng: number, lat: number): boolean {
  if (computeHaversineDistance(origin.lng, origin.lat, lng, lat) < REBASE_DISTANCE_M) {
    return false;
  }
  projectToMercator(scratchMercator, lng, lat, 0);
  origin.lng = lng;
  origin.lat = lat;
  origin.x = scratchMercator.x;
  origin.y = scratchMercator.y;
  origin.unitsPerMeter = computeMercatorUnitsPerMeter(lat);
  return true;
}
