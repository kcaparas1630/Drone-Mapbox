// The map widget: one full-screen Mapbox map with terrain plus overlays for states where it cannot render.
import { useRef } from 'react';

import { BC_BOUNDING_BOX } from '@/shared/config';
import { useOnlineStatus } from '@/shared/lib/browser';

import type { MapStatus, MapStatusPatch } from '../model/map-status.types';
import { useMapboxMap } from '../model/use-mapbox-map';
import { MapStatusOverlay } from './map-status-overlay';

export type MapViewProps = {
  mapboxToken: string;
  status: MapStatus;
  onStatusPatch: (patch: MapStatusPatch) => void;
};

// Renders the map container and its status overlay.
export function MapView({ mapboxToken, status, onStatusPatch }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();
  useMapboxMap({
    containerRef,
    accessToken: mapboxToken,
    centreLng: BC_BOUNDING_BOX.CENTRE_LNG,
    centreLat: BC_BOUNDING_BOX.CENTRE_LAT,
    onStatusPatch,
  });
  return (
    <div className="absolute inset-0 bg-background">
      <div ref={containerRef} className="h-full w-full" data-testid="map-container" />
      <MapStatusOverlay status={status} isOnline={isOnline} />
    </div>
  );
}
