// Reads the saved drone position from localStorage, warning (not failing) when it is corrupt (behaviour §8).
import { reportError } from '@/shared/lib/report-error';
import { readVersionedItem } from '@/shared/lib/storage';

import { DRONE_STORAGE_KEY } from '../config/drone-storage-key';
import { type SavedDroneState, savedDroneStateSchema } from '../model/saved-drone-state.schema';

// Returns the validated saved state, or null when absent or discarded as invalid.
export function loadSavedDroneState(): SavedDroneState | null {
  const result = readVersionedItem(DRONE_STORAGE_KEY, savedDroneStateSchema);
  if (!result.isOk) {
    reportError(result.error, 'drone persistence', 'warn');
    return null;
  }
  return result.value;
}
