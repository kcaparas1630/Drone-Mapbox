// Thresholds for the low-end device fallback: under 30 fps for 5 s drops detail (behaviour §10).

export const REDUCED_DETAIL = {
  MIN_FPS: 30,
  LOW_FPS_DURATION_MS: 5000,
  WINDOW_MS: 1000,
  WARM_UP_MS: 5000,
  MAX_FRAME_GAP_MS: 10_000,
  MAX_PIXEL_RATIO: 1.5,
  BASEMAP_IMPORT_ID: 'basemap',
  HIDDEN_LABEL_CONFIGS: [
    'showPlaceLabels',
    'showRoadLabels',
    'showPointOfInterestLabels',
    'showTransitLabels',
  ],
} as const;
