// Chase camera distances, orbit limits, easing and framing from docs/behaviour.md §3.1, §4, §4.2, §6.5 (ADR 014, 024).

const DEG_TO_RAD = Math.PI / 180;

export const CAMERA_TUNING = {
  FOLLOW_DISTANCE_M: 60,
  FOLLOW_HEIGHT_M: 25,
  LOOK_AHEAD_M: 40,
  MIN_FOLLOW_DISTANCE_M: 30,
  MAX_FOLLOW_DISTANCE_M: 400,
  WHEEL_ZOOM_STEP: 1.15,
  ORBIT_YAW_LIMIT_RAD: 90 * DEG_TO_RAD,
  MIN_MAPBOX_PITCH_RAD: 30 * DEG_TO_RAD,
  MAX_MAPBOX_PITCH_RAD: 75 * DEG_TO_RAD,
  ORBIT_RAD_PER_PIXEL: 0.005,
  ORBIT_EASE_BACK_S: 1.5,
  ARRIVAL_ORBIT_RAD_PER_S: 10 * DEG_TO_RAD,
  MIN_CAMERA_AGL_M: 5,
  // Mapbox GL v3's default vertical field of view, 2·atan(1/3) ≈ 36.87°; the app never changes it.
  MAPBOX_VERTICAL_FOV_RAD: 0.6435011087932844,
  LANDSCAPE_DRONE_BAND_RATIO: 0.75,
} as const;
