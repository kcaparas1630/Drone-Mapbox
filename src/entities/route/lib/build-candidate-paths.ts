// Candidate route curves: quadratic Béziers bowed sideways by 0, ±15, ±30 and ±45 % of the distance (ADR 022).
import { ROUTE_TUNING } from '@/shared/config';
import { computeHaversineDistance, EARTH_RADIUS_M } from '@/shared/lib/geo';

import type { PathPoints, RouteEndpoints } from '../model/route-path.types';

const {
  MAX_PATH_POINTS,
  MIN_PATH_POINTS,
  PATH_POINT_SPACING_M,
  MIN_CURVED_ROUTE_M,
  OFFSET_FRACTIONS,
  MAX_OFFSET_M,
} = ROUTE_TUNING;
const DEGREES_TO_RADIANS = Math.PI / 180;

// Returns one curve per offset (the straight line first); routes under 3 km only get the straight line.
export function buildCandidatePaths(endpoints: RouteEndpoints): PathPoints[] {
  const { originLng, originLat, destinationLng, destinationLat } = endpoints;
  const straightM = computeHaversineDistance(originLng, originLat, destinationLng, destinationLat);
  const pointCount = Math.min(
    MAX_PATH_POINTS,
    Math.max(MIN_PATH_POINTS, Math.ceil(straightM / PATH_POINT_SPACING_M) + 1),
  );
  const metresPerDegreeLat = EARTH_RADIUS_M * DEGREES_TO_RADIANS;
  const metresPerDegreeLng =
    metresPerDegreeLat * Math.cos(((originLat + destinationLat) / 2) * DEGREES_TO_RADIANS);
  const eastM = (destinationLng - originLng) * metresPerDegreeLng;
  const northM = (destinationLat - originLat) * metresPerDegreeLat;
  const lengthM = Math.max(1, Math.hypot(eastM, northM));
  const fractions = straightM < MIN_CURVED_ROUTE_M ? [0] : OFFSET_FRACTIONS;
  return fractions.map((fraction) => {
    const offsetM = Math.max(-MAX_OFFSET_M, Math.min(MAX_OFFSET_M, fraction * straightM));
    const controlEastM = eastM / 2 + (2 * offsetM * northM) / lengthM;
    const controlNorthM = northM / 2 - (2 * offsetM * eastM) / lengthM;
    const lngs: number[] = [];
    const lats: number[] = [];
    for (let index = 0; index < pointCount; index += 1) {
      const t = index / (pointCount - 1);
      const controlWeight = 2 * (1 - t) * t;
      lngs.push(originLng + (controlWeight * controlEastM + t * t * eastM) / metresPerDegreeLng);
      lats.push(originLat + (controlWeight * controlNorthM + t * t * northM) / metresPerDegreeLat);
    }
    return { lngs, lats };
  });
}
