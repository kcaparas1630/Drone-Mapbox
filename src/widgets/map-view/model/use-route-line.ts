// Draws the active route as a great-circle line on the map, faded and dashed while paused (behaviour §6.4).
import type { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl';
import { useEffect } from 'react';

import { buildRouteLine } from '@/entities/route';
import { useAppSelector } from '@/shared/lib/redux';

import { MAP_STYLE } from '../config/map-style';

const EMPTY_LINE = { type: 'FeatureCollection' as const, features: [] };

// Adds the route source and line layer once per map.
function ensureRouteLayer(map: MapboxMap): GeoJSONSource | undefined {
  if (map.getSource(MAP_STYLE.ROUTE_SOURCE_ID) === undefined) {
    map.addSource(MAP_STYLE.ROUTE_SOURCE_ID, { type: 'geojson', data: EMPTY_LINE });
    map.addLayer({
      id: MAP_STYLE.ROUTE_LAYER_ID,
      type: 'line',
      source: MAP_STYLE.ROUTE_SOURCE_ID,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ff8a2a', 'line-width': 4, 'line-opacity': 0.9 },
    });
  }
  return map.getSource<GeoJSONSource>(MAP_STYLE.ROUTE_SOURCE_ID);
}

// Keeps the route line in sync with the active route and the flight mode.
export function useRouteLine(map: MapboxMap | null): void {
  const plan = useAppSelector((state) => state.route.activeRoute);
  const mode = useAppSelector((state) => state.droneMode.mode);
  const isVisible = plan !== null && (mode === 'autoRoute' || mode === 'paused');
  const isPaused = mode === 'paused';
  useEffect(() => {
    if (map === null) {
      return;
    }
    const source = ensureRouteLayer(map);
    if (!isVisible) {
      source?.setData(EMPTY_LINE);
      return;
    }
    const { destination } = plan;
    source?.setData(
      buildRouteLine(
        plan.originLng,
        plan.originLat,
        destination.lng,
        destination.lat,
        plan.distanceM,
      ),
    );
    map.setPaintProperty(MAP_STYLE.ROUTE_LAYER_ID, 'line-opacity', isPaused ? 0.35 : 0.9);
    map.setPaintProperty(MAP_STYLE.ROUTE_LAYER_ID, 'line-dasharray', isPaused ? [2, 2] : [1, 0]);
  }, [isPaused, isVisible, map, plan]);
}
