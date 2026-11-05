// Plans a straight great-circle route with turf at plan time (ADR 007); per-frame motion uses shared geo maths.
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';

import type { Place } from '../model/place.schema';
import type { RoutePlanDraft } from '../model/route-plan.types';
import { computeTripDuration } from './compute-trip-duration';

// Returns the route from the origin to the destination with its distance, duration and initial bearing.
export function planGeodesicRoute(
  originLng: number,
  originLat: number,
  destination: Place,
): RoutePlanDraft {
  const origin: [number, number] = [originLng, originLat];
  const target: [number, number] = [destination.lng, destination.lat];
  const distanceM = turfDistance(origin, target, { units: 'meters' });
  const bearingDeg = turfBearing(origin, target);
  return {
    destination,
    originLng,
    originLat,
    distanceM,
    durationS: computeTripDuration(distanceM),
    initialBearingRad: (((bearingDeg + 360) % 360) * Math.PI) / 180,
  };
}
