// Status filter chips for the fire panel, each with its count; one is always selected (§7.1).
import { cn } from '@/shared/ui';

import type { FireStatusFilter, FireStatusFilterId } from '../model/fire-status-filter.types';

export type FireStatusChipsProps = {
  filters: readonly { filter: FireStatusFilter; count: number }[];
  selectedId: FireStatusFilterId;
  onSelect: (id: FireStatusFilterId) => void;
  isCompact?: boolean;
};

// Renders the chips as a group of toggle buttons; compact keeps them on one row that scrolls sideways.
export function FireStatusChips({
  filters,
  selectedId,
  onSelect,
  isCompact = false,
}: FireStatusChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filter fires by status"
      className={cn('flex gap-1.5', isCompact ? 'shrink-0 overflow-x-auto' : 'flex-wrap')}
    >
      {filters.map(({ filter, count }) => {
        const isSelected = filter.id === selectedId;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => {
              onSelect(filter.id);
            }}
            className={cn(
              'inline-flex min-h-7 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors',
              isCompact ? 'shrink-0' : '',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-transparent bg-secondary text-secondary-foreground hover:brightness-125',
            )}
          >
            {filter.label}
            <span className={cn('tabular-nums', isSelected ? 'opacity-80' : 'opacity-60')}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
