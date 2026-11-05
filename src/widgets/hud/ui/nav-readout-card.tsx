// The nav cluster's card: where the drone is (place name, coordinates) and its speed and altitudes (§4.1).
import { MapPin } from 'lucide-react';

import type { DroneSnapshot } from '@/entities/drone';
import { cn } from '@/shared/ui';

import { formatCoordinates } from '../lib/format-coordinates';
import { formatFlightValue } from '../lib/format-flight-value';
import { TelemetryGrid } from './telemetry-grid';

export type NavReadoutCardProps = {
  snapshot: DroneSnapshot | null;
  placeName: string;
  isCompact: boolean;
};

// Renders the place, coordinates and four readouts; compact drops coordinates, and the card in a narrow slot.
export function NavReadoutCard({ snapshot, placeName, isCompact }: NavReadoutCardProps) {
  const altitudeAgl = snapshot === null || snapshot.isTerrainMissing ? null : snapshot.altitudeAgl;
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col rounded-panel border border-panel-border bg-panel shadow-xl backdrop-blur-md',
        isCompact ? 'max-w-60 gap-1.5 p-2 @max-[17rem]:hidden' : 'max-w-72 gap-2 p-3',
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            'flex items-center gap-1.5 font-semibold',
            isCompact ? 'text-xs' : 'text-sm',
            'leading-tight',
          )}
        >
          <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <span className="line-clamp-2" aria-live="polite">
            {placeName}
          </span>
        </p>
        <p
          className={cn(
            'mt-0.5 hidden font-mono text-[11px] text-muted-foreground tabular-nums',
            isCompact ? '' : 'sm:block',
          )}
        >
          {snapshot === null ? '—' : formatCoordinates(snapshot.lng, snapshot.lat)}
        </p>
      </div>
      <TelemetryGrid
        isCompact={isCompact}
        readouts={[
          ['Speed', formatFlightValue('speed', snapshot?.speedMps ?? null)],
          ['Climb', formatFlightValue('verticalSpeed', snapshot?.verticalSpeedMps ?? null)],
          ['Alt MSL', formatFlightValue('altitude', snapshot?.altitudeMsl ?? null)],
          ['Alt AGL', formatFlightValue('altitude', altitudeAgl)],
        ]}
      />
    </div>
  );
}
