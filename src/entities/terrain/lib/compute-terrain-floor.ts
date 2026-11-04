// Free-flight terrain floor: the highest known lookahead sample plus 30 m, so mountains ahead lift the drone.
import { FLIGHT_TUNING } from '@/shared/config';

// Returns the minimum safe altitude in metres MSL, or null when every sample is missing.
export function computeTerrainFloor(samples: readonly (number | null)[]): number | null {
  let highestM: number | null = null;
  for (const sample of samples) {
    if (sample !== null && (highestM === null || sample > highestM)) {
      highestM = sample;
    }
  }
  return highestM === null ? null : highestM + FLIGHT_TUNING.MIN_AGL_M;
}
