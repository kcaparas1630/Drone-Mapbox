// Tailwind classes for each status's colour swatch, matching the BCWS palette tokens (ADR 015, convention 009).
import type { FireStatus } from '../model/fire.types';

export const FIRE_STATUS_SWATCH_CLASSES: Readonly<Record<FireStatus, string>> = {
  'Out of Control': 'bg-fire-out-of-control',
  'Being Held': 'bg-fire-being-held',
  'Under Control': 'bg-fire-under-control',
  New: 'bg-fire-new',
  'Fire of Note': 'bg-fire-out-of-control ring-2 ring-white',
  Out: 'bg-muted-foreground',
  Unknown: 'bg-fire-unknown',
};
