// Writes prefs to localStorage when recents or the follow distance change; only app/ may subscribe (005).
import { reportError } from '@/shared/lib/report-error';
import { writeVersionedItem } from '@/shared/lib/storage';

import type { store as appStore } from '../store';
import { PREFS_STORAGE_KEY, prefsSchema } from './prefs.schema';

const WRITE_DELAY_MS = 500;

// Subscribes to the store and writes changed prefs at most every 500 ms; returns the unsubscribe function.
export function persistPrefs(store: typeof appStore): () => void {
  let lastRecents = store.getState().recentPlaces.places;
  let lastFollowDistanceM = store.getState().cameraPrefs.followDistanceM;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    const recents = state.recentPlaces.places;
    const { followDistanceM } = state.cameraPrefs;
    if (recents === lastRecents && followDistanceM === lastFollowDistanceM) {
      return;
    }
    lastRecents = recents;
    lastFollowDistanceM = followDistanceM;
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
    }
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      const value = { v: 1 as const, recents: lastRecents, followDistanceM: lastFollowDistanceM };
      const result = writeVersionedItem(PREFS_STORAGE_KEY, prefsSchema, value);
      if (!result.isOk) {
        reportError(result.error, 'prefs persistence', 'warn');
      }
    }, WRITE_DELAY_MS);
  });
  return unsubscribe;
}
