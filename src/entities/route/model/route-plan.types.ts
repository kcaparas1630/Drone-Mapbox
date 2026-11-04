// Serialisable description of a planned auto-route; routeId increases with every plan, including resumes.
import type { Place } from './place.schema';

export type RoutePlanDraft = {
  destination: Place;
  originLng: number;
  originLat: number;
  distanceM: number;
  durationS: number;
  initialBearingRad: number;
};

export type RoutePlan = RoutePlanDraft & { routeId: number };
