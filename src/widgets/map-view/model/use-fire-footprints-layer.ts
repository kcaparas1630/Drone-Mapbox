// Draped scorched footprints: a charred fill with a status-coloured edge, dashed when approximate (ADR 023).
import type { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl';
import { useEffect } from 'react';

import { type Fire, useGetFirePerimetersQuery } from '@/entities/fire';
import { FIRE_FEED } from '@/shared/config';

import { MAP_STYLE } from '../config/map-style';
import { buildFireFootprints } from '../lib/build-fire-footprints';

const EDGE_WIDTH = ['interpolate', ['linear'], ['zoom'], 7, 1, 12, 2.5, 15, 4] as const;

// Adds the footprint source, fill and edge layers once per map, below the fire points.
function ensureFootprintLayers(map: MapboxMap): void {
  if (map.getSource(MAP_STYLE.FIRE_FOOTPRINT_SOURCE_ID) !== undefined) {
    return;
  }
  const beforeId =
    map.getLayer(MAP_STYLE.FIRE_LAYER_ID) === undefined ? undefined : MAP_STYLE.FIRE_LAYER_ID;
  map.addSource(MAP_STYLE.FIRE_FOOTPRINT_SOURCE_ID, {
    type: 'geojson',
    data: buildFireFootprints([], []),
  });
  map.addLayer(
    {
      id: MAP_STYLE.FIRE_FOOTPRINT_FILL_LAYER_ID,
      type: 'fill',
      source: MAP_STYLE.FIRE_FOOTPRINT_SOURCE_ID,
      paint: { 'fill-color': '#2a1710', 'fill-opacity': 0.55, 'fill-antialias': true },
    },
    beforeId,
  );
  map.addLayer(
    {
      id: MAP_STYLE.FIRE_FOOTPRINT_EDGE_LAYER_ID,
      type: 'line',
      source: MAP_STYLE.FIRE_FOOTPRINT_SOURCE_ID,
      filter: ['==', ['get', 'isApproximate'], false],
      paint: { 'line-color': ['get', 'color'], 'line-width': [...EDGE_WIDTH], 'line-blur': 1 },
    },
    beforeId,
  );
  map.addLayer(
    {
      id: MAP_STYLE.FIRE_FOOTPRINT_APPROXIMATE_EDGE_LAYER_ID,
      type: 'line',
      source: MAP_STYLE.FIRE_FOOTPRINT_SOURCE_ID,
      filter: ['==', ['get', 'isApproximate'], true],
      paint: {
        'line-color': ['get', 'color'],
        'line-width': [...EDGE_WIDTH],
        'line-dasharray': [2, 1.5],
        'line-opacity': 0.85,
      },
    },
    beforeId,
  );
}

// Polls the perimeters with the fire feed and keeps the footprints in sync with the visible fires.
export function useFireFootprintsLayer(
  map: MapboxMap | null,
  fires: readonly Fire[] | undefined,
): void {
  const { data: perimeters } = useGetFirePerimetersQuery(undefined, {
    pollingInterval: FIRE_FEED.POLL_MS,
    refetchOnReconnect: true,
  });
  useEffect(() => {
    if (map === null) {
      return;
    }
    ensureFootprintLayers(map);
    map
      .getSource<GeoJSONSource>(MAP_STYLE.FIRE_FOOTPRINT_SOURCE_ID)
      ?.setData(buildFireFootprints(fires ?? [], perimeters ?? []));
  }, [fires, map, perimeters]);
}
