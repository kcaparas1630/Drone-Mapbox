// Heading-up compass rose: the card turns with the drone, N is red, fires show as blips at their bearings (§4.1).
import type { FireBlip } from '../lib/compute-fire-blips';
import { formatFlightValue } from '../lib/format-flight-value';
import { useContinuousAngle } from '../model/use-continuous-angle';
import { CompassCard } from './compass-card';

export type CompassRoseProps = { headingDeg: number | null; blips: readonly FireBlip[] };

// Renders the bezel, the turning card, the fixed lubber mark and drone glyph, and the heading below.
export function CompassRose({ headingDeg, blips }: CompassRoseProps) {
  const cardDeg = useContinuousAngle(headingDeg ?? 0);
  const headingText = formatFlightValue('heading', headingDeg);
  return (
    <figure className="flex flex-col items-center gap-1" aria-label="Compass">
      <svg viewBox="0 0 120 120" className="size-28 drop-shadow-lg sm:size-32" role="img">
        <title>{headingDeg === null ? 'Heading unknown' : `Heading ${headingText}`}</title>
        <circle cx="60" cy="60" r="58" className="fill-panel stroke-panel-border" />
        <circle cx="60" cy="60" r="40" className="fill-none stroke-white/10" />
        <CompassCard cardDeg={cardDeg} blips={blips} />
        <path d="M60 1 L65 9 L55 9 Z" className="fill-primary" />
        <path
          d="M60 46 L69 72 L60 66 L51 72 Z"
          className="fill-primary stroke-black/60"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <figcaption className="rounded-full border border-panel-border bg-panel px-2.5 py-0.5 font-mono text-xs text-foreground tabular-nums">
        {headingText}
      </figcaption>
    </figure>
  );
}
