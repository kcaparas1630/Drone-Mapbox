// Wraps each propeller of the drone model in a pivot at its hub, so spinning the pivot turns the blades in place.
import { Box3, Group, type Object3D, Vector3 } from 'three';

// Returns true for the top-most object of a propeller: its name matches and its parent's does not.
function isPropellerRoot(object: Object3D, namePrefix: string): boolean {
  const { parent } = object;
  return (
    parent !== null && object.name.startsWith(namePrefix) && !parent.name.startsWith(namePrefix)
  );
}

// Re-parents each propeller under a hub pivot; vertices stay untouched since its primitives share one buffer.
export function createPropellerPivots(model: Object3D, namePrefix: string): Object3D[] {
  model.updateMatrixWorld(true);
  const roots: Object3D[] = [];
  model.traverse((object) => {
    if (isPropellerRoot(object, namePrefix)) {
      roots.push(object);
    }
  });
  const hubWorld = new Vector3();
  const bounds = new Box3();
  return roots.map((root) => {
    const parent = root.parent ?? model;
    bounds.setFromObject(root).getCenter(hubWorld);
    const pivot = new Group();
    pivot.name = `${root.name}_Pivot`;
    pivot.position.copy(parent.worldToLocal(hubWorld));
    parent.add(pivot);
    pivot.updateMatrixWorld(true);
    pivot.attach(root);
    return pivot;
  });
}
