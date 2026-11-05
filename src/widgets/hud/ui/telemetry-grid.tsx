// Two-by-two telemetry readouts (label over value) for the nav cluster; hidden on narrow screens (§4.1).
import { cn } from '@/shared/ui';

export type TelemetryGridProps = {
  readouts: readonly (readonly [string, string])[];
  isCompact?: boolean;
};

// Renders each label/value pair as a definition with tabular digits; always shown and tighter when compact.
export function TelemetryGrid({ readouts, isCompact = false }: TelemetryGridProps) {
  return (
    <dl
      aria-label="Flight data"
      className={cn(
        'grid-cols-2',
        isCompact ? 'grid gap-x-3 gap-y-0.5' : 'hidden gap-x-4 gap-y-1.5 sm:grid',
      )}
    >
      {readouts.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </dt>
          <dd
            className={cn(
              'font-mono font-semibold tabular-nums',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
