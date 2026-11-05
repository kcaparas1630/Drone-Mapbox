// Tiny external state source for PWA state the HUD shows: an install prompt is available, an update is ready.

export type PwaStatus = { canInstall: boolean; isUpdateReady: boolean };

type InstallPromptEvent = Event & { prompt: () => Promise<void> };

let status: PwaStatus = { canInstall: false, isUpdateReady: false };
let installPrompt: InstallPromptEvent | null = null;
let applyUpdate: (() => void) | null = null;
const listeners = new Set<() => void>();

// Replaces the snapshot and notifies subscribers.
function setStatus(next: PwaStatus): void {
  status = next;
  for (const listener of listeners) {
    listener();
  }
}

export const pwaStatusSource = {
  getSnapshot: (): PwaStatus => status,
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setInstallPrompt: (event: Event | null): void => {
    installPrompt = event !== null && 'prompt' in event ? (event as InstallPromptEvent) : null;
    setStatus({ ...status, canInstall: installPrompt !== null });
  },
  setUpdateReady: (reload: () => void): void => {
    applyUpdate = reload;
    setStatus({ ...status, isUpdateReady: true });
  },
  showInstallPrompt: async (): Promise<void> => {
    const prompt = installPrompt;
    installPrompt = null;
    setStatus({ ...status, canInstall: false });
    await prompt?.prompt();
  },
  applyUpdate: (): void => {
    applyUpdate?.();
  },
};
