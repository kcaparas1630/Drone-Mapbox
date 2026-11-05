// The map widget: one full-screen Mapbox map with terrain, the flying drone and status overlays.
import { useRef, useState } from 'react';

import { loadSavedDroneState, restoreDroneSpawn } from '@/entities/drone';
import { useOnlineStatus } from '@/shared/lib/browser';
import { reportError } from '@/shared/lib/report-error';

import type { MapStatus, MapStatusPatch } from '../model/map-status.types';
import { useActiveFireFeed } from '../model/use-active-fire-feed';
import { useDroneSimulation } from '../model/use-drone-simulation';
import type { FireHover } from '../model/fire-hover.types';
import { useFirePointsLayer } from '../model/use-fire-points-layer';
import { useMapboxMap } from '../model/use-mapbox-map';
import { useRouteLine } from '../model/use-route-line';
import { FireTooltip } from './fire-tooltip';
import { MapStatusOverlay } from './map-status-overlay';

export type MapViewProps = {
  mapboxToken: string;
  isDevBuild: boolean;
  status: MapStatus;
  onStatusPatch: (patch: MapStatusPatch) => void;
};

// Restores the launch spawn once, warning when a saved position had to be discarded.
function readLaunchSpawn() {
  const { spawn, rejectionReason } = restoreDroneSpawn(loadSavedDroneState());
  if (rejectionReason !== null) {
    reportError(rejectionReason, 'drone persistence', 'warn');
  }
  return spawn;
}

// Renders the map container, starts the drone on it and shows the status overlay.
export function MapView({ mapboxToken, isDevBuild, status, onStatusPatch }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spawn] = useState(readLaunchSpawn);
  const isOnline = useOnlineStatus();
  const [fireHover, setFireHover] = useState<FireHover | null>(null);
  const fires = useActiveFireFeed();
  const map = useMapboxMap({
    containerRef,
    accessToken: mapboxToken,
    centreLng: spawn.lng,
    centreLat: spawn.lat,
    onStatusPatch,
  });
  useDroneSimulation(map, spawn, isDevBuild);
  useRouteLine(map);
  useFirePointsLayer(map, fires, setFireHover);
  return (
    <div className="absolute inset-0 bg-background">
      <div ref={containerRef} className="h-full w-full touch-none" data-testid="map-container" />
      <FireTooltip hover={fireHover} />
      <MapStatusOverlay status={status} isOnline={isOnline} />
    </div>
  );
}
