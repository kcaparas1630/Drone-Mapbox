// The only page: the full-screen map with every widget layered on top; owns the map status shared with the HUD.
import { useReducer } from 'react';

import { INITIAL_MAP_STATUS, MapView, mergeMapStatus } from '@/widgets/map-view';

export type MapPageProps = { mapboxToken: string };

// Renders the map page.
export function MapPage({ mapboxToken }: MapPageProps) {
  const [mapStatus, patchMapStatus] = useReducer(mergeMapStatus, INITIAL_MAP_STATUS);
  return (
    <main className="relative h-dvh w-full overflow-hidden" aria-label="FireflyBC map">
      <MapView mapboxToken={mapboxToken} status={mapStatus} onStatusPatch={patchMapStatus} />
    </main>
  );
}
