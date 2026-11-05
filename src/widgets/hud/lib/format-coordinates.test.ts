// Tests the hemisphere letters and precision of the coordinate readout.
import { describe, expect, it } from 'vitest';

import { formatCoordinates } from './format-coordinates';

describe('formatCoordinates', () => {
  it('writes British Columbia positions as north and west with 5 decimals', () => {
    expect(formatCoordinates(-122.75, 53.919449)).toBe('53.91945° N · 122.75000° W');
  });

  it('uses south and east for the other hemispheres', () => {
    expect(formatCoordinates(151.2, -33.86)).toBe('33.86000° S · 151.20000° E');
  });
});
