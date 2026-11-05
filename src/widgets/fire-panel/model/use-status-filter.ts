// Holds the selected status chip and resets it to All when a fire selected on the map would be hidden (§7.1).
import { useState } from 'react';

import { type RankedFire, selectSelectedFireNumber } from '@/entities/fire';
import { useAppSelector } from '@/shared/lib/redux';

import { FIRE_STATUS_FILTERS } from '../config/fire-status-filters';
import { filterFiresByStatus } from '../lib/filter-fires-by-status';
import type { FireStatusFilterId } from './fire-status-filter.types';

// Returns the chip id, its setter and the matching filter, revealing a newly selected fire if needed.
export function useStatusFilter(sorted: readonly RankedFire[]) {
  const [filterId, setFilterId] = useState<FireStatusFilterId>('all');
  const selectedFireNumber = useAppSelector(selectSelectedFireNumber);
  const [revealedFireNumber, setRevealedFireNumber] = useState(selectedFireNumber);
  const selectedFilter = FIRE_STATUS_FILTERS.find((filter) => filter.id === filterId);
  if (selectedFireNumber !== revealedFireNumber) {
    setRevealedFireNumber(selectedFireNumber);
    const isHidden =
      selectedFilter !== undefined &&
      !filterFiresByStatus(sorted, selectedFilter).some(
        (entry) => entry.fire.fireNumber === selectedFireNumber,
      );
    if (selectedFireNumber !== null && isHidden) {
      setFilterId('all');
    }
  }
  return { filterId, setFilterId, selectedFilter };
}
