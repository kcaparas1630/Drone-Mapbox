// Free-flight terrain floor: eases the drone up over terrain ahead and never lets it sink into the ground (§3.3).
import type { SimWorld } from '@/entities/drone';
import { computeTerrainFloor, easeAltitude } from '@/entities/terrain';
import { FLIGHT_TUNING } from '@/shared/config';

const FLOOR_GAIN_PER_S = 5;
const HARD_FLOOR_AGL_M = 2;

// Pushes the altitude up toward the lookahead floor and clamps it above the ground directly below.
export function applyTerrainFloor(world: SimWorld, dtS: number): void {
  const floorMsl = computeTerrainFloor(world.terrainSamplesM);
  if (floorMsl !== null && world.altitudeMsl < floorMsl) {
    world.altitudeMsl = easeAltitude(
      world.altitudeMsl,
      floorMsl,
      FLIGHT_TUNING.TERRAIN_FLOOR_RISE_MPS,
      FLOOR_GAIN_PER_S,
      dtS,
    );
    world.verticalSpeedMps = Math.max(0, world.verticalSpeedMps);
  }
  const groundM = world.groundElevationM;
  if (groundM !== null && world.altitudeMsl < groundM + HARD_FLOOR_AGL_M) {
    world.altitudeMsl = groundM + HARD_FLOOR_AGL_M;
  }
}
