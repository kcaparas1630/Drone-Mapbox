// Chase camera pose behind and above the drone, aimed just ahead of it so the horizon shows (ADR 014, 023, §4).
import { CAMERA_TUNING } from '@/shared/config';
import { computeDestinationPoint, type GeoPoint } from '@/shared/lib/geo';

import { getDefaultElevationRad } from './get-default-elevation-rad';

export type ChaseCameraInput = {
  lng: number;
  lat: number;
  altitudeMsl: number;
  headingRad: number;
  speedRatio: number;
  followDistanceM: number;
  orbitYawRad: number;
  orbitPitchRad: number;
  arrivalAngleRad: number;
};

export type ChaseCameraPose = {
  lng: number;
  lat: number;
  altitudeMsl: number;
  lookAtLng: number;
  lookAtLat: number;
  lookAtAltitudeMsl: number;
};

const {
  FOLLOW_DISTANCE_M,
  FOLLOW_HEIGHT_M,
  LOOK_AHEAD_M,
  MIN_MAPBOX_PITCH_RAD,
  MAX_MAPBOX_PITCH_RAD,
} = CAMERA_TUNING;
const DEFAULT_SLANT_M = Math.hypot(FOLLOW_DISTANCE_M, FOLLOW_HEIGHT_M);
const MIN_ELEVATION_RAD = Math.PI / 2 - MAX_MAPBOX_PITCH_RAD;
const MAX_ELEVATION_RAD = Math.PI / 2 - MIN_MAPBOX_PITCH_RAD;
const MAX_SPEED_PULL_BACK = 6;
const scratchPoint: GeoPoint = { lng: 0, lat: 0 };

// Writes the camera position (behind, above, orbit-rotated) and a look-at point ahead of the drone into out.
export function computeChaseCamera(out: ChaseCameraPose, input: ChaseCameraInput): void {
  const pullBack = 1 + Math.min(MAX_SPEED_PULL_BACK, Math.max(0, input.speedRatio));
  const slantM = DEFAULT_SLANT_M * (input.followDistanceM / FOLLOW_DISTANCE_M) * pullBack;
  const elevationRad = Math.min(
    MAX_ELEVATION_RAD,
    Math.max(MIN_ELEVATION_RAD, getDefaultElevationRad() + input.orbitPitchRad),
  );
  const bearingRad = input.headingRad + Math.PI + input.orbitYawRad + input.arrivalAngleRad;
  computeDestinationPoint(
    scratchPoint,
    input.lng,
    input.lat,
    bearingRad,
    slantM * Math.cos(elevationRad),
  );
  out.lng = scratchPoint.lng;
  out.lat = scratchPoint.lat;
  out.altitudeMsl = input.altitudeMsl + slantM * Math.sin(elevationRad);
  const lookAheadM = LOOK_AHEAD_M * (slantM / DEFAULT_SLANT_M);
  computeDestinationPoint(scratchPoint, input.lng, input.lat, bearingRad + Math.PI, lookAheadM);
  out.lookAtLng = scratchPoint.lng;
  out.lookAtLat = scratchPoint.lat;
  out.lookAtAltitudeMsl = input.altitudeMsl;
}
