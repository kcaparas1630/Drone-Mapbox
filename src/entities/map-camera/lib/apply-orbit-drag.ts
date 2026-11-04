// Turns a drag delta into a clamped orbit offset: yaw ±90°, Mapbox pitch 30–75° (behaviour §3.1).
import { CAMERA_TUNING } from '@/shared/config';

import type { OrbitState } from '../model/orbit-state';
import { getDefaultElevationRad } from './get-default-elevation-rad';

const MIN_ELEVATION_RAD = Math.PI / 2 - CAMERA_TUNING.MAX_MAPBOX_PITCH_RAD;
const MAX_ELEVATION_RAD = Math.PI / 2 - CAMERA_TUNING.MIN_MAPBOX_PITCH_RAD;

// Adds a pointer drag (in pixels) to the orbit and clamps it to the allowed range.
export function applyOrbitDrag(orbit: OrbitState, deltaXPx: number, deltaYPx: number): void {
  const defaultElevationRad = getDefaultElevationRad();
  const yawLimitRad = CAMERA_TUNING.ORBIT_YAW_LIMIT_RAD;
  const nextYawRad = orbit.yawRad - deltaXPx * CAMERA_TUNING.ORBIT_RAD_PER_PIXEL;
  const nextPitchRad = orbit.pitchRad + deltaYPx * CAMERA_TUNING.ORBIT_RAD_PER_PIXEL;
  orbit.yawRad = Math.min(yawLimitRad, Math.max(-yawLimitRad, nextYawRad));
  orbit.pitchRad = Math.min(
    MAX_ELEVATION_RAD - defaultElevationRad,
    Math.max(MIN_ELEVATION_RAD - defaultElevationRad, nextPitchRad),
  );
}
