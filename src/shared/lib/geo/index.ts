// Public API of the geo maths: spherical distance, bearing, destination and mercator projection.
export { computeDestinationPoint } from './compute-destination-point';
export { computeHeadingVector } from './compute-heading-vector';
export type { HeadingVector } from './compute-heading-vector';
export { computeHaversineDistance } from './compute-haversine-distance';
export { computeInitialBearing } from './compute-initial-bearing';
export { computeMercatorUnitsPerMeter } from './compute-mercator-units-per-meter';
export { EARTH_RADIUS_M } from './earth-radius-m';
export type { GeoBoundingBox, GeoPoint, MercatorPoint } from './geo.types';
export { isInsideBoundingBox } from './is-inside-bounding-box';
export { normalizeAngle } from './normalize-angle';
export { projectToMercator } from './project-to-mercator';
export { toDegrees } from './to-degrees';
export { toRadians } from './to-radians';
