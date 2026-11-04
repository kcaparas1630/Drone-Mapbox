// Starts an auto-route to a place from search, recents or a fire's "Fly here" (behaviour §2, §5.4).
import { autoRouteStarted } from '@/entities/drone';
import { type Place, planGeodesicRoute, recentPlaceAdded, routePlanned } from '@/entities/route';

// Plans from the drone's last snapshot (the loop re-plans from its exact position), starts the route, saves recents.
export function flyToPlace(place: Place): AppThunk {
  return (dispatch, getState) => {
    const snapshot = getState().droneSnapshot.snapshot;
    const originLng = snapshot?.lng ?? place.lng;
    const originLat = snapshot?.lat ?? place.lat;
    dispatch(routePlanned(planGeodesicRoute(originLng, originLat, place)));
    dispatch(autoRouteStarted());
    dispatch(recentPlaceAdded(place));
  };
}
