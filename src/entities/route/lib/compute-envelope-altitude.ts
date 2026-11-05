// Climb–cruise–descent envelope of an auto-route: climb at 25 %, cruise above both ends, descend at 15 % (§6.2).
import { FLIGHT_TUNING, ROUTE_TUNING } from '@/shared/config';

const { CLIMB_GRADIENT, DESCENT_GRADIENT, CRUISE_MARGIN_FRACTION, MAX_CRUISE_MARGIN_M } =
  ROUTE_TUNING;

// Returns the envelope altitude in metres MSL at distanceM along a route of totalM metres.
export function computeEnvelopeAltitude(
  distanceM: number,
  totalM: number,
  startMsl: number,
  endMsl: number,
): number {
  const cruiseMsl =
    Math.max(startMsl, endMsl) + Math.min(MAX_CRUISE_MARGIN_M, CRUISE_MARGIN_FRACTION * totalM);
  const climbMsl = startMsl + CLIMB_GRADIENT * distanceM;
  const descentMsl = endMsl + DESCENT_GRADIENT * Math.max(0, totalM - distanceM);
  return Math.min(FLIGHT_TUNING.CEILING_MSL_M, climbMsl, cruiseMsl, descentMsl);
}
