// Switches a running route onto its terrain-aware path while the trip is still early (behaviour §6.1, ADR 022).
import type { SimWorld } from '@/entities/drone';
import { computeTripDuration, type RoutePath } from '@/entities/route';
import { ROUTE_TUNING } from '@/shared/config';
import { computeHaversineDistance } from '@/shared/lib/geo';

// Copies the planned path into the world's buffers from the route's own origin; late paths are only marked seen.
export function applyPlannedPath(world: SimWorld, path: RoutePath): void {
  const { route } = world;
  route.adoptedPath = path;
  const timeFraction = route.durationS > 0 ? route.elapsedS / route.durationS : 1;
  const pointCount = Math.min(ROUTE_TUNING.MAX_PATH_POINTS, path.lngs.length);
  if (timeFraction > ROUTE_TUNING.ADOPT_PATH_MAX_TIME_FRACTION || pointCount < 2) {
    return;
  }
  let distanceM = 0;
  for (let index = 0; index < pointCount; index += 1) {
    route.pathLngs[index] = index === 0 ? route.originLng : (path.lngs[index] ?? 0);
    route.pathLats[index] = index === 0 ? route.originLat : (path.lats[index] ?? 0);
    route.pathAltitudesMsl[index] = path.altitudesMsl[index] ?? world.altitudeMsl;
    if (index > 0) {
      distanceM += computeHaversineDistance(
        route.pathLngs[index - 1] ?? 0,
        route.pathLats[index - 1] ?? 0,
        route.pathLngs[index] ?? 0,
        route.pathLats[index] ?? 0,
      );
    }
    route.pathDistancesM[index] = distanceM;
  }
  route.pathCount = pointCount;
  route.segmentIndex = 0;
  route.distanceM = distanceM;
  route.durationS = computeTripDuration(distanceM);
}
