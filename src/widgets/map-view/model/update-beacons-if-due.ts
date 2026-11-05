// Refreshes beacon instances when the feed changed, the origin moved, or 250 ms passed; pulses every frame.
import type { Map as MapboxMap } from 'mapbox-gl';

import { MAP_STYLE } from '../config/map-style';
import { applyBeaconPulse } from './apply-beacon-pulse';
import type { FireBeacons } from './create-fire-beacons';
import type { FrameLoopContext } from './frame-loop-context';
import type { SceneOrigin } from './scene-origin';
import { updateFireBeacons } from './update-fire-beacons';

// Updates beacon matrices only when needed and the halo pulse each frame, without allocating.
export function updateBeaconsIfDue(
  beacons: FireBeacons,
  context: FrameLoopContext,
  origin: SceneOrigin,
  map: MapboxMap,
  nowMs: number,
  isOriginRebased: boolean,
): void {
  const { fireBeacons, flags, world } = context;
  const isNewFeed = fireBeacons.version !== beacons.renderedVersion;
  if (isNewFeed) {
    beacons.anchorsM.fill(Number.NaN);
    beacons.renderedVersion = fireBeacons.version;
  }
  if (
    isNewFeed ||
    isOriginRebased ||
    nowMs - beacons.lastUpdateMs >= MAP_STYLE.BEACON_UPDATE_INTERVAL_MS
  ) {
    beacons.lastUpdateMs = nowMs;
    updateFireBeacons(beacons, fireBeacons.fires, world, origin, map);
  }
  applyBeaconPulse(beacons, nowMs / 1000, !flags.isReducedMotion && !flags.isReducedDetail);
}
