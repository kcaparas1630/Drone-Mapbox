// Centre notice on a phone in portrait: landscape fits the map, fire list and controls (§4.2, ADR 024).
import { Smartphone } from 'lucide-react';

import { Button, Card } from '@/shared/ui';

export type RotateDeviceNoticeProps = { onDismiss: () => void };

// Renders the notice with a sideways phone icon and the button that keeps portrait for this session.
export function RotateDeviceNotice({ onDismiss }: RotateDeviceNoticeProps) {
  return (
    <Card
      role="status"
      aria-labelledby="rotate-device-title"
      className="flex max-w-xs flex-col items-center gap-3 p-5 text-center"
    >
      <Smartphone aria-hidden="true" className="size-10 rotate-90 text-primary" />
      <h2 id="rotate-device-title" className="text-base font-semibold">
        Turn your phone sideways
      </h2>
      <p className="text-sm text-muted-foreground">
        FireflyBC works best in landscape: the map, the fire list and the flight controls all fit on
        screen.
      </p>
      <Button variant="secondary" size="small" onClick={onDismiss}>
        Continue in portrait
      </Button>
    </Card>
  );
}
