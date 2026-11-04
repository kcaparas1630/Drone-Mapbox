// Tests that the typed selector hook reads from the provided store.
import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { useAppSelector } from './use-app-selector';

describe('useAppSelector', () => {
  it('selects state from the store in context', () => {
    const testStore = configureStore({ reducer: { counter: () => 7 } });
    const { result } = renderHook(() => useAppSelector((state) => state), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={testStore}>{children}</Provider>
      ),
    });
    expect(result.current).toEqual({ counter: 7 });
  });
});
