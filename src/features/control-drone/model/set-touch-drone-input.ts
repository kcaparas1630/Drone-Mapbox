// Lets the touch joystick, slider and boost button feed the same input the keyboard does (behaviour §3.2).
import { droneInputSource } from './drone-input-source';

export type TouchDroneInput = Partial<{
  forward: number;
  yaw: number;
  vertical: number;
  isBoosting: boolean;
}>;

// Updates the given touch axes, clamped to -1..1.
export function setTouchDroneInput(input: TouchDroneInput): void {
  const { touch } = droneInputSource;
  if (input.forward !== undefined) {
    touch.forward = Math.min(1, Math.max(-1, input.forward));
  }
  if (input.yaw !== undefined) {
    touch.yaw = Math.min(1, Math.max(-1, input.yaw));
  }
  if (input.vertical !== undefined) {
    touch.vertical = Math.min(1, Math.max(-1, input.vertical));
  }
  if (input.isBoosting !== undefined) {
    touch.isBoosting = input.isBoosting;
  }
}
