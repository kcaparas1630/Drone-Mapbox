// Snaps a position to a ~2 km grid cell so the place name is looked up once per cell (behaviour §4.1).

const LAT_STEP_DEG = 0.02;
const LNG_STEP_DEG = 0.03;

export type LookupCell = { key: string; lng: number; lat: number };

// Returns the cell containing lng/lat, keyed by its indices, with the cell centre to look up.
export function computeLookupCell(lng: number, lat: number): LookupCell {
  const lngIndex = Math.floor(lng / LNG_STEP_DEG);
  const latIndex = Math.floor(lat / LAT_STEP_DEG);
  return {
    key: `${String(lngIndex)}:${String(latIndex)}`,
    lng: Number(((lngIndex + 0.5) * LNG_STEP_DEG).toFixed(5)),
    lat: Number(((latIndex + 0.5) * LAT_STEP_DEG).toFixed(5)),
  };
}
