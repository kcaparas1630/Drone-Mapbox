// Tests the low frame rate detector: warm-up, sustained slowness, recovery and hidden-tab gaps.
import { describe, expect, it } from 'vitest';

import { type FrameRateSample, sampleFrameRate } from './sample-frame-rate';

// Returns a fresh sample started at time zero.
function createSample(): FrameRateSample {
  return { startedMs: 0, windowStartMs: 0, frameCount: 0, lowSinceMs: null, lastFrameMs: 0 };
}

// Feeds frames at a steady rate between two times and returns the time the detector first fired, or null.
function runFramesAtRate(sample: FrameRateSample, fromMs: number, toMs: number, fps: number) {
  const frameMs = 1000 / fps;
  for (let nowMs = fromMs + frameMs; nowMs <= toMs; nowMs += frameMs) {
    if (sampleFrameRate(sample, nowMs)) {
      return nowMs;
    }
  }
  return null;
}

describe('sampleFrameRate', () => {
  it('never fires on a device holding 60 fps', () => {
    expect(runFramesAtRate(createSample(), 0, 30_000, 60)).toBeNull();
  });

  it('ignores a slow start while the map is still loading', () => {
    expect(runFramesAtRate(createSample(), 0, 5000, 10)).toBeNull();
  });

  it('fires after five seconds below 30 fps once warmed up', () => {
    const firedMs = runFramesAtRate(createSample(), 0, 20_000, 20);
    expect(firedMs).not.toBeNull();
    expect(firedMs).toBeGreaterThanOrEqual(9900);
    expect(firedMs).toBeLessThan(11_100);
  });

  it('starts over when one window recovers', () => {
    const sample = createSample();
    expect(runFramesAtRate(sample, 0, 9000, 20)).toBeNull();
    expect(runFramesAtRate(sample, 9000, 10_500, 60)).toBeNull();
    expect(sample.lowSinceMs).toBeNull();
    const firedMs = runFramesAtRate(sample, 10_500, 20_000, 20);
    expect(firedMs).toBeGreaterThanOrEqual(15_500);
  });

  it('still fires on a device managing one frame a second', () => {
    expect(runFramesAtRate(createSample(), 0, 20_000, 1)).toBe(9000);
  });

  it('starts over after a long pause such as a sleeping laptop', () => {
    const sample = createSample();
    expect(runFramesAtRate(sample, 0, 9000, 20)).toBeNull();
    expect(sampleFrameRate(sample, 20_000)).toBe(false);
    expect(sample.lowSinceMs).toBeNull();
  });
});
