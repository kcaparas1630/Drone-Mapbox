// The requestAnimationFrame loop: fixed-step simulation, chase camera, repaint, snapshot and saves (ADR 001).
import { saveDroneState } from '@/entities/drone';
import { FLIGHT_TUNING } from '@/shared/config';

import type { FrameLoopContext } from './frame-loop-context';
import { publishDroneSnapshot } from './publish-drone-snapshot';
import { stepSimulation } from './step-simulation';

const SNAPSHOT_INTERVAL_MS = 250;
const SAVE_INTERVAL_MS = 2000;

// Starts the loop and returns a function that stops it; a hidden tab simply stops receiving frames.
export function runFrameLoop(context: FrameLoopContext): () => void {
  const { FIXED_STEP_S, MAX_FRAME_DT_S } = FLIGHT_TUNING;
  let frameId = 0;
  let lastFrameMs: number | null = null;
  let accumulatorS = 0;
  let lastSnapshotMs = Number.NEGATIVE_INFINITY;
  let lastSaveMs = performance.now();
  const tick = (nowMs: number) => {
    frameId = requestAnimationFrame(tick);
    const frameS =
      lastFrameMs === null ? 0 : Math.min(MAX_FRAME_DT_S, (nowMs - lastFrameMs) / 1000);
    lastFrameMs = nowMs;
    if (context.flags.isContextLost) {
      return;
    }
    accumulatorS += Math.max(0, frameS);
    while (accumulatorS >= FIXED_STEP_S) {
      stepSimulation(context, FIXED_STEP_S);
      accumulatorS -= FIXED_STEP_S;
    }
    context.map.triggerRepaint();
    if (nowMs - lastSnapshotMs >= SNAPSHOT_INTERVAL_MS) {
      lastSnapshotMs = nowMs;
      publishDroneSnapshot(context.store, context.world, nowMs);
    }
    if (nowMs - lastSaveMs >= SAVE_INTERVAL_MS) {
      lastSaveMs = nowMs;
      saveDroneState(context.world, Date.now());
    }
  };
  frameId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frameId);
  };
}
