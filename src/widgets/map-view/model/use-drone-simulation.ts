// Runs the drone on a ready map: custom layer, frame loop, keyboard and camera input, lifecycle handling.
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useRef } from 'react';

import { createSimWorld, type DroneSpawn } from '@/entities/drone';
import { useKeyboardDroneControls } from '@/features/control-drone';
import { usePrefersReducedMotion } from '@/shared/lib/browser';
import { useAppStore } from '@/shared/lib/redux';

import { createFrameLoopContext, type FrameLoopContext } from './frame-loop-context';
import { publishDebugContext } from './publish-debug-context';
import { registerSimulationLifecycle } from './register-simulation-lifecycle';
import { resetDroneLayer } from './reset-drone-layer';
import { runFrameLoop } from './run-frame-loop';

// Starts the simulation once the map is ready and tears everything down on unmount.
export function useDroneSimulation(
  map: MapboxMap | null,
  spawn: DroneSpawn,
  isDevBuild: boolean,
): void {
  const store = useAppStore();
  const isReducedMotion = usePrefersReducedMotion();
  const contextRef = useRef<FrameLoopContext | null>(null);
  const spawnRef = useRef(spawn);
  const isReducedMotionRef = useRef(isReducedMotion);
  useKeyboardDroneControls();
  useEffect(() => {
    isReducedMotionRef.current = isReducedMotion;
    if (contextRef.current !== null) {
      contextRef.current.flags.isReducedMotion = isReducedMotion;
    }
  }, [isReducedMotion]);
  useEffect(() => {
    if (map === null) {
      return undefined;
    }
    const context = createFrameLoopContext(map, createSimWorld(spawnRef.current), store);
    context.flags.isReducedMotion = isReducedMotionRef.current;
    contextRef.current = context;
    if (isDevBuild) {
      publishDebugContext(context);
    }
    resetDroneLayer(map, context);
    const unregisterLifecycle = registerSimulationLifecycle(map, context);
    const stopLoop = runFrameLoop(context);
    return () => {
      stopLoop();
      unregisterLifecycle();
      publishDebugContext(null);
      contextRef.current = null;
    };
  }, [isDevBuild, map, store]);
}
