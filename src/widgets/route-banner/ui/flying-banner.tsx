// Banner shown during an auto-route: "Flying to {name} · 182 km · 0:31" with a Cancel button (behaviour §6.4).
import { Navigation } from 'lucide-react';

import { selectDroneSnapshot } from '@/entities/drone';
import { cancelRoute } from '@/features/pause-resume-route';
import { formatDistance, formatDuration } from '@/shared/lib/format';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';
import { Button, Card } from '@/shared/ui';

export type FlyingBannerProps = { destinationName: string };

// Renders the destination, the distance and time left from the snapshot, and a way to cancel.
export function FlyingBanner({ destinationName }: FlyingBannerProps) {
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector(selectDroneSnapshot);
  const progress =
    snapshot === null || snapshot.routeRemainingS <= 0
      ? null
      : `${formatDistance(snapshot.routeRemainingM)} · ${formatDuration(snapshot.routeRemainingS)}`;
  return (
    <Card role="status" aria-live="polite" className="flex w-full max-w-md items-center gap-3 p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20">
        <Navigation aria-hidden="true" className="size-4 text-primary" />
      </span>
      <p className="min-w-0 flex-1 text-sm">
        <span className="block truncate">
          Flying to <strong>{destinationName}</strong>
        </span>
        {progress === null ? null : (
          <span className="block text-xs text-muted-foreground tabular-nums">{progress}</span>
        )}
      </p>
      <Button
        size="small"
        variant="ghost"
        onClick={() => {
          dispatch(cancelRoute());
        }}
      >
        Cancel
      </Button>
    </Card>
  );
}
