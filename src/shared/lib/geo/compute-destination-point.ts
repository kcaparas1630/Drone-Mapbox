// Moves along a great circle from a lng/lat point; writes into an out object so per-frame use never allocates.
import { EARTH_RADIUS_M } from './earth-radius-m';
import type { GeoPoint } from './geo.types';
import { toDegrees } from './to-degrees';
import { toRadians } from './to-radians';

// Writes the point reached after distanceM metres on bearingRad (clockwise from north) into out.
export function computeDestinationPoint(
  out: GeoPoint,
  lng: number,
  lat: number,
  bearingRad: number,
  distanceM: number,
): void {
  const angularDistance = distanceM / EARTH_RADIUS_M;
  const latRad = toRadians(lat);
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinDistance = Math.sin(angularDistance);
  const cosDistance = Math.cos(angularDistance);
  const sinDestinationLat = sinLat * cosDistance + cosLat * sinDistance * Math.cos(bearingRad);
  const destinationLatRad = Math.asin(Math.min(1, Math.max(-1, sinDestinationLat)));
  const deltaLngRad = Math.atan2(
    Math.sin(bearingRad) * sinDistance * cosLat,
    cosDistance - sinLat * sinDestinationLat,
  );
  out.lat = toDegrees(destinationLatRad);
  out.lng = ((lng + toDegrees(deltaLngRad) + 540) % 360) - 180;
}
