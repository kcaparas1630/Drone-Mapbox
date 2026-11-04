// Tests that the content hash changes with any path or byte and is stable otherwise.
import { describe, expect, it } from 'vitest';

import { computeContentHash } from './compute-content-hash';

// Builds a byte reader over an in-memory map of file contents.
function buildReader(contents: Record<string, string>): (path: string) => Uint8Array {
  return (path) => new TextEncoder().encode(contents[path] ?? '');
}

describe('computeContentHash', () => {
  it('is stable for the same files', () => {
    const reader = buildReader({ 'a.ts': 'x' });
    expect(computeContentHash(['a.ts'], reader)).toBe(computeContentHash(['a.ts'], reader));
  });

  it('changes when content or the file set changes', () => {
    const base = computeContentHash(['a.ts'], buildReader({ 'a.ts': 'x' }));
    expect(computeContentHash(['a.ts'], buildReader({ 'a.ts': 'y' }))).not.toBe(base);
    expect(computeContentHash(['a.ts', 'b.ts'], buildReader({ 'a.ts': 'x' }))).not.toBe(base);
  });

  it('does not confuse a path boundary with content', () => {
    const first = computeContentHash(['ab', 'c'], buildReader({ ab: '', c: '' }));
    const second = computeContentHash(['a', 'bc'], buildReader({ a: '', bc: '' }));
    expect(first).not.toBe(second);
  });
});
