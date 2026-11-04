// Camera elevation angle of the default chase position: 25 m up over 60 m back (behaviour §4).
import { CAMERA_TUNING } from '@/shared/config';

const DEFAULT_ELEVATION_RAD = Math.atan2(
  CAMERA_TUNING.FOLLOW_HEIGHT_M,
  CAMERA_TUNING.FOLLOW_DISTANCE_M,
);

// Returns the default elevation of the camera above the drone's horizon, in radians.
export function getDefaultElevationRad(): number {
  return DEFAULT_ELEVATION_RAD;
}
