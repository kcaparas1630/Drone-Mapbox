// PWA smoke on the production build: the page links a valid manifest and the service worker is served (ADR 006).
import { expect, test } from '@playwright/test';

import { registerFixtureRoutes } from './support/register-fixture-routes';

test('serves the web app manifest and the service worker script', async ({ page, request }) => {
  await registerFixtureRoutes(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestHref).not.toBeNull();

  const manifestResponse = await request.get(manifestHref ?? '');
  expect(manifestResponse.ok()).toBe(true);
  const manifest: unknown = await manifestResponse.json();
  expect(manifest).toHaveProperty('name', 'FireflyBC');
  expect(manifest).toHaveProperty('short_name', 'FireflyBC');
  expect(manifest).toHaveProperty('start_url', '/');
  expect(manifest).toHaveProperty('display', 'standalone');

  const serviceWorkerResponse = await request.get('/sw.js');
  expect(serviceWorkerResponse.ok()).toBe(true);
  expect(serviceWorkerResponse.headers()['content-type']).toContain('javascript');
});
