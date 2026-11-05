// Plans each new route's terrain-aware path in the background and attaches it to the plan (ADR 022, §6.1).
import { useEffect } from 'react';

import { routePathPlanned, selectActiveRoute } from '@/entities/route';
import { reportError } from '@/shared/lib/report-error';
import { useAppDispatch, useAppSelector, useAppStore } from '@/shared/lib/redux';

import { planRoutePath } from './plan-route-path';

// Starts planning when a route without a path appears and cancels it when the route changes.
export function useTerrainAwareRoute(mapboxToken: string): void {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const plan = useAppSelector(selectActiveRoute);
  const pendingPlan = plan !== null && plan.path === null ? plan : null;
  useEffect(() => {
    if (pendingPlan === null) {
      return undefined;
    }
    const controller = new AbortController();
    const startAltitudeMsl = store.getState().droneSnapshot.snapshot?.altitudeMsl ?? 0;
    planRoutePath(mapboxToken, pendingPlan, startAltitudeMsl, controller.signal)
      .then((path) => {
        if (path !== null && !controller.signal.aborted) {
          dispatch(routePathPlanned({ routeId: pendingPlan.routeId, path }));
        }
      })
      .catch((error: unknown) => {
        reportError(error, 'route planning (keeping the great circle)', 'warn');
      });
    return () => {
      controller.abort();
    };
  }, [dispatch, mapboxToken, pendingPlan, store]);
}
