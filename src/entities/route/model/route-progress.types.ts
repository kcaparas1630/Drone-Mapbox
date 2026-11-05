// Inputs and outputs of per-frame route progress along the planned polyline; SimWorld.route satisfies the input.

export type RouteProgressInput = {
  durationS: number;
  pathCount: number;
  pathLngs: Float64Array;
  pathLats: Float64Array;
  pathAltitudesMsl: Float64Array;
  pathDistancesM: Float64Array;
  segmentIndex: number;
};

export type RouteProgressPoint = {
  lng: number;
  lat: number;
  altitudeMsl: number;
  profileSlope: number;
  pathBearingRad: number;
  remainingM: number;
  isComplete: boolean;
};
