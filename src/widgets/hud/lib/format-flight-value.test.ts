// Tests HUD value formatting for speed, altitude, heading and missing values.
import { describe, expect, it } from 'vitest';

import { formatFlightValue } from './format-flight-value';

describe('formatFlightValue', () => {
  it('shows speed in km/h with separators', () => {
    expect(formatFlightValue('speed', 150)).toBe('540 km/h');
    expect(formatFlightValue('speed', -10)).toBe('36 km/h');
    expect(formatFlightValue('speed', 30_000)).toBe('108,000 km/h');
  });

  it('shows altitude in metres', () => {
    expect(formatFlightValue('altitude', 1234.4)).toBe('1,234 m');
  });

  it('shows heading with the nearest compass point and wraps 360', () => {
    expect(formatFlightValue('heading', 0)).toBe('0° N');
    expect(formatFlightValue('heading', 157)).toBe('157° SE');
    expect(formatFlightValue('heading', 359.6)).toBe('0° N');
  });

  it('shows a dash for unknown values such as AGL without terrain', () => {
    expect(formatFlightValue('altitude', null)).toBe('—');
    expect(formatFlightValue('speed', Number.NaN)).toBe('—');
  });
});
