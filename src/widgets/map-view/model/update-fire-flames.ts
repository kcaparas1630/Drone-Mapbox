// Re-places every flame in the local frame: terrain anchor, height from size, status and camera distance (ADR 023).
import type { Map as MapboxMap } from 'mapbox-gl';
import { Color } from 'three';

import { computeFlameHeight, FIRE_MODEL, type Fire } from '@/entities/fire';
import type { ChaseCameraPose } from '@/entities/map-camera';
import { sampleTerrainElevation } from '@/entities/terrain';
import {
  computeHaversineDistance,
  computeMercatorUnitsPerMeter,
  type MercatorPoint,
  projectToMercator,
} from '@/shared/lib/geo';

import { MAP_STYLE } from '../config/map-style';
import type { FireFlames } from './create-fire-flames';
import { FLAME_PLACEMENT_STRIDE } from '../config/flame-placement-stride';
import type { FlamePicks } from './flame-picks.types';
import type { SceneOrigin } from './scene-origin';

const MIN_TINT = 0.55;
const scratchMercator: MercatorPoint = { x: 0, y: 0, z: 0 };
const scratchTint = new Color();

// Writes one flame's placement and tint at slot; the dimmer tint marks calmer statuses.
function setFlamePlacement(
  flames: FireFlames,
  picks: FlamePicks,
  slot: number,
  fire: Fire,
  heightM: number,
  origin: SceneOrigin,
): void {
  const anchorM = flames.anchorsM[slot] ?? Number.NaN;
  const groundM = Number.isNaN(anchorM) ? 0 : anchorM;
  projectToMercator(
    scratchMercator,
    fire.lng,
    fire.lat,
    groundM + heightM * FIRE_MODEL.HOVER_FRACTION,
  );
  const scale = computeMercatorUnitsPerMeter(fire.lat) / origin.unitsPerMeter;
  const offset = slot * FLAME_PLACEMENT_STRIDE;
  picks.placements[offset] = (scratchMercator.x - origin.x) / origin.unitsPerMeter;
  picks.placements[offset + 1] = (scratchMercator.y - origin.y) / origin.unitsPerMeter;
  picks.placements[offset + 2] = scratchMercator.z / origin.unitsPerMeter;
  picks.placements[offset + 3] = heightM * FIRE_MODEL.WIDTH_RATIO * scale;
  picks.placements[offset + 4] = heightM * scale;
  scratchTint.setScalar(MIN_TINT + (1 - MIN_TINT) * FIRE_MODEL.STATUS_SCALE[fire.status]);
  flames.inner?.setColorAt(slot, scratchTint);
  flames.outer?.setColorAt(slot, scratchTint);
  flames.ghost?.setColorAt(slot, scratchTint);
}

// Places a flame for every fire that is not Out; the anchor is sampled once per fire from loaded terrain.
export function updateFireFlames(
  flames: FireFlames,
  picks: FlamePicks,
  fires: readonly Fire[],
  cameraPose: ChaseCameraPose,
  origin: SceneOrigin,
  map: MapboxMap,
): void {
  const viewportHeightPx = map.getContainer().clientHeight;
  const fireCount = Math.min(fires.length, MAP_STYLE.FIRE_FLAME_CAPACITY);
  let slot = 0;
  for (let index = 0; index < fireCount; index += 1) {
    const fire = fires[index];
    if (fire === undefined || FIRE_MODEL.STATUS_SCALE[fire.status] === 0) {
      continue;
    }
    if (Number.isNaN(flames.anchorsM[slot] ?? Number.NaN)) {
      flames.anchorsM[slot] = sampleTerrainElevation(map, fire.lng, fire.lat) ?? Number.NaN;
    }
    const anchorM = flames.anchorsM[slot] ?? Number.NaN;
    const groundDistanceM = computeHaversineDistance(
      cameraPose.lng,
      cameraPose.lat,
      fire.lng,
      fire.lat,
    );
    const distanceM = Math.hypot(
      groundDistanceM,
      cameraPose.altitudeMsl - (Number.isNaN(anchorM) ? 0 : anchorM),
    );
    const heightM = computeFlameHeight(fire.sizeHa, fire.status, distanceM, viewportHeightPx);
    setFlamePlacement(flames, picks, slot, fire, heightM, origin);
    picks.fireIndices[slot] = index;
    slot += 1;
  }
  picks.count = flames.inner === null ? 0 : slot;
  if (flames.inner?.instanceColor != null) {
    flames.inner.instanceColor.needsUpdate = true;
  }
  if (flames.outer?.instanceColor != null) {
    flames.outer.instanceColor.needsUpdate = true;
  }
  if (flames.ghost?.instanceColor != null) {
    flames.ghost.instanceColor.needsUpdate = true;
  }
}
