// Persistent banner while the browser is offline; the drone keeps flying over loaded tiles (behaviour §1.8, §10).
import { WifiOff } from 'lucide-react';

import { useOnlineStatus } from '@/shared/lib/browser';

// Renders the offline notice, or nothing while online.
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) {
    return null;
  }
  return (
    <p
      role="status"
      className="flex items-center gap-2 rounded-panel bg-warning px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg"
    >
      <WifiOff aria-hidden="true" className="size-4" />
      Offline — the map and search need a connection
    </p>
  );
}
