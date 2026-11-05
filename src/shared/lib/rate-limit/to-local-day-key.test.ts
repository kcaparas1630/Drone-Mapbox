// Tests that timestamps map to their local calendar day.
import { describe, expect, it } from 'vitest';

import { toLocalDayKey } from './to-local-day-key';

describe('toLocalDayKey', () => {
  it('formats the local date with zero-padded month and day', () => {
    expect(toLocalDayKey(new Date(2026, 0, 5, 23, 59).getTime())).toBe('2026-01-05');
  });

  it('moves to the next key at local midnight', () => {
    expect(toLocalDayKey(new Date(2026, 10, 6, 0, 0).getTime())).toBe('2026-11-06');
  });
});
