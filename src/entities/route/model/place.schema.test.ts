// Tests place validation: a named, finite, in-range position.
import { describe, expect, it } from 'vitest';

import { placeSchema } from './place.schema';

describe('placeSchema', () => {
  it('accepts a named place and trims its name', () => {
    expect(placeSchema.parse({ name: '  Summerland ', lng: -119.68, lat: 49.6 })).toEqual({
      name: 'Summerland',
      lng: -119.68,
      lat: 49.6,
    });
  });

  it('rejects empty names and out-of-range or non-finite coordinates', () => {
    expect(placeSchema.safeParse({ name: ' ', lng: 0, lat: 0 }).success).toBe(false);
    expect(placeSchema.safeParse({ name: 'X', lng: 200, lat: 0 }).success).toBe(false);
    expect(placeSchema.safeParse({ name: 'X', lng: 0, lat: Number.NaN }).success).toBe(false);
  });
});
