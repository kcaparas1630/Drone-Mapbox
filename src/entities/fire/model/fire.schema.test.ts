// Tests the BCWS page schema against a real-shaped feature, the ArcGIS error body and schema drift.
import { describe, expect, it } from 'vitest';

import { fireFeedPageSchema } from './fire.schema';

const FEATURE = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [-121.45, 49.89] },
  properties: {
    FIRE_NUMBER: 'V10742',
    INCIDENT_NAME: 'Brunswick Creek',
    FIRE_STATUS: 'Under Control',
    CURRENT_SIZE: 9543,
    IGNITION_DATE: 1_783_020_034_000,
    GEOGRAPHIC_DESCRIPTION: 'Brunswick Creek',
    FIRE_URL:
      'https://wildfiresituation.nrs.gov.bc.ca/incidents?fireYear=2026&incidentNumber=V10742',
    FIRE_OF_NOTE_IND: 'N',
    FIRE_CAUSE: 'Person',
    FIRE_CENTRE: 2,
    UNEXPECTED_FIELD: '<script>',
  },
};

describe('fireFeedPageSchema', () => {
  it('accepts a page with the paging flag and strips unknown properties', () => {
    const page = fireFeedPageSchema.parse({
      type: 'FeatureCollection',
      crs: { type: 'name' },
      properties: { exceededTransferLimit: true },
      features: [FEATURE],
    });
    expect(page.properties?.exceededTransferLimit).toBe(true);
    expect(page.features[0]?.properties).not.toHaveProperty('UNEXPECTED_FIELD');
  });

  it('accepts the last page, which has no properties block', () => {
    expect(fireFeedPageSchema.safeParse({ type: 'FeatureCollection', features: [] }).success).toBe(
      true,
    );
  });

  it('rejects the ArcGIS error body served with HTTP 200', () => {
    const errorBody = {
      error: { code: 400, message: '', details: ["'where' parameter is invalid"] },
    };
    expect(fireFeedPageSchema.safeParse(errorBody).success).toBe(false);
  });

  it('rejects a feature that lost its fire number (schema drift)', () => {
    const drifted = { ...FEATURE, properties: { ...FEATURE.properties, FIRE_NUMBER: undefined } };
    const page = { type: 'FeatureCollection', features: [drifted] };
    expect(fireFeedPageSchema.safeParse(page).success).toBe(false);
  });
});
