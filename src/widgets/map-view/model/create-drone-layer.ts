// The one Mapbox custom layer: a three.js scene sharing Mapbox's WebGL context, drawing the drone (ADR 005).
import type { CustomLayerInterface, Map as MapboxMap } from 'mapbox-gl';
import { Camera, type Group, type Object3D, WebGLRenderer } from 'three';

import { disposeObject3d, loadDroneModel, type SimWorld } from '@/entities/drone';
import { reportError } from '@/shared/lib/report-error';

import { MAP_STYLE } from '../config/map-style';
import { createDroneScene } from './create-drone-scene';
import { createSceneOrigin } from './scene-origin';
import { updateDroneTransform } from './update-drone-transform';
import { updateLayerCamera } from './update-layer-camera';
import { updatePropellers } from './update-propellers';
import { updateSceneOrigin } from './update-scene-origin';

// Swaps the placeholder for the loaded GLB unless the layer was removed meanwhile.
function loadDroneModelIntoLayer(
  map: MapboxMap,
  droneRoot: Group,
  placeholder: Group,
  propellers: Object3D[],
  isRemoved: () => boolean,
): void {
  loadDroneModel()
    .then(({ model, propellers: loadedPropellers }) => {
      if (isRemoved()) {
        disposeObject3d(model);
        return;
      }
      model.traverse((object) => {
        object.frustumCulled = false;
      });
      droneRoot.remove(placeholder);
      disposeObject3d(placeholder);
      droneRoot.add(model);
      propellers.push(...loadedPropellers);
      map.triggerRepaint();
    })
    .catch((error: unknown) => {
      reportError(error, 'drone model (keeping the wireframe placeholder)');
    });
}

// Builds the layer for a simulation world; render() reads the world each frame and never allocates.
export function createDroneLayer(world: SimWorld): CustomLayerInterface {
  const origin = createSceneOrigin(world.lng, world.lat);
  const { scene, droneRoot, placeholder } = createDroneScene();
  const camera = new Camera();
  const propellers: Object3D[] = [];
  let renderer: WebGLRenderer | null = null;
  let isRemoved = false;
  let lastRenderMs = performance.now();
  return {
    id: MAP_STYLE.DRONE_LAYER_ID,
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, glContext) {
      renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: glContext,
        antialias: true,
      });
      renderer.autoClear = false;
      loadDroneModelIntoLayer(map, droneRoot, placeholder, propellers, () => isRemoved);
    },
    render(_glContext, matrix) {
      if (renderer === null) {
        return;
      }
      const nowMs = performance.now();
      updateSceneOrigin(origin, world.lng, world.lat);
      updateDroneTransform(droneRoot, world, origin);
      updatePropellers(propellers, world.speedMps, (nowMs - lastRenderMs) / 1000);
      lastRenderMs = nowMs;
      updateLayerCamera(camera, matrix, origin);
      renderer.resetState();
      renderer.render(scene, camera);
    },
    onRemove() {
      isRemoved = true;
      disposeObject3d(scene);
      renderer?.dispose();
      renderer = null;
    },
  };
}
