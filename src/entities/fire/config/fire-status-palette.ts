// BCWS status colours so users recognise them from the official site; unknown is grey (ADR 015).
import type { FireStatus } from '../model/fire.types';

export const FIRE_STATUS_PALETTE: Readonly<Record<FireStatus, string>> = {
  'Out of Control': '#FF0000',
  'Being Held': '#FFFF00',
  'Under Control': '#98E600',
  New: '#FC921F',
  'Fire of Note': '#FF0000',
  Out: '#6B7280',
  Unknown: '#9CA3AF',
};
