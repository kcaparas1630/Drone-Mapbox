// Where each drawn flame is, for click picking: placements in the local frame and the last projection (ADR 023).

export type FlamePicks = {
  count: number;
  placements: Float64Array;
  fireIndices: Int32Array;
  projection: Float64Array;
};
