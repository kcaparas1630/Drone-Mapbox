// Registers the service worker (install-only PWA, ADR 006) and feeds install/update state to the HUD.
import { registerSW } from 'virtual:pwa-register';

import { pwaStatusSource } from '@/shared/lib/pwa';
import { reportError } from '@/shared/lib/report-error';

// Registers the worker; a new version asks before reloading, and the install prompt waits for the HUD button.
export function registerPwa(): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  registerSW({
    immediate: true,
    onNeedReload: () => {
      pwaStatusSource.setUpdateReady(() => {
        window.location.reload();
      });
    },
    onRegisterError: (error: unknown) => {
      reportError(error, 'service worker');
    },
  });
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    pwaStatusSource.setInstallPrompt(event);
  });
  window.addEventListener('appinstalled', () => {
    pwaStatusSource.setInstallPrompt(null);
  });
}
