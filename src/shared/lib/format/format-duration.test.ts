// Tests the minutes:seconds wording of time left.
import { describe, expect, it } from 'vitest';

import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('pads seconds and rounds partial seconds up', () => {
    expect(formatDuration(30.2)).toBe('0:31');
    expect(formatDuration(725)).toBe('12:05');
    expect(formatDuration(-4)).toBe('0:00');
  });
});
