// Creates the one Mapbox map for the component's lifetime, adds terrain and reports health (convention 006, 007).
import type { Map as MapboxMap } from 'mapbox-gl';
import { type RefObject, useEffect, useEffectEvent, useRef, useState } from 'react';

import { addTerrain } from './add-terrain';
import { createMap } from './create-map';
import type { MapStatusPatch } from './map-status.types';
import { trackMapHealth } from './track-map-health';

export type UseMapboxMapOptions = {
  containerRef: RefObject<HTMLDivElement | null>;
  accessToken: string;
  centreLng: number;
  centreLat: number;
  onStatusPatch: (patch: MapStatusPatch) => void;
};

// Returns the map once its style has loaded; it is removed on unmount and never re-created on re-render.
export function useMapboxMap(options: UseMapboxMapOptions): MapboxMap | null {
  const { containerRef, accessToken, centreLng, centreLat, onStatusPatch } = options;
  const [readyMap, setReadyMap] = useState<MapboxMap | null>(null);
  const initialCentreRef = useRef({ lng: centreLng, lat: centreLat });
  const patchStatus = useEffectEvent((patch: MapStatusPatch) => {
    onStatusPatch(patch);
  });
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return undefined;
    }
    const { lng, lat } = initialCentreRef.current;
    const createdMap = createMap(container, accessToken, lng, lat);
    const stopWatching = trackMapHealth(createdMap, patchStatus);
    createdMap.on('style.load', () => {
      addTerrain(createdMap);
      patchStatus({ isStyleLoaded: true });
      setReadyMap(createdMap);
    });
    return () => {
      stopWatching();
      setReadyMap(null);
      createdMap.remove();
    };
  }, [accessToken, containerRef]);
  return readyMap;
}
