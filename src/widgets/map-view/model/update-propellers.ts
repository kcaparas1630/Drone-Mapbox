// Spins the propellers in place, faster with ground speed, purely for looks.
import type { Object3D } from 'three';

import { DRONE_MODEL } from '@/entities/drone';
import { FLIGHT_TUNING } from '@/shared/config';

const MAX_SPIN_STEP_RAD = 1;

// Advances each propeller's rotation about its hub axis by the elapsed time.
export function updatePropellers(propellers: Object3D[], speedMps: number, elapsedS: number): void {
  const speedFraction = Math.min(1, Math.abs(speedMps) / FLIGHT_TUNING.MAX_SPEED_MPS);
  const spinRadPerS =
    DRONE_MODEL.PROPELLER_IDLE_RAD_PER_S +
    speedFraction * (DRONE_MODEL.PROPELLER_MAX_RAD_PER_S - DRONE_MODEL.PROPELLER_IDLE_RAD_PER_S);
  const stepRad = Math.min(MAX_SPIN_STEP_RAD, spinRadPerS * Math.max(0, elapsedS));
  for (let index = 0; index < propellers.length; index += 1) {
    const propeller = propellers[index];
    if (propeller !== undefined) {
      propeller.rotation.y += index % 2 === 0 ? stepRad : -stepRad;
    }
  }
}
