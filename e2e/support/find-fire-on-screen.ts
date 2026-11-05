// Finds where a fire point is drawn on screen, through the dev-only debug hook's map.
import type { Page } from '@playwright/test';

import type { DebugWindow } from './debug-window.types';

const FIRE_LAYER_ID = 'fire-points';

// Returns where to click the fire: its point must be drawn there and no HUD panel may cover it; else null.
export function findFireOnScreen(
  page: Page,
  lngLat: [number, number],
): Promise<{ x: number; y: number } | null> {
  return page.evaluate(
    ({ position, layerId }) => {
      const map = (window as DebugWindow).fireflybcDebug?.map;
      if (map === undefined) {
        return null;
      }
      const point = map.project(position);
      const hits = map.queryRenderedFeatures([point.x, point.y], { layers: [layerId] });
      const topElement = document.elementFromPoint(point.x, point.y);
      const isMapOnTop = topElement?.classList.contains('mapboxgl-canvas') === true;
      return hits.length > 0 && isMapOnTop ? { x: point.x, y: point.y } : null;
    },
    { position: lngLat, layerId: FIRE_LAYER_ID },
  );
}
