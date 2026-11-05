// The mutable input the frame loop polls: held keyboard keys, the touch controls and a camera-reset request.

export type DroneInputSource = {
  pressedCodes: Set<string>;
  touch: { forward: number; yaw: number; vertical: number; isBoosting: boolean };
  isCameraResetRequested: boolean;
};

export const droneInputSource: DroneInputSource = {
  pressedCodes: new Set<string>(),
  touch: { forward: 0, yaw: 0, vertical: 0, isBoosting: false },
  isCameraResetRequested: false,
};
