// Hands the R-key camera reset to the frame loop exactly once by clearing it as it is read.
import { droneInputSource } from './drone-input-source';

// Returns true once after R was pressed, then false until it is pressed again.
export function clearCameraResetRequest(): boolean {
  const isRequested = droneInputSource.isCameraResetRequested;
  droneInputSource.isCameraResetRequested = false;
  return isRequested;
}
