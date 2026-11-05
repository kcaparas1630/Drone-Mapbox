// Phone layout smoke: portrait collapses behind a rotate notice; landscape is compact, its fire list collapsible (§4.2).
import { expect, type Locator, test } from '@playwright/test';

import { registerFixtureRoutes } from './support/register-fixture-routes';

const PORTRAIT = { width: 412, height: 915 };
const LANDSCAPE = { width: 915, height: 412 };

// Returns the x of the element's right edge in CSS pixels.
async function readRightEdgePx(locator: Locator): Promise<number> {
  const box = await locator.boundingBox();
  return box === null ? Number.NaN : box.x + box.width;
}

test.use({ hasTouch: true, isMobile: true, viewport: PORTRAIT });

test('collapses the cockpit in portrait, and in landscape frees the fire column until the list opens', async ({
  page,
}) => {
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
  const climbStick = page.getByLabel('Climb and descend');
  await expect(firePanelToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByLabel('Move and turn')).toBeVisible();
  await expect(notice).toHaveCount(0);
  await expect(climbStick).toBeVisible();
  const collapsedStickRightPx = await readRightEdgePx(climbStick);
  expect(collapsedStickRightPx).toBeGreaterThan(LANDSCAPE.width - 40);

  await firePanelToggle.click();
  await expect(firePanelToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/Fires: 22/)).toBeVisible();
  expect(await readRightEdgePx(climbStick)).toBeLessThan(collapsedStickRightPx - 200);
});
