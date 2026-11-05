// Formats HUD numbers: speed in km/h, climb in m/s, altitudes in metres, heading with a compass point; "—" if unknown.

const WHOLE_NUMBER = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const MPS_TO_KMH = 3.6;

export type FlightValueKind = 'speed' | 'verticalSpeed' | 'altitude' | 'heading';

// Returns the display text for a HUD value of the given kind, or "—" when it is unknown.
export function formatFlightValue(kind: FlightValueKind, value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }
  if (kind === 'speed') {
    return `${WHOLE_NUMBER.format(Math.abs(value) * MPS_TO_KMH)} km/h`;
  }
  if (kind === 'verticalSpeed') {
    const arrow = value > 0 ? '▲ ' : value < 0 ? '▼ ' : '';
    return `${arrow}${WHOLE_NUMBER.format(Math.abs(value))} m/s`;
  }
  if (kind === 'altitude') {
    return `${WHOLE_NUMBER.format(value)} m`;
  }
  const degrees = ((Math.round(value) % 360) + 360) % 360;
  const point = COMPASS_POINTS[Math.round(degrees / 45) % COMPASS_POINTS.length] ?? 'N';
  return `${String(degrees)}° ${point}`;
}
