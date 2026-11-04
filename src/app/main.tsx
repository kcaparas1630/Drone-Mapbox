// Entry point: mounts the FireflyBC React tree into the page's root element.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';

// Finds the root element in index.html and renders the app inside StrictMode.
function mountApp(): void {
  const rootElement = document.getElementById('root');
  if (rootElement === null) {
    throw new Error('FireflyBC cannot start: the #root element is missing from index.html.');
  }
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

mountApp();
