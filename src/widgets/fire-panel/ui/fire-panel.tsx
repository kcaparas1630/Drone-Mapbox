// Right-hand fire panel: feed freshness, status chips, fires nearest first, and the Out toggle (§7.1).
import { useMemo, useState } from 'react';

import { selectDroneSnapshot } from '@/entities/drone';
import { sortFiresByDistance, useFireFeedQuery } from '@/entities/fire';
import { useAppSelector } from '@/shared/lib/redux';
import { cn } from '@/shared/ui';

import { FIRE_STATUS_FILTERS } from '../config/fire-status-filters';
import { filterFiresByStatus } from '../lib/filter-fires-by-status';
import { useStatusFilter } from '../model/use-status-filter';
import { FireFeedBadge } from './fire-feed-badge';
import { FireList } from './fire-list';
import { FirePanelHeader } from './fire-panel-header';
import { FireStatusChips } from './fire-status-chips';
import { OutFiresToggle } from './out-fires-toggle';

const WIDE_SCREEN_QUERY = '(min-width: 640px)';

// Returns whether the panel starts open on its own: yes on wide screens, collapsed on narrow ones.
function readIsInitiallyOpen(): boolean {
  return typeof window.matchMedia !== 'function' || window.matchMedia(WIDE_SCREEN_QUERY).matches;
}

// onOpenChange lets the page make room for the open panel (phone landscape, §4.2).
export type FirePanelProps = {
  isOpenByDefault?: boolean;
  isCompact?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

// Renders the collapsible panel from the shared feed cache and the ≤ 4 Hz drone snapshot.
export function FirePanel({ isOpenByDefault, isCompact = false, onOpenChange }: FirePanelProps) {
  const [isOpen, setIsOpen] = useState(() => isOpenByDefault ?? readIsInitiallyOpen());
  const snapshot = useAppSelector(selectDroneSnapshot);
  const { data: feed } = useFireFeedQuery();
  const sorted = useMemo(() => sortFiresByDistance(feed?.fires ?? [], snapshot), [feed, snapshot]);
  const chips = FIRE_STATUS_FILTERS.map((filter) => ({
    filter,
    count: filterFiresByStatus(sorted, filter).length,
  }));
  const { filterId, setFilterId, selectedFilter } = useStatusFilter(sorted);
  return (
    <section
      aria-label="Active fires"
      className={cn(
        'flex max-h-full min-h-0 w-full shrink flex-col overflow-hidden rounded-panel border border-panel-border bg-panel shadow-xl backdrop-blur-md',
        isCompact ? '' : 'sm:w-80',
      )}
    >
      <FirePanelHeader
        fireCount={sorted.length}
        isOpen={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen);
          onOpenChange?.(!isOpen);
        }}
      />
      <div
        id="fire-panel-body"
        hidden={!isOpen}
        className={cn(
          'flex min-h-0 flex-1 flex-col border-t border-panel-border',
          isCompact ? 'gap-2 px-2 pt-2 pb-2' : 'gap-2.5 px-3 pt-2.5 pb-3',
        )}
      >
        <FireFeedBadge />
        <FireStatusChips
          filters={chips}
          selectedId={filterId}
          isCompact={isCompact}
          onSelect={setFilterId}
        />
        <FireList
          fires={
            selectedFilter === undefined ? sorted : filterFiresByStatus(sorted, selectedFilter)
          }
          headingDeg={snapshot?.headingDeg ?? null}
        />
        <OutFiresToggle />
      </div>
    </section>
  );
}
