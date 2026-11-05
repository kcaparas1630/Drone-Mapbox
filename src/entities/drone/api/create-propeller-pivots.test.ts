// Tests that propellers spin around their own hubs, multi-material propellers included, without moving vertices.
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  type Object3D,
  Vector3,
} from 'three';
import { describe, expect, it } from 'vitest';

import { createPropellerPivots } from './create-propeller-pivots';

const HUB = new Vector3(1, 0.5, -2);

// Returns a blade along x centred on the hub, its vertices baked in model space like the owner's GLB.
function createBladePositions(): BufferAttribute {
  const vertices = [-0.5, 0, -0.05, 0.5, 0, -0.05, 0.5, 0, 0.05, -0.5, 0, 0.05].map(
    (value, index) => value + HUB.getComponent(index % 3),
  );
  return new BufferAttribute(new Float32Array(vertices), 3);
}

// Returns a mesh drawing part of the shared blade buffer, as GLTFLoader does for one primitive.
function createPrimitive(name: string, positions: BufferAttribute, indices: number[]): Mesh {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  geometry.setIndex(indices);
  const mesh = new Mesh(geometry, new MeshBasicMaterial());
  mesh.name = name;
  return mesh;
}

// Returns a drone whose one propeller is a group of two primitives sharing a position buffer.
function createMultiMaterialDrone() {
  const positions = createBladePositions();
  const propeller = new Group();
  propeller.name = 'Propeller_FrontLeft';
  propeller.add(createPrimitive('Propeller_FrontLeft_1', positions, [0, 1, 2]));
  propeller.add(createPrimitive('Propeller_FrontLeft_2', positions, [0, 2, 3]));
  const drone = new Group();
  drone.name = 'Drone';
  drone.add(propeller);
  return { drone, positions };
}

// Returns the world-space centre of an object.
function readCentre(object: Object3D): Vector3 {
  object.updateMatrixWorld(true);
  return new Box3().setFromObject(object).getCenter(new Vector3());
}

describe('createPropellerPivots', () => {
  it('makes one pivot per propeller, not one per material', () => {
    const { drone } = createMultiMaterialDrone();
    expect(createPropellerPivots(drone, 'Propeller_')).toHaveLength(1);
  });

  it('places the pivot at the hub and keeps the blade where it was', () => {
    const { drone } = createMultiMaterialDrone();
    const [pivot] = createPropellerPivots(drone, 'Propeller_');
    expect(pivot?.position.distanceTo(HUB)).toBeLessThan(1e-6);
    expect(readCentre(drone).distanceTo(HUB)).toBeLessThan(1e-6);
  });

  it('keeps the blade on its hub while spinning', () => {
    const { drone } = createMultiMaterialDrone();
    const [pivot] = createPropellerPivots(drone, 'Propeller_');
    if (pivot === undefined) {
      throw new Error('expected a pivot');
    }
    pivot.rotation.y = Math.PI / 3;
    expect(readCentre(drone).distanceTo(HUB)).toBeLessThan(1e-6);
  });

  it('never rewrites the shared vertex buffer', () => {
    const { drone, positions } = createMultiMaterialDrone();
    const before = Array.from(positions.array);
    createPropellerPivots(drone, 'Propeller_');
    expect(Array.from(positions.array)).toEqual(before);
  });

  it('handles a single-mesh propeller under a scaled, moved model', () => {
    const drone = new Group();
    drone.scale.setScalar(10);
    drone.position.set(5, 0, 5);
    drone.add(createPrimitive('Propeller_RearRight', createBladePositions(), [0, 1, 2, 0, 2, 3]));
    const [pivot] = createPropellerPivots(drone, 'Propeller_');
    expect(pivot?.position.distanceTo(HUB)).toBeLessThan(1e-5);
  });
});
