// Tests that recent places become ready-to-fly search options.
import { describe, expect, it } from 'vitest';

import { toRecentOptions } from './to-recent-options';

describe('toRecentOptions', () => {
  it('labels each recent place and keeps its coordinates', () => {
    const place = { name: 'Kelowna', lng: -119.49, lat: 49.88 };
    expect(toRecentOptions([place])).toEqual([
      { id: 'recent-0', name: 'Kelowna', detail: 'Recent', suggestion: null, place },
    ]);
  });
});
