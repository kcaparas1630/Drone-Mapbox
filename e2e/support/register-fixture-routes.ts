// Serves the BC Wildfire Service feed and Mapbox Search Box from fixtures, so e2e runs never depend on them.
import { fileURLToPath } from 'node:url';

import type { Page, Route } from '@playwright/test';

const FIXTURES_DIR = fileURLToPath(new URL('../fixtures/', import.meta.url));
const SEARCH_BOX_PATH = '/search/searchbox/v1/';

// Answers one intercepted request with a fixture file, allowing the app's cross-origin fetch to read it.
function handleRouteWithFixture(route: Route, fileName: string): Promise<void> {
  return route.fulfill({
    path: `${FIXTURES_DIR}${fileName}`,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
  });
}

// Routes the fire feed and Search Box suggest/retrieve; Mapbox tiles still use the real API (convention 010).
export async function registerFixtureRoutes(page: Page): Promise<void> {
  await page.route('https://services6.arcgis.com/**', (route) =>
    handleRouteWithFixture(route, 'bcws-active-fires.json'),
  );
  await page.route(
    (url) =>
      url.hostname === 'api.mapbox.com' && url.pathname.startsWith(`${SEARCH_BOX_PATH}suggest`),
    (route) => handleRouteWithFixture(route, 'search-box-suggest.json'),
  );
  await page.route(
    (url) =>
      url.hostname === 'api.mapbox.com' && url.pathname.startsWith(`${SEARCH_BOX_PATH}retrieve`),
    (route) => handleRouteWithFixture(route, 'search-box-retrieve.json'),
  );
}
