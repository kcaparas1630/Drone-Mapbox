// Chase-camera smoke: in flight, Mapbox renders the camera exactly where the chase camera put it (ADR 020).
import { expect, test } from '@playwright/test';

import { measureCameraDrift } from './support/measure-camera-drift';
import { readDroneMode } from './support/read-drone-mode';
import { readIsAltitudePending } from './support/read-is-altitude-pending';
import { registerFixtureRoutes } from './support/register-fixture-routes';

// A ~1 m one-frame terrain refinement is normal; the maxBounds bounce (ADR 020) was 20 m+ and growing.
const MAX_CAMERA_DRIFT_M = 5;

test('keeps the rendered camera on the chase-camera pose while flying and turning', async ({
  page,
}) => {
  await registerFixtureRoutes(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Ready', { exact: true })).toBeVisible();
  await expect.poll(() => readDroneMode(page)).toBe('idle');
  await expect.poll(() => readIsAltitudePending(page)).toBe(false);

  const driftM = await measureCameraDrift(page, async () => {
    await page.keyboard.down('w');
    await page.waitForTimeout(4000);
    await page.keyboard.down('d');
    await page.waitForTimeout(2000);
    await page.keyboard.up('d');
    await page.keyboard.up('w');
  });

  expect(driftM).toBeLessThan(MAX_CAMERA_DRIFT_M);
});
