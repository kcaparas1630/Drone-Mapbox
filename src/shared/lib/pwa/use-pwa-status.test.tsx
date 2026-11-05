// Tests that the PWA hook re-renders when the store changes.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { pwaStatusSource } from '@/shared/lib/pwa';
import { usePwaStatus } from './use-pwa-status';

describe('usePwaStatus', () => {
  it('reflects an update becoming ready', () => {
    const { result } = renderHook(() => usePwaStatus());
    act(() => {
      pwaStatusSource.setUpdateReady(() => undefined);
    });
    expect(result.current.isUpdateReady).toBe(true);
  });
});
