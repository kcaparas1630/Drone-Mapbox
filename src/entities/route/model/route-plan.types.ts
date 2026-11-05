// Serialisable description of a planned auto-route; routeId increases with every plan, including resumes.
import type { Place } from './place.schema';
import type { RoutePath } from './route-path.types';

export type RoutePlanDraft = {
  destination: Place;
  originLng: number;
  originLat: number;
  distanceM: number;
  durationS: number;
  initialBearingRad: number;
};

// path is null until the terrain-aware planner attaches one (ADR 022).
export type RoutePlan = RoutePlanDraft & { routeId: number; path: RoutePath | null };
