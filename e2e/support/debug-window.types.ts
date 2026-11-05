// The slice of the dev-only window.fireflybcDebug hook that the e2e specs read.

type RenderedCameraPosition = {
  toLngLat: () => { lng: number; lat: number };
  toAltitude: () => number;
};

export type DebugWindow = Window & {
  fireflybcDebug?: {
    store: { getState: () => { droneMode: { mode: string } } };
    world: { isAltitudePending: boolean };
    cameraPose: { lng: number; lat: number; altitudeMsl: number };
    map: {
      project: (lngLat: [number, number]) => { x: number; y: number };
      queryRenderedFeatures: (point: [number, number], options: { layers: string[] }) => unknown[];
      getFreeCameraOptions: () => { position: RenderedCameraPosition | undefined };
      on: (type: 'render', listener: () => void) => void;
      off: (type: 'render', listener: () => void) => void;
    };
  };
};
