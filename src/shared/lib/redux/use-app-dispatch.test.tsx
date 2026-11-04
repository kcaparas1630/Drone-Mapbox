// Tests that the typed dispatch hook returns the store's dispatch.
import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { useAppDispatch } from './use-app-dispatch';

describe('useAppDispatch', () => {
  it('returns the dispatch of the store in context', () => {
    const testStore = configureStore({ reducer: { counter: () => 0 } });
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={testStore}>{children}</Provider>
      ),
    });
    expect(result.current).toBe(testStore.dispatch);
  });
});
