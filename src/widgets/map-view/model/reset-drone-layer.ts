// Replaces the drone custom layer with a fresh instance, e.g. on start or after a restored WebGL context.
import type { Map as MapboxMap } from 'mapbox-gl';

import { MAP_STYLE } from '../config/map-style';
import { createDroneLayer } from './create-drone-layer';
import type { FrameLoopContext } from './frame-loop-context';

// Removes any existing drone layer and adds a new one drawing the context's world.
export function resetDroneLayer(map: MapboxMap, context: FrameLoopContext): void {
  if (map.getLayer(MAP_STYLE.DRONE_LAYER_ID) !== undefined) {
    map.removeLayer(MAP_STYLE.DRONE_LAYER_ID);
  }
  map.addLayer(createDroneLayer(context.world));
}
