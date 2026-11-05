// The fire panel's status chips; "Out of control" includes Fires of Note, which BCWS reports as out of control (§7.1).
import type { FireStatusFilter } from '../model/fire-status-filter.types';

export const FIRE_STATUS_FILTERS: readonly FireStatusFilter[] = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'outOfControl', label: 'Out of control', statuses: ['Out of Control', 'Fire of Note'] },
  { id: 'beingHeld', label: 'Being held', statuses: ['Being Held'] },
  { id: 'underControl', label: 'Under control', statuses: ['Under Control'] },
  { id: 'new', label: 'New', statuses: ['New'] },
];
