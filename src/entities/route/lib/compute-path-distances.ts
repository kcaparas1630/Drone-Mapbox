// Cumulative great-circle distance along a polyline, the arc-length parameter of a planned route (§6.1).
import { computeHaversineDistance } from '@/shared/lib/geo';

import type { PathPoints } from '../model/route-path.types';

// Returns the distance in metres from the first point to each point of the path.
export function computePathDistances(path: PathPoints): number[] {
  const distances = [0];
  for (let index = 1; index < path.lngs.length; index += 1) {
    const segmentM = computeHaversineDistance(
      path.lngs[index - 1] ?? 0,
      path.lats[index - 1] ?? 0,
      path.lngs[index] ?? 0,
      path.lats[index] ?? 0,
    );
    distances.push((distances[index - 1] ?? 0) + segmentM);
  }
  return distances;
}
