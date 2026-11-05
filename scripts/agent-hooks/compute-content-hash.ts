// Hashes file paths and contents so the Stop hook can skip a check when nothing relevant changed.
import { createHash } from 'node:crypto';

// Returns a SHA-256 hex digest over every path and its bytes, in the given order.
export function computeContentHash(
  paths: readonly string[],
  readBytes: (path: string) => Uint8Array,
): string {
  const hash = createHash('sha256');
  for (const path of paths) {
    hash.update(path);
    hash.update('\0');
    hash.update(readBytes(path));
    hash.update('\0');
  }
  return hash.digest('hex');
}
