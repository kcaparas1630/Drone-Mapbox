// Returns the browser's localStorage when it is usable, so storage helpers degrade gracefully.

// Returns window.localStorage, or null in non-browser contexts or when access is blocked.
export function getDefaultStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}
