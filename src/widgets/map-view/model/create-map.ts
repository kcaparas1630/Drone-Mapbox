// Creates the single Mapbox map: Standard style, mercator, no maxBounds, handlers off, no metrics (ADR 005, 020).
import { Map as MapboxMap } from 'mapbox-gl';

import { MAP_STYLE } from '../config/map-style';

// Returns a map centred on the spawn; never add maxBounds, it bounces the chase camera on terrain (ADR 020).
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
