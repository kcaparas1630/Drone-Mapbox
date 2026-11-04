// One fixed step of auto-route flight: eased great-circle progress, turn, terrain-following altitude (§6, ADR 007).
import type { RoutePlan } from '@/entities/route';
import { stepAlongRoute } from '@/entities/route';
import { easeAltitude, updateFollowTarget } from '@/entities/terrain';
import { FLIGHT_TUNING } from '@/shared/config';
import { computeHaversineDistance } from '@/shared/lib/geo';

import type { FrameLoopContext } from './frame-loop-context';
import { startRouteProgress } from './start-route-progress';
import { stepRouteHeading } from './step-route-heading';

// Advances the drone along the active route; returns true once it is within the arrival radius.
export function stepAutoRoute(context: FrameLoopContext, plan: RoutePlan, dtS: number): boolean {
  const { world, routeProgress, terrainFollow } = context;
  if (world.route.routeId !== plan.routeId) {
    startRouteProgress(world, plan, terrainFollow);
  }
  world.route.elapsedS += dtS;
  stepAlongRoute(routeProgress, world.route, world.route.elapsedS);
  world.previousLng = world.lng;
  world.previousLat = world.lat;
  world.lng = routeProgress.lng;
  world.lat = routeProgress.lat;
  const movedM = computeHaversineDistance(
    world.previousLng,
    world.previousLat,
    world.lng,
    world.lat,
  );
  world.speedMps = dtS > 0 ? movedM / dtS : 0;
  stepRouteHeading(world, routeProgress.pathBearingRad, dtS);
  const speedFactor = Math.min(1, world.speedMps / FLIGHT_TUNING.CRUISE_MPS);
  updateFollowTarget(terrainFollow, world.terrainSamplesM, world.altitudeMsl, speedFactor, dtS);
  const targetMsl = terrainFollow.targetMsl ?? world.altitudeMsl;
  const nextAltitudeMsl = easeAltitude(
    world.altitudeMsl,
    targetMsl,
    FLIGHT_TUNING.MAX_ROUTE_VERTICAL_MPS,
    FLIGHT_TUNING.ROUTE_VERTICAL_GAIN_PER_S,
    dtS,
  );
  world.verticalSpeedMps = dtS > 0 ? (nextAltitudeMsl - world.altitudeMsl) / dtS : 0;
  world.altitudeMsl = nextAltitudeMsl;
  world.isAtCeiling = world.altitudeMsl >= FLIGHT_TUNING.CEILING_MSL_M;
  return routeProgress.isComplete || routeProgress.remainingM <= FLIGHT_TUNING.ARRIVAL_RADIUS_M;
}
