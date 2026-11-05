// Owner flame GLB location and how big each status's flame is drawn (ADR 023, behaviour §7).
import type { FireStatus } from '../model/fire.types';

export const FIRE_MODEL = {
  URL: '/models/fire.glb',
  INNER_MESH_NAME: 'FlameInner',
  OUTER_MESH_NAME: 'FlameOuter',
  WIDTH_RATIO: 0.8,
  BASE_HEIGHT_M: 60,
  HEIGHT_PER_DECADE_M: 45,
  MAX_SIZE_HEIGHT_M: 400,
  MIN_SCREEN_HEIGHT_PX: 32,
  PIXELS_PER_RADIAN_FACTOR: 1.5,
  HOVER_FRACTION: 0.1,
  STATUS_SCALE: {
    'Out of Control': 1,
    New: 1,
    'Fire of Note': 1,
    'Being Held': 0.6,
    'Under Control': 0.35,
    Unknown: 0.6,
    Out: 0,
  } satisfies Readonly<Record<FireStatus, number>>,
} as const;
