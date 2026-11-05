// Tests that nearby positions share a lookup cell and distant ones do not.
import { describe, expect, it } from 'vitest';

import { computeLookupCell } from './compute-lookup-cell';

describe('computeLookupCell', () => {
  it('gives positions a few hundred metres apart the same cell and centre', () => {
    const first = computeLookupCell(-122.751, 53.921);
    const second = computeLookupCell(-122.749, 53.925);
    expect(second).toEqual(first);
    expect(first.lng).toBeCloseTo(-122.745, 5);
    expect(first.lat).toBeCloseTo(53.93, 5);
  });

  it('moves to a new cell after a few kilometres', () => {
    expect(computeLookupCell(-122.75, 53.92).key).not.toBe(computeLookupCell(-122.75, 53.96).key);
  });
});
