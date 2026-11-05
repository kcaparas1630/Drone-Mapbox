// Tests that useNow ticks on its interval and stops on unmount.
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useNow } from './use-now';

describe('useNow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates every interval', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    const { result, unmount } = renderHook(() => useNow(60_000));
    expect(result.current).toBe(1000);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe(61_000);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
