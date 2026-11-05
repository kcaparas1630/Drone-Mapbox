// Retrieves the chosen suggestion's coordinates with the session token that produced it (billing per session).
import type { SearchBoxCore, SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core';

import type { Place } from '@/entities/route';
import type { Result } from '@/shared/lib/result';

import { type RetrievedPlaceProblem, toRetrievedPlace } from '../lib/to-retrieved-place';
import type { SearchOption } from './search.schema';

export type ResolvePlaceProblem = RetrievedPlaceProblem | 'failed';

// Returns the validated place for the option, or why it cannot be flown to.
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
  try {
    const response = await search.retrieve(option.suggestion as SearchBoxSuggestion, {
      sessionToken,
    });
    return toRetrievedPlace(response);
  } catch {
    return { isOk: false, error: 'failed' };
  }
}
