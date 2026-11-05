// Re-places flames when the feed changed, the origin moved or 250 ms passed; flickers and records picks every frame.
import type { Map as MapboxMap } from 'mapbox-gl';
import type { Matrix4 } from 'three';

import { MAP_STYLE } from '../config/map-style';
import { applyFlameFlicker } from './apply-flame-flicker';
import type { FireFlames } from './create-fire-flames';
import type { FrameLoopContext } from './frame-loop-context';
import type { SceneOrigin } from './scene-origin';
import { updateFireFlames } from './update-fire-flames';

// Updates flame placements only when needed, then this frame's matrices and the projection used for picking.
export function updateFlamesIfDue(
  flames: FireFlames,
  context: FrameLoopContext,
  origin: SceneOrigin,
  map: MapboxMap,
  nowMs: number,
  isOriginRebased: boolean,
  projection: Matrix4,
): void {
  const { fireFeed, flamePicks, flags, cameraPose } = context;
  const isNewFeed = fireFeed.version !== flames.renderedVersion;
  if (isNewFeed) {
    flames.anchorsM.fill(Number.NaN);
    flames.renderedVersion = fireFeed.version;
  }
  if (
    isNewFeed ||
    isOriginRebased ||
    nowMs - flames.lastUpdateMs >= MAP_STYLE.FLAME_UPDATE_INTERVAL_MS
  ) {
    flames.lastUpdateMs = nowMs;
    updateFireFlames(flames, flamePicks, fireFeed.fires, cameraPose, origin, map);
  }
  applyFlameFlicker(
    flames,
    flamePicks,
    nowMs / 1000,
    !flags.isReducedMotion && !flags.isReducedDetail,
  );
  for (let index = 0; index < 16; index += 1) {
    flamePicks.projection[index] = projection.elements[index] ?? 0;
  }
}
