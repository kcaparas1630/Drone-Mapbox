// Terrain floor: the highest known lookahead sample plus a clearance (30 m in free flight, 300 m on a route).
import { FLIGHT_TUNING } from '@/shared/config';

// Returns the minimum safe altitude in metres MSL, or null when every sample is missing.
export function computeTerrainFloor(
  samples: readonly (number | null)[],
  clearanceM: number = FLIGHT_TUNING.MIN_AGL_M,
): number | null {
  let highestM: number | null = null;
  for (const sample of samples) {
    if (sample !== null && (highestM === null || sample > highestM)) {
      highestM = sample;
    }
  }
  return highestM === null ? null : highestM + clearanceM;
}
