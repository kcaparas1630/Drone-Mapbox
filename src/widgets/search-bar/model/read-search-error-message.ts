// Maps Search Box failures to short inline messages; the drone is never affected (behaviour §10).

const RATE_LIMITED_STATUS = 429;

// Returns the message to show under the search box for a failed suggest request.
export function readSearchErrorMessage(error: unknown): string {
  const statusCode =
    typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : null;
  if (statusCode === RATE_LIMITED_STATUS) {
    return 'Search is busy — try again in a moment.';
  }
  return 'Search is unavailable right now.';
}
