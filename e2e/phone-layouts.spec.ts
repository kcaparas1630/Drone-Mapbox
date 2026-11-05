// Phone layout smoke: portrait collapses the cockpit behind a rotate notice, landscape shows it compact (§4.2).
import { expect, test } from '@playwright/test';

import { registerFixtureRoutes } from './support/register-fixture-routes';

const PORTRAIT = { width: 412, height: 915 };
const LANDSCAPE = { width: 915, height: 412 };

test.use({ hasTouch: true, isMobile: true, viewport: PORTRAIT });

test('collapses the cockpit in portrait and expands it when the phone turns', async ({ page }) => {
  await registerFixtureRoutes(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const notice = page.getByRole('status', { name: 'Turn your phone sideways' });
  const firePanelToggle = page.getByRole('button', { name: /Active fires/ });
  await expect(notice).toBeVisible();
  await expect(firePanelToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('combobox')).toHaveCount(0);
  await expect(page.getByLabel('Flight data')).toHaveCount(0);

  await page.getByRole('button', { name: 'Continue in portrait' }).click();
  await expect(notice).toBeHidden();
  await page.getByRole('button', { name: 'Search places in British Columbia' }).click();
  await expect(page.getByRole('combobox')).toBeFocused();

  await page.setViewportSize(LANDSCAPE);
  await expect(firePanelToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/Fires: 22/)).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByLabel('Move and turn')).toBeVisible();
  await expect(notice).toHaveCount(0);
});
