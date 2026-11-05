// Initial great-circle bearing from one lng/lat point towards another.
import { toRadians } from './to-radians';

const FULL_TURN_RAD = 2 * Math.PI;

// Returns the bearing in radians clockwise from north, in [0, 2π).
export function computeInitialBearing(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number,
): number {
  const fromLatRad = toRadians(fromLat);
  const toLatRad = toRadians(toLat);
  const deltaLngRad = toRadians(toLng - fromLng);
  const east = Math.sin(deltaLngRad) * Math.cos(toLatRad);
  const north =
    Math.cos(fromLatRad) * Math.sin(toLatRad) -
    Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(deltaLngRad);
  return (Math.atan2(east, north) + FULL_TURN_RAD) % FULL_TURN_RAD;
}
