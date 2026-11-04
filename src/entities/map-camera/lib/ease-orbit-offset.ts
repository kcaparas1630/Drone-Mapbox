// Eases a released orbit back behind the drone over ~1.5 s; reduced motion snaps it back (behaviour §3.1, §4).
import { CAMERA_TUNING } from '@/shared/config';

import type { OrbitState } from '../model/orbit-state';

const EASE_RATE_PER_S = 5 / CAMERA_TUNING.ORBIT_EASE_BACK_S;
const SNAP_THRESHOLD_RAD = 0.001;

// Decays the yaw and pitch offsets toward zero unless the user is still dragging.
export function easeOrbitOffset(orbit: OrbitState, dtS: number, isReducedMotion: boolean): void {
  if (orbit.isDragging) {
    return;
  }
  const keptFraction = isReducedMotion ? 0 : Math.exp(-EASE_RATE_PER_S * dtS);
  orbit.yawRad = Math.abs(orbit.yawRad) < SNAP_THRESHOLD_RAD ? 0 : orbit.yawRad * keptFraction;
  orbit.pitchRad =
    Math.abs(orbit.pitchRad) < SNAP_THRESHOLD_RAD ? 0 : orbit.pitchRad * keptFraction;
}
