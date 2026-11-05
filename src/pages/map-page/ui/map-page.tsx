// The only page: the full-screen map with every widget layered on top; owns the map status shared with the HUD.
import { useReducer } from 'react';

import { FirePopup } from '@/widgets/fire-popup';
import { FlightHud } from '@/widgets/hud';
import { INITIAL_MAP_STATUS, MapView, mergeMapStatus } from '@/widgets/map-view';
import { RouteBanner } from '@/widgets/route-banner';
import { SearchBar } from '@/widgets/search-bar';

import { useEscapeShortcut } from '../model/use-escape-shortcut';

export type MapPageProps = { mapboxToken: string; isDevBuild: boolean };

// Renders the map page: map underneath, widgets in a click-through overlay.
export function MapPage({ mapboxToken, isDevBuild }: MapPageProps) {
  const [mapStatus, patchMapStatus] = useReducer(mergeMapStatus, INITIAL_MAP_STATUS);
  useEscapeShortcut();
  return (
    <main className="relative h-dvh w-full overflow-hidden" aria-label="FireflyBC map">
      <MapView
        mapboxToken={mapboxToken}
        isDevBuild={isDevBuild}
        status={mapStatus}
        onStatusPatch={patchMapStatus}
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between gap-2 p-2 sm:p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-auto order-2 sm:order-1">
              <FlightHud
                isReducedDetail={mapStatus.isReducedDetail}
                isTileStalled={mapStatus.isTileStalled}
              />
            </div>
            <div className="pointer-events-auto order-1 flex w-full justify-center sm:order-2 sm:w-auto sm:flex-1">
              <SearchBar mapboxToken={mapboxToken} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 pb-8 sm:items-end sm:pb-6">
          <div className="pointer-events-auto flex w-full justify-center sm:w-auto sm:justify-end">
            <FirePopup />
          </div>
          <div className="pointer-events-auto flex w-full justify-center">
            <RouteBanner />
          </div>
        </div>
      </div>
    </main>
  );
}
