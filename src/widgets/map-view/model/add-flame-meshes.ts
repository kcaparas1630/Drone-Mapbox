// Builds the flame meshes from fire.glb: a core, a translucent outer flame and a ghost seen through terrain (023).
import { type BufferGeometry, InstancedMesh, MeshBasicMaterial } from 'three';

import type { FireModelGeometry } from '@/entities/fire';

import { MAP_STYLE } from '../config/map-style';
import type { FireFlames } from './create-fire-flames';

const GHOST_OPACITY = 0.45;
const GHOST_RENDER_ORDER = -1;

// Creates an instanced mesh with per-instance tint and no instances drawn yet.
function createFlameMesh(geometry: BufferGeometry, material: MeshBasicMaterial): InstancedMesh {
  const mesh = new InstancedMesh(geometry, material, MAP_STYLE.FIRE_FLAME_CAPACITY);
  mesh.count = 0;
  mesh.frustumCulled = false;
  return mesh;
}

// Adds the flame meshes, unlit with vertex colours; the ghost ignores depth so ridges never hide a fire.
export function addFlameMeshes(flames: FireFlames, geometry: FireModelGeometry): void {
  const outerMaterial = new MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  flames.inner = createFlameMesh(geometry.inner, new MeshBasicMaterial({ vertexColors: true }));
  flames.outer = createFlameMesh(geometry.outer, outerMaterial);
  const ghostMaterial = new MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: GHOST_OPACITY,
    depthTest: false,
    depthWrite: false,
  });
  flames.ghost = createFlameMesh(geometry.outer, ghostMaterial);
  flames.ghost.renderOrder = GHOST_RENDER_ORDER;
  flames.group.add(flames.ghost, flames.inner, flames.outer);
  flames.renderedVersion = -1;
}
