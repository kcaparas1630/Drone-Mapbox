// Creates the Search Box API client limited to British Columbia, in English (ADR 008, ADR 019).
import { SearchBoxCore } from '@mapbox/search-js-core';

import { BC_BOUNDING_BOX } from '@/shared/config';

const SUGGESTION_LIMIT = 6;
const PLACE_TYPES = 'region,district,place,locality,neighborhood,poi,address';

// Returns a client that only suggests Canadian places inside the BC bounding box.
export function createPlaceSearch(accessToken: string): SearchBoxCore {
  return new SearchBoxCore({
    accessToken,
    country: 'ca',
    bbox: [
      BC_BOUNDING_BOX.WEST_LNG,
      BC_BOUNDING_BOX.SOUTH_LAT,
      BC_BOUNDING_BOX.EAST_LNG,
      BC_BOUNDING_BOX.NORTH_LAT,
    ],
    language: 'en',
    limit: SUGGESTION_LIMIT,
    types: PLACE_TYPES,
  });
}
