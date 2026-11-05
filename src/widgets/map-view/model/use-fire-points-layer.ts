// Fire hit-test layer: status-coloured circles that show a tooltip on hover and open the popup on click (§7).
import type { GeoJSONSource, Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';
import { useEffect, useEffectEvent } from 'react';

import type { Fire } from '@/entities/fire';
import { selectFire } from '@/features/select-fire';
import { useAppDispatch } from '@/shared/lib/redux';

import { MAP_STYLE } from '../config/map-style';
import { buildFirePoints } from '../lib/build-fire-points';
import type { FireHover } from './fire-hover.types';

// Adds the fire source and circle layer once per map.
function ensureFireLayer(map: MapboxMap): void {
  if (map.getSource(MAP_STYLE.FIRE_SOURCE_ID) !== undefined) {
    return;
  }
  map.addSource(MAP_STYLE.FIRE_SOURCE_ID, { type: 'geojson', data: buildFirePoints([]) });
  map.addLayer({
    id: MAP_STYLE.FIRE_LAYER_ID,
    type: 'circle',
    source: MAP_STYLE.FIRE_SOURCE_ID,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 5, 12, 8, 16, 11],
      'circle-color': ['get', 'color'],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
      'circle-pitch-alignment': 'map',
    },
  });
}

// Reads a string property from the first feature under the pointer.
function readFeatureText(event: MapMouseEvent, key: string): string | null {
  const value: unknown = event.features?.[0]?.properties?.[key];
  return typeof value === 'string' ? value : null;
}

// Keeps the layer's data in sync with the feed and wires hover and click.
export function useFirePointsLayer(
  map: MapboxMap | null,
  fires: readonly Fire[] | undefined,
  onHover: (hover: FireHover | null) => void,
): void {
  const dispatch = useAppDispatch();
  const reportHover = useEffectEvent(onHover);
  useEffect(() => {
    if (map === null) {
      return undefined;
    }
    ensureFireLayer(map);
    const handleMove = (event: MapMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer';
      const name = readFeatureText(event, 'incidentName') ?? '';
      reportHover({
        x: event.point.x,
        y: event.point.y,
        name,
        status: readFeatureText(event, 'statusLabel') ?? '',
      });
    };
    const handleLeave = () => {
      map.getCanvas().style.cursor = '';
      reportHover(null);
    };
    const handleClick = (event: MapMouseEvent) => {
      const fireNumber = readFeatureText(event, 'fireNumber');
      if (fireNumber !== null) {
        dispatch(selectFire(fireNumber));
      }
    };
    map.on('mousemove', MAP_STYLE.FIRE_LAYER_ID, handleMove);
    map.on('mouseleave', MAP_STYLE.FIRE_LAYER_ID, handleLeave);
    map.on('click', MAP_STYLE.FIRE_LAYER_ID, handleClick);
    return () => {
      map.off('mousemove', MAP_STYLE.FIRE_LAYER_ID, handleMove);
      map.off('mouseleave', MAP_STYLE.FIRE_LAYER_ID, handleLeave);
      map.off('click', MAP_STYLE.FIRE_LAYER_ID, handleClick);
    };
  }, [dispatch, map]);
  useEffect(() => {
    if (map !== null) {
      ensureFireLayer(map);
      map.getSource<GeoJSONSource>(MAP_STYLE.FIRE_SOURCE_ID)?.setData(buildFirePoints(fires ?? []));
    }
  }, [fires, map]);
}
