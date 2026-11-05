// Map health shown by overlays and HUD notes: style ready, context lost, auth failed, tiles stalled, reduced detail.

export type MapStatus = {
  isStyleLoaded: boolean;
  isContextLost: boolean;
  isAuthFailed: boolean;
  isTileStalled: boolean;
  isReducedDetail: boolean;
};

export type MapStatusPatch = Partial<MapStatus>;
