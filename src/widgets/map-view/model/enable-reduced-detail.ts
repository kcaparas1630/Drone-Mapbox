// Drops detail on a slow device: hides the basemap labels and caps the pixel ratio at 1.5 (behaviour §10).
import type { Map as MapboxMap } from 'mapbox-gl';

import { clampDevicePixelRatio } from '@/shared/lib/browser';

import { REDUCED_DETAIL } from '../config/reduced-detail';

// Makes Mapbox re-allocate its canvas at the new ratio: resize() does nothing unless the container size changed.
function resetMapCanvasSize(map: MapboxMap): void {
  const container = map.getContainer();
  const inlineWidth = container.style.width;
  container.style.width = `${String(container.clientWidth - 1)}px`;
  map.resize();
  container.style.width = inlineWidth;
  map.resize();
}

// Applies the reduced-detail settings and returns a function that gives the page back its own pixel ratio.
export function enableReducedDetail(map: MapboxMap): () => void {
  for (const configName of REDUCED_DETAIL.HIDDEN_LABEL_CONFIGS) {
    map.setConfigProperty(REDUCED_DETAIL.BASEMAP_IMPORT_ID, configName, false);
  }
  if (window.devicePixelRatio <= REDUCED_DETAIL.MAX_PIXEL_RATIO) {
    return () => undefined;
  }
  const restorePixelRatio = clampDevicePixelRatio(REDUCED_DETAIL.MAX_PIXEL_RATIO);
  resetMapCanvasSize(map);
  return restorePixelRatio;
}
