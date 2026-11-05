// Builds one paged BCWS ArcGIS query URL; the only place that knows the ArcGIS query parameters (ADR 003).
import { FIRE_FEED } from '@/shared/config';

// Returns the query URL for the page starting at offset, excluding Out fires unless includeOut is set.
export function buildFireQueryUrl(offset: number, isOutIncluded: boolean): string {
  const query = new URLSearchParams({
    where: isOutIncluded ? '1=1' : "FIRE_STATUS<>'Out'",
    outFields: FIRE_FEED.OUT_FIELDS,
    f: 'geojson',
    outSR: '4326',
    orderByFields: 'FIRE_NUMBER',
    resultRecordCount: String(FIRE_FEED.PAGE_SIZE),
    resultOffset: String(offset),
  });
  return `${FIRE_FEED.QUERY_URL}?${query.toString()}`;
}
