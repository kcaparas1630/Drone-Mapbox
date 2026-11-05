// Runs the drone on a ready map: custom layer, frame loop, keyboard and camera input, lifecycle handling.
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useRef } from 'react';

import { createSimWorld, type DroneSpawn } from '@/entities/drone';
import type { Fire } from '@/entities/fire';
import { useKeyboardDroneControls } from '@/features/control-drone';
import { usePrefersReducedMotion } from '@/shared/lib/browser';
import { useAppStore } from '@/shared/lib/redux';

import { createFrameLoopContext, type FrameLoopContext } from './frame-loop-context';
import { publishDebugContext } from './publish-debug-context';
import { registerCameraInput } from './register-camera-input';
import { registerFlamePicking } from './register-flame-picking';
import { registerSimulationLifecycle } from './register-simulation-lifecycle';
import { resetDroneLayer } from './reset-drone-layer';
import { runFrameLoop } from './run-frame-loop';

export type DroneSimulationOptions = {
  spawn: DroneSpawn;
  isDevBuild: boolean;
  fires: readonly Fire[] | undefined;
  isReducedDetail: boolean;
};

// Starts the simulation once the map is ready and tears everything down on unmount.
export function useDroneSimulation(map: MapboxMap | null, options: DroneSimulationOptions): void {
  const { spawn, isDevBuild, fires, isReducedDetail } = options;
  const store = useAppStore();
  const isReducedMotion = usePrefersReducedMotion();
  const contextRef = useRef<FrameLoopContext | null>(null);
  const spawnRef = useRef(spawn);
  const loopFlagsRef = useRef({ isReducedMotion, isReducedDetail });
  const firesRef = useRef(fires);
  useKeyboardDroneControls();
  useEffect(() => {
    loopFlagsRef.current = { isReducedMotion, isReducedDetail };
    if (contextRef.current !== null) {
      Object.assign(contextRef.current.flags, loopFlagsRef.current);
    }
  }, [isReducedMotion, isReducedDetail]);
  useEffect(() => {
    firesRef.current = fires;
    if (contextRef.current !== null) {
      contextRef.current.fireFeed.fires = fires ?? [];
      contextRef.current.fireFeed.version += 1;
    }
  }, [fires]);
  useEffect(() => {
    if (map === null) {
      return undefined;
    }
    const context = createFrameLoopContext(map, createSimWorld(spawnRef.current), store);
    Object.assign(context.flags, loopFlagsRef.current);
    context.fireFeed.fires = firesRef.current ?? [];
    context.fireFeed.version = 1;
    contextRef.current = context;
    if (isDevBuild) {
      publishDebugContext(context);
    }
    resetDroneLayer(map, context);
    const unregisterLifecycle = registerSimulationLifecycle(map, context);
    const unregisterCameraInput = registerCameraInput(
      map.getCanvasContainer(),
      context.orbit,
      store,
    );
    const unregisterFlamePicking = registerFlamePicking(map, context);
    const stopLoop = runFrameLoop(context);
    return () => {
      stopLoop();
      unregisterFlamePicking();
      unregisterCameraInput();
      unregisterLifecycle();
      publishDebugContext(null);
      contextRef.current = null;
    };
  }, [isDevBuild, map, store]);
}
