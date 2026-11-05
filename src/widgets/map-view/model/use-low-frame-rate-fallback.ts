// Watches the map's frame rate and drops detail once a slow device stays under 30 fps for 5 s (behaviour §10).
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useEffectEvent } from 'react';

import { type FrameRateSample, sampleFrameRate } from '../lib/sample-frame-rate';
import { enableReducedDetail } from './enable-reduced-detail';
import type { MapStatusPatch } from './map-status.types';

// Returns a sample whose warm-up starts now.
function createFrameRateSample(nowMs: number): FrameRateSample {
  return {
    startedMs: nowMs,
    windowStartMs: nowMs,
    frameCount: 0,
    lowSinceMs: null,
    lastFrameMs: nowMs,
  };
}

// Samples every rendered frame until the fallback fires once; the page keeps reduced detail until it reloads.
export function useLowFrameRateFallback(
  map: MapboxMap | null,
  onStatusPatch: (patch: MapStatusPatch) => void,
): void {
  const patchStatus = useEffectEvent((patch: MapStatusPatch) => {
    onStatusPatch(patch);
  });
  useEffect(() => {
    if (map === null) {
      return undefined;
    }
    let sample = createFrameRateSample(performance.now());
    let restorePixelRatio: (() => void) | null = null;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sample = createFrameRateSample(performance.now());
      }
    };
    const handleRender = () => {
      if (!sampleFrameRate(sample, performance.now())) {
        return;
      }
      map.off('render', handleRender);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      restorePixelRatio = enableReducedDetail(map);
      patchStatus({ isReducedDetail: true });
    };
    map.on('render', handleRender);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      map.off('render', handleRender);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      restorePixelRatio?.();
    };
  }, [map]);
}
