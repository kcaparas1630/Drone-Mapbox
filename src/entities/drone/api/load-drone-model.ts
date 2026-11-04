// Loads the owner's drone GLB and re-centres each propeller on its own hub so it can spin in place.
import { Box3, type Group, type Mesh, type Object3D, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRONE_MODEL } from '../config/drone-model';

export type LoadDroneModelResult = { model: Group; propellers: Object3D[] };

// Returns true for the propeller meshes of the owner's model.
function isPropeller(object: Object3D): object is Mesh {
  return object.name.startsWith(DRONE_MODEL.PROPELLER_NAME_PREFIX) && 'geometry' in object;
}

// Moves a propeller's geometry so its hub is the node origin, keeping it in the same place.
function translatePropellerToHub(propeller: Mesh): void {
  const centre = new Box3().setFromObject(propeller).getCenter(new Vector3());
  propeller.geometry.translate(-centre.x, -centre.y, -centre.z);
  propeller.position.add(centre);
}

// Fetches and parses the GLB, returning its scene and the propellers ready to spin.
export async function loadDroneModel(url: string = DRONE_MODEL.URL): Promise<LoadDroneModelResult> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const propellers: Object3D[] = [];
  gltf.scene.traverse((object) => {
    if (isPropeller(object)) {
      translatePropellerToHub(object);
      propellers.push(object);
    }
  });
  return { model: gltf.scene, propellers };
}
