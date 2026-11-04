// Tests reading versioned values: absent, valid, corrupt JSON and schema failures that get discarded.
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { readVersionedItem } from './read-versioned-item';

const prefsSchema = z.object({ v: z.literal(1), followDistanceM: z.number() });

// Builds an in-memory Storage seeded with the given entries.
function buildStorage(entries: Record<string, string>): Storage {
  const store = new Map(Object.entries(entries));
  return {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key) => store.get(key) ?? null,
    key: vi.fn((index: number) => [...store.keys()][index] ?? null),
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

describe('readVersionedItem', () => {
  it('returns null when nothing is stored or storage is unavailable', () => {
    expect(readVersionedItem('k', prefsSchema, buildStorage({}))).toEqual({
      isOk: true,
      value: null,
    });
    expect(readVersionedItem('k', prefsSchema, null)).toEqual({ isOk: true, value: null });
  });

  it('returns a valid stored value', () => {
    const storage = buildStorage({ k: '{"v":1,"followDistanceM":80}' });
    expect(readVersionedItem('k', prefsSchema, storage)).toEqual({
      isOk: true,
      value: { v: 1, followDistanceM: 80 },
    });
  });

  it('discards corrupt JSON', () => {
    const storage = buildStorage({ k: '{oops' });
    expect(readVersionedItem('k', prefsSchema, storage).isOk).toBe(false);
    expect(storage.getItem('k')).toBeNull();
  });

  it('discards values from another schema version', () => {
    const storage = buildStorage({ k: '{"v":2,"followDistanceM":80}' });
    const result = readVersionedItem('k', prefsSchema, storage);
    expect(result).toEqual({ isOk: false, error: 'k failed validation and was discarded.' });
    expect(storage.getItem('k')).toBeNull();
  });
});
