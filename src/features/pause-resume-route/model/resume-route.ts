// Resumes a paused flight by re-planning from where the drone is now to the same destination (behaviour §6.4).
import { autoRouteStarted, destinationReached, routeCancelled } from '@/entities/drone';
import { planGeodesicRoute, routePlanned } from '@/entities/route';
import { FLIGHT_TUNING } from '@/shared/config';

// Re-plans and restarts the route; arrives immediately when already at the destination.
export function resumeRoute(): AppThunk {
  return (dispatch, getState) => {
    const { route, droneSnapshot } = getState();
    const destination = route.activeRoute?.destination;
    if (destination === undefined) {
      dispatch(routeCancelled());
      return;
    }
    const originLng = droneSnapshot.snapshot?.lng ?? destination.lng;
    const originLat = droneSnapshot.snapshot?.lat ?? destination.lat;
    const plan = planGeodesicRoute(originLng, originLat, destination);
    dispatch(routePlanned(plan));
    dispatch(autoRouteStarted());
    if (plan.distanceM <= FLIGHT_TUNING.ARRIVAL_RADIUS_M) {
      dispatch(destinationReached());
    }
  };
}
