// React hook exposing navigator.onLine and re-rendering when the browser goes offline or online.
import { useSyncExternalStore } from 'react';

// Subscribes to the browser's online and offline events.
function subscribeToConnectivity(onChange: () => void): () => void {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

// Returns whether the browser currently reports a network connection.
function readIsOnline(): boolean {
  return navigator.onLine;
}

// Returns true while the browser is online; server rendering assumes online.
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeToConnectivity, readIsOnline, () => true);
}
