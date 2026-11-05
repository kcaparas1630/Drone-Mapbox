// Points the three.js camera through Mapbox's matrix at the local metric frame, composed in float64 (ADR 005).
import { type Camera, Matrix4 } from 'three';

import type { SceneOrigin } from './scene-origin';

const scratchMapMatrix = new Matrix4();
const scratchOriginMatrix = new Matrix4();

// Sets projection = mapboxMatrix × translate(origin) × scale(units per metre); the view matrix stays identity.
export function updateLayerCamera(
  camera: Camera,
  mapboxMatrix: number[],
  origin: SceneOrigin,
): void {
  const scale = origin.unitsPerMeter;
  scratchOriginMatrix.set(scale, 0, 0, origin.x, 0, scale, 0, origin.y, 0, 0, scale, 0, 0, 0, 0, 1);
  scratchMapMatrix.fromArray(mapboxMatrix);
  camera.projectionMatrix.multiplyMatrices(scratchMapMatrix, scratchOriginMatrix);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}
