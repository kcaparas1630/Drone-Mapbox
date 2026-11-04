// Maps a raw BCWS FIRE_STATUS string onto our status union; unknown values become 'Unknown' (ADR 015).
import type { FireStatus } from '../model/fire.types';

const KNOWN_STATUSES: ReadonlySet<string> = new Set<FireStatus>([
  'Out of Control',
  'Being Held',
  'Under Control',
  'New',
  'Fire of Note',
  'Out',
]);

// Returns the matching known status (case and spacing tolerant) or 'Unknown'.
export function normalizeFireStatus(rawStatus: string | null): FireStatus {
  const cleaned = (rawStatus ?? '').trim().replaceAll(/\s+/g, ' ');
  for (const status of KNOWN_STATUSES) {
    if (status.toLowerCase() === cleaned.toLowerCase()) {
      return status as FireStatus;
    }
  }
  return 'Unknown';
}
