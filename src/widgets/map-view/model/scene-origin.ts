// The local metric frame the three.js scene uses: a mercator origin near the drone and its metres-to-units scale.
import { computeMercatorUnitsPerMeter, projectToMercator } from '@/shared/lib/geo';

export type SceneOrigin = { lng: number; lat: number; x: number; y: number; unitsPerMeter: number };

// Returns an origin at lng/lat; the scene stores positions in metres relative to it.
export function createSceneOrigin(lng: number, lat: number): SceneOrigin {
  const mercator = { x: 0, y: 0, z: 0 };
  projectToMercator(mercator, lng, lat, 0);
  return {
    lng,
    lat,
    x: mercator.x,
    y: mercator.y,
    unitsPerMeter: computeMercatorUnitsPerMeter(lat),
  };
}
