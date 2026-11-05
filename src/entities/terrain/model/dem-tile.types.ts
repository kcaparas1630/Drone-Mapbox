// One decoded DEM tile and the tile range covering a route corridor (ADR 022).

export type DemTile = { zoom: number; x: number; y: number; size: number; heightsM: Float32Array };

export type DemTileRange = { zoom: number; xMin: number; xMax: number; yMin: number; yMax: number };
