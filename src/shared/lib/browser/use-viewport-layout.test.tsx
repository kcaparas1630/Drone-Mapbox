// Tests that the viewport layout hook classifies phones by pointer, size and orientation and follows rotation.
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useViewportLayout } from './use-viewport-layout';

type MediaState = { isPhone: boolean; isPortrait: boolean };

// Replaces matchMedia so each query reads from the given state, and returns the registered listeners.
function setMediaQueries(state: MediaState) {
  const listeners = new Set<() => void>();
  const removeListener = vi.fn((_type: string, onChange: () => void) => {
    listeners.delete(onChange);
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return query.includes('orientation') ? state.isPortrait : state.isPhone;
      },
      addEventListener: (_type: string, onChange: () => void) => {
        listeners.add(onChange);
      },
      removeEventListener: removeListener,
    })),
  );
  return { listeners, removeListener };
}

describe('useViewportLayout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns desktop when the device is not a phone, whatever the orientation', () => {
    setMediaQueries({ isPhone: false, isPortrait: true });
    const { result } = renderHook(() => useViewportLayout());
    expect(result.current).toBe('desktop');
  });

  it('returns mobile-portrait for a phone held upright', () => {
    setMediaQueries({ isPhone: true, isPortrait: true });
    const { result } = renderHook(() => useViewportLayout());
    expect(result.current).toBe('mobile-portrait');
  });

  it('switches to mobile-landscape when the phone rotates and unsubscribes on unmount', () => {
    const state = { isPhone: true, isPortrait: true };
    const { listeners, removeListener } = setMediaQueries(state);
    const { result, unmount } = renderHook(() => useViewportLayout());
    state.isPortrait = false;
    act(() => {
      for (const listener of listeners) {
        listener();
      }
    });
    expect(result.current).toBe('mobile-landscape');
    unmount();
    expect(removeListener).toHaveBeenCalledTimes(2);
  });
});
