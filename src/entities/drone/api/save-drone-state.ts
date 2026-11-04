// Writes the drone position to localStorage; a quota error disables persistence for the session (behaviour §8).
import { reportError } from '@/shared/lib/report-error';
import { writeVersionedItem } from '@/shared/lib/storage';

import { DRONE_STORAGE_KEY } from '../config/drone-storage-key';
import { savedDroneStateSchema } from '../model/saved-drone-state.schema';
import type { SimWorld } from '../model/sim-world';

let hasReportedFailure = false;

// Saves position, altitude and heading with a timestamp; reports the first failure only.
export function saveDroneState(world: SimWorld, nowMs: number): void {
  const result = writeVersionedItem(DRONE_STORAGE_KEY, savedDroneStateSchema, {
    v: 1,
    lng: world.lng,
    lat: world.lat,
    altMsl: world.altitudeMsl,
    headingRad: world.headingRad,
    savedAt: nowMs,
  });
  if (!result.isOk && !hasReportedFailure) {
    hasReportedFailure = true;
    reportError(result.error, 'drone persistence', 'warn');
  }
}
