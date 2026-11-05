// The one set of Mapbox request budgets for the app; every Mapbox API call reserves from its budget first (ADR 025).
import { MAPBOX_REQUEST_LIMITS } from '../config/mapbox-request-limits';
import { createRequestBudget } from '../lib/rate-limit';

export const mapboxRequestBudgets = {
  searchSuggest: createRequestBudget({
    name: 'search-suggest',
    ...MAPBOX_REQUEST_LIMITS.searchSuggest,
  }),
  searchRetrieve: createRequestBudget({
    name: 'search-retrieve',
    ...MAPBOX_REQUEST_LIMITS.searchRetrieve,
  }),
  reverseGeocode: createRequestBudget({
    name: 'reverse-geocode',
    ...MAPBOX_REQUEST_LIMITS.reverseGeocode,
  }),
  demTiles: createRequestBudget({ name: 'dem-tiles', ...MAPBOX_REQUEST_LIMITS.demTiles }),
};
