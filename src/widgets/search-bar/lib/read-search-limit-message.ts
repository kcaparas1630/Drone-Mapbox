// The inline message when a Search Box budget is spent: wait a minute, or wait for tomorrow (behaviour §11).

// Returns the message for the window that ran out.
export function readSearchLimitMessage(exceededWindow: 'minute' | 'day'): string {
  return exceededWindow === 'minute'
    ? 'Search limit reached — try again in a minute.'
    : 'Search limit reached for today on this device. Recent places still work.';
}
