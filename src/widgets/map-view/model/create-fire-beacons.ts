// Instanced beacon meshes for up to 2000 fires: glowing columns plus pulsing halos (ADR 015).
import {
  AdditiveBlending,
  CylinderGeometry,
  Group,
  InstancedMesh,
  MeshBasicMaterial,
  SphereGeometry,
} from 'three';

import { MAP_STYLE } from '../config/map-style';

export type FireBeacons = {
  group: Group;
  columns: InstancedMesh;
  halos: InstancedMesh;
  notableHalos: InstancedMesh;
  anchorsM: Float64Array;
  renderedVersion: number;
  lastUpdateMs: number;
};

// Creates an instanced mesh with per-instance colours and no instances drawn yet.
function createInstancedMesh(
  geometry: CylinderGeometry | SphereGeometry,
  material: MeshBasicMaterial,
): InstancedMesh {
  const mesh = new InstancedMesh(geometry, material, MAP_STYLE.FIRE_BEACON_CAPACITY);
  mesh.count = 0;
  mesh.frustumCulled = false;
  return mesh;
}

// Returns the beacon meshes: a unit column standing on its base (+Z up) and unit halo spheres.
export function createFireBeacons(): FireBeacons {
  const columnGeometry = new CylinderGeometry(1, 1, 1, 12, 1, true)
    .rotateX(Math.PI / 2)
    .translate(0, 0, 0.5);
  const haloGeometry = new SphereGeometry(1, 16, 12);
  const columnMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const haloOptions = {
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: AdditiveBlending,
  };
  const group = new Group();
  const beacons: FireBeacons = {
    group,
    columns: createInstancedMesh(columnGeometry, columnMaterial),
    halos: createInstancedMesh(haloGeometry, new MeshBasicMaterial(haloOptions)),
    notableHalos: createInstancedMesh(haloGeometry, new MeshBasicMaterial(haloOptions)),
    anchorsM: new Float64Array(MAP_STYLE.FIRE_BEACON_CAPACITY).fill(Number.NaN),
    renderedVersion: -1,
    lastUpdateMs: 0,
  };
  group.add(beacons.columns, beacons.halos, beacons.notableHalos);
  return beacons;
}
