// Temporary camera orbit from mouse or touch drags, plus the slow orbit used while hovering on arrival (§3.1, §6.5).

export type OrbitState = {
  yawRad: number;
  pitchRad: number;
  isDragging: boolean;
  arrivalAngleRad: number;
};

// Returns an orbit with no offset, not dragging.
export function createOrbitState(): OrbitState {
  return { yawRad: 0, pitchRad: 0, isDragging: false, arrivalAngleRad: 0 };
}
