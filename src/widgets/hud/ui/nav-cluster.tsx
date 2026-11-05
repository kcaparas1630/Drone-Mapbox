// Lower-left nav cluster: compass with fire blips, where the drone is, and its speed and altitudes (§4.1, §4.2).
import { useMemo } from 'react';

import { selectDroneSnapshot } from '@/entities/drone';
import { sortFiresByDistance, useFireFeedQuery } from '@/entities/fire';
import { usePlaceName } from '@/entities/location';
import { useAppSelector } from '@/shared/lib/redux';
import { cn } from '@/shared/ui';

import { computeFireBlips } from '../lib/compute-fire-blips';
import { CompassRose } from './compass-rose';
import { NavReadoutCard } from './nav-readout-card';

// full: the desktop cluster; compact: smaller, no coordinates (phone landscape); compass: the rose only (phone portrait).
export type NavClusterVariant = 'full' | 'compact' | 'compass';

export type NavClusterProps = { mapboxToken: string; variant?: NavClusterVariant };

const FALLBACK_PLACE = 'Over British Columbia';

// Renders the cluster from the ≤ 4 Hz snapshot and the fire feed cache; compass-only skips the place lookup.
export function NavCluster({ mapboxToken, variant = 'full' }: NavClusterProps) {
  const snapshot = useAppSelector(selectDroneSnapshot);
  const { data: feed } = useFireFeedQuery();
  const isCompassOnly = variant === 'compass';
  const placeName = usePlaceName(
    mapboxToken,
    isCompassOnly ? null : (snapshot?.lng ?? null),
    isCompassOnly ? null : (snapshot?.lat ?? null),
  );
  const blips = useMemo(
    () => computeFireBlips(sortFiresByDistance(feed?.fires ?? [], snapshot)),
    [feed, snapshot],
  );
  const isCompact = variant !== 'full';
  return (
    <section
      aria-label="Navigation"
      className={cn('flex items-end', isCompact ? 'gap-2' : 'gap-3')}
    >
      <CompassRose headingDeg={snapshot?.headingDeg ?? null} blips={blips} isCompact={isCompact} />
      {isCompassOnly ? null : (
        <NavReadoutCard
          snapshot={snapshot}
          placeName={placeName ?? FALLBACK_PLACE}
          isCompact={isCompact}
        />
      )}
    </section>
  );
}
