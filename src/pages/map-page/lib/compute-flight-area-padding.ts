// Camera padding that draws the drone in the clear band between the landscape top row and bottom bar (§4.2).
import { getDroneDropRatio } from '@/entities/map-camera';
import { CAMERA_TUNING } from '@/shared/config';
import type { CameraPadding } from '@/widgets/map-view';

type VerticalEdges = { top: number; bottom: number };

const NO_PADDING: CameraPadding = { topPx: 0, bottomPx: 0 };

// Returns padding whose centre of view puts the drone LANDSCAPE_DRONE_BAND_RATIO down the band; none if no band.
export function computeFlightAreaPadding(
  overlay: VerticalEdges,
  topRow: VerticalEdges,
  bottomBar: VerticalEdges,
): CameraPadding {
  const heightPx = overlay.bottom - overlay.top;
  const bandTopPx = Math.max(0, topRow.bottom - overlay.top);
  const bandBottomPx = Math.min(heightPx, bottomBar.top - overlay.top);
  if (bandBottomPx <= bandTopPx) {
    return NO_PADDING;
  }
  const droneYPx =
    bandTopPx + (bandBottomPx - bandTopPx) * CAMERA_TUNING.LANDSCAPE_DRONE_BAND_RATIO;
  const centreYPx = droneYPx - getDroneDropRatio() * heightPx;
  const shiftPx = Math.round(heightPx - 2 * centreYPx);
  return shiftPx >= 0 ? { topPx: 0, bottomPx: shiftPx } : { topPx: -shiftPx, bottomPx: 0 };
}
