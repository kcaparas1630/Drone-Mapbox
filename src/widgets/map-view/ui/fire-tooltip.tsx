// Hover tooltip for a fire point (desktop): incident name and status, positioned at the pointer via a ref.
import { useLayoutEffect, useRef } from 'react';

import type { FireHover } from '../model/fire-hover.types';

export type FireTooltipProps = { hover: FireHover | null };

const POINTER_OFFSET_PX = 14;

// Renders the tooltip near the pointer, or nothing when no fire is hovered.
export function FireTooltip({ hover }: FireTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hover !== null && tooltipRef.current !== null) {
      const x = hover.x + POINTER_OFFSET_PX;
      const y = hover.y + POINTER_OFFSET_PX;
      tooltipRef.current.style.transform = `translate(${String(x)}px, ${String(y)}px)`;
    }
  }, [hover]);
  if (hover === null) {
    return null;
  }
  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      className="pointer-events-none absolute top-0 left-0 z-20 max-w-60 rounded-md border border-panel-border bg-panel px-2 py-1 text-xs shadow-lg backdrop-blur-md"
    >
      <p className="font-semibold">{hover.name}</p>
      <p className="text-muted-foreground">{hover.status}</p>
    </div>
  );
}
