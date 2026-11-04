// Chooses the launch spawn: the saved position when it is inside BC, else BC centre heading north (ADR 014).
import { BC_BOUNDING_BOX, FLIGHT_TUNING } from '@/shared/config';
import { isInsideBoundingBox } from '@/shared/lib/geo';

import type { DroneSpawn } from '../model/drone-spawn.types';
import type { SavedDroneState } from '../model/saved-drone-state.schema';

export type DroneSpawnRestoration = { spawn: DroneSpawn; rejectionReason: string | null };

const DEFAULT_SPAWN: DroneSpawn = {
  lng: BC_BOUNDING_BOX.CENTRE_LNG,
  lat: BC_BOUNDING_BOX.CENTRE_LAT,
  altitudeMsl: null,
  headingRad: 0,
};

// Returns the saved spawn when usable, or the default spawn with the reason the save was rejected.
export function restoreDroneSpawn(saved: SavedDroneState | null): DroneSpawnRestoration {
  if (saved === null) {
    return { spawn: DEFAULT_SPAWN, rejectionReason: null };
  }
  if (!isInsideBoundingBox(saved.lng, saved.lat, BC_BOUNDING_BOX)) {
    return { spawn: DEFAULT_SPAWN, rejectionReason: 'Saved drone position is outside BC.' };
  }
  return {
    spawn: {
      lng: saved.lng,
      lat: saved.lat,
      altitudeMsl: Math.min(FLIGHT_TUNING.CEILING_MSL_M, saved.altMsl),
      headingRad: saved.headingRad,
    },
    rejectionReason: null,
  };
}
