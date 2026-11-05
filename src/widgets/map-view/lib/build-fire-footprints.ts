// Scorched footprints for the map: the BCWS perimeter when mapped, else a circle of the reported area (ADR 023).
import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';

import { FIRE_STATUS_PALETTE, type Fire, type FirePerimeter } from '@/entities/fire';
import { computeDestinationPoint, type GeoPoint } from '@/shared/lib/geo';

import type { FireFootprintProperties } from '../model/fire-footprint.types';

const CIRCLE_VERTICES = 48;
const MIN_RADIUS_M = 60;
const SQUARE_METRES_PER_HECTARE = 10_000;

// Returns the radius of a circle with the fire's area, never below 60 m.
function computeCircleRadius(sizeHa: number | null): number {
  const areaM2 = Math.max(0, sizeHa ?? 0) * SQUARE_METRES_PER_HECTARE;
  return Math.max(MIN_RADIUS_M, Math.sqrt(areaM2 / Math.PI));
}

// Returns a closed ring approximating a circle of radiusM around the fire point.
function buildCircleRing(fire: Fire, radiusM: number): [number, number][] {
  const point: GeoPoint = { lng: 0, lat: 0 };
  const ring: [number, number][] = [];
  for (let index = 0; index <= CIRCLE_VERTICES; index += 1) {
    const bearingRad = (2 * Math.PI * (index % CIRCLE_VERTICES)) / CIRCLE_VERTICES;
    computeDestinationPoint(point, fire.lng, fire.lat, bearingRad, radiusM);
    ring.push([point.lng, point.lat]);
  }
  return ring;
}

// Returns one footprint per fire that is not Out, using its mapped perimeter when there is one.
export function buildFireFootprints(
  fires: readonly Fire[],
  perimeters: readonly FirePerimeter[],
): FeatureCollection<MultiPolygon, FireFootprintProperties> {
  const perimeterByNumber = new Map(
    perimeters.map((perimeter) => [perimeter.fireNumber, perimeter]),
  );
  const features = fires
    .filter((fire) => fire.status !== 'Out')
    .map((fire): Feature<MultiPolygon, FireFootprintProperties> => {
      const perimeter = perimeterByNumber.get(fire.fireNumber);
      const rings = perimeter?.rings ?? [buildCircleRing(fire, computeCircleRadius(fire.sizeHa))];
      return {
        type: 'Feature',
        geometry: { type: 'MultiPolygon', coordinates: rings.map((ring) => [ring]) },
        properties: {
          fireNumber: fire.fireNumber,
          color: FIRE_STATUS_PALETTE[fire.status],
          isApproximate: perimeter === undefined,
        },
      };
    });
  return { type: 'FeatureCollection', features };
}
