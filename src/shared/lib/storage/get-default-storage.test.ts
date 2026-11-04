// Tests that the default storage is null outside a browser and when access throws.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getDefaultStorage } from './get-default-storage';

describe('getDefaultStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when there is no window', () => {
    expect(getDefaultStorage()).toBeNull();
  });

  it('returns localStorage when available and null when access is blocked', () => {
    const storage = { getItem: vi.fn() };
    vi.stubGlobal('window', { localStorage: storage });
    expect(getDefaultStorage()).toBe(storage);
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
    expect(getDefaultStorage()).toBeNull();
  });
});
