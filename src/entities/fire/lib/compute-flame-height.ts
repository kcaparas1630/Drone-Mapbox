// Flame height: grows with fire size (log scale), never under ~32 px on screen, scaled by status (ADR 023).
import { FIRE_MODEL } from '../config/fire-model';
import type { FireStatus } from '../model/fire.types';

const {
  BASE_HEIGHT_M,
  HEIGHT_PER_DECADE_M,
  MAX_SIZE_HEIGHT_M,
  MIN_SCREEN_HEIGHT_PX,
  PIXELS_PER_RADIAN_FACTOR,
  STATUS_SCALE,
} = FIRE_MODEL;

// Returns the flame height in metres for a fire seen from distanceM on a viewport viewportHeightPx tall; 0 hides it.
export function computeFlameHeight(
  sizeHa: number | null,
  status: FireStatus,
  distanceM: number,
  viewportHeightPx: number,
): number {
  const sizeHeightM = Math.min(
    MAX_SIZE_HEIGHT_M,
    BASE_HEIGHT_M + HEIGHT_PER_DECADE_M * Math.log10(1 + Math.max(0, sizeHa ?? 0)),
  );
  const pixelsPerMetre =
    (PIXELS_PER_RADIAN_FACTOR * Math.max(1, viewportHeightPx)) / Math.max(1, distanceM);
  const minimumHeightM = MIN_SCREEN_HEIGHT_PX / pixelsPerMetre;
  return Math.max(sizeHeightM, minimumHeightM) * STATUS_SCALE[status];
}
