// Route banner: "Flying to …" during auto-route, Resume/Cancel when paused, the arrival card on arrival (§2, §6).
import { selectDroneMode } from '@/entities/drone';
import { selectActiveRoute } from '@/entities/route';
import { closeArrival } from '@/features/pause-resume-route';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import { ArrivalCard } from './arrival-card';
import { FlyingBanner } from './flying-banner';
import { PausedBanner } from './paused-banner';

// Renders the banner for the current flight mode, or nothing in free flight.
export function RouteBanner() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectDroneMode);
  const plan = useAppSelector(selectActiveRoute);
  if (plan === null) {
    return null;
  }
  if (mode === 'arrived') {
    return (
      <ArrivalCard
        destination={plan.destination}
        onDismiss={() => {
          dispatch(closeArrival());
        }}
      />
    );
  }
  if (mode === 'paused') {
    return <PausedBanner destinationName={plan.destination.name} />;
  }
  return mode === 'autoRoute' ? <FlyingBanner destinationName={plan.destination.name} /> : null;
}
