// Tests WebGL2 detection for supported, unsupported and throwing canvases.
import { describe, expect, it } from 'vitest';

import { isWebgl2Supported } from './is-webgl2-supported';

// Builds a fake canvas whose getContext returns the given context or throws.
function buildCanvas(getContext: () => unknown): () => HTMLCanvasElement {
  return () => ({ getContext }) as unknown as HTMLCanvasElement;
}

describe('isWebgl2Supported', () => {
  it('returns true when a WebGL2 context is created', () => {
    expect(isWebgl2Supported(buildCanvas(() => ({})))).toBe(true);
  });

  it('returns false when the context is unavailable', () => {
    expect(isWebgl2Supported(buildCanvas(() => null))).toBe(false);
  });

  it('returns false when context creation throws', () => {
    expect(
      isWebgl2Supported(
        buildCanvas(() => {
          throw new Error('blocked');
        }),
      ),
    ).toBe(false);
  });

  it('returns false outside a browser, where the default canvas factory cannot run', () => {
    expect(isWebgl2Supported()).toBe(false);
  });
});
