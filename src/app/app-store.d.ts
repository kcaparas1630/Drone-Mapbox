// Global store types declared by the app layer so shared hooks are typed without importing upward (FSD).
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';

import type { store } from './store';

declare global {
  type AppStore = typeof store;
  type AppRootState = ReturnType<AppStore['getState']>;
  type AppDispatch = AppStore['dispatch'];
  type AppThunk<ReturnValue = void> = ThunkAction<
    ReturnValue,
    AppRootState,
    unknown,
    UnknownAction
  >;
}

export {};
