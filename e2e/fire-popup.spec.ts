// Fire popup smoke: a fire from the seeded BCWS fixture opens its popup on click and closes on Esc (behaviour §7).
import { expect, test } from '@playwright/test';

import { findFireOnScreen } from './support/find-fire-on-screen';
import { registerFixtureRoutes } from './support/register-fixture-routes';
import { saveDronePosition } from './support/save-drone-position';

const FIXTURE_FIRE = { name: 'C10952', lngLat: [-123.989867, 53.16905] as [number, number] };

test('opens the popup of a seeded fire and closes it with Escape', async ({ page }) => {
  const [fireLng, fireLat] = FIXTURE_FIRE.lngLat;
  await saveDronePosition(page, {
    lng: fireLng,
    lat: fireLat - 0.018,
    altMsl: 2000,
    headingRad: 0,
  });
  await registerFixtureRoutes(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Fires: 22/)).toBeVisible();

  const heading = page.getByRole('heading', { name: FIXTURE_FIRE.name });
  await expect(async () => {
    const firePoint = await findFireOnScreen(page, FIXTURE_FIRE.lngLat);
    expect(firePoint).not.toBeNull();
    await page.mouse.click(firePoint?.x ?? 0, firePoint?.y ?? 0);
    await expect(heading).toBeVisible({ timeout: 2000 });
  }).toPass();
  await expect(page.getByText(/Informational only/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(heading).toBeHidden();
});
