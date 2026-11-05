// Distance to a fire with an arrow pointing to it relative to the drone's heading (up = straight ahead) (§7.1).

export type FireBearingReadoutProps = { distanceText: string; relativeDeg: number | null };

// Renders the distance and the arrow, or nothing before the first drone snapshot.
export function FireBearingReadout({ distanceText, relativeDeg }: FireBearingReadoutProps) {
  if (distanceText === '') {
    return null;
  }
  return (
    <span className="flex shrink-0 flex-col items-end gap-0.5">
      <span className="text-xs font-semibold tabular-nums">{distanceText}</span>
      {relativeDeg === null ? null : (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 text-primary">
          <path
            d="M8 2 L12.5 13 L8 10.5 L3.5 13 Z"
            fill="currentColor"
            transform={`rotate(${String(relativeDeg)} 8 8)`}
          />
        </svg>
      )}
    </span>
  );
}
