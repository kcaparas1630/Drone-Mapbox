// Tests perimeter normalisation: outer rings kept, holes and bad rings dropped, last duplicate wins.
import { describe, expect, it } from 'vitest';

import type { FirePerimeterFeature } from '../model/fire-perimeter.schema';
import { normalizeFirePerimeters } from './normalize-fire-perimeters';

const OUTER = [
  [-122.2, 51.6],
  [-122.3, 51.6],
  [-122.3, 51.7],
  [-122.2, 51.6],
];
const HOLE = [
  [-122.25, 51.62],
  [-122.26, 51.62],
  [-122.26, 51.63],
  [-122.25, 51.62],
];

// Builds a perimeter feature for a fire number and geometry.
function buildFeature(
  fireNumber: string,
  geometry: FirePerimeterFeature['geometry'],
  sizeHa: number | null = 10,
): FirePerimeterFeature {
  return {
    type: 'Feature',
    geometry,
    properties: { FIRE_NUMBER: fireNumber, FIRE_SIZE_HECTARES: sizeHa },
  };
}

describe('normalizeFirePerimeters', () => {
  it('keeps the outer ring of every polygon and ignores holes', () => {
    const [perimeter] = normalizeFirePerimeters([
      buildFeature('C1', { type: 'MultiPolygon', coordinates: [[OUTER, HOLE], [OUTER]] }),
    ]);
    expect(perimeter?.fireNumber).toBe('C1');
    expect(perimeter?.rings).toHaveLength(2);
    expect(perimeter?.rings[0]?.[1]).toEqual([-122.3, 51.6]);
  });

  it('drops missing geometry, short rings and rings outside BC, and keeps the last duplicate', () => {
    const outsideBc = OUTER.map(([lng, lat]) => [(lng ?? 0) + 60, lat ?? 0]);
    const perimeters = normalizeFirePerimeters([
      buildFeature('NONE', null),
      buildFeature('SHORT', { type: 'Polygon', coordinates: [OUTER.slice(0, 3)] }),
      buildFeature('AWAY', { type: 'Polygon', coordinates: [outsideBc] }),
      buildFeature('C2', { type: 'Polygon', coordinates: [OUTER] }, 5),
      buildFeature('C2', { type: 'Polygon', coordinates: [OUTER] }, -1),
    ]);
    expect(perimeters).toEqual([{ fireNumber: 'C2', sizeHa: null, rings: [OUTER] }]);
  });
});
