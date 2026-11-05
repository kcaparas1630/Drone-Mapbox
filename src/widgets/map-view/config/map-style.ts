// The only place the map style and terrain source live: Standard Satellite (ADR 021) plus the Mapbox DEM (ADR 006).

import { FIRE_FEED } from '@/shared/config';

export const MAP_STYLE = {
  STYLE_URL: 'mapbox://styles/mapbox/standard-satellite',
  DEM_SOURCE_ID: 'mapbox-dem',
  DRONE_LAYER_ID: 'drone-layer',
  ROUTE_SOURCE_ID: 'route-line',
  ROUTE_LAYER_ID: 'route-line',
  FIRE_SOURCE_ID: 'fires',
  FIRE_LAYER_ID: 'fire-points',
  FIRE_LABEL_LAYER_ID: 'fire-labels',
  FIRE_FOOTPRINT_SOURCE_ID: 'fire-footprints',
  FIRE_FOOTPRINT_FILL_LAYER_ID: 'fire-footprint-fill',
  FIRE_FOOTPRINT_EDGE_LAYER_ID: 'fire-footprint-edge',
  FIRE_FOOTPRINT_APPROXIMATE_EDGE_LAYER_ID: 'fire-footprint-edge-approximate',
  FIRE_FLAME_CAPACITY: FIRE_FEED.PAGE_SIZE * FIRE_FEED.MAX_PAGES,
  FLAME_UPDATE_INTERVAL_MS: 250,
  DEM_URL: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  DEM_TILE_SIZE: 512,
  DEM_MAX_ZOOM: 14,
  TERRAIN_EXAGGERATION: 1,
  MIN_ZOOM: 4,
  INITIAL_ZOOM: 13,
  INITIAL_PITCH_DEG: 65,
  TILE_STALL_MS: 10_000,
  HEALTH_CHECK_INTERVAL_MS: 2000,
} as const;
