// Detects controls that Space presses, so a keyboard user's Space reaches them instead of climbing (behaviour §3.1).

const SPACE_ACTIVATED_CONTROLS = [
  'button',
  'summary',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="option"]',
].join(', ');

// Returns true for buttons, checkboxes and the other elements the browser activates with Space.
export function isSpaceActivatedControl(target: EventTarget | null): boolean {
  if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) {
    return false;
  }
  return target.matches(SPACE_ACTIVATED_CONTROLS);
}
