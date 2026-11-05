// Counts fires within a radius of a point and finds the nearest one, for the arrival card (behaviour §6.5).
import { computeHaversineDistance } from '@/shared/lib/geo';

import type { Fire, NearbyFires } from '../model/fire.types';

// Returns how many fires lie within radiusM of lng/lat and which is closest.
export function findNearbyFires(
  fires: readonly Fire[],
  lng: number,
  lat: number,
  radiusM: number,
): NearbyFires {
  let count = 0;
  let nearest: NearbyFires['nearest'] = null;
  for (const fire of fires) {
    const distanceM = computeHaversineDistance(lng, lat, fire.lng, fire.lat);
    if (distanceM > radiusM) {
      continue;
    }
    count += 1;
    if (nearest === null || distanceM < nearest.distanceM) {
      nearest = { fire, distanceM };
    }
  }
  return { count, nearest };
}
