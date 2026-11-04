// Turns the set of held key codes into thrust, yaw, climb and boost using the tunable mapping (behaviour §3.1).
import type { DroneInput } from '@/entities/drone';
import { DRONE_CONTROLS } from '@/shared/config';

// Returns 1 when any of the codes is held, else 0.
function readHeld(pressedCodes: ReadonlySet<string>, codes: readonly string[]): number {
  for (const code of codes) {
    if (pressedCodes.has(code)) {
      return 1;
    }
  }
  return 0;
}

// Writes the keyboard's contribution into out; opposite keys cancel each other.
export function computeKeyboardInput(pressedCodes: ReadonlySet<string>, out: DroneInput): void {
  out.forward =
    readHeld(pressedCodes, DRONE_CONTROLS.FORWARD) -
    readHeld(pressedCodes, DRONE_CONTROLS.BACKWARD);
  out.yaw =
    readHeld(pressedCodes, DRONE_CONTROLS.YAW_RIGHT) -
    readHeld(pressedCodes, DRONE_CONTROLS.YAW_LEFT);
  out.vertical =
    readHeld(pressedCodes, DRONE_CONTROLS.CLIMB) - readHeld(pressedCodes, DRONE_CONTROLS.DESCEND);
  out.isBoosting = readHeld(pressedCodes, DRONE_CONTROLS.BOOST) === 1;
}
