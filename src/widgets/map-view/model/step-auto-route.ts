// One fixed step of auto-route flight: eased progress on the planned path, banked turns, profile altitude (§6).
import type { RoutePlan } from '@/entities/route';
import { stepAlongRoute } from '@/entities/route';
import { computeTerrainFloor, easeAltitude } from '@/entities/terrain';
import { FLIGHT_TUNING, ROUTE_TUNING } from '@/shared/config';
import { computeHaversineDistance } from '@/shared/lib/geo';

import { applyPlannedPath } from './apply-planned-path';
import type { FrameLoopContext } from './frame-loop-context';
import { startRouteProgress } from './start-route-progress';
import { stepRouteHeading } from './step-route-heading';

// Returns the altitude to aim for: the planned profile, raised by the live terrain ahead or a data blackout.
function computeTargetAltitude(context: FrameLoopContext, dtS: number): number {
  const { world, routeProgress } = context;
  const floorMsl = computeTerrainFloor(world.terrainSamplesM, FLIGHT_TUNING.CLEARANCE_M);
  const targetMsl = Math.max(routeProgress.altitudeMsl, floorMsl ?? Number.NEGATIVE_INFINITY);
  if (world.allTerrainMissingS > FLIGHT_TUNING.TERRAIN_MISSING_HOLD_S) {
    return Math.max(targetMsl, world.altitudeMsl + FLIGHT_TUNING.TERRAIN_MISSING_CLIMB_MPS * dtS);
  }
  return Math.min(FLIGHT_TUNING.CEILING_MSL_M, targetMsl);
}

// Advances the drone along the active route; returns true once it is within the arrival radius.
export function stepAutoRoute(context: FrameLoopContext, plan: RoutePlan, dtS: number): boolean {
  const { world, routeProgress } = context;
  if (world.route.routeId !== plan.routeId) {
    startRouteProgress(world, plan);
  }
  if (plan.path !== null && world.route.adoptedPath !== plan.path) {
    applyPlannedPath(world, plan.path);
  }
  world.route.elapsedS += dtS;
  stepAlongRoute(routeProgress, world.route, world.route.elapsedS);
  world.previousLng = world.lng;
  world.previousLat = world.lat;
  world.lng = routeProgress.lng;
  world.lat = routeProgress.lat;
  world.route.remainingM = routeProgress.remainingM;
  const movedM = computeHaversineDistance(
    world.previousLng,
    world.previousLat,
    world.lng,
    world.lat,
  );
  world.speedMps = dtS > 0 ? movedM / dtS : 0;
  stepRouteHeading(world, routeProgress.pathBearingRad, dtS);
  const maxRateMps = Math.max(
    FLIGHT_TUNING.MAX_ROUTE_VERTICAL_MPS,
    ROUTE_TUNING.SLOPE_RATE_FACTOR * Math.abs(routeProgress.profileSlope) * world.speedMps,
  );
  const nextAltitudeMsl = easeAltitude(
    world.altitudeMsl,
    computeTargetAltitude(context, dtS),
    maxRateMps,
    ROUTE_TUNING.ALTITUDE_GAIN_PER_S,
    dtS,
  );
  world.verticalSpeedMps = dtS > 0 ? (nextAltitudeMsl - world.altitudeMsl) / dtS : 0;
  world.altitudeMsl = nextAltitudeMsl;
  world.isAtCeiling = world.altitudeMsl >= FLIGHT_TUNING.CEILING_MSL_M;
  return routeProgress.isComplete || routeProgress.remainingM <= FLIGHT_TUNING.ARRIVAL_RADIUS_M;
}
