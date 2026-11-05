// Retrieves the chosen suggestion's coordinates with the session token that produced it (billing per session).
import type { SearchBoxCore, SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core';

import type { Place } from '@/entities/route';
import { mapboxRequestBudgets } from '@/shared/api';
import type { Result } from '@/shared/lib/result';

import { type RetrievedPlaceProblem, toRetrievedPlace } from '../lib/to-retrieved-place';
import type { SearchOption } from './search.schema';

export type ResolvePlaceProblem = RetrievedPlaceProblem | 'failed' | 'rate-limited';

// Returns the validated place for the option, or why it cannot be flown to (including a spent retrieve budget).
export async function resolvePlace(
  search: SearchBoxCore | null,
  sessionToken: SessionToken | null,
  option: SearchOption,
): Promise<Result<Place, ResolvePlaceProblem>> {
  if (option.place !== null) {
    return { isOk: true, value: option.place };
  }
  if (search === null || sessionToken === null) {
    return { isOk: false, error: 'failed' };
  }
  if (!mapboxRequestBudgets.searchRetrieve.reserve().isAllowed) {
    return { isOk: false, error: 'rate-limited' };
  }
  try {
    const response = await search.retrieve(option.suggestion as SearchBoxSuggestion, {
      sessionToken,
    });
    return toRetrievedPlace(response);
  } catch {
    return { isOk: false, error: 'failed' };
  }
}
