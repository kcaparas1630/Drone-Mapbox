// Launch smoke on the production build: the map canvas, the HUD and the fire badge appear without page errors.
import { expect, test } from '@playwright/test';

import { registerFixtureRoutes } from './support/register-fixture-routes';

test('loads the map, the flight HUD and the fire badge without errors', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  await registerFixtureRoutes(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('canvas.mapboxgl-canvas')).toBeVisible();
  await expect(page.getByText('Ready', { exact: true })).toBeVisible();
  await expect(page.getByText(/Fires: 22/)).toBeVisible();
  expect(pageErrors).toEqual([]);
});
