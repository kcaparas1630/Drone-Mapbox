// Adds the Mapbox DEM source and turns on terrain, idempotently, after each style load (ADR 005, 007).
import type { Map as MapboxMap } from 'mapbox-gl';

import { MAP_STYLE } from '../config/map-style';

// Ensures the raster-dem source exists and terrain uses it at real (unexaggerated) height.
export function addTerrain(map: MapboxMap): void {
  if (map.getSource(MAP_STYLE.DEM_SOURCE_ID) === undefined) {
    map.addSource(MAP_STYLE.DEM_SOURCE_ID, {
      type: 'raster-dem',
      url: MAP_STYLE.DEM_URL,
      tileSize: MAP_STYLE.DEM_TILE_SIZE,
      maxzoom: MAP_STYLE.DEM_MAX_ZOOM,
    });
  }
  map.setTerrain({ source: MAP_STYLE.DEM_SOURCE_ID, exaggeration: MAP_STYLE.TERRAIN_EXAGGERATION });
}
