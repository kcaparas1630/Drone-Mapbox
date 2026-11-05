// Applies a chase-camera pose with FreeCameraOptions, reusing one options object per map (no per-frame allocation).
import { type Map as MapboxMap, MercatorCoordinate } from 'mapbox-gl';

import { type MercatorPoint, projectToMercator } from '@/shared/lib/geo';

import type { ChaseCameraPose } from '../lib/compute-chase-camera';

type FreeCameraOptions = ReturnType<MapboxMap['getFreeCameraOptions']>;

const cameraOptionsByMap = new WeakMap<MapboxMap, FreeCameraOptions>();
const scratchMercator: MercatorPoint = { x: 0, y: 0, z: 0 };
const scratchPosition = new MercatorCoordinate(0, 0, 0);
const scratchLookAt = { lng: 0, lat: 0 };

// Returns the map's reusable FreeCameraOptions, creating it on first use.
function getCameraOptions(map: MapboxMap): FreeCameraOptions {
  const existing = cameraOptionsByMap.get(map);
  if (existing !== undefined) {
    return existing;
  }
  const created = map.getFreeCameraOptions();
  cameraOptionsByMap.set(map, created);
  return created;
}

// Positions the map camera at the pose and points it at the drone.
export function applyChaseCamera(map: MapboxMap, pose: ChaseCameraPose): void {
  const cameraOptions = getCameraOptions(map);
  projectToMercator(scratchMercator, pose.lng, pose.lat, pose.altitudeMsl);
  scratchPosition.x = scratchMercator.x;
  scratchPosition.y = scratchMercator.y;
  scratchPosition.z = scratchMercator.z;
  cameraOptions.position = scratchPosition;
  scratchLookAt.lng = pose.lookAtLng;
  scratchLookAt.lat = pose.lookAtLat;
  cameraOptions.lookAtPoint(scratchLookAt, undefined, pose.lookAtAltitudeMsl);
  map.setFreeCameraOptions(cameraOptions);
}
