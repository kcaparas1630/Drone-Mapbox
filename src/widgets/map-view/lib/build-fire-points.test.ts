// Tests the hit-test GeoJSON: coordinates, status colour and the raw label for unknown statuses.
import { describe, expect, it } from 'vitest';

import type { Fire } from '@/entities/fire';

import { buildFirePoints } from './build-fire-points';

const FIRE: Fire = {
  fireNumber: 'K52001',
  incidentName: 'McDougall Creek',
  status: 'Out of Control',
  rawStatus: 'Out of Control',
  isFireOfNote: true,
  sizeHa: 100,
  ignitionDateMs: null,
  location: null,
  cause: null,
  incidentUrl: null,
  lng: -119.6,
  lat: 49.9,
};

describe('buildFirePoints', () => {
  it('builds a point per fire with its status colour', () => {
    const collection = buildFirePoints([FIRE]);
    expect(collection.features[0]).toEqual({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-119.6, 49.9] },
      properties: {
        fireNumber: 'K52001',
        incidentName: 'McDougall Creek',
        statusLabel: 'Out of Control',
        color: '#FF0000',
      },
    });
  });

  it('shows the raw BCWS text and grey for unknown statuses', () => {
    const collection = buildFirePoints([{ ...FIRE, status: 'Unknown', rawStatus: 'Smouldering' }]);
    expect(collection.features[0]?.properties).toMatchObject({
      statusLabel: 'Smouldering',
      color: '#9CA3AF',
    });
  });
});
