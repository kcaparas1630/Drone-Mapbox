// Full-map messages for states where the map cannot be shown: auth failure, lost graphics context, offline.
import { Card } from '@/shared/ui';

import type { MapStatus } from '../model/map-status.types';

export type MapStatusOverlayProps = { status: MapStatus; isOnline: boolean };

// Returns the message to show, most severe first, or null when the map is healthy.
function readOverlayMessage({ status, isOnline }: MapStatusOverlayProps): string | null {
  if (status.isAuthFailed) {
    return 'Map unavailable (auth). Reload the page; if it persists the map token needs attention.';
  }
  if (status.isContextLost) {
    return 'Graphics context lost — restoring…';
  }
  if (!isOnline && !status.isStyleLoaded) {
    return 'You’re offline — the map needs a connection.';
  }
  return null;
}

// Renders a centred, polite status message over the map, or nothing.
export function MapStatusOverlay(props: MapStatusOverlayProps) {
  const message = readOverlayMessage(props);
  if (message === null) {
    return null;
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6">
      <Card role="status" aria-live="polite" className="max-w-sm p-4 text-center text-sm">
        {message}
      </Card>
    </div>
  );
}
