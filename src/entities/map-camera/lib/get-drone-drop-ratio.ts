// How far below the centre of view the default chase camera draws the drone, as a share of the view height (§4).
import { CAMERA_TUNING } from '@/shared/config';

import { getDefaultElevationRad } from './get-default-elevation-rad';

const { FOLLOW_DISTANCE_M, FOLLOW_HEIGHT_M, LOOK_AHEAD_M, MAPBOX_VERTICAL_FOV_RAD } = CAMERA_TUNING;
const AIM_DEPRESSION_RAD = Math.atan2(FOLLOW_HEIGHT_M, FOLLOW_DISTANCE_M + LOOK_AHEAD_M);
const DRONE_DROP_RATIO =
  (0.5 * Math.tan(getDefaultElevationRad() - AIM_DEPRESSION_RAD)) /
  Math.tan(MAPBOX_VERTICAL_FOV_RAD / 2);

// Returns the drone's offset below the centre of view divided by the view height; speed pull-back keeps it constant.
export function getDroneDropRatio(): number {
  return DRONE_DROP_RATIO;
}
