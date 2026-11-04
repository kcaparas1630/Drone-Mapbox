// Esc priority across widgets: close the fire popup first, then cancel a route, then dismiss arrival (§10).
import { useEffect } from 'react';

import { fireDeselected } from '@/entities/fire';
import { cancelRoute, closeArrival } from '@/features/pause-resume-route';
import { useAppStore } from '@/shared/lib/redux';

// Returns true when Esc belongs to a text field (the search box handles its own Esc).
function isTextEntryTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

// Registers the window Esc handler for the page's lifetime.
export function useEscapeShortcut(): void {
  const store = useAppStore();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || isTextEntryTarget(event.target)) {
        return;
      }
      const state = store.getState();
      const { mode } = state.droneMode;
      if (state.selectedFire.fireNumber !== null) {
        store.dispatch(fireDeselected());
      } else if (mode === 'autoRoute' || mode === 'paused') {
        store.dispatch(cancelRoute());
      } else if (mode === 'arrived') {
        store.dispatch(closeArrival());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [store]);
}
