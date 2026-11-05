// Tests the climb, cruise and descent legs of the route envelope.
import { describe, expect, it } from 'vitest';

import { computeEnvelopeAltitude } from './compute-envelope-altitude';

describe('computeEnvelopeAltitude', () => {
  it('climbs at 25 %, cruises 2 % of the distance above the higher end, then descends at 15 %', () => {
    const totalM = 50_000;
    expect(computeEnvelopeAltitude(0, totalM, 1000, 600)).toBe(1000);
    expect(computeEnvelopeAltitude(2000, totalM, 1000, 600)).toBe(1500);
    expect(computeEnvelopeAltitude(25_000, totalM, 1000, 600)).toBe(2000);
    expect(computeEnvelopeAltitude(48_000, totalM, 1000, 600)).toBe(900);
    expect(computeEnvelopeAltitude(totalM, totalM, 1000, 600)).toBe(600);
  });

  it('caps the cruise margin at 1,500 m and the altitude at the ceiling', () => {
    expect(computeEnvelopeAltitude(150_000, 300_000, 500, 500)).toBe(2000);
    expect(computeEnvelopeAltitude(150_000, 300_000, 11_500, 11_500)).toBe(12_000);
  });
});
