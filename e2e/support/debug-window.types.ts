// The slice of the dev-only window.fireflybcDebug hook that the e2e specs read.

export type DebugWindow = Window & {
  fireflybcDebug?: {
    store: { getState: () => { droneMode: { mode: string } } };
    map: {
      project: (lngLat: [number, number]) => { x: number; y: number };
      queryRenderedFeatures: (point: [number, number], options: { layers: string[] }) => unknown[];
    };
  };
};
