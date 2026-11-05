// Tests that the typed store hook returns the store in context.
import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { useAppStore } from './use-app-store';

describe('useAppStore', () => {
  it('returns the store in context', () => {
    const testStore = configureStore({ reducer: { counter: () => 0 } });
    const { result } = renderHook(() => useAppStore(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={testStore}>{children}</Provider>
      ),
    });
    expect(result.current).toBe(testStore);
  });
});
