// Search-to-fly smoke: a typed place, then Enter, starts an auto-route to it (behaviour §4, convention 010).
import { expect, test } from '@playwright/test';

import { readDroneMode } from './support/read-drone-mode';
import { registerFixtureRoutes } from './support/register-fixture-routes';

test('flies to a searched place in auto-route mode', async ({ page }) => {
  await registerFixtureRoutes(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Ready', { exact: true })).toBeVisible();
  await expect.poll(() => readDroneMode(page)).toBe('idle');

  const searchBox = page.getByRole('combobox', { name: 'Search places in British Columbia' });
  await searchBox.click();
  await searchBox.fill('Summerland');
  await expect(page.getByRole('option', { name: /Summerland/ })).toBeVisible();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('status').filter({ hasText: 'Flying to Summerland' })).toBeVisible();
  await expect.poll(() => readDroneMode(page)).toBe('autoRoute');
});
