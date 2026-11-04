// Public API of the drone entity: simulation state, physics, mode machine, snapshot and persistence.
export { clampToBritishColumbia } from './lib/clamp-to-british-columbia';
export { stepFreeFlight } from './lib/step-free-flight';
export { createDroneInput } from './model/drone-input';
export type { DroneInput } from './model/drone-input';
export {
  arrivalDismissed,
  autoRouteStarted,
  destinationReached,
  DRONE_MODES,
  droneInputStarted,
  droneModeSlice,
  routeCancelled,
  selectDroneMode,
} from './model/drone-mode.slice';
export type { DroneMode, DroneModeState } from './model/drone-mode.slice';
export {
  droneSnapshotPublished,
  droneSnapshotSlice,
  selectDroneSnapshot,
} from './model/drone-snapshot.slice';
export type { DroneSnapshot, DroneSnapshotState } from './model/drone-snapshot.slice';
export type { DroneSpawn } from './model/drone-spawn.types';
export { createSimWorld } from './model/sim-world';
export type { SimWorld, SimWorldRoute } from './model/sim-world';
