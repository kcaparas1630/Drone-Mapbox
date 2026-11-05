// Allocates the flame pick buffers once per loop context, sized for every fire (ADR 023).
import { FLAME_PLACEMENT_STRIDE } from '../config/flame-placement-stride';
import { MAP_STYLE } from '../config/map-style';
import type { FlamePicks } from './flame-picks.types';

// Returns empty pick buffers: x, y, z, width, height per flame plus a 4×4 projection.
export function createFlamePicks(): FlamePicks {
  return {
    count: 0,
    placements: new Float64Array(MAP_STYLE.FIRE_FLAME_CAPACITY * FLAME_PLACEMENT_STRIDE),
    fireIndices: new Int32Array(MAP_STYLE.FIRE_FLAME_CAPACITY),
    projection: new Float64Array(16),
  };
}
