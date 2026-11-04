// The mutable 60 fps simulation state read and written by the frame loop, never by React or Redux (ADR 001).
import { FLIGHT_TUNING } from '@/shared/config';

import { createDroneInput, type DroneInput } from './drone-input';
import type { DroneSpawn } from './drone-spawn.types';

export type SimWorldRoute = {
  routeId: number;
  elapsedS: number;
  durationS: number;
  distanceM: number;
  originLng: number;
  originLat: number;
  destinationLng: number;
  destinationLat: number;
  initialBearingRad: number;
};

export type SimWorld = {
  lng: number;
  lat: number;
  previousLng: number;
  previousLat: number;
  altitudeMsl: number;
  isAltitudePending: boolean;
  headingRad: number;
  speedMps: number;
  verticalSpeedMps: number;
  bankRad: number;
  input: DroneInput;
  terrainSamplesM: (number | null)[];
  groundElevationM: number | null;
  allTerrainMissingS: number;
  isAtBcEdge: boolean;
  isAtCeiling: boolean;
  route: SimWorldRoute;
};

// Creates the world at the spawn point with every buffer preallocated so stepping never allocates.
export function createSimWorld(spawn: DroneSpawn): SimWorld {
  return {
    lng: spawn.lng,
    lat: spawn.lat,
    previousLng: spawn.lng,
    previousLat: spawn.lat,
    altitudeMsl: spawn.altitudeMsl ?? FLIGHT_TUNING.PENDING_SPAWN_ALT_MSL_M,
    isAltitudePending: spawn.altitudeMsl === null,
    headingRad: spawn.headingRad,
    speedMps: 0,
    verticalSpeedMps: 0,
    bankRad: 0,
    input: createDroneInput(),
    terrainSamplesM: FLIGHT_TUNING.LOOKAHEAD_DISTANCES_M.map(() => null),
    groundElevationM: null,
    allTerrainMissingS: 0,
    isAtBcEdge: false,
    isAtCeiling: false,
    route: {
      routeId: 0,
      elapsedS: 0,
      durationS: 0,
      distanceM: 0,
      originLng: spawn.lng,
      originLat: spawn.lat,
      destinationLng: spawn.lng,
      destinationLat: spawn.lat,
      initialBearingRad: 0,
    },
  };
}
