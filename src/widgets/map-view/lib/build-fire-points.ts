// GeoJSON points for the fire hit-test layer, carrying only what hover and click need (ADR 015).
import type { Feature, FeatureCollection, Point } from 'geojson';

import { FIRE_STATUS_PALETTE, type Fire } from '@/entities/fire';

export type FirePointsProperties = {
  fireNumber: string;
  incidentName: string;
  statusLabel: string;
  color: string;
};

// Returns one point feature per fire with its status colour and label.
export function buildFirePoints(
  fires: readonly Fire[],
): FeatureCollection<Point, FirePointsProperties> {
  const features = fires.map((fire): Feature<Point, FirePointsProperties> => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [fire.lng, fire.lat] },
    properties: {
      fireNumber: fire.fireNumber,
      incidentName: fire.incidentName,
      statusLabel: fire.status === 'Unknown' ? fire.rawStatus : fire.status,
      color: FIRE_STATUS_PALETTE[fire.status],
    },
  }));
  return { type: 'FeatureCollection', features };
}
