// Fire details for the selected fire, shown under the fire list; "Fly here" starts an auto-route (§7, ADR 023).
import {
  selectSelectedFireNumber,
  useFireFeedQuery,
  useGetFirePerimetersQuery,
} from '@/entities/fire';
import { flyToPlace } from '@/features/fly-to-place';
import { closeFirePopup } from '@/features/select-fire';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import { FireDetailsCard } from './fire-details-card';

// Renders the popup for the selected fire, or nothing when none is selected or it left the feed.
export function FirePopup() {
  const dispatch = useAppDispatch();
  const fireNumber = useAppSelector(selectSelectedFireNumber);
  const { data: feed } = useFireFeedQuery();
  const { data: perimeters } = useGetFirePerimetersQuery(undefined);
  const fire = feed?.fires.find((candidate) => candidate.fireNumber === fireNumber);
  if (feed === undefined || fire === undefined) {
    return null;
  }
  return (
    <FireDetailsCard
      fire={fire}
      fetchedAtMs={feed.fetchedAtMs}
      isAreaMapped={
        perimeters?.some((perimeter) => perimeter.fireNumber === fire.fireNumber) ?? false
      }
      onClose={() => {
        dispatch(closeFirePopup());
      }}
      onFlyHere={() => {
        dispatch(flyToPlace({ name: fire.incidentName, lng: fire.lng, lat: fire.lat }));
        dispatch(closeFirePopup());
      }}
    />
  );
}
