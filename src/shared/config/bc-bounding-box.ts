// British Columbia's bounding box, default spawn centre and soft-clamp zone (ADR 014).

export const BC_BOUNDING_BOX = {
  WEST_LNG: -139.06,
  SOUTH_LAT: 48.3,
  EAST_LNG: -114.03,
  NORTH_LAT: 60,
  CENTRE_LNG: -122.75,
  CENTRE_LAT: 53.92,
  EDGE_SOFT_ZONE_M: 5000,
} as const;
