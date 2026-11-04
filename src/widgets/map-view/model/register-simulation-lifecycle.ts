// Keeps the simulation alive across the page lifecycle: WebGL context loss/restore and saves on hide (§8, §10).
import type { Map as MapboxMap } from 'mapbox-gl';

import { saveDroneState } from '@/entities/drone';

import type { FrameLoopContext } from './frame-loop-context';
import { resetDroneLayer } from './reset-drone-layer';

// Pauses on context loss, re-adds the layer on restore and saves on pagehide; returns the cleanup.
export function registerSimulationLifecycle(map: MapboxMap, context: FrameLoopContext): () => void {
  const handleContextLost = () => {
    context.flags.isContextLost = true;
  };
  const handleContextRestored = () => {
    context.flags.isContextLost = false;
    resetDroneLayer(map, context);
  };
  const saveNow = () => {
    saveDroneState(context.world, Date.now());
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      saveNow();
    }
  };
  map.on('webglcontextlost', handleContextLost);
  map.on('webglcontextrestored', handleContextRestored);
  window.addEventListener('pagehide', saveNow);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    saveNow();
    map.off('webglcontextlost', handleContextLost);
    map.off('webglcontextrestored', handleContextRestored);
    window.removeEventListener('pagehide', saveNow);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
