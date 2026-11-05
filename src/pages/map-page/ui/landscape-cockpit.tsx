// Phone landscape cockpit: the desktop layout at a smaller size, with the touch sticks along the bottom (§4.2).
import { FirePanel } from '@/widgets/fire-panel';
import { FirePopup } from '@/widgets/fire-popup';
import { FlightHud, NavCluster, OfflineBanner, PwaControls } from '@/widgets/hud';
import { Joystick } from '@/widgets/joystick';
import type { MapStatus } from '@/widgets/map-view';
import { RouteBanner } from '@/widgets/route-banner';
import { SearchBar } from '@/widgets/search-bar';

export type LandscapeCockpitProps = { mapboxToken: string; mapStatus: MapStatus };

// Renders a flight area on the left (HUD, search, nav, sticks) and the fire column on the right.
export function LandscapeCockpit({ mapboxToken, mapStatus }: LandscapeCockpitProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex gap-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))]">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start gap-2">
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
      <div className="flex w-64 shrink-0 flex-col">
        <div className="pointer-events-auto flex min-h-0 flex-col gap-2">
          <FirePanel isCompact isOpenByDefault />
          <FirePopup isCompact />
        </div>
      </div>
    </div>
  );
}
