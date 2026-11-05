// Altitude profile along a planned path: clears ridges by 300 m inside the envelope, climbs pulled ahead (§6.2).
import { FLIGHT_TUNING, ROUTE_TUNING } from '@/shared/config';

import { computeEnvelopeAltitude } from './compute-envelope-altitude';

const { RIDGE_WINDOW_M, CLIMB_GRADIENT, DESCENT_GRADIENT, ARRIVAL_AGL_M, SMOOTHING_PASSES } =
  ROUTE_TUNING;

// Returns, per point, the highest known terrain within the ridge window plus clearance, or -Infinity.
function computeClearanceNeeds(
  distancesM: readonly number[],
  terrainM: readonly (number | null)[],
): number[] {
  return distancesM.map((distanceM) => {
    let highestM = Number.NEGATIVE_INFINITY;
    terrainM.forEach((sample, index) => {
      if (sample !== null && Math.abs((distancesM[index] ?? 0) - distanceM) <= RIDGE_WINDOW_M) {
        highestM = Math.max(highestM, sample);
      }
    });
    return highestM + FLIGHT_TUNING.CLEARANCE_M;
  });
}

// Raises points so climbs start early enough (backward pass) and descents stay gentle (forward pass).
function clampProfileGradients(altitudesMsl: number[], distancesM: readonly number[]): void {
  const lastIndex = altitudesMsl.length - 1;
  for (let index = lastIndex - 1; index >= 0; index -= 1) {
    const runM = (distancesM[index + 1] ?? 0) - (distancesM[index] ?? 0);
    const climbFloorMsl = (altitudesMsl[index + 1] ?? 0) - CLIMB_GRADIENT * runM;
    altitudesMsl[index] = Math.max(altitudesMsl[index] ?? 0, climbFloorMsl);
  }
  for (let index = 1; index <= lastIndex; index += 1) {
    const runM = (distancesM[index] ?? 0) - (distancesM[index - 1] ?? 0);
    const descentFloorMsl = (altitudesMsl[index - 1] ?? 0) - DESCENT_GRADIENT * runM;
    altitudesMsl[index] = Math.max(altitudesMsl[index] ?? 0, descentFloorMsl);
  }
}

// Smooths interior points with a 1-2-1 kernel, never dropping below the clearance need.
function easeProfileCorners(altitudesMsl: number[], needsMsl: readonly number[]): void {
  for (let pass = 0; pass < SMOOTHING_PASSES; pass += 1) {
    const previous = [...altitudesMsl];
    for (let index = 1; index < altitudesMsl.length - 1; index += 1) {
      const smoothedMsl =
        ((previous[index - 1] ?? 0) + 2 * (previous[index] ?? 0) + (previous[index + 1] ?? 0)) / 4;
      altitudesMsl[index] = Math.max(smoothedMsl, needsMsl[index] ?? Number.NEGATIVE_INFINITY);
    }
  }
}

// Returns the planned altitude in metres MSL at each path point, starting exactly at startMsl.
export function buildAltitudeProfile(
  distancesM: readonly number[],
  terrainM: readonly (number | null)[],
  startMsl: number,
): number[] {
  const lastIndex = distancesM.length - 1;
  const totalM = distancesM[lastIndex] ?? 0;
  const endGroundM = terrainM[lastIndex] ?? null;
  const endMsl = endGroundM === null ? startMsl : endGroundM + ARRIVAL_AGL_M;
  const needsMsl = computeClearanceNeeds(distancesM, terrainM);
  const altitudesMsl = distancesM.map((distanceM, index) =>
    Math.max(
      computeEnvelopeAltitude(distanceM, totalM, startMsl, endMsl),
      needsMsl[index] ?? Number.NEGATIVE_INFINITY,
    ),
  );
  clampProfileGradients(altitudesMsl, distancesM);
  altitudesMsl[0] = startMsl;
  easeProfileCorners(altitudesMsl, needsMsl);
  return altitudesMsl.map((altitudeMsl) => Math.min(FLIGHT_TUNING.CEILING_MSL_M, altitudeMsl));
}
