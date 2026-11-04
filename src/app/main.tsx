// Entry point: validates the environment, checks WebGL2, starts prefs persistence and mounts the app.
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/globals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { readEnv } from '@/shared/config';
import { isWebgl2Supported } from '@/shared/lib/browser';
import { reportError } from '@/shared/lib/report-error';

import { App } from './app';
import { persistPrefs } from './prefs/persist-prefs';
import { store } from './store';

// Finds the root element and renders the app; a configuration error is also reported to the console.
function renderApp(): void {
  const rootElement = document.getElementById('root');
  if (rootElement === null) {
    throw new Error('FireflyBC cannot start: the #root element is missing from index.html.');
  }
  const env = readEnv();
  if (!env.isOk) {
    reportError(env.error, 'configuration');
  }
  persistPrefs(store);
  createRoot(rootElement).render(
    <StrictMode>
      <App env={env} isWebgl2Available={isWebgl2Supported()} />
    </StrictMode>,
  );
}

renderApp();
