// A planned route polyline with its altitude profile; serialisable so it can live in Redux (ADR 022).

export type RoutePath = {
  lngs: number[];
  lats: number[];
  altitudesMsl: number[];
};

export type PathPoints = { lngs: number[]; lats: number[] };

export type RouteEndpoints = {
  originLng: number;
  originLat: number;
  destinationLng: number;
  destinationLat: number;
};

export type ElevationSampler = (lng: number, lat: number) => number | null;
