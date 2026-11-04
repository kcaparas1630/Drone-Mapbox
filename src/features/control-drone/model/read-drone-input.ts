// Combines keyboard and touch into the input the loop reads each fixed step, without allocating.
import type { DroneInput } from '@/entities/drone';

import { computeKeyboardInput } from '../lib/compute-keyboard-input';
import { droneInputSource } from './drone-input-source';

// Clamps a combined axis to -1..1.
function clampAxis(value: number): number {
  return Math.min(1, Math.max(-1, value));
}

// Writes keyboard plus touch input into out.
export function readDroneInput(out: DroneInput): void {
  computeKeyboardInput(droneInputSource.pressedCodes, out);
  const { touch } = droneInputSource;
  out.forward = clampAxis(out.forward + touch.forward);
  out.yaw = clampAxis(out.yaw + touch.yaw);
  out.vertical = clampAxis(out.vertical + touch.vertical);
  out.isBoosting = out.isBoosting || touch.isBoosting;
}
