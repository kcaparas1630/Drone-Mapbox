// Presentational fire status pill: the BCWS colour swatch always paired with the status text (convention 009).
import { cn } from '@/shared/ui';

import { FIRE_STATUS_PALETTE } from '../config/fire-status-palette';
import type { FireStatus } from '../model/fire.types';

export type FireStatusBadgeProps = { status: FireStatus; rawStatus: string; className?: string };

const SWATCH_CLASS_BY_STATUS: Readonly<Record<FireStatus, string>> = {
  'Out of Control': 'bg-fire-out-of-control',
  'Being Held': 'bg-fire-being-held',
  'Under Control': 'bg-fire-under-control',
  New: 'bg-fire-new',
  'Fire of Note': 'bg-fire-out-of-control ring-2 ring-white',
  Out: 'bg-muted-foreground',
  Unknown: 'bg-fire-unknown',
};

// Renders the status colour swatch and the status text; unknown statuses show the raw BCWS text.
export function FireStatusBadge({ status, rawStatus, className }: FireStatusBadgeProps) {
  const label = status === 'Unknown' ? rawStatus : status;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-panel-border bg-panel px-2 py-0.5 text-xs font-semibold',
        className,
      )}
      data-status-color={FIRE_STATUS_PALETTE[status]}
    >
      <span
        aria-hidden="true"
        className={cn('size-2.5 rounded-full', SWATCH_CLASS_BY_STATUS[status])}
      />
      {label}
    </span>
  );
}
