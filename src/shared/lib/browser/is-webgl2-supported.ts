// Detects WebGL2, which Mapbox GL JS v3 requires (ADR 005, behaviour §1).

// Returns true when a canvas can create a WebGL2 context; never throws.
export function isWebgl2Supported(
  createCanvas: () => HTMLCanvasElement = () => document.createElement('canvas'),
): boolean {
  try {
    return createCanvas().getContext('webgl2') !== null;
  } catch {
    return false;
  }
}
