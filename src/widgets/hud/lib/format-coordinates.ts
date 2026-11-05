// Formats the drone position as "53.91945° N · 122.75000° W" for the location readout (§4.1).

// Returns the latitude and longitude with 5 decimals and hemisphere letters.
export function formatCoordinates(lng: number, lat: number): string {
  const latText = `${Math.abs(lat).toFixed(5)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngText = `${Math.abs(lng).toFixed(5)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latText} · ${lngText}`;
}
