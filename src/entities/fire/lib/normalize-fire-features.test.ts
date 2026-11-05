// Tests normalisation: field mapping, dropped points, duplicates, statuses, links and hostile text.
import { describe, expect, it } from 'vitest';

import type { FireFeature } from '../model/fire.schema';
import { normalizeFireFeatures } from './normalize-fire-features';

// Builds a feature at the given point with property overrides.
function buildFeature(
  coordinates: number[] | null,
  overrides: Partial<FireFeature['properties']> = {},
): FireFeature {
  return {
    type: 'Feature',
    geometry: coordinates === null ? null : { type: 'Point', coordinates },
    properties: {
      FIRE_NUMBER: 'K52001',
      INCIDENT_NAME: 'McDougall Creek',
      FIRE_STATUS: 'Out of Control',
      CURRENT_SIZE: 13_970,
      IGNITION_DATE: 1_692_000_000_000,
      GEOGRAPHIC_DESCRIPTION: 'West Kelowna',
      FIRE_URL: 'https://wildfiresituation.nrs.gov.bc.ca/incidents?incidentNumber=K52001',
      FIRE_OF_NOTE_IND: 'Y',
      FIRE_CAUSE: 'Lightning',
      FIRE_CENTRE: 5,
      ...overrides,
    },
  };
}

describe('normalizeFireFeatures', () => {
  it('maps ArcGIS fields to a Fire', () => {
    const { fires } = normalizeFireFeatures([buildFeature([-119.6, 49.9])]);
    expect(fires[0]).toEqual({
      fireNumber: 'K52001',
      incidentName: 'McDougall Creek',
      status: 'Out of Control',
      rawStatus: 'Out of Control',
      isFireOfNote: true,
      sizeHa: 13_970,
      ignitionDateMs: 1_692_000_000_000,
      location: 'West Kelowna',
      cause: 'Lightning',
      incidentUrl: 'https://wildfiresituation.nrs.gov.bc.ca/incidents?incidentNumber=K52001',
      lng: -119.6,
      lat: 49.9,
    });
  });

  it('drops missing, malformed and out-of-BC points and counts them', () => {
    const result = normalizeFireFeatures([
      buildFeature(null),
      buildFeature([-119.6]),
      buildFeature([-100, 49]),
      buildFeature([Number.NaN, 49]),
    ]);
    expect(result).toEqual({ fires: [], droppedCount: 4, duplicateCount: 0 });
  });

  it('keeps the last of duplicate fire numbers and counts the duplicate', () => {
    const result = normalizeFireFeatures([
      buildFeature([-119.6, 49.9], { CURRENT_SIZE: 1 }),
      buildFeature([-119.6, 49.9], { CURRENT_SIZE: 2 }),
    ]);
    expect(result.fires.map((fire) => fire.sizeHa)).toEqual([2]);
    expect(result.duplicateCount).toBe(1);
  });

  it('keeps unknown statuses as raw text and drops disallowed links', () => {
    const { fires } = normalizeFireFeatures([
      buildFeature([-119.6, 49.9], {
        FIRE_STATUS: 'Smouldering',
        FIRE_URL: 'https://evil.example/',
        FIRE_OF_NOTE_IND: 'N',
        INCIDENT_NAME: '  ',
        CURRENT_SIZE: -5,
        IGNITION_DATE: null,
      }),
    ]);
    expect(fires[0]).toMatchObject({
      status: 'Unknown',
      rawStatus: 'Smouldering',
      incidentUrl: null,
      isFireOfNote: false,
      incidentName: 'K52001',
      sizeHa: null,
      ignitionDateMs: null,
    });
  });

  it('keeps hostile text as plain data for React to render as text', () => {
    const { fires } = normalizeFireFeatures([
      buildFeature([-119.6, 49.9], { INCIDENT_NAME: '<img src=x onerror=alert(1)>' }),
    ]);
    expect(fires[0]?.incidentName).toBe('<img src=x onerror=alert(1)>');
  });
});
