// Mutable point and box shapes used by the allocation-free geo maths (out parameters).

export type GeoPoint = { lng: number; lat: number };

export type MercatorPoint = { x: number; y: number; z: number };

export type GeoBoundingBox = {
  readonly WEST_LNG: number;
  readonly SOUTH_LAT: number;
  readonly EAST_LNG: number;
  readonly NORTH_LAT: number;
};
