// Reads whether the spawn altitude still waits for terrain, through the dev-only debug hook (behaviour §1.3).
import type { Page } from '@playwright/test';

import type { DebugWindow } from './debug-window.types';

// Returns true until the drone has been placed above loaded terrain, or null before the simulation starts.
export function readIsAltitudePending(page: Page): Promise<boolean | null> {
  return page.evaluate(
    () => (window as DebugWindow).fireflybcDebug?.world.isAltitudePending ?? null,
  );
}
