// Inputs and outputs of per-frame route progress; SimWorld.route satisfies the input structurally.

export type RouteProgressInput = {
  originLng: number;
  originLat: number;
  destinationLng: number;
  destinationLat: number;
  initialBearingRad: number;
  distanceM: number;
  durationS: number;
};

export type RouteProgressPoint = {
  lng: number;
  lat: number;
  pathBearingRad: number;
  remainingM: number;
  isComplete: boolean;
};
