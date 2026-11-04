// Map status before the style loads: nothing failed, nothing ready yet.
import type { MapStatus } from './map-status.types';

export const INITIAL_MAP_STATUS: MapStatus = {
  isStyleLoaded: false,
  isContextLost: false,
  isAuthFailed: false,
  isTileStalled: false,
  isReducedDetail: false,
};
