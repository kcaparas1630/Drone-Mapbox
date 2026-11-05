// Arrival card: the destination and how many active fires are within 25 km, with the nearest (§6.5).
import { findNearbyFires, useFireFeedQuery } from '@/entities/fire';
import type { Place } from '@/entities/route';
import { FIRE_FEED } from '@/shared/config';
import { Button, Card } from '@/shared/ui';

export type ArrivalCardProps = { destination: Place; onDismiss: () => void };

// Returns the nearby-fires sentence, or a loading/unavailable note when the feed has no data.
function describeNearbyFires(
  destination: Place,
  fires: Parameters<typeof findNearbyFires>[0] | undefined,
): string {
  if (fires === undefined) {
    return 'Fire data is not available right now.';
  }
  const { count, nearest } = findNearbyFires(
    fires,
    destination.lng,
    destination.lat,
    FIRE_FEED.NEARBY_RADIUS_M,
  );
  if (nearest === null) {
    return 'Fires within 25 km: 0';
  }
  const distanceKm = (nearest.distanceM / 1000).toFixed(1);
  const { incidentName, status, rawStatus } = nearest.fire;
  const statusLabel = status === 'Unknown' ? rawStatus : status;
  return `Fires within 25 km: ${String(count)} (nearest: ${incidentName}, ${distanceKm} km, ${statusLabel})`;
}

// Renders the arrival summary and a Dismiss button.
export function ArrivalCard({ destination, onDismiss }: ArrivalCardProps) {
  const { data: feed } = useFireFeedQuery();
  return (
    <Card role="status" aria-live="polite" className="flex w-full max-w-md flex-col gap-2 p-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Arrived</p>
      <h2 className="text-lg font-semibold">{destination.name}</h2>
      <p className="text-sm">{describeNearbyFires(destination, feed?.fires)}</p>
      <Button className="self-end" variant="secondary" onClick={onDismiss}>
        Dismiss
      </Button>
    </Card>
  );
}
