// Keyboard mapping for the drone and camera as KeyboardEvent.code values (behaviour §3.1).

export const DRONE_CONTROLS = {
  FORWARD: ['KeyW', 'ArrowUp'],
  BACKWARD: ['KeyS', 'ArrowDown'],
  YAW_LEFT: ['KeyA', 'ArrowLeft'],
  YAW_RIGHT: ['KeyD', 'ArrowRight'],
  CLIMB: ['Space'],
  DESCEND: ['ShiftLeft', 'ShiftRight'],
  BOOST: ['ControlLeft', 'ControlRight', 'KeyE'],
  RESET_ORBIT: ['KeyR'],
} as const;
