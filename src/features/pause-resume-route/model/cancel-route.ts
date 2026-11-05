// Cancels a running or paused route: free flight, route cleared (behaviour §2, §6.4).
import { routeCancelled } from '@/entities/drone';
import { routeCleared } from '@/entities/route';

// Leaves auto-route for free flight and removes the route.
export function cancelRoute(): AppThunk {
  return (dispatch) => {
    dispatch(routeCancelled());
    dispatch(routeCleared());
  };
}
