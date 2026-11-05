// Turns a timestamp into the local calendar day, the key a daily request count resets on (ADR 025).

// Returns the local date of the timestamp as YYYY-MM-DD.
export function toLocalDayKey(timeMs: number): string {
  const date = new Date(timeMs);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${String(date.getFullYear())}-${month}-${day}`;
}
