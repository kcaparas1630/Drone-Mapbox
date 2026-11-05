// The turning part of the compass: 10° ticks, upright N/E/S/W letters and fire blips, eased by CSS (§4.1).
import { useEffect, useRef } from 'react';

import type { FireBlip } from '../lib/compute-fire-blips';

export type CompassCardProps = { cardDeg: number; blips: readonly FireBlip[] };

const CENTRE = 60;
const TICK_DEGREES = [...Array(36).keys()].map((index) => index * 10);
const CARDINALS = [
  { label: 'N', deg: 0 },
  { label: 'E', deg: 90 },
  { label: 'S', deg: 180 },
  { label: 'W', deg: 270 },
] as const;

// Returns an SVG rotation about the given point.
function formatRotation(deg: number, centreX: number = CENTRE, centreY: number = CENTRE): string {
  return `rotate(${String(deg)} ${String(centreX)} ${String(centreY)})`;
}

// Renders the card group and turns it to -cardDeg through a ref, so the CSS transition animates it.
export function CompassCard({ cardDeg, blips }: CompassCardProps) {
  const cardRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const card = cardRef.current;
    if (card !== null) {
      card.style.transformOrigin = `${String(CENTRE)}px ${String(CENTRE)}px`;
      card.style.transform = `rotate(${String(-cardDeg)}deg)`;
    }
  }, [cardDeg]);
  return (
    <g
      ref={cardRef}
      className="transition-transform duration-[260ms] ease-linear motion-reduce:transition-none"
    >
      {TICK_DEGREES.map((deg) => (
        <line
          key={deg}
          x1={CENTRE}
          x2={CENTRE}
          y1="6"
          y2={deg % 30 === 0 ? 15 : 11}
          transform={formatRotation(deg)}
          className={deg % 30 === 0 ? 'stroke-white/80' : 'stroke-white/35'}
          strokeWidth={deg % 90 === 0 ? 2 : 1}
        />
      ))}
      {CARDINALS.map(({ label, deg }) => (
        <text
          key={label}
          x={CENTRE}
          y="28"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`${formatRotation(deg)} ${formatRotation(cardDeg - deg, CENTRE, 28)}`}
          className={
            label === 'N'
              ? 'fill-red-500 text-[13px] font-bold'
              : 'fill-white/85 text-[11px] font-semibold'
          }
        >
          {label}
        </text>
      ))}
      {blips.map((blip) => (
        <circle
          key={blip.fireNumber}
          cx={CENTRE}
          cy="8"
          r={blip.radius}
          fill={blip.color}
          className="stroke-black/70"
          strokeWidth="1"
          transform={formatRotation(blip.bearingDeg)}
        />
      ))}
    </g>
  );
}
