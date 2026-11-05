// Tests the keyboard mapping: WASD and arrows, climb/descend, boost and cancelling keys.
import { describe, expect, it } from 'vitest';

import { createDroneInput } from '@/entities/drone';

import { computeKeyboardInput } from './compute-keyboard-input';

// Returns the input produced by holding the given key codes.
function readInputFor(codes: string[]) {
  const out = createDroneInput();
  computeKeyboardInput(new Set(codes), out);
  return out;
}

describe('computeKeyboardInput', () => {
  it('maps W/arrow up to forward and A/D to yaw (right is positive)', () => {
    expect(readInputFor(['KeyW', 'KeyD'])).toEqual({
      forward: 1,
      yaw: 1,
      vertical: 0,
      isBoosting: false,
    });
    expect(readInputFor(['ArrowDown', 'ArrowLeft'])).toMatchObject({ forward: -1, yaw: -1 });
  });

  it('climbs with Space, descends with Shift and boosts with Ctrl or E', () => {
    expect(readInputFor(['Space', 'ControlLeft'])).toMatchObject({ vertical: 1, isBoosting: true });
    expect(readInputFor(['ShiftRight', 'KeyE'])).toMatchObject({ vertical: -1, isBoosting: true });
  });

  it('cancels opposite keys', () => {
    expect(readInputFor(['KeyW', 'KeyS', 'Space', 'ShiftLeft'])).toMatchObject({
      forward: 0,
      vertical: 0,
    });
  });
});
