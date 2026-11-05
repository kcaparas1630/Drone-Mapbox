// React hook telling the page whether it runs on a desktop, a phone in landscape, or a phone in portrait (ADR 024).
import { useSyncExternalStore } from 'react';

export type ViewportLayout = 'desktop' | 'mobile-landscape' | 'mobile-portrait';

const PHONE_QUERY =
  '(pointer: coarse) and (max-width: 639px), (pointer: coarse) and (max-height: 639px)';
const PORTRAIT_QUERY = '(orientation: portrait)';

// Subscribes to changes of the phone and orientation media queries.
function subscribeToViewportLayout(onChange: () => void): () => void {
  const queries = [window.matchMedia(PHONE_QUERY), window.matchMedia(PORTRAIT_QUERY)];
  for (const query of queries) {
    query.addEventListener('change', onChange);
  }
  return () => {
    for (const query of queries) {
      query.removeEventListener('change', onChange);
    }
  };
}

// Returns the layout the media queries describe right now.
function readViewportLayout(): ViewportLayout {
  if (!window.matchMedia(PHONE_QUERY).matches) {
    return 'desktop';
  }
  return window.matchMedia(PORTRAIT_QUERY).matches ? 'mobile-portrait' : 'mobile-landscape';
}

// Returns the current layout and re-renders when the device rotates or the window crosses a breakpoint.
export function useViewportLayout(): ViewportLayout {
  return useSyncExternalStore(subscribeToViewportLayout, readViewportLayout, () => 'desktop');
}
