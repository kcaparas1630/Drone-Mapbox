// Install button (only after the browser offers it, never auto-prompted) and the "Updated — reload" toast.
import { Download } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { pwaStatusSource, usePwaStatus } from '@/shared/lib/pwa';
import { Button } from '@/shared/ui';

const UPDATE_TOAST_ID = 'fireflybc-update';

// Renders the install button when available and raises the update toast once a new version is ready.
export function PwaControls() {
  const { canInstall, isUpdateReady } = usePwaStatus();
  useEffect(() => {
    if (isUpdateReady) {
      toast('FireflyBC was updated', {
        id: UPDATE_TOAST_ID,
        duration: Number.POSITIVE_INFINITY,
        action: { label: 'Reload', onClick: pwaStatusSource.applyUpdate },
      });
    }
  }, [isUpdateReady]);
  if (!canInstall) {
    return null;
  }
  return (
    <Button size="small" variant="outline" onClick={() => void pwaStatusSource.showInstallPrompt()}>
      <Download aria-hidden="true" className="size-4" />
      Install app
    </Button>
  );
}
