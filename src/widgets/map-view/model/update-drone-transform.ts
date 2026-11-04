// Places the drone mesh in the local metric frame: position, heading, render-only bank and display scale.
import { Matrix4, type Object3D, Vector3 } from 'three';

import { DRONE_MODEL, type SimWorld } from '@/entities/drone';
import {
  computeHeadingVector,
  computeMercatorUnitsPerMeter,
  type HeadingVector,
  type MercatorPoint,
  projectToMercator,
} from '@/shared/lib/geo';

import type { SceneOrigin } from './scene-origin';

const scratchMercator: MercatorPoint = { x: 0, y: 0, z: 0 };
const scratchHeading: HeadingVector = { east: 0, north: 1 };
const scratchLeft = new Vector3();
const scratchUp = new Vector3();
const scratchForward = new Vector3();
const scratchBank = new Matrix4();

// Writes the drone's matrix: model +X left, +Y up, +Z forward mapped onto mercator east/south/up axes.
export function updateDroneTransform(drone: Object3D, world: SimWorld, origin: SceneOrigin): void {
  projectToMercator(scratchMercator, world.lng, world.lat, world.altitudeMsl);
  computeHeadingVector(scratchHeading, world.headingRad + DRONE_MODEL.YAW_OFFSET_RAD);
  const { east, north } = scratchHeading;
  const scale =
    (DRONE_MODEL.DISPLAY_SCALE * computeMercatorUnitsPerMeter(world.lat)) / origin.unitsPerMeter;
  scratchLeft.set(-north, -east, 0).multiplyScalar(scale);
  scratchUp.set(0, 0, scale);
  scratchForward.set(east, -north, 0).multiplyScalar(scale);
  drone.matrix.makeBasis(scratchLeft, scratchUp, scratchForward);
  drone.matrix.setPosition(
    (scratchMercator.x - origin.x) / origin.unitsPerMeter,
    (scratchMercator.y - origin.y) / origin.unitsPerMeter,
    scratchMercator.z / origin.unitsPerMeter,
  );
  drone.matrix.multiply(scratchBank.makeRotationZ(world.bankRad));
  drone.matrixWorldNeedsUpdate = true;
}
