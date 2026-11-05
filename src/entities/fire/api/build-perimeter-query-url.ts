// Builds the BCWS perimeter query: non-Out polygons simplified to ~50 m, in WGS84 GeoJSON (ADR 023).
import { FIRE_FEED } from '@/shared/config';

// Returns the one-page perimeter query URL.
export function buildPerimeterQueryUrl(): string {
  const query = new URLSearchParams({
    where: "FIRE_STATUS<>'Out'",
    outFields: FIRE_FEED.PERIMETER_OUT_FIELDS,
    f: 'geojson',
    outSR: '4326',
    maxAllowableOffset: String(FIRE_FEED.PERIMETER_SIMPLIFY_DEG),
    geometryPrecision: '5',
    resultRecordCount: String(FIRE_FEED.PERIMETER_MAX_FEATURES),
  });
  return `${FIRE_FEED.PERIMETER_QUERY_URL}?${query.toString()}`;
}
