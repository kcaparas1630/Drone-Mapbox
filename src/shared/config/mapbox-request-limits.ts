// Mapbox request budgets per API: per minute (per tab) and per day (per browser), behaviour §11 (ADR 025).

export const MAPBOX_REQUEST_LIMITS = {
  searchSuggest: { perMinute: 30, perDay: 300 },
  searchRetrieve: { perMinute: 10, perDay: 50 },
  reverseGeocode: { perMinute: 20, perDay: 1000 },
  demTiles: { perMinute: 48, perDay: 480 },
} as const;
