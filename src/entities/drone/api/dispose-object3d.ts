// Frees the GPU resources of a three.js subtree: geometries, materials and their textures (convention 007).
import type { Material, Object3D, Texture } from 'three';

// Disposes every texture referenced by a material's properties, then the material.
function disposeMaterial(material: Material): void {
  for (const value of Object.values(material)) {
    if (typeof value === 'object' && value !== null && 'isTexture' in value) {
      (value as Texture).dispose();
    }
  }
  material.dispose();
}

// Walks the subtree and disposes everything it owns on the GPU.
export function disposeObject3d(root: Object3D): void {
  root.traverse((object) => {
    if ('geometry' in object && typeof object.geometry === 'object' && object.geometry !== null) {
      (object.geometry as { dispose: () => void }).dispose();
    }
    if ('material' in object) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials as Material[]) {
        disposeMaterial(material);
      }
    }
  });
}
