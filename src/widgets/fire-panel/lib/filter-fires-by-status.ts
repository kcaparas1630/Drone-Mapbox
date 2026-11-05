// Keeps the ranked fires that match a status chip, preserving the nearest-first order (§7.1).
import type { RankedFire } from '@/entities/fire';

import type { FireStatusFilter } from '../model/fire-status-filter.types';

// Returns the fires whose status the filter includes; the "All" filter returns every fire.
export function filterFiresByStatus(
  rankedFires: readonly RankedFire[],
  filter: FireStatusFilter,
): readonly RankedFire[] {
  const { statuses } = filter;
  return statuses === null
    ? rankedFires
    : rankedFires.filter((entry) => statuses.includes(entry.fire.status));
}
