// Tests that the reduced-motion hook reads and follows the media query.
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

describe('usePrefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the media query state and re-renders on change', () => {
    let listener: (() => void) | null = null;
    let isReduced = true;
    const removeListener = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        get matches() {
          return isReduced;
        },
        addEventListener: (_type: string, onChange: () => void) => {
          listener = onChange;
        },
        removeEventListener: removeListener,
      })),
    );
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    isReduced = false;
    act(() => {
      listener?.();
    });
    expect(result.current).toBe(false);
    unmount();
    expect(removeListener).toHaveBeenCalled();
  });
});
