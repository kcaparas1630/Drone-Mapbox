// Everything the frame loop touches, allocated once so per-frame code only mutates (ADR 001, convention 007).
import type { Map as MapboxMap } from 'mapbox-gl';

import type { SimWorld } from '@/entities/drone';
import type { Fire } from '@/entities/fire';
import {
  type ChaseCameraInput,
  type ChaseCameraPose,
  createOrbitState,
  type OrbitState,
} from '@/entities/map-camera';
import type { RouteProgressPoint } from '@/entities/route';
import { createTerrainFollowState, type TerrainFollowState } from '@/entities/terrain';

export type FrameLoopContext = {
  map: MapboxMap;
  world: SimWorld;
  store: AppStore;
  orbit: OrbitState;
  cameraInput: ChaseCameraInput;
  cameraPose: ChaseCameraPose;
  terrainFollow: TerrainFollowState;
  routeProgress: RouteProgressPoint;
  fireBeacons: { fires: readonly Fire[]; version: number };
  flags: { isReducedMotion: boolean; isReducedDetail: boolean; isContextLost: boolean };
};

// Returns a context for one map and world with every scratch buffer preallocated.
export function createFrameLoopContext(
  map: MapboxMap,
  world: SimWorld,
  store: AppStore,
): FrameLoopContext {
  return {
    map,
    world,
    store,
    orbit: createOrbitState(),
    cameraInput: {
      lng: world.lng,
      lat: world.lat,
      altitudeMsl: world.altitudeMsl,
      headingRad: world.headingRad,
      speedRatio: 0,
      followDistanceM: store.getState().cameraPrefs.followDistanceM,
      orbitYawRad: 0,
      orbitPitchRad: 0,
      arrivalAngleRad: 0,
    },
    cameraPose: {
      lng: 0,
      lat: 0,
      altitudeMsl: 0,
      lookAtLng: 0,
      lookAtLat: 0,
      lookAtAltitudeMsl: 0,
    },
    terrainFollow: createTerrainFollowState(),
    routeProgress: { lng: 0, lat: 0, pathBearingRad: 0, remainingM: 0, isComplete: false },
    fireBeacons: { fires: [], version: 0 },
    flags: { isReducedMotion: false, isReducedDetail: false, isContextLost: false },
  };
}
