// The only place the map style and terrain source live, so offline or style options can swap them later (ADR 006).

export const MAP_STYLE = {
  STYLE_URL: 'mapbox://styles/mapbox/standard',
  DEM_SOURCE_ID: 'mapbox-dem',
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
