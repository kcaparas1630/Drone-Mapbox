// Two-by-two telemetry readouts (label over value) for the nav cluster; hidden on narrow screens (§4.1).

export type TelemetryGridProps = { readouts: readonly (readonly [string, string])[] };

// Renders each label/value pair as a definition with tabular digits.
export function TelemetryGrid({ readouts }: TelemetryGridProps) {
  return (
    <dl aria-label="Flight data" className="hidden grid-cols-2 gap-x-4 gap-y-1.5 sm:grid">
      {readouts.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </dt>
          <dd className="font-mono text-sm font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
