// The one Mapbox custom layer: a three.js scene sharing Mapbox's WebGL context: the drone and fire flames (ADR 005).
import type { CustomLayerInterface, Map as MapboxMap } from 'mapbox-gl';
import { Camera, type Group, type Object3D, WebGLRenderer } from 'three';

import { disposeObject3d, loadDroneModel } from '@/entities/drone';
import { loadFireModel } from '@/entities/fire';
import { reportError } from '@/shared/lib/report-error';

import { MAP_STYLE } from '../config/map-style';
import { createDroneScene } from './create-drone-scene';
import { addFlameMeshes } from './add-flame-meshes';
import { createFireFlames, type FireFlames } from './create-fire-flames';
import type { FrameLoopContext } from './frame-loop-context';
import { createSceneOrigin } from './scene-origin';
import { updateDroneTransform } from './update-drone-transform';
import { updateFlamesIfDue } from './update-flames-if-due';
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

// Adds the flame meshes once fire.glb has loaded, unless the layer was removed meanwhile.
function loadFireModelIntoLayer(
  map: MapboxMap,
  flames: FireFlames,
  isRemoved: () => boolean,
): void {
  loadFireModel()
    .then((geometry) => {
      if (isRemoved()) {
        geometry.inner.dispose();
        geometry.outer.dispose();
        return;
      }
      addFlameMeshes(flames, geometry);
      map.triggerRepaint();
    })
    .catch((error: unknown) => {
      reportError(error, 'fire model (fires show as footprints and points only)');
    });
}

// Builds the layer for the loop context; render() reads the world and fire flames each frame and never allocates.
export function createDroneLayer(context: FrameLoopContext): CustomLayerInterface {
  const { world } = context;
  const origin = createSceneOrigin(world.lng, world.lat);
  const { scene, droneRoot, placeholder } = createDroneScene();
  const camera = new Camera();
  const flames = createFireFlames();
  scene.add(flames.group);
  let layerMap: MapboxMap | null = null;
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
      layerMap = map;
      loadDroneModelIntoLayer(map, droneRoot, placeholder, propellers, () => isRemoved);
      loadFireModelIntoLayer(map, flames, () => isRemoved);
    },
    render(_glContext, matrix) {
      if (renderer === null || layerMap === null) {
        return;
      }
      const nowMs = performance.now();
      const isOriginRebased = updateSceneOrigin(origin, world.lng, world.lat);
      updateDroneTransform(droneRoot, world, origin);
      updatePropellers(propellers, world.speedMps, (nowMs - lastRenderMs) / 1000);
      lastRenderMs = nowMs;
      updateLayerCamera(camera, matrix, origin);
      updateFlamesIfDue(
        flames,
        context,
        origin,
        layerMap,
        nowMs,
        isOriginRebased,
        camera.projectionMatrix,
      );
      renderer.resetState();
      renderer.render(scene, camera);
    },
    onRemove() {
      isRemoved = true;
      disposeObject3d(scene);
      renderer?.dispose();
      renderer = null;
      layerMap = null;
    },
  };
}
