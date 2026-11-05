// Pointer handling for a touch stick: captures the pointer, reports the vector, springs back on release.
import { type PointerEvent, type RefObject, useRef } from 'react';

import { computeStickVector, type StickVector } from '../lib/compute-stick-vector';

export type UseStickDragResult = {
  padRef: RefObject<HTMLDivElement | null>;
  knobRef: RefObject<HTMLDivElement | null>;
  handlers: {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  };
};

// Returns refs for the pad and knob and the pointer handlers; onChange receives each new vector.
export function useStickDrag(onChange: (vector: StickVector) => void): UseStickDragResult {
  const padRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointerRef = useRef<number | null>(null);
  const moveKnob = (event: PointerEvent<HTMLDivElement>) => {
    const pad = padRef.current;
    if (pad === null) {
      return;
    }
    const bounds = pad.getBoundingClientRect();
    const radiusPx = Math.min(bounds.width, bounds.height) / 2;
    const vector = computeStickVector(
      event.clientX - (bounds.left + bounds.width / 2),
      event.clientY - (bounds.top + bounds.height / 2),
      radiusPx,
    );
    knobRef.current?.style.setProperty(
      'transform',
      `translate(${String(vector.x * radiusPx * 0.6)}px, ${String(-vector.y * radiusPx * 0.6)}px)`,
    );
    onChange(vector);
  };
  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== event.pointerId) {
      return;
    }
    activePointerRef.current = null;
    knobRef.current?.style.setProperty('transform', 'translate(0px, 0px)');
    onChange({ x: 0, y: 0 });
  };
  return {
    padRef,
    knobRef,
    handlers: {
      onPointerDown: (event) => {
        activePointerRef.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        moveKnob(event);
      },
      onPointerMove: (event) => {
        if (activePointerRef.current === event.pointerId) {
          moveKnob(event);
        }
      },
      onPointerUp: release,
      onPointerCancel: release,
    },
  };
}
