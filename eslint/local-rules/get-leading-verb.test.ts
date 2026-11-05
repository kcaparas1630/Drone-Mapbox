// Tests detection of the approved leading verb in camelCase identifiers.
import { describe, expect, it } from 'vitest';

import { getLeadingVerb } from './get-leading-verb';

describe('getLeadingVerb', () => {
  it('returns the verb before an acronym', () => {
    expect(getLeadingVerb('fetchBCWildfireData')).toBe('fetch');
  });

  it('returns a verb that is the whole name', () => {
    expect(getLeadingVerb('render')).toBe('render');
  });

  it('returns null when the leading word merely starts with a verb', () => {
    expect(getLeadingVerb('stepper')).toBeNull();
    expect(getLeadingVerb('tokenize')).toBeNull();
  });

  it('returns null for nouns and PascalCase names', () => {
    expect(getLeadingVerb('droneThing')).toBeNull();
    expect(getLeadingVerb('FirePopup')).toBeNull();
  });
});
