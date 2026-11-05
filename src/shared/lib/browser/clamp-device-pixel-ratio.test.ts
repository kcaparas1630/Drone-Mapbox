// Tests that the pixel-ratio clamp caps high ratios, keeps low ones, follows zoom and restores the original.
import { describe, expect, it } from 'vitest';

import { clampDevicePixelRatio } from './clamp-device-pixel-ratio';

// Returns a stand-in window whose ratio is an accessor, like the real one, so zoom changes can be simulated.
function createZoomableTarget(initialRatio: number) {
  const zoom = { ratio: initialRatio };
  const target = {};
  Object.defineProperty(target, 'devicePixelRatio', {
    configurable: true,
    enumerable: true,
    get: () => zoom.ratio,
  });
  return { target, zoom };
}

// Reads the ratio the way a canvas library would.
function readRatio(target: object): unknown {
  return Reflect.get(target, 'devicePixelRatio');
}

describe('clampDevicePixelRatio', () => {
  it('caps a high-density ratio at the maximum', () => {
    const { target } = createZoomableTarget(3);
    clampDevicePixelRatio(1.5, target);
    expect(readRatio(target)).toBe(1.5);
  });

  it('keeps a ratio already under the maximum', () => {
    const { target } = createZoomableTarget(1);
    clampDevicePixelRatio(1.5, target);
    expect(readRatio(target)).toBe(1);
  });

  it('still follows the browser when the user zooms', () => {
    const { target, zoom } = createZoomableTarget(1);
    clampDevicePixelRatio(1.5, target);
    zoom.ratio = 1.25;
    expect(readRatio(target)).toBe(1.25);
    zoom.ratio = 2;
    expect(readRatio(target)).toBe(1.5);
  });

  it('restores the original accessor', () => {
    const { target } = createZoomableTarget(3);
    const restore = clampDevicePixelRatio(1.5, target);
    restore();
    expect(readRatio(target)).toBe(3);
  });

  it('handles a plain value inherited from a prototype and removes its override on restore', () => {
    const target: object = Object.create({ devicePixelRatio: 2 }) as object;
    const restore = clampDevicePixelRatio(1.5, target);
    expect(readRatio(target)).toBe(1.5);
    restore();
    expect(Object.getOwnPropertyDescriptor(target, 'devicePixelRatio')).toBeUndefined();
    expect(readRatio(target)).toBe(2);
  });
});
