// Ground-speed response for free flight: thrust, braking, reverse, boost and drag (behaviour §3.3).
import { FLIGHT_TUNING } from '@/shared/config';

const {
  MAX_SPEED_MPS,
  BOOST_MULTIPLIER,
  REVERSE_SPEED_FACTOR,
  ACCELERATION_MPS2,
  BRAKE_DECELERATION_MPS2,
  DRAG_TIME_CONSTANT_S,
  STOP_SPEED_MPS,
} = FLIGHT_TUNING;

// Returns the signed forward speed after one step of the given thrust input (-1..1) and boost state.
export function stepFreeFlightSpeed(
  speedMps: number,
  forwardInput: number,
  isBoosting: boolean,
  dtS: number,
): number {
  const boost = isBoosting ? BOOST_MULTIPLIER : 1;
  const maxForwardMps = MAX_SPEED_MPS * boost;
  const isBraking = (forwardInput > 0 && speedMps < 0) || (forwardInput < 0 && speedMps > 0);
  if (isBraking) {
    const braked = Math.abs(speedMps) - BRAKE_DECELERATION_MPS2 * boost * dtS;
    return Math.sign(speedMps) * Math.max(0, braked);
  }
  if (forwardInput !== 0) {
    const limitMps = forwardInput > 0 ? maxForwardMps : maxForwardMps * REVERSE_SPEED_FACTOR;
    const targetMps = forwardInput * limitMps;
    if (Math.abs(speedMps) > Math.abs(targetMps)) {
      return applyDrag(speedMps, Math.abs(targetMps), dtS);
    }
    const accelerated = speedMps + Math.sign(targetMps) * ACCELERATION_MPS2 * boost * dtS;
    return Math.abs(accelerated) > Math.abs(targetMps) ? targetMps : accelerated;
  }
  return applyDrag(speedMps, 0, dtS);
}

// Decays speed exponentially toward a floor magnitude and snaps tiny speeds to zero.
function applyDrag(speedMps: number, floorMps: number, dtS: number): number {
  const decayed = speedMps * Math.exp(-dtS / DRAG_TIME_CONSTANT_S);
  const magnitude = Math.max(floorMps, Math.abs(decayed));
  if (magnitude < STOP_SPEED_MPS) {
    return 0;
  }
  return Math.sign(speedMps) * Math.min(Math.abs(speedMps), magnitude);
}
