// Turns recent places into search options that can be flown to without another API call (behaviour §5.4).
import type { Place } from '@/entities/route';

import type { SearchOption } from '../model/search.schema';

// Returns one option per recent place, labelled "Recent".
export function toRecentOptions(recents: readonly Place[]): SearchOption[] {
  return recents.map((place, index) => ({
    id: `recent-${String(index)}`,
    name: place.name,
    detail: 'Recent',
    suggestion: null,
    place,
  }));
}
