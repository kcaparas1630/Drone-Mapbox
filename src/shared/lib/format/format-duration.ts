// Formats seconds left as "0:31" or "12:05" for the route banner (behaviour §6.4).

// Returns minutes and zero-padded seconds, rounding up so the banner never shows 0:00 early.
export function formatDuration(seconds: number): string {
  const wholeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  return `${String(minutes)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}
