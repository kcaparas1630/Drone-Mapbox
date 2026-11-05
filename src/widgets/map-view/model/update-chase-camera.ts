// Moves the map camera behind the drone each frame: orbit easing, arrival orbit, terrain clearance (ADR 014).
import { applyChaseCamera, computeChaseCamera, easeOrbitOffset } from '@/entities/map-camera';
import { sampleTerrainElevation } from '@/entities/terrain';
import { clearCameraResetRequest } from '@/features/control-drone';
import { CAMERA_TUNING, FLIGHT_TUNING } from '@/shared/config';
import { normalizeAngle } from '@/shared/lib/geo';

import type { FrameLoopContext } from './frame-loop-context';

const ARRIVAL_ANGLE_RELEASE_PER_S = 3;

// Computes and applies the chase-camera pose for this frame.
export function updateChaseCamera(
  context: FrameLoopContext,
  dtS: number,
  followDistanceM: number,
  isArrived: boolean,
): void {
  const { map, world, orbit, cameraInput, cameraPose, flags } = context;
  if (clearCameraResetRequest()) {
    orbit.yawRad = 0;
    orbit.pitchRad = 0;
  }
  easeOrbitOffset(orbit, dtS, flags.isReducedMotion);
  orbit.arrivalAngleRad =
    isArrived && !flags.isReducedMotion
      ? normalizeAngle(orbit.arrivalAngleRad + CAMERA_TUNING.ARRIVAL_ORBIT_RAD_PER_S * dtS)
      : normalizeAngle(orbit.arrivalAngleRad) * Math.exp(-ARRIVAL_ANGLE_RELEASE_PER_S * dtS);
  cameraInput.lng = world.lng;
  cameraInput.lat = world.lat;
  cameraInput.altitudeMsl = world.altitudeMsl;
  cameraInput.headingRad = world.headingRad;
  cameraInput.speedRatio = Math.abs(world.speedMps) / FLIGHT_TUNING.MAX_SPEED_MPS;
  cameraInput.followDistanceM = followDistanceM;
  cameraInput.orbitYawRad = orbit.yawRad;
  cameraInput.orbitPitchRad = orbit.pitchRad;
  cameraInput.arrivalAngleRad = orbit.arrivalAngleRad;
  computeChaseCamera(cameraPose, cameraInput);
  const terrainM = sampleTerrainElevation(map, cameraPose.lng, cameraPose.lat);
  if (terrainM !== null && cameraPose.altitudeMsl < terrainM + CAMERA_TUNING.MIN_CAMERA_AGL_M) {
    cameraPose.altitudeMsl = terrainM + CAMERA_TUNING.MIN_CAMERA_AGL_M;
  }
  applyChaseCamera(map, cameraPose);
}
