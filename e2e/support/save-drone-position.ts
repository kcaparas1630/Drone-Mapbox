// Saves a drone position before the app starts, as a returning visitor would have (behaviour §8).
import type { Page } from '@playwright/test';

export type DronePosition = { lng: number; lat: number; altMsl: number; headingRad: number };

// Writes the versioned saved-drone record into localStorage ahead of every page script.
export async function saveDronePosition(page: Page, position: DronePosition): Promise<void> {
  await page.addInitScript((saved) => {
    window.localStorage.setItem(
      'fireflybc.drone.v1',
      JSON.stringify({ v: 1, ...saved, savedAt: Date.now() }),
    );
  }, position);
}
