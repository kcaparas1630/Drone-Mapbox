// Fire popup: shows the selected fire from the feed cache; "Fly here" starts an auto-route to it (behaviour §7).
import { selectSelectedFireNumber, useFireFeedQuery } from '@/entities/fire';
import { flyToPlace } from '@/features/fly-to-place';
import { closeFirePopup } from '@/features/select-fire';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import { FireDetailsCard } from './fire-details-card';

// Renders the popup for the selected fire, or nothing when none is selected or it left the feed.
export function FirePopup() {
  const dispatch = useAppDispatch();
  const fireNumber = useAppSelector(selectSelectedFireNumber);
  const { data: feed } = useFireFeedQuery();
  const fire = feed?.fires.find((candidate) => candidate.fireNumber === fireNumber);
  if (feed === undefined || fire === undefined) {
    return null;
  }
  return (
    <FireDetailsCard
      fire={fire}
      fetchedAtMs={feed.fetchedAtMs}
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
