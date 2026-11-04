// Great-circle distance between two lng/lat points on a spherical Earth.
import { EARTH_RADIUS_M } from './earth-radius-m';
import { toRadians } from './to-radians';

// Returns the distance in metres between the two points.
export function computeHaversineDistance(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number,
): number {
  const fromLatRad = toRadians(fromLat);
  const toLatRad = toRadians(toLat);
  const deltaLatRad = toLatRad - fromLatRad;
  const deltaLngRad = toRadians(toLng - fromLng);
  const halfChord =
    Math.sin(deltaLatRad / 2) ** 2 +
    Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(deltaLngRad / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(halfChord), Math.sqrt(1 - halfChord));
}
