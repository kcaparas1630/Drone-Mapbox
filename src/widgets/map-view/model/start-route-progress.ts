// Starts per-frame progress for a newly planned route from the drone's exact position, so it never jumps.
import type { SimWorld } from '@/entities/drone';
import { computeTripDuration, type RoutePlan } from '@/entities/route';
import type { TerrainFollowState } from '@/entities/terrain';
import { computeHaversineDistance, computeInitialBearing } from '@/shared/lib/geo';

// Re-plans the route from the world's position to the plan's destination and resets the altitude target.
export function startRouteProgress(
  world: SimWorld,
  plan: RoutePlan,
  terrainFollow: TerrainFollowState,
): void {
  const { destination } = plan;
  const distanceM = computeHaversineDistance(
    world.lng,
    world.lat,
    destination.lng,
    destination.lat,
  );
  const { route } = world;
  route.routeId = plan.routeId;
  route.elapsedS = 0;
  route.distanceM = distanceM;
  route.durationS = computeTripDuration(distanceM);
  route.originLng = world.lng;
  route.originLat = world.lat;
  route.destinationLng = destination.lng;
  route.destinationLat = destination.lat;
  route.initialBearingRad = computeInitialBearing(
    world.lng,
    world.lat,
    destination.lng,
    destination.lat,
  );
  terrainFollow.targetMsl = world.altitudeMsl;
  terrainFollow.allMissingS = 0;
}
