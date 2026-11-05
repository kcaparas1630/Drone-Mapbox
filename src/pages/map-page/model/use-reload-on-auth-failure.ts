// Reloads automatically only when Mapbox rejected the token and a newer app version is waiting (§10, ADR 016).
import { useEffect } from 'react';

import { pwaStatusSource, usePwaStatus } from '@/shared/lib/pwa';

// Applies the waiting update when the map failed authentication, since a rotated token needs the new bundle.
export function useReloadOnAuthFailure(isAuthFailed: boolean): void {
  const { isUpdateReady } = usePwaStatus();
  useEffect(() => {
    if (isAuthFailed && isUpdateReady) {
      pwaStatusSource.applyUpdate();
    }
  }, [isAuthFailed, isUpdateReady]);
}
