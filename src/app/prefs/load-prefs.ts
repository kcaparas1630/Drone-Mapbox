// Restores recents and follow distance at startup; invalid prefs are discarded with a warning (behaviour §8).
import { CAMERA_TUNING } from '@/shared/config';
import { reportError } from '@/shared/lib/report-error';
import { readVersionedItem } from '@/shared/lib/storage';

import { type Prefs, PREFS_STORAGE_KEY, prefsSchema } from './prefs.schema';

// Returns the saved prefs, or defaults when none are saved or they fail validation.
export function loadPrefs(): Prefs {
  const result = readVersionedItem(PREFS_STORAGE_KEY, prefsSchema);
  if (!result.isOk) {
    reportError(result.error, 'prefs persistence', 'warn');
  }
  const saved = result.isOk ? result.value : null;
  return saved ?? { v: 1, recents: [], followDistanceM: CAMERA_TUNING.FOLLOW_DISTANCE_M };
}
