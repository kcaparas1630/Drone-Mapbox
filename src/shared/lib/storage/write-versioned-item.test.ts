// Tests writing versioned values, rejecting invalid ones and disabling writes after a quota error.
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { writeVersionedItem } from './write-versioned-item';

const prefsSchema = z.object({ v: z.literal(1), followDistanceM: z.number() });

// Builds a Storage stub whose setItem is the given mock.
function buildStorage(setItem: Storage['setItem']): Storage {
  return {
    length: 0,
    clear: vi.fn(),
    getItem: vi.fn(() => null),
    key: vi.fn(() => null),
    removeItem: vi.fn(),
    setItem,
  };
}

describe('writeVersionedItem', () => {
  it('stores the validated value as JSON', () => {
    const setItem = vi.fn();
    const result = writeVersionedItem(
      'k',
      prefsSchema,
      { v: 1, followDistanceM: 60 },
      buildStorage(setItem),
    );
    expect(result).toEqual({ isOk: true, value: true });
    expect(setItem).toHaveBeenCalledWith('k', '{"v":1,"followDistanceM":60}');
  });

  it('refuses values that fail the schema', () => {
    const setItem = vi.fn();
    const invalid = { v: 1, followDistanceM: 'far' } as unknown as z.input<typeof prefsSchema>;
    expect(writeVersionedItem('k', prefsSchema, invalid, buildStorage(setItem)).isOk).toBe(false);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('disables writes for the session after a quota error', () => {
    const setItem = vi.fn(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const storage = buildStorage(setItem);
    const value = { v: 1 as const, followDistanceM: 60 };
    expect(writeVersionedItem('k', prefsSchema, value, storage)).toEqual({
      isOk: false,
      error: 'Persistence disabled for this session: full',
    });
    expect(writeVersionedItem('k', prefsSchema, value, storage).isOk).toBe(false);
    expect(setItem).toHaveBeenCalledTimes(1);
  });

  it('reports unavailable storage', () => {
    expect(writeVersionedItem('k', prefsSchema, { v: 1, followDistanceM: 60 }, null).isOk).toBe(
      false,
    );
  });
});
