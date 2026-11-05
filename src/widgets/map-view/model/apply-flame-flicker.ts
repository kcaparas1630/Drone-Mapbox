// Writes every flame's matrix for this frame from its placement and flicker; still under reduced motion (§7).
import { Matrix4 } from 'three';

import { computeFlameFlicker, type FlameFlicker } from '@/entities/fire';

import type { FireFlames } from './create-fire-flames';
import { FLAME_PLACEMENT_STRIDE } from '../config/flame-placement-stride';
import type { FlamePicks } from './flame-picks.types';

const scratchMatrix = new Matrix4();
const scratchFlicker: FlameFlicker = { heightScale: 1, widthScale: 1 };

// Sets the instance matrices and counts of both flame meshes, without allocating.
export function applyFlameFlicker(
  flames: FireFlames,
  picks: FlamePicks,
  timeS: number,
  isFlickerEnabled: boolean,
): void {
  const { inner, outer, ghost } = flames;
  if (inner === null || outer === null || ghost === null) {
    return;
  }
  for (let slot = 0; slot < picks.count; slot += 1) {
    const offset = slot * FLAME_PLACEMENT_STRIDE;
    computeFlameFlicker(scratchFlicker, timeS, flames.phasesRad[slot] ?? 0, isFlickerEnabled);
    const widthScale = (picks.placements[offset + 3] ?? 0) * scratchFlicker.widthScale;
    scratchMatrix
      .makeScale(
        widthScale,
        widthScale,
        (picks.placements[offset + 4] ?? 0) * scratchFlicker.heightScale,
      )
      .setPosition(
        picks.placements[offset] ?? 0,
        picks.placements[offset + 1] ?? 0,
        picks.placements[offset + 2] ?? 0,
      );
    inner.setMatrixAt(slot, scratchMatrix);
    outer.setMatrixAt(slot, scratchMatrix);
    ghost.setMatrixAt(slot, scratchMatrix);
  }
  inner.count = picks.count;
  outer.count = picks.count;
  ghost.count = picks.count;
  inner.instanceMatrix.needsUpdate = true;
  outer.instanceMatrix.needsUpdate = true;
  ghost.instanceMatrix.needsUpdate = true;
}
