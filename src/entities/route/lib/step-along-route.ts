// Position, planned altitude and steering bearing on the route polyline after a flight time, without allocating.
import { ROUTE_TUNING } from '@/shared/config';
import { computeInitialBearing } from '@/shared/lib/geo';

import type { RouteProgressInput, RouteProgressPoint } from '../model/route-progress.types';
import { easeRouteProgress } from './ease-route-progress';

// Returns the index of the segment containing distanceM, scanning forward from startIndex.
function findSegment(route: RouteProgressInput, distanceM: number, startIndex: number): number {
  let index = Math.max(0, startIndex);
  while (index < route.pathCount - 2 && (route.pathDistancesM[index + 1] ?? 0) <= distanceM) {
    index += 1;
  }
  return index;
}

// Returns how far (0..1) distanceM lies along the segment starting at index.
function readSegmentFraction(route: RouteProgressInput, index: number, distanceM: number): number {
  const startM = route.pathDistancesM[index] ?? 0;
  const lengthM = (route.pathDistancesM[index + 1] ?? startM) - startM;
  return lengthM > 0 ? Math.min(1, Math.max(0, (distanceM - startM) / lengthM)) : 0;
}

// Returns the value of a path buffer interpolated at a segment fraction.
function interpolate(values: Float64Array, index: number, fraction: number): number {
  const start = values[index] ?? 0;
  return start + ((values[index + 1] ?? start) - start) * fraction;
}

// Writes the eased position after elapsedS, its planned altitude and slope, and the look-ahead bearing.
export function stepAlongRoute(
  out: RouteProgressPoint,
  route: RouteProgressInput,
  elapsedS: number,
): void {
  const totalM = route.pathDistancesM[route.pathCount - 1] ?? 0;
  const timeFraction = route.durationS > 0 ? elapsedS / route.durationS : 1;
  const coveredM = totalM * easeRouteProgress(timeFraction);
  const index = findSegment(route, coveredM, route.segmentIndex);
  route.segmentIndex = index;
  const fraction = readSegmentFraction(route, index, coveredM);
  out.lng = interpolate(route.pathLngs, index, fraction);
  out.lat = interpolate(route.pathLats, index, fraction);
  out.altitudeMsl = interpolate(route.pathAltitudesMsl, index, fraction);
  const segmentM = (route.pathDistancesM[index + 1] ?? 0) - (route.pathDistancesM[index] ?? 0);
  out.profileSlope =
    segmentM > 0
      ? ((route.pathAltitudesMsl[index + 1] ?? 0) - (route.pathAltitudesMsl[index] ?? 0)) / segmentM
      : 0;
  const lookaheadM = Math.max(
    ROUTE_TUNING.MIN_LOOKAHEAD_M,
    ROUTE_TUNING.LOOKAHEAD_FRACTION * totalM,
  );
  const aheadM = Math.min(totalM, coveredM + lookaheadM);
  const aheadIndex = findSegment(route, aheadM, index);
  const aheadFraction = readSegmentFraction(route, aheadIndex, aheadM);
  const aheadLng = interpolate(route.pathLngs, aheadIndex, aheadFraction);
  const aheadLat = interpolate(route.pathLats, aheadIndex, aheadFraction);
  if (aheadM - coveredM > 1) {
    out.pathBearingRad = computeInitialBearing(out.lng, out.lat, aheadLng, aheadLat);
  }
  out.remainingM = totalM - coveredM;
  out.isComplete = timeFraction >= 1;
}
