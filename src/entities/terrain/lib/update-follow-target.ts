// Auto-route terrain-following target: highest known terrain + 300 m + speed margin, fail-safe upward (§6.2, §6.3).
import { FLIGHT_TUNING } from '@/shared/config';

import type { TerrainFollowState } from '../model/terrain-follow-state';

const {
  CLEARANCE_M,
  SPEED_CLEARANCE_M,
  CEILING_MSL_M,
  TERRAIN_MISSING_HOLD_S,
  TERRAIN_MISSING_CLIMB_MPS,
} = FLIGHT_TUNING;

// Updates the target: missing samples never lower it; all missing for > 2 s raises it 100 m/s.
export function updateFollowTarget(
  state: TerrainFollowState,
  samples: readonly (number | null)[],
  currentAltitudeMsl: number,
  speedFactor: number,
  dtS: number,
): void {
  let highestM = Number.NEGATIVE_INFINITY;
  let knownCount = 0;
  for (const sample of samples) {
    if (sample !== null) {
      knownCount += 1;
      highestM = Math.max(highestM, sample);
    }
  }
  if (knownCount === 0) {
    state.allMissingS += dtS;
    state.targetMsl = Math.max(state.targetMsl ?? currentAltitudeMsl, currentAltitudeMsl);
    if (state.allMissingS > TERRAIN_MISSING_HOLD_S) {
      state.targetMsl = Math.min(CEILING_MSL_M, state.targetMsl + TERRAIN_MISSING_CLIMB_MPS * dtS);
    }
    return;
  }
  state.allMissingS = 0;
  const clampedSpeedFactor = Math.min(1, Math.max(0, speedFactor));
  let candidateMsl = highestM + CLEARANCE_M + clampedSpeedFactor * SPEED_CLEARANCE_M;
  if (knownCount < samples.length && state.targetMsl !== null) {
    candidateMsl = Math.max(candidateMsl, state.targetMsl);
  }
  state.targetMsl = Math.min(CEILING_MSL_M, candidateMsl);
}
