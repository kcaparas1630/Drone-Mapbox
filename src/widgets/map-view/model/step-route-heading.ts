// Turns the drone toward the path bearing at up to 180°/s with a visible bank; short routes just face it (§6.1).
import type { SimWorld } from '@/entities/drone';
import { FLIGHT_TUNING } from '@/shared/config';
import { normalizeAngle } from '@/shared/lib/geo';

const FULL_TURN_RAD = 2 * Math.PI;

// Rotates the heading toward pathBearingRad within the turn-rate limit and eases the render-only bank.
export function stepRouteHeading(world: SimWorld, pathBearingRad: number, dtS: number): void {
  if (world.route.distanceM < FLIGHT_TUNING.SHORT_ROUTE_M) {
    world.headingRad = ((pathBearingRad % FULL_TURN_RAD) + FULL_TURN_RAD) % FULL_TURN_RAD;
    world.bankRad = 0;
    return;
  }
  const maxTurnRad = FLIGHT_TUNING.ROUTE_TURN_RATE_RAD_PER_S * dtS;
  const errorRad = normalizeAngle(pathBearingRad - world.headingRad);
  const turnRad = Math.min(maxTurnRad, Math.max(-maxTurnRad, errorRad));
  world.headingRad =
    (((world.headingRad + turnRad) % FULL_TURN_RAD) + FULL_TURN_RAD) % FULL_TURN_RAD;
  const targetBankRad = (turnRad / maxTurnRad) * FLIGHT_TUNING.MAX_BANK_RAD;
  world.bankRad +=
    (targetBankRad - world.bankRad) * Math.min(1, FLIGHT_TUNING.BANK_RESPONSE_PER_S * dtS);
}
