// Builds the failed Result the fetch helpers return instead of throwing (convention 008).
import type { FetchJsonErrorKind } from './fetch-json.types';

// Returns a failed Result carrying one error kind, a message and the HTTP status if there was one.
export function toFetchFailure(
  kind: FetchJsonErrorKind,
  message: string,
  status: number | null = null,
) {
  return { isOk: false, error: { kind, message, status } } as const;
}
