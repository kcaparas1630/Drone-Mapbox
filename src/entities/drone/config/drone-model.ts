// Owner GLB location and the constants that place it correctly: the model is +Y up, +Z forward (Spike B).

export const DRONE_MODEL = {
  URL: '/models/drone.glb',
  DISPLAY_SCALE: 10,
  YAW_OFFSET_RAD: 0,
  PROPELLER_NAME_PREFIX: 'Propeller_',
  PROPELLER_IDLE_RAD_PER_S: 30,
  PROPELLER_MAX_RAD_PER_S: 90,
  PLACEHOLDER_LENGTH_M: 0.8,
} as const;
