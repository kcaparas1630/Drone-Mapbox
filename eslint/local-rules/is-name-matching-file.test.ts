// Tests export-name to file-name matching across naming styles, acronyms and verb prefixes.
import { describe, expect, it } from 'vitest';

import { isNameMatchingFile } from './is-name-matching-file';

describe('isNameMatchingFile', () => {
  it('matches camelCase functions and PascalCase components', () => {
    expect(isNameMatchingFile('loadDroneModel', 'load-drone-model')).toBe(true);
    expect(isNameMatchingFile('FirePopup', 'fire-popup')).toBe(true);
  });

  it('matches acronyms and UPPER_SNAKE constants', () => {
    expect(isNameMatchingFile('fetchBCWildfireData', 'fetch-bc-wildfire-data')).toBe(true);
    expect(isNameMatchingFile('BC_BOUNDING_BOX', 'bc-bounding-box')).toBe(true);
  });

  it('accepts an approved verb in front of the file name', () => {
    expect(isNameMatchingFile('createSimWorld', 'sim-world')).toBe(true);
  });

  it('rejects unrelated names', () => {
    expect(isNameMatchingFile('formatSpeed', 'hud')).toBe(false);
    expect(isNameMatchingFile('droneThing', 'sim-world')).toBe(false);
  });
});
