// One fire in the panel: status swatch, name, size, distance and an arrow pointing to it from the drone (§7.1).
import { Navigation } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { FIRE_STATUS_SWATCH_CLASSES, formatFireSize, type RankedFire } from '@/entities/fire';
import { formatDistance } from '@/shared/lib/format';
import { toDegrees } from '@/shared/lib/geo';
import { cn } from '@/shared/ui';

import { FireBearingReadout } from './fire-bearing-readout';

export type FireListRowProps = {
  entry: RankedFire;
  headingDeg: number | null;
  isSelected: boolean;
  onOpen: () => void;
  onFly: () => void;
};

// Renders the row as a select button with a separate Fly button; a newly selected row scrolls into view.
export function FireListRow({ entry, headingDeg, isSelected, onOpen, onFly }: FireListRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (isSelected) {
      rowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isSelected]);
  const { fire, distanceM, bearingRad } = entry;
  const statusLabel = fire.status === 'Unknown' ? fire.rawStatus : fire.status;
  const distanceText = formatDistance(distanceM);
  const relativeDeg =
    bearingRad === null || headingDeg === null ? null : toDegrees(bearingRad) - headingDeg;
  const openLabel = `${fire.incidentName}, ${statusLabel}${distanceText === '' ? '' : `, ${distanceText} away`}. Show details`;
  return (
    <li
      ref={rowRef}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(
        'flex items-center gap-1 rounded-lg transition-colors',
        isSelected
          ? 'bg-primary/15 shadow-[inset_3px_0_0_var(--color-primary)]'
          : 'hover:bg-secondary/70',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={openLabel}
        className="flex min-h-12 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 text-left"
      >
        <span
          aria-hidden="true"
          className={cn(
            'size-3 shrink-0 rounded-full ring-2 ring-status-ring',
            FIRE_STATUS_SWATCH_CLASSES[fire.status],
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{fire.incidentName}</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {statusLabel} · {formatFireSize(fire.sizeHa)}
          </span>
        </span>
        <FireBearingReadout distanceText={distanceText} relativeDeg={relativeDeg} />
      </button>
      <button
        type="button"
        onClick={onFly}
        aria-label={`Fly to ${fire.incidentName}`}
        title="Fly here"
        className="mr-1 grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground"
      >
        <Navigation aria-hidden="true" className="size-4" />
      </button>
    </li>
  );
}
