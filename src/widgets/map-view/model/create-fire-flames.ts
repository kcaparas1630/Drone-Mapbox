// Instanced flame meshes for every fire, filled in once fire.glb loads; a ghost copy shows through terrain (ADR 023).
import { Group, type InstancedMesh } from 'three';

import { MAP_STYLE } from '../config/map-style';

export type FireFlames = {
  group: Group;
  inner: InstancedMesh | null;
  outer: InstancedMesh | null;
  ghost: InstancedMesh | null;
  phasesRad: Float64Array;
  anchorsM: Float64Array;
  renderedVersion: number;
  lastUpdateMs: number;
};

const GOLDEN_ANGLE_RAD = Math.PI * (3 - Math.sqrt(5));

// Returns an empty flame group with per-flame flicker phases spread by the golden angle.
export function createFireFlames(): FireFlames {
  const phasesRad = new Float64Array(MAP_STYLE.FIRE_FLAME_CAPACITY);
  phasesRad.forEach((unused, index) => {
    phasesRad[index] = (index * GOLDEN_ANGLE_RAD) % (2 * Math.PI);
  });
  return {
    group: new Group(),
    inner: null,
    outer: null,
    ghost: null,
    phasesRad,
    anchorsM: new Float64Array(MAP_STYLE.FIRE_FLAME_CAPACITY).fill(Number.NaN),
    renderedVersion: -1,
    lastUpdateMs: 0,
  };
}
