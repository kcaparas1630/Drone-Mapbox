// Scale between metres and Mapbox mercator units at a latitude, for sizing meshes correctly at 60° N.
import { EARTH_RADIUS_M } from './earth-radius-m';
import { toRadians } from './to-radians';

const EARTH_CIRCUMFERENCE_M = 2 * Math.PI * EARTH_RADIUS_M;

// Returns how many mercator units one metre spans at the given latitude.
export function computeMercatorUnitsPerMeter(lat: number): number {
  return 1 / (EARTH_CIRCUMFERENCE_M * Math.cos(toRadians(lat)));
}
