// Lower-left nav cluster: compass with fire blips, where the drone is, and its speed and altitudes (§4.1).
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

import { selectDroneSnapshot } from '@/entities/drone';
import { sortFiresByDistance, useFireFeedQuery } from '@/entities/fire';
import { usePlaceName } from '@/entities/location';
import { useAppSelector } from '@/shared/lib/redux';

import { computeFireBlips } from '../lib/compute-fire-blips';
import { formatCoordinates } from '../lib/format-coordinates';
import { formatFlightValue } from '../lib/format-flight-value';
import { CompassRose } from './compass-rose';
import { TelemetryGrid } from './telemetry-grid';

export type NavClusterProps = { mapboxToken: string };

const FALLBACK_PLACE = 'Over British Columbia';

// Renders the cluster from the ≤ 4 Hz snapshot and the shared fire feed cache.
export function NavCluster({ mapboxToken }: NavClusterProps) {
  const snapshot = useAppSelector(selectDroneSnapshot);
  const { data: feed } = useFireFeedQuery();
  const placeName = usePlaceName(mapboxToken, snapshot?.lng ?? null, snapshot?.lat ?? null);
  const blips = useMemo(
    () => computeFireBlips(sortFiresByDistance(feed?.fires ?? [], snapshot)),
    [feed, snapshot],
  );
  const altitudeAgl = snapshot === null || snapshot.isTerrainMissing ? null : snapshot.altitudeAgl;
  return (
    <section aria-label="Navigation" className="flex items-end gap-3">
      <CompassRose headingDeg={snapshot?.headingDeg ?? null} blips={blips} />
      <div className="flex max-w-72 min-w-0 flex-col gap-2 rounded-panel border border-panel-border bg-panel p-3 shadow-xl backdrop-blur-md">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm leading-tight font-semibold">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-2" aria-live="polite">
              {placeName ?? FALLBACK_PLACE}
            </span>
          </p>
          <p className="mt-0.5 hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:block">
            {snapshot === null ? '—' : formatCoordinates(snapshot.lng, snapshot.lat)}
          </p>
        </div>
        <TelemetryGrid
          readouts={[
            ['Speed', formatFlightValue('speed', snapshot?.speedMps ?? null)],
            ['Climb', formatFlightValue('verticalSpeed', snapshot?.verticalSpeedMps ?? null)],
            ['Alt MSL', formatFlightValue('altitude', snapshot?.altitudeMsl ?? null)],
            ['Alt AGL', formatFlightValue('altitude', altitudeAgl)],
          ]}
        />
      </div>
    </section>
  );
}
