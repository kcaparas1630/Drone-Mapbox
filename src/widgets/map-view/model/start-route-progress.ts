// Starts per-frame progress for a new route from the drone's exact position on the great circle (§6.1, ADR 022).
import type { SimWorld } from '@/entities/drone';
import { computeEnvelopeAltitude, computeTripDuration, type RoutePlan } from '@/entities/route';
import { ROUTE_TUNING } from '@/shared/config';
import {
  computeDestinationPoint,
  computeHaversineDistance,
  computeInitialBearing,
  type GeoPoint,
} from '@/shared/lib/geo';

const scratchPoint: GeoPoint = { lng: 0, lat: 0 };

// Writes the great circle to the destination into the world's path buffers with the envelope profile.
export function startRouteProgress(world: SimWorld, plan: RoutePlan): void {
  const { destination } = plan;
  const { route } = world;
  const distanceM = computeHaversineDistance(
    world.lng,
    world.lat,
    destination.lng,
    destination.lat,
  );
  const bearingRad = computeInitialBearing(world.lng, world.lat, destination.lng, destination.lat);
  const pointCount = Math.min(
    ROUTE_TUNING.MAX_PATH_POINTS,
    Math.max(
      ROUTE_TUNING.MIN_PATH_POINTS,
      Math.ceil(distanceM / ROUTE_TUNING.PATH_POINT_SPACING_M) + 1,
    ),
  );
  for (let index = 0; index < pointCount; index += 1) {
    const alongM = (distanceM * index) / (pointCount - 1);
    computeDestinationPoint(scratchPoint, world.lng, world.lat, bearingRad, alongM);
    route.pathLngs[index] = scratchPoint.lng;
    route.pathLats[index] = scratchPoint.lat;
    route.pathDistancesM[index] = alongM;
    route.pathAltitudesMsl[index] = computeEnvelopeAltitude(
      alongM,
      distanceM,
      world.altitudeMsl,
      world.altitudeMsl,
    );
  }
  route.routeId = plan.routeId;
  route.elapsedS = 0;
  route.distanceM = distanceM;
  route.durationS = computeTripDuration(distanceM);
  route.originLng = world.lng;
  route.originLat = world.lat;
  route.destinationLng = destination.lng;
  route.destinationLat = destination.lat;
  route.initialBearingRad = bearingRad;
  route.pathCount = pointCount;
  route.segmentIndex = 0;
  route.adoptedPath = null;
  route.remainingM = distanceM;
}
