// Small HUD notes: edge of British Columbia, altitude ceiling, reduced detail and stalled map tiles (§3.4, §10).

export type HudNotesProps = {
  isAtBcEdge: boolean;
  isAtCeiling: boolean;
  isReducedDetail: boolean;
  isTileStalled: boolean;
};

// Renders each active note as text, or nothing when all is normal.
export function HudNotes({
  isAtBcEdge,
  isAtCeiling,
  isReducedDetail,
  isTileStalled,
}: HudNotesProps) {
  const notes = [
    isAtBcEdge ? 'Edge of British Columbia' : null,
    isAtCeiling ? 'Altitude ceiling (12,000 m)' : null,
    isReducedDetail ? 'Reduced detail' : null,
    isTileStalled ? 'Map tiles are slow to load' : null,
  ].filter((note): note is string => note !== null);
  if (notes.length === 0) {
    return null;
  }
  return (
    <ul aria-live="polite" className="flex flex-col gap-0.5 text-[11px] text-warning">
      {notes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  );
}
