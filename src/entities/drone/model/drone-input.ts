// The control vector the frame loop reads each step, filled by keyboard or touch input (ADR 001).

export type DroneInput = {
  forward: number;
  yaw: number;
  vertical: number;
  isBoosting: boolean;
};

// Returns a neutral input: no thrust, no turn, no climb, no boost.
export function createDroneInput(): DroneInput {
  return { forward: 0, yaw: 0, vertical: 0, isBoosting: false };
}
