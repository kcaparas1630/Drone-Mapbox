// Sorts fires by distance from the drone with the bearing to each, for the fire panel and the compass (§4.1, §7.1).
import { computeHaversineDistance, computeInitialBearing } from '@/shared/lib/geo';

import type { Fire, RankedFire } from '../model/fire.types';

// Returns every fire nearest first; without an origin they are sorted by name and carry no distance.
export function sortFiresByDistance(
  fires: readonly Fire[],
  origin: { lng: number; lat: number } | null,
): RankedFire[] {
  if (origin === null) {
    return fires
      .map((fire) => ({ fire, distanceM: null, bearingRad: null }))
      .sort((first, second) => first.fire.incidentName.localeCompare(second.fire.incidentName));
  }
  return fires
    .map((fire) => ({
      fire,
      distanceM: computeHaversineDistance(origin.lng, origin.lat, fire.lng, fire.lat),
      bearingRad: computeInitialBearing(origin.lng, origin.lat, fire.lng, fire.lat),
    }))
    .sort((first, second) => first.distanceM - second.distanceM);
}
