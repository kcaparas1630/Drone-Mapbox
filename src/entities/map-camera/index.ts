// Public API of the map-camera entity: chase-camera maths, orbit handling, follow-distance prefs.
export { applyChaseCamera } from './api/apply-chase-camera';
export { applyOrbitDrag } from './lib/apply-orbit-drag';
export { computeChaseCamera } from './lib/compute-chase-camera';
export type { ChaseCameraInput, ChaseCameraPose } from './lib/compute-chase-camera';
export { easeOrbitOffset } from './lib/ease-orbit-offset';
export { getDroneDropRatio } from './lib/get-drone-drop-ratio';
export {
  cameraPrefsSlice,
  followDistanceChanged,
  selectFollowDistanceM,
} from './model/camera-prefs.slice';
export type { CameraPrefsState } from './model/camera-prefs.slice';
export { createOrbitState } from './model/orbit-state';
export type { OrbitState } from './model/orbit-state';
