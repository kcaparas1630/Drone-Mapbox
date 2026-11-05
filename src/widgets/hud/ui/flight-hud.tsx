// Top-left HUD: the FireflyBC wordmark, the flight mode badge and edge/ceiling/detail notes (behaviour §2, §4.1).
import { Flame } from 'lucide-react';

import { type DroneMode, selectDroneMode, selectDroneSnapshot } from '@/entities/drone';
import { useAppSelector } from '@/shared/lib/redux';
import { Badge } from '@/shared/ui';

import { HudNotes } from './hud-notes';

export type FlightHudProps = { isReducedDetail: boolean; isTileStalled: boolean };

const MODE_LABELS: Readonly<Record<DroneMode, string>> = {
  idle: 'Ready',
  freeFlight: 'Free flight',
  autoRoute: 'Auto-route',
  paused: 'Paused',
  arrived: 'Arrived',
};

// Renders the brand row with the live mode, and any active notes underneath.
export function FlightHud({ isReducedDetail, isTileStalled }: FlightHudProps) {
  const mode = useAppSelector(selectDroneMode);
  const snapshot = useAppSelector(selectDroneSnapshot);
  return (
    <header className="flex w-fit max-w-full flex-col gap-1.5 rounded-panel border border-panel-border bg-panel px-3 py-2 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 text-sm font-bold tracking-tight">
          <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-amber-400 to-red-600 shadow-md">
            <Flame aria-hidden="true" className="size-3.5 text-white" />
          </span>
          Firefly<span className="text-primary">BC</span>
        </span>
        <Badge tone={mode === 'paused' ? 'warning' : 'info'} aria-live="polite">
          {MODE_LABELS[mode]}
        </Badge>
      </div>
      <HudNotes
        isAtBcEdge={snapshot?.isAtBcEdge ?? false}
        isAtCeiling={snapshot?.isAtCeiling ?? false}
        isReducedDetail={isReducedDetail}
        isTileStalled={isTileStalled}
      />
    </header>
  );
}
