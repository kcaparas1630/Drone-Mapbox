// Tests which elements count as controls that Space presses.
import { describe, expect, it } from 'vitest';

import { isSpaceActivatedControl } from './is-space-activated-control';

// Returns an input of the given type.
function createInput(type: string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = type;
  return input;
}

describe('isSpaceActivatedControl', () => {
  it('counts buttons, checkboxes and button-like roles', () => {
    const roleSwitch = document.createElement('div');
    roleSwitch.setAttribute('role', 'switch');
    expect(isSpaceActivatedControl(document.createElement('button'))).toBe(true);
    expect(isSpaceActivatedControl(createInput('checkbox'))).toBe(true);
    expect(isSpaceActivatedControl(roleSwitch)).toBe(true);
  });

  it('leaves Space to the drone everywhere else', () => {
    expect(isSpaceActivatedControl(createInput('range'))).toBe(false);
    expect(isSpaceActivatedControl(document.createElement('div'))).toBe(false);
    expect(isSpaceActivatedControl(document.body)).toBe(false);
    expect(isSpaceActivatedControl(null)).toBe(false);
  });
});
