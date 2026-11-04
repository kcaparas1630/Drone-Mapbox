// Records ground elevation and missing-terrain time, and settles a pending spawn 500 m above the ground (§1.3).
import type { SimWorld } from '@/entities/drone';
import { FLIGHT_TUNING } from '@/shared/config';

// Updates the world's terrain bookkeeping from this step's lookahead samples.
export function updateTerrainState(world: SimWorld, dtS: number): void {
  const groundM = world.terrainSamplesM[0] ?? null;
  world.groundElevationM = groundM;
  let isAnySampleKnown = false;
  for (const sample of world.terrainSamplesM) {
    isAnySampleKnown = isAnySampleKnown || sample !== null;
  }
  world.allTerrainMissingS = isAnySampleKnown ? 0 : world.allTerrainMissingS + dtS;
  if (world.isAltitudePending && groundM !== null) {
    world.altitudeMsl = groundM + FLIGHT_TUNING.DEFAULT_ALT_AGL_M;
    world.isAltitudePending = false;
  }
}
