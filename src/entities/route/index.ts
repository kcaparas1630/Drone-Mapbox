// Public API of the route entity: places, geodesic planning, progress, the route line and their slices.
export { buildRouteLine } from './lib/build-route-line';
export { computeTripDuration } from './lib/compute-trip-duration';
export { easeRouteProgress } from './lib/ease-route-progress';
export { planGeodesicRoute } from './lib/plan-geodesic-route';
export { stepAlongRoute } from './lib/step-along-route';
export type { RouteProgressInput, RouteProgressPoint } from './model/route-progress.types';
export { placeSchema } from './model/place.schema';
export type { Place } from './model/place.schema';
export {
  recentPlaceAdded,
  recentPlacesRestored,
  recentPlacesSlice,
  selectRecentPlaces,
} from './model/recent-places.slice';
export type { RecentPlacesState } from './model/recent-places.slice';
export type { RoutePlan, RoutePlanDraft } from './model/route-plan.types';
export { routeCleared, routePlanned, routeSlice, selectActiveRoute } from './model/route.slice';
export type { RouteState } from './model/route.slice';
