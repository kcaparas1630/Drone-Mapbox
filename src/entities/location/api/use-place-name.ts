// Keeps the place name for the drone's ~2 km cell, looking each cell up at most once per session (§4.1).
import { useEffect, useState } from 'react';

import { computeLookupCell } from '../lib/compute-lookup-cell';
import { fetchPlaceName } from './fetch-place-name';

const SETTLE_MS = 800;
const RETRY_AFTER_FAILURE_MS = 60_000;

type CachedPlace = { name: string | null; failedAtMs: number | null };

const placeByCell = new Map<string, CachedPlace>();

// Returns the latest known place text, or null until the first lookup succeeds.
export function usePlaceName(accessToken: string, lng: number | null, lat: number | null) {
  const [placeName, setPlaceName] = useState<string | null>(null);
  const cell = lng === null || lat === null ? null : computeLookupCell(lng, lat);
  const cellKey = cell?.key ?? null;
  const cellLng = cell?.lng ?? 0;
  const cellLat = cell?.lat ?? 0;
  useEffect(() => {
    if (cellKey === null) {
      return undefined;
    }
    const controller = new AbortController();
    const timerId = window.setTimeout(() => {
      const cached = placeByCell.get(cellKey);
      const isFreshFailure =
        cached?.failedAtMs != null && Date.now() - cached.failedAtMs < RETRY_AFTER_FAILURE_MS;
      if (cached !== undefined && (cached.failedAtMs === null || isFreshFailure)) {
        if (cached.name !== null) {
          setPlaceName(cached.name);
        }
        return;
      }
      void fetchPlaceName(accessToken, cellLng, cellLat, controller.signal).then((result) => {
        if (controller.signal.aborted) {
          return;
        }
        placeByCell.set(
          cellKey,
          result.isOk
            ? { name: result.value, failedAtMs: null }
            : { name: null, failedAtMs: Date.now() },
        );
        if (result.isOk && result.value !== null) {
          setPlaceName(result.value);
        }
      });
    }, SETTLE_MS);
    return () => {
      window.clearTimeout(timerId);
      controller.abort();
    };
  }, [accessToken, cellKey, cellLat, cellLng]);
  return placeName;
}
