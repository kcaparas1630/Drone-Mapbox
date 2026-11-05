// Counts rendered frames in one-second windows to spot a device that cannot hold 30 fps (behaviour §10).
import { REDUCED_DETAIL } from '../config/reduced-detail';

export type FrameRateSample = {
  startedMs: number;
  windowStartMs: number;
  frameCount: number;
  lowSinceMs: number | null;
  lastFrameMs: number;
};

// Records one frame and returns true once every window for the whole duration ran below the minimum rate.
export function sampleFrameRate(sample: FrameRateSample, nowMs: number): boolean {
  const { MIN_FPS, LOW_FPS_DURATION_MS, WINDOW_MS, WARM_UP_MS, MAX_FRAME_GAP_MS } = REDUCED_DETAIL;
  const isGap = nowMs - sample.lastFrameMs > MAX_FRAME_GAP_MS;
  sample.lastFrameMs = nowMs;
  if (isGap || nowMs - sample.startedMs < WARM_UP_MS) {
    sample.windowStartMs = nowMs;
    sample.frameCount = 0;
    sample.lowSinceMs = null;
    return false;
  }
  sample.frameCount += 1;
  const windowMs = nowMs - sample.windowStartMs;
  if (windowMs < WINDOW_MS) {
    return false;
  }
  const isLow = (sample.frameCount * 1000) / windowMs < MIN_FPS;
  sample.lowSinceMs = isLow ? (sample.lowSinceMs ?? sample.windowStartMs) : null;
  sample.windowStartMs = nowMs;
  sample.frameCount = 0;
  return sample.lowSinceMs !== null && nowMs - sample.lowSinceMs >= LOW_FPS_DURATION_MS;
}
