// Watches the map for auth failures, lost WebGL contexts and stalled tiles, reporting status patches (§10).
import type { Map as MapboxMap } from 'mapbox-gl';

import { reportError } from '@/shared/lib/report-error';

import { MAP_STYLE } from '../config/map-style';
import type { MapStatusPatch } from './map-status.types';

const AUTH_FAILURE_STATUSES: ReadonlySet<number> = new Set([401, 403]);

// Reads an HTTP status from a Mapbox error event, when the error carries one.
function readErrorStatus(event: { error?: unknown }): number | null {
  const { error } = event;
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const { status } = error;
    return typeof status === 'number' ? status : null;
  }
  return null;
}

// Subscribes to map health signals and returns a function that removes every listener and timer.
export function trackMapHealth(
  map: MapboxMap,
  onPatch: (patch: MapStatusPatch) => void,
): () => void {
  let lastTileActivityMs = performance.now();
  let hasReportedAuthFailure = false;
  const handleError = (event: { error?: unknown }) => {
    const status = readErrorStatus(event);
    if (status !== null && AUTH_FAILURE_STATUSES.has(status)) {
      onPatch({ isAuthFailed: true });
      if (!hasReportedAuthFailure) {
        hasReportedAuthFailure = true;
        reportError(
          `Mapbox returned ${String(status)}. Check VITE_MAPBOX_TOKEN, its scopes and its allowed URLs.`,
          'map auth',
        );
      }
      return;
    }
    reportError(event.error ?? 'Unknown map error', 'map', 'warn');
  };
  const handleTileActivity = () => {
    lastTileActivityMs = performance.now();
    onPatch({ isTileStalled: false });
  };
  const handleContextLost = () => {
    onPatch({ isContextLost: true });
  };
  const handleContextRestored = () => {
    onPatch({ isContextLost: false });
  };
  const healthTimer = window.setInterval(() => {
    const isWaiting = !map.areTilesLoaded();
    const isStalled = isWaiting && performance.now() - lastTileActivityMs > MAP_STYLE.TILE_STALL_MS;
    onPatch({ isTileStalled: isStalled });
  }, MAP_STYLE.HEALTH_CHECK_INTERVAL_MS);
  map.on('error', handleError);
  map.on('data', handleTileActivity);
  map.on('webglcontextlost', handleContextLost);
  map.on('webglcontextrestored', handleContextRestored);
  return () => {
    window.clearInterval(healthTimer);
    map.off('error', handleError);
    map.off('data', handleTileActivity);
    map.off('webglcontextlost', handleContextLost);
    map.off('webglcontextrestored', handleContextRestored);
  };
}
