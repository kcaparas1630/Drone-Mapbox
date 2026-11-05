// React hook exposing the PWA store's install and update state.
import { useSyncExternalStore } from 'react';

import { type PwaStatus, pwaStatusSource } from './pwa-status-source';

// Returns the current PWA status, re-rendering when it changes.
export function usePwaStatus(): PwaStatus {
  return useSyncExternalStore(
    pwaStatusSource.subscribe,
    pwaStatusSource.getSnapshot,
    pwaStatusSource.getSnapshot,
  );
}
