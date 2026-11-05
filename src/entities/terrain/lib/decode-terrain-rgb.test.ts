// Tests terrain-RGB decoding and the rejection of out-of-range heights.
import { describe, expect, it } from 'vitest';

import { decodeTerrainRgb } from './decode-terrain-rgb';

// Returns the RGBA bytes that encode a height in metres.
function encodeHeight(heightM: number): number[] {
  const encoded = Math.round((heightM + 10_000) * 10);
  return [Math.floor(encoded / 65_536), Math.floor(encoded / 256) % 256, encoded % 256, 255];
}

describe('decodeTerrainRgb', () => {
  it('decodes sea level, a valley and a peak to the nearest 0.1 m', () => {
    const heights = decodeTerrainRgb(
      [...encodeHeight(0), ...encodeHeight(612.3), ...encodeHeight(2954)],
      3,
    );
    expect(heights[0]).toBeCloseTo(0, 1);
    expect(heights[1]).toBeCloseTo(612.3, 1);
    expect(heights[2]).toBeCloseTo(2954, 1);
  });

  it('marks impossible heights as NaN instead of trusting them', () => {
    const heights = decodeTerrainRgb([0, 0, 0, 255, 255, 255, 255, 255], 2);
    expect(Number.isNaN(heights[0])).toBe(true);
    expect(Number.isNaN(heights[1])).toBe(true);
  });
});
