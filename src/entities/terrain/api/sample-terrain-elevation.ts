// Null-safe wrapper over map.queryTerrainElevation: unloaded tiles give null, never undefined or NaN (ADR 005).
import type { Map as MapboxMap } from 'mapbox-gl';

const scratchLngLat = { lng: 0, lat: 0 };
const ELEVATION_OPTIONS = { exaggerated: false };

// Returns the terrain elevation in metres at lng/lat, or null when the DEM tile is not loaded.
export function sampleTerrainElevation(map: MapboxMap, lng: number, lat: number): number | null {
  scratchLngLat.lng = lng;
  scratchLngLat.lat = lat;
  const elevationM = map.queryTerrainElevation(scratchLngLat, ELEVATION_OPTIONS);
  return typeof elevationM === 'number' && Number.isFinite(elevationM) ? elevationM : null;
}
