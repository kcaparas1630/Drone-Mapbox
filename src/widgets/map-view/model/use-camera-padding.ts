// Moves the map's centre of view into the area the cockpit leaves clear, so the drone is not drawn under it (§4).
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect } from 'react';

import type { CameraPadding } from './camera-padding.types';

// Applies the padding as a Mapbox projection offset; the free chase camera keeps its pose and aim.
export function useCameraPadding(map: MapboxMap | null, padding: CameraPadding): void {
  const { topPx, bottomPx } = padding;
  useEffect(() => {
    if (map === null) {
      return;
    }
    map.setPadding({ top: topPx, bottom: bottomPx, left: 0, right: 0 });
  }, [map, topPx, bottomPx]);
}
