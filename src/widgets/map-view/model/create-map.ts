// Creates the single Mapbox map: Standard style, mercator, BC bounds, handlers off, no metrics (ADR 005, 007).
import { Map as MapboxMap } from 'mapbox-gl';

import { BC_BOUNDING_BOX } from '@/shared/config';

import { MAP_STYLE } from '../config/map-style';

const { WEST_LNG, SOUTH_LAT, EAST_LNG, NORTH_LAT, PADDING_DEG } = BC_BOUNDING_BOX;

// Returns a map centred on the spawn; the chase camera takes over the view once the loop starts.
export function createMap(
  container: HTMLElement,
  accessToken: string,
  centreLng: number,
  centreLat: number,
): MapboxMap {
  return new MapboxMap({
    container,
    accessToken,
    style: MAP_STYLE.STYLE_URL,
    projection: 'mercator',
    center: [centreLng, centreLat],
    zoom: MAP_STYLE.INITIAL_ZOOM,
    pitch: MAP_STYLE.INITIAL_PITCH_DEG,
    minZoom: MAP_STYLE.MIN_ZOOM,
    maxPitch: 85,
    maxBounds: [
      [WEST_LNG - PADDING_DEG, SOUTH_LAT - PADDING_DEG],
      [EAST_LNG + PADDING_DEG, NORTH_LAT + PADDING_DEG],
    ],
    dragPan: false,
    dragRotate: false,
    scrollZoom: false,
    boxZoom: false,
    doubleClickZoom: false,
    keyboard: false,
    touchZoomRotate: false,
    touchPitch: false,
    pitchWithRotate: false,
    performanceMetricsCollection: false,
    antialias: true,
    attributionControl: true,
  });
}
