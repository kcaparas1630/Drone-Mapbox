// Projects lng/lat/altitude into Mapbox mercator units without allocating (replaces fromLngLat per frame).
import { EARTH_RADIUS_M } from './earth-radius-m';
import type { MercatorPoint } from './geo.types';
import { toRadians } from './to-radians';

const EARTH_CIRCUMFERENCE_M = 2 * Math.PI * EARTH_RADIUS_M;

// Writes the mercator x/y (0..1 across the world) and altitude z in the same units into out.
export function projectToMercator(
  out: MercatorPoint,
  lng: number,
  lat: number,
  altitudeM: number,
): void {
  const latRad = toRadians(lat);
  out.x = (180 + lng) / 360;
  out.y = (180 - (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + latRad / 2))) / 360;
  out.z = altitudeM / (EARTH_CIRCUMFERENCE_M * Math.cos(latRad));
}
