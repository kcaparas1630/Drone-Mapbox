// Re-places every beacon in the local frame: terrain anchor, size from hectares and distance, status colour.
import type { Map as MapboxMap } from 'mapbox-gl';
import { Color, type InstancedMesh, Matrix4 } from 'three';

import type { SimWorld } from '@/entities/drone';
import {
  type BeaconSize,
  computeBeaconSize,
  FIRE_STATUS_PALETTE,
  type Fire,
  type FireStatus,
} from '@/entities/fire';
import { sampleTerrainElevation } from '@/entities/terrain';
import {
  computeHaversineDistance,
  computeMercatorUnitsPerMeter,
  type MercatorPoint,
  projectToMercator,
} from '@/shared/lib/geo';

import { MAP_STYLE } from '../config/map-style';
import type { FireBeacons } from './create-fire-beacons';
import type { SceneOrigin } from './scene-origin';

const STATUS_COLORS = new Map<FireStatus, Color>(
  (Object.keys(FIRE_STATUS_PALETTE) as FireStatus[]).map((status) => [
    status,
    new Color(FIRE_STATUS_PALETTE[status]),
  ]),
);
const FALLBACK_COLOR = new Color('#9CA3AF');
const HALO_RADIUS_FACTOR = 2.5;
const NOTABLE_HALO_FACTOR = 1.6;
const scratchMatrix = new Matrix4();
const scratchMercator: MercatorPoint = { x: 0, y: 0, z: 0 };
const scratchSize: BeaconSize = { heightM: 0, widthM: 0 };

// Writes one beacon's column and halo matrices and colours; returns 1 when it used a notable halo slot.
function setBeaconInstance(
  beacons: FireBeacons,
  fire: Fire,
  index: number,
  notableIndex: number,
  origin: SceneOrigin,
  world: SimWorld,
): number {
  const anchorM = beacons.anchorsM[index] ?? Number.NaN;
  projectToMercator(scratchMercator, fire.lng, fire.lat, Number.isNaN(anchorM) ? 0 : anchorM);
  computeBeaconSize(
    scratchSize,
    fire.sizeHa,
    computeHaversineDistance(world.lng, world.lat, fire.lng, fire.lat),
  );
  const scale = computeMercatorUnitsPerMeter(fire.lat) / origin.unitsPerMeter;
  const x = (scratchMercator.x - origin.x) / origin.unitsPerMeter;
  const y = (scratchMercator.y - origin.y) / origin.unitsPerMeter;
  const z = scratchMercator.z / origin.unitsPerMeter;
  const width = scratchSize.widthM * scale;
  const height = scratchSize.heightM * scale;
  const color = STATUS_COLORS.get(fire.status) ?? FALLBACK_COLOR;
  beacons.columns.setMatrixAt(
    index,
    scratchMatrix.makeScale(width, width, height).setPosition(x, y, z),
  );
  beacons.columns.setColorAt(index, color);
  const haloMesh = fire.isFireOfNote ? beacons.notableHalos : beacons.halos;
  const haloIndex = fire.isFireOfNote ? notableIndex : index - notableIndex;
  const haloRadius = width * HALO_RADIUS_FACTOR * (fire.isFireOfNote ? NOTABLE_HALO_FACTOR : 1);
  haloMesh.setMatrixAt(
    haloIndex,
    scratchMatrix.makeScale(haloRadius, haloRadius, haloRadius).setPosition(x, y, z + height),
  );
  haloMesh.setColorAt(haloIndex, color);
  return fire.isFireOfNote ? 1 : 0;
}

// Flags an instanced mesh so three.js uploads its matrices and colours.
function setInstancesNeedUpdate(mesh: InstancedMesh): void {
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor !== null) {
    mesh.instanceColor.needsUpdate = true;
  }
}

// Anchors unanchored fires on loaded terrain, then rewrites all instance matrices; never allocates.
export function updateFireBeacons(
  beacons: FireBeacons,
  fires: readonly Fire[],
  world: SimWorld,
  origin: SceneOrigin,
  map: MapboxMap,
): void {
  const count = Math.min(fires.length, MAP_STYLE.FIRE_BEACON_CAPACITY);
  let notableCount = 0;
  for (let index = 0; index < count; index += 1) {
    const fire = fires[index];
    if (fire === undefined) {
      continue;
    }
    if (Number.isNaN(beacons.anchorsM[index] ?? Number.NaN)) {
      beacons.anchorsM[index] = sampleTerrainElevation(map, fire.lng, fire.lat) ?? Number.NaN;
    }
    notableCount += setBeaconInstance(beacons, fire, index, notableCount, origin, world);
  }
  beacons.columns.count = count;
  beacons.halos.count = count - notableCount;
  beacons.notableHalos.count = notableCount;
  setInstancesNeedUpdate(beacons.columns);
  setInstancesNeedUpdate(beacons.halos);
  setInstancesNeedUpdate(beacons.notableHalos);
}
