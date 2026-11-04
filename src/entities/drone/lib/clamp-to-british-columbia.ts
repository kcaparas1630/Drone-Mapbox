// Soft-clamps the drone to British Columbia: outward motion fades to zero within 5 km of the edge (behaviour §3.4).
import { BC_BOUNDING_BOX } from '@/shared/config';
import { EARTH_RADIUS_M } from '@/shared/lib/geo';

import type { SimWorld } from '../model/sim-world';

const { WEST_LNG, EAST_LNG, SOUTH_LAT, NORTH_LAT, EDGE_SOFT_ZONE_M } = BC_BOUNDING_BOX;
const METERS_PER_DEGREE_LAT = (Math.PI * EARTH_RADIUS_M) / 180;
const EDGE_NOTICE_DISTANCE_M = 500;

// Returns the fraction (0..1) of outward motion allowed at a distance from the edge.
function computeEdgeFactor(distanceToEdgeM: number): number {
  return Math.min(1, Math.max(0, distanceToEdgeM / EDGE_SOFT_ZONE_M));
}

// Scales the outward components of this step's movement near the edges and keeps the drone inside the box.
export function clampToBritishColumbia(world: SimWorld): void {
  const metersPerDegreeLng = METERS_PER_DEGREE_LAT * Math.cos((world.previousLat * Math.PI) / 180);
  const eastDistanceM = (EAST_LNG - world.previousLng) * metersPerDegreeLng;
  const westDistanceM = (world.previousLng - WEST_LNG) * metersPerDegreeLng;
  const northDistanceM = (NORTH_LAT - world.previousLat) * METERS_PER_DEGREE_LAT;
  const southDistanceM = (world.previousLat - SOUTH_LAT) * METERS_PER_DEGREE_LAT;
  const eastStep = world.lng - world.previousLng;
  const northStep = world.lat - world.previousLat;
  const eastFactor = computeEdgeFactor(eastStep > 0 ? eastDistanceM : westDistanceM);
  const northFactor = computeEdgeFactor(northStep > 0 ? northDistanceM : southDistanceM);
  world.lng = Math.min(EAST_LNG, Math.max(WEST_LNG, world.previousLng + eastStep * eastFactor));
  world.lat = Math.min(NORTH_LAT, Math.max(SOUTH_LAT, world.previousLat + northStep * northFactor));
  const nearestEdgeM = Math.min(eastDistanceM, westDistanceM, northDistanceM, southDistanceM);
  const isOutwardDamped =
    (eastStep !== 0 && eastFactor < 1) || (northStep !== 0 && northFactor < 1);
  world.isAtBcEdge = isOutwardDamped || nearestEdgeM < EDGE_NOTICE_DISTANCE_M;
}
