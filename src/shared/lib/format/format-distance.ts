// Formats a distance for lists and banners: "850 m" up close, "12.4 km" nearby, "143 km" far away (§6.4, §7.1).

const ONE_DECIMAL = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 1 });
const WHOLE_NUMBER = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

// Returns the distance text, or an empty string when the distance is unknown.
export function formatDistance(distanceM: number | null): string {
  if (distanceM === null) {
    return '';
  }
  if (distanceM < 1000) {
    return `${WHOLE_NUMBER.format(Math.round(distanceM / 10) * 10)} m`;
  }
  const distanceKm = distanceM / 1000;
  return `${(distanceKm < 100 ? ONE_DECIMAL : WHOLE_NUMBER).format(distanceKm)} km`;
}
