// Tests the fire list's distance wording at each scale.
import { describe, expect, it } from 'vitest';

import { formatDistance } from './format-distance';

describe('formatDistance', () => {
  it('uses metres under a kilometre, one decimal under 100 km, whole km beyond', () => {
    expect(formatDistance(847)).toBe('850 m');
    expect(formatDistance(12_440)).toBe('12.4 km');
    expect(formatDistance(1_143_200)).toBe('1,143 km');
  });

  it('shows nothing when the distance is unknown', () => {
    expect(formatDistance(null)).toBe('');
  });
});
