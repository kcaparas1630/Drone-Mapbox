// Finds the flame under a screen point by projecting each flame's base and tip; the nearest hit wins (ADR 023).
import { FIRE_MODEL } from '@/entities/fire';

import { FLAME_PLACEMENT_STRIDE } from '../config/flame-placement-stride';
import type { FlamePicks } from '../model/flame-picks.types';

const MIN_HIT_WIDTH_PX = 24;
const MIN_HIT_HEIGHT_PX = 24;

type ScreenPoint = { x: number; y: number; depth: number };

// Projects a local-frame point through the column-major projection to CSS pixels, or null behind the camera.
function projectToScreen(
  projection: Float64Array,
  point: readonly [number, number, number],
  widthPx: number,
  heightPx: number,
): ScreenPoint | null {
  const [x, y, z] = point;
  const element = (index: number) => projection[index] ?? 0;
  const clipX = element(0) * x + element(4) * y + element(8) * z + element(12);
  const clipY = element(1) * x + element(5) * y + element(9) * z + element(13);
  const clipW = element(3) * x + element(7) * y + element(11) * z + element(15);
  if (clipW <= 0) {
    return null;
  }
  return {
    x: ((clipX / clipW + 1) / 2) * widthPx,
    y: ((1 - clipY / clipW) / 2) * heightPx,
    depth: clipW,
  };
}

// Returns the fire index of the nearest flame whose on-screen box contains the point, or -1.
export function findFlameAtPoint(
  picks: FlamePicks,
  pointXPx: number,
  pointYPx: number,
  widthPx: number,
  heightPx: number,
): number {
  let bestIndex = -1;
  let bestDepth = Number.POSITIVE_INFINITY;
  for (let slot = 0; slot < picks.count; slot += 1) {
    const offset = slot * FLAME_PLACEMENT_STRIDE;
    const x = picks.placements[offset] ?? 0;
    const y = picks.placements[offset + 1] ?? 0;
    const z = picks.placements[offset + 2] ?? 0;
    const flameHeight = picks.placements[offset + 4] ?? 0;
    const base = projectToScreen(picks.projection, [x, y, z], widthPx, heightPx);
    const tip = projectToScreen(picks.projection, [x, y, z + flameHeight], widthPx, heightPx);
    if (base === null || tip === null) {
      continue;
    }
    const spanPx = Math.max(MIN_HIT_HEIGHT_PX, Math.abs(base.y - tip.y));
    const halfWidthPx = Math.max(MIN_HIT_WIDTH_PX, spanPx * FIRE_MODEL.WIDTH_RATIO) / 2;
    const centreYPx = (base.y + tip.y) / 2;
    const isInside =
      Math.abs(pointXPx - (base.x + tip.x) / 2) <= halfWidthPx &&
      Math.abs(pointYPx - centreYPx) <= spanPx / 2;
    if (isInside && base.depth < bestDepth) {
      bestDepth = base.depth;
      bestIndex = picks.fireIndices[slot] ?? -1;
    }
  }
  return bestIndex;
}
