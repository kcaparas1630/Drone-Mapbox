// Fire badge text and tone: count and age, amber after 30 min, red after 2 h, never silently blank (§7).
import { FIRE_FEED } from '@/shared/config';

export type FireFreshnessTone = 'neutral' | 'warning' | 'danger';

export type FireFreshness = { tone: FireFreshnessTone; label: string; detail: string | null };

export type FireFreshnessInput = {
  fireCount: number | null;
  fetchedAtMs: number | null;
  nowMs: number;
  isError: boolean;
};

const MINUTE_MS = 60_000;

// Returns "just now", "N min ago" or "N h ago" for an age in milliseconds.
function describeAge(ageMs: number): string {
  const minutes = Math.floor(Math.max(0, ageMs) / MINUTE_MS);
  if (minutes < 1) {
    return 'just now';
  }
  return minutes < 120 ? `${String(minutes)} min ago` : `${String(Math.floor(minutes / 60))} h ago`;
}

// Returns what the fire badge shows for the feed's current state.
export function readFireFreshness(input: FireFreshnessInput): FireFreshness {
  const { fireCount, fetchedAtMs, nowMs, isError } = input;
  if (fireCount === null || fetchedAtMs === null) {
    return isError
      ? { tone: 'danger', label: 'Fire data unavailable', detail: 'Retrying every 10 minutes.' }
      : { tone: 'neutral', label: 'Loading fires…', detail: null };
  }
  const ageMs = nowMs - fetchedAtMs;
  const label = `Fires: ${String(fireCount)} · updated ${describeAge(ageMs)}`;
  if (ageMs > FIRE_FEED.STALE_ERROR_MS) {
    return { tone: 'danger', label, detail: 'Fire data may be stale' };
  }
  if (ageMs > FIRE_FEED.STALE_WARN_MS) {
    return { tone: 'warning', label, detail: 'Fire data may be stale' };
  }
  return { tone: 'neutral', label, detail: null };
}
