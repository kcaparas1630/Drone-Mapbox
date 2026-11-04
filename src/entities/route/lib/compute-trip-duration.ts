// Trip duration for an auto-route: distance at cruise speed, clamped to 5–45 s (behaviour §6.1).
import { FLIGHT_TUNING } from '@/shared/config';

// Returns the flight time in seconds for a route of distanceM metres.
export function computeTripDuration(distanceM: number): number {
  const cruiseS = distanceM / FLIGHT_TUNING.CRUISE_MPS;
  return Math.min(FLIGHT_TUNING.MAX_TRIP_S, Math.max(FLIGHT_TUNING.MIN_TRIP_S, cruiseS));
}
