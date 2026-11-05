// Tests trip duration: cruise speed in the middle, 5 s minimum and 45 s maximum.
import { describe, expect, it } from 'vitest';

import { computeTripDuration } from './compute-trip-duration';

describe('computeTripDuration', () => {
  it('flies at 400 m/s for mid-length trips', () => {
    expect(computeTripDuration(8000)).toBe(20);
  });

  it('never takes less than 5 s, even for very short routes', () => {
    expect(computeTripDuration(100)).toBe(5);
  });

  it('caps long trips such as Vancouver to Summerland at 45 s', () => {
    expect(computeTripDuration(251_000)).toBe(45);
  });
});
