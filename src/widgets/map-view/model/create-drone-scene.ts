// Builds the layer's three.js scene: lights and a drone root that starts with the wireframe placeholder.
import { DirectionalLight, Group, HemisphereLight, Scene } from 'three';

import { createDronePlaceholder } from '@/entities/drone';

export type CreateDroneSceneResult = { scene: Scene; droneRoot: Group; placeholder: Group };

// Returns the scene graph; the drone root's matrix is written by hand every frame.
export function createDroneScene(): CreateDroneSceneResult {
  const scene = new Scene();
  const droneRoot = new Group();
  droneRoot.matrixAutoUpdate = false;
  const placeholder = createDronePlaceholder();
  droneRoot.add(placeholder);
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.position.set(1, -1, 2);
  scene.add(droneRoot, new HemisphereLight(0xffffff, 0x445566, 2.2), sun);
  return { scene, droneRoot, placeholder };
}
