// Loads the owner's flame GLB and returns its two meshes' geometry turned +Z up for the map frame (ADR 023).
import type { BufferGeometry, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { FIRE_MODEL } from '../config/fire-model';

export type FireModelGeometry = { inner: BufferGeometry; outer: BufferGeometry };

// Returns the named mesh's geometry, rotated from the model's +Y up to the map's +Z up.
function readMeshGeometry(scene: { getObjectByName: (name: string) => unknown }, name: string) {
  const mesh = scene.getObjectByName(name) as Mesh | undefined;
  if (mesh?.geometry === undefined) {
    throw new Error(`fire.glb has no mesh named ${name}`);
  }
  return mesh.geometry.clone().rotateX(Math.PI / 2);
}

// Fetches and parses the GLB, returning the inner core and outer flame geometry.
export async function loadFireModel(url: string = FIRE_MODEL.URL): Promise<FireModelGeometry> {
  const gltf = await new GLTFLoader().loadAsync(url);
  return {
    inner: readMeshGeometry(gltf.scene, FIRE_MODEL.INNER_MESH_NAME),
    outer: readMeshGeometry(gltf.scene, FIRE_MODEL.OUTER_MESH_NAME),
  };
}
