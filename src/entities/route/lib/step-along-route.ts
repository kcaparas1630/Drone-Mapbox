// Position and bearing on a great-circle route after a given flight time, without allocating (behaviour §6.1).
import {
  computeDestinationPoint,
  computeHaversineDistance,
  computeInitialBearing,
} from '@/shared/lib/geo';

import type { RouteProgressInput, RouteProgressPoint } from '../model/route-progress.types';
import { easeRouteProgress } from './ease-route-progress';

const MIN_BEARING_DISTANCE_M = 1;

// Writes the eased position after elapsedS, the path bearing there and the distance left into out.
export function stepAlongRoute(
  out: RouteProgressPoint,
  route: RouteProgressInput,
  elapsedS: number,
): void {
  const timeFraction = route.durationS > 0 ? elapsedS / route.durationS : 1;
  const coveredM = route.distanceM * easeRouteProgress(timeFraction);
  computeDestinationPoint(out, route.originLng, route.originLat, route.initialBearingRad, coveredM);
  out.remainingM = computeHaversineDistance(
    out.lng,
    out.lat,
    route.destinationLng,
    route.destinationLat,
  );
  out.pathBearingRad =
    out.remainingM > MIN_BEARING_DISTANCE_M
      ? computeInitialBearing(out.lng, out.lat, route.destinationLng, route.destinationLat)
      : route.initialBearingRad;
  out.isComplete = timeFraction >= 1;
}
