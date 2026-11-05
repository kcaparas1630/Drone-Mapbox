// Formats a fire's size in hectares for the popup, e.g. "13,970 ha" or "0.5 ha".

const HECTARE_FORMAT = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 1 });

// Returns the size with thousands separators, or "Not reported" when unknown.
export function formatFireSize(sizeHa: number | null): string {
  return sizeHa === null ? 'Not reported' : `${HECTARE_FORMAT.format(sizeHa)} ha`;
}
