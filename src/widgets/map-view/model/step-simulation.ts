// One fixed 1/60 s simulation step, composing input, terrain, physics, altitude rules and the BC clamp (ADR 001).
import { clampToBritishColumbia, destinationReached, stepFreeFlight } from '@/entities/drone';
import { sampleTerrainAhead } from '@/entities/terrain';
import { readDroneInput } from '@/features/control-drone';

import { applyTerrainFloor } from './apply-terrain-floor';
import type { FrameLoopContext } from './frame-loop-context';
import { stepAutoRoute } from './step-auto-route';
import { updateTerrainState } from './update-terrain-state';

// Advances the world by dtS; reads the store once and never subscribes.
export function stepSimulation(context: FrameLoopContext, dtS: number): void {
  const { map, world, store } = context;
  const state = store.getState();
  const plan = state.route.activeRoute;
  readDroneInput(world.input);
  sampleTerrainAhead(map, world.lng, world.lat, world.headingRad, world.terrainSamplesM);
  updateTerrainState(world, dtS);
  if (state.droneMode.mode === 'autoRoute' && plan !== null) {
    if (stepAutoRoute(context, plan, dtS)) {
      store.dispatch(destinationReached());
    }
  } else {
    stepFreeFlight(world, dtS);
  }
  applyTerrainFloor(world, dtS);
  clampToBritishColumbia(world);
  if (context.flags.isReducedMotion) {
    world.bankRad = 0;
  }
}
