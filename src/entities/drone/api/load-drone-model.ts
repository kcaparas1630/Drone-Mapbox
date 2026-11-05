// Loads the owner's drone GLB and gives each propeller a pivot at its hub so it can spin in place.
import type { Group, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRONE_MODEL } from '../config/drone-model';
import { createPropellerPivots } from './create-propeller-pivots';

export type LoadDroneModelResult = { model: Group; propellers: Object3D[] };

// Fetches and parses the GLB, returning its scene and the propeller pivots ready to spin.
export async function loadDroneModel(url: string = DRONE_MODEL.URL): Promise<LoadDroneModelResult> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const propellers = createPropellerPivots(gltf.scene, DRONE_MODEL.PROPELLER_NAME_PREFIX);
  return { model: gltf.scene, propellers };
}
