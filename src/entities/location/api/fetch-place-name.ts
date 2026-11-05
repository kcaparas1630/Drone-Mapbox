// Looks up the place name for a point with the Mapbox Geocoding v6 reverse API (ADR 021, security §4).
import { fetchJson, mapboxRequestBudgets } from '@/shared/api';

import { formatPlaceName } from '../lib/format-place-name';
import { reverseGeocodeSchema } from '../model/reverse-geocode.schema';

const REVERSE_GEOCODE_URL = 'https://api.mapbox.com/search/geocode/v6/reverse';
const PLACE_TYPES = 'neighborhood,locality,place,district,region';
const MAX_RESPONSE_BYTES = 256 * 1024;

// Returns the readout text for lng/lat, null when Mapbox knows no place there, or a failed Result (incl. over budget).
export async function fetchPlaceName(
  accessToken: string,
  lng: number,
  lat: number,
  signal: AbortSignal,
) {
  const url = new URL(REVERSE_GEOCODE_URL);
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('types', PLACE_TYPES);
  url.searchParams.set('language', 'en');
  url.searchParams.set('access_token', accessToken);
  const result = await fetchJson(url.toString(), reverseGeocodeSchema, {
    signal,
    maxBytes: MAX_RESPONSE_BYTES,
    budget: mapboxRequestBudgets.reverseGeocode,
  });
  return result.isOk ? { isOk: true as const, value: formatPlaceName(result.value) } : result;
}
