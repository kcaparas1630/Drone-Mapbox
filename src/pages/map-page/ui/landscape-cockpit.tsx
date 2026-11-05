// Phone landscape cockpit: the desktop layout at a smaller size, with the touch sticks along the bottom (§4.2).
import { useState } from 'react';

import { selectSelectedFireNumber } from '@/entities/fire';
import { useAppSelector } from '@/shared/lib/redux';
import { cn } from '@/shared/ui';
import { FirePanel } from '@/widgets/fire-panel';
import { FirePopup } from '@/widgets/fire-popup';
import { FlightHud, NavCluster, OfflineBanner, PwaControls } from '@/widgets/hud';
import { Joystick } from '@/widgets/joystick';
import type { MapStatus } from '@/widgets/map-view';
import { RouteBanner } from '@/widgets/route-banner';
import { SearchBar } from '@/widgets/search-bar';

export type LandscapeCockpitProps = { mapboxToken: string; mapStatus: MapStatus };

// Renders a grid whose fire column is full height only while the list or a fire is open, else just its header.
export function LandscapeCockpit({ mapboxToken, mapStatus }: LandscapeCockpitProps) {
  const [isFirePanelOpen, setIsFirePanelOpen] = useState(false);
  const isFireSelected = useAppSelector(selectSelectedFireNumber) !== null;
  const isFireColumnTall = isFirePanelOpen || isFireSelected;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_minmax(0,1fr)] gap-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))]">
      <div className="col-[1/2] row-[1/2] flex items-start gap-2">
        <div className="pointer-events-auto shrink-0">
          <FlightHud
            isCompact
            isReducedDetail={mapStatus.isReducedDetail}
            isTileStalled={mapStatus.isTileStalled}
          />
        </div>
        <div className="pointer-events-auto flex min-w-0 flex-1 justify-center">
          <SearchBar mapboxToken={mapboxToken} />
        </div>
        <div className="pointer-events-auto shrink-0 empty:hidden">
          <PwaControls isCompact />
        </div>
      </div>
      <div
        className={cn(
          'pointer-events-auto col-[2/3] flex min-h-0 flex-col gap-2',
          isFireColumnTall ? 'row-[1/3] w-64' : 'row-[1/2]',
        )}
      >
        <FirePanel isCompact isOpenByDefault={false} onOpenChange={setIsFirePanelOpen} />
        <FirePopup isCompact />
      </div>
      <div
        className={cn(
          'row-[2/3] flex min-h-0 flex-col gap-2',
          isFireColumnTall ? 'col-[1/2]' : 'col-[1/3]',
        )}
      >
        <div className="flex justify-center">
          <div className="pointer-events-auto">
            <OfflineBanner />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-end justify-between gap-2">
          <div className="pointer-events-auto shrink-0">
            <NavCluster mapboxToken={mapboxToken} variant="compact" />
          </div>
          <div className="pointer-events-auto flex min-w-0 flex-1 justify-center">
            <RouteBanner />
          </div>
        </div>
        <Joystick isCompact />
      </div>
    </div>
  );
}
