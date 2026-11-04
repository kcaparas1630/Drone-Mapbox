// Releases every held key and touch control, e.g. when the window loses focus (behaviour §10).
import { droneInputSource } from './drone-input-source';

// Clears held keys and zeroes the touch controls.
export function clearDroneInput(): void {
  droneInputSource.pressedCodes.clear();
  droneInputSource.touch.forward = 0;
  droneInputSource.touch.yaw = 0;
  droneInputSource.touch.vertical = 0;
  droneInputSource.touch.isBoosting = false;
}
