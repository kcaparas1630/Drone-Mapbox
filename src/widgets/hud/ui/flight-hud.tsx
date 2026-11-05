// Flight HUD: mode badge, speed, altitude MSL/AGL, heading and edge/ceiling/detail notes (behaviour §2, §3, §10).
import { type DroneMode, selectDroneMode, selectDroneSnapshot } from '@/entities/drone';
import { useAppSelector } from '@/shared/lib/redux';
import { Badge, Card } from '@/shared/ui';

import { formatFlightValue } from '../lib/format-flight-value';
import { HudNotes } from './hud-notes';

export type FlightHudProps = { isReducedDetail: boolean; isTileStalled: boolean };

const MODE_LABELS: Readonly<Record<DroneMode, string>> = {
  idle: 'Ready',
  freeFlight: 'Free flight',
  autoRoute: 'Auto-route',
  paused: 'Paused',
  arrived: 'Arrived',
};

// Renders the readouts; values show "—" until the first snapshot arrives.
export function FlightHud({ isReducedDetail, isTileStalled }: FlightHudProps) {
  const mode = useAppSelector(selectDroneMode);
  const snapshot = useAppSelector(selectDroneSnapshot);
  const altitudeAgl = snapshot === null || snapshot.isTerrainMissing ? null : snapshot.altitudeAgl;
  const readouts: [string, string, string][] = [
    ['speed', 'Speed', formatFlightValue('speed', snapshot?.speedMps ?? null)],
    ['msl', 'Alt MSL', formatFlightValue('altitude', snapshot?.altitudeMsl ?? null)],
    ['agl', 'Alt AGL', formatFlightValue('altitude', altitudeAgl)],
    ['heading', 'Heading', formatFlightValue('heading', snapshot?.headingDeg ?? null)],
  ];
  return (
    <Card
      aria-label="Flight data"
      className="flex w-fit max-w-full flex-col gap-1.5 p-2 text-xs sm:p-3"
    >
      <Badge tone={mode === 'paused' ? 'warning' : 'info'} aria-live="polite">
        {MODE_LABELS[mode]}
      </Badge>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:grid-cols-[auto_auto]">
        {readouts.map(([key, label, value]) => (
          <div
            key={key}
            className={key === 'heading' || key === 'agl' ? 'hidden sm:contents' : 'contents'}
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-mono tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <HudNotes
        isAtBcEdge={snapshot?.isAtBcEdge ?? false}
        isAtCeiling={snapshot?.isAtCeiling ?? false}
        isReducedDetail={isReducedDetail}
        isTileStalled={isTileStalled}
      />
    </Card>
  );
}
