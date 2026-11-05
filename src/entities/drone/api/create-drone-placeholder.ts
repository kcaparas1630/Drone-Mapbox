// Wireframe stand-in shown until the GLB arrives, or for good if it fails to load (behaviour §1.5, §10).
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';

import { DRONE_MODEL } from '../config/drone-model';

// Returns a wireframe quadcopter outline sized like the real model (+Y up, +Z forward).
export function createDronePlaceholder(): Group {
  const length = DRONE_MODEL.PLACEHOLDER_LENGTH_M;
  const material = new MeshBasicMaterial({ color: 0xff7a1a, wireframe: true });
  const placeholder = new Group();
  placeholder.name = 'drone-placeholder';
  placeholder.add(new Mesh(new BoxGeometry(length * 0.3, length * 0.15, length * 0.6), material));
  const armGeometry = new BoxGeometry(length, length * 0.04, length * 0.06);
  const frontArm = new Mesh(armGeometry, material);
  frontArm.rotation.y = Math.PI / 4;
  const rearArm = new Mesh(armGeometry, material);
  rearArm.rotation.y = -Math.PI / 4;
  placeholder.add(frontArm, rearArm);
  return placeholder;
}
