// Dismisses the arrival card: back to free flight with the finished route cleared (behaviour §6.5).
import { arrivalDismissed } from '@/entities/drone';
import { routeCleared } from '@/entities/route';

// Leaves the arrived state and clears the route.
export function closeArrival(): AppThunk {
  return (dispatch) => {
    dispatch(arrivalDismissed());
    dispatch(routeCleared());
  };
}
