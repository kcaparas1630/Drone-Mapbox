// Tests the PWA store: install prompt availability, showing it once, and the update-ready flow.
import { describe, expect, it, vi } from 'vitest';

import { pwaStatusSource } from './pwa-status-source';

describe('pwaStatusSource', () => {
  it('offers install only for events that can prompt, and prompts once', async () => {
    const listener = vi.fn();
    const unsubscribe = pwaStatusSource.subscribe(listener);
    pwaStatusSource.setInstallPrompt(new Event('beforeinstallprompt'));
    expect(pwaStatusSource.getSnapshot().canInstall).toBe(false);
    const prompt = vi.fn(() => Promise.resolve());
    pwaStatusSource.setInstallPrompt(Object.assign(new Event('beforeinstallprompt'), { prompt }));
    expect(pwaStatusSource.getSnapshot().canInstall).toBe(true);
    await pwaStatusSource.showInstallPrompt();
    await pwaStatusSource.showInstallPrompt();
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(pwaStatusSource.getSnapshot().canInstall).toBe(false);
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('marks an update ready and applies it on request', () => {
    const reload = vi.fn();
    pwaStatusSource.setUpdateReady(reload);
    expect(pwaStatusSource.getSnapshot().isUpdateReady).toBe(true);
    pwaStatusSource.applyUpdate();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
