// The fire panel's list: one row per fire, nearest first, or a note when the filter matches nothing (§7.1).
import { type RankedFire, selectSelectedFireNumber } from '@/entities/fire';
import { flyToPlace } from '@/features/fly-to-place';
import { selectFire } from '@/features/select-fire';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import { FireListRow } from './fire-list-row';

export type FireListProps = { fires: readonly RankedFire[]; headingDeg: number | null };

// Renders the scrollable rows; a row opens the popup, its Fly button starts an auto-route.
export function FireList({ fires, headingDeg }: FireListProps) {
  const dispatch = useAppDispatch();
  const selectedFireNumber = useAppSelector(selectSelectedFireNumber);
  if (fires.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">No fires match this filter</p>
    );
  }
  return (
    <ul aria-label="Fires, nearest first" className="-mx-1 min-h-24 flex-1 overflow-y-auto">
      {fires.map((entry) => (
        <FireListRow
          key={entry.fire.fireNumber}
          entry={entry}
          headingDeg={headingDeg}
          isSelected={entry.fire.fireNumber === selectedFireNumber}
          onOpen={() => {
            dispatch(selectFire(entry.fire.fireNumber));
          }}
          onFly={() => {
            const { fire } = entry;
            dispatch(flyToPlace({ name: fire.incidentName, lng: fire.lng, lat: fire.lat }));
          }}
        />
      ))}
    </ul>
  );
}
