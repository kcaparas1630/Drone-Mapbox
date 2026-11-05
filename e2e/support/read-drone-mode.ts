// Reads the drone mode from the dev-only debug hook, so specs can assert the state machine directly.
import type { Page } from '@playwright/test';

import type { DebugWindow } from './debug-window.types';

// Returns the current drone mode, or null before the simulation has started.
export function readDroneMode(page: Page): Promise<string | null> {
  return page.evaluate(
    () => (window as DebugWindow).fireflybcDebug?.store.getState().droneMode.mode ?? null,
  );
}
