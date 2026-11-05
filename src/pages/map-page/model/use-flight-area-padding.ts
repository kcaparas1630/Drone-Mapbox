// Keeps the camera padding in step with the landscape top row and centre instruments as they resize (§4.2).
import { useEffect, useRef } from 'react';

import type { CameraPadding } from '@/widgets/map-view';

import { computeFlightAreaPadding } from '../lib/compute-flight-area-padding';

// Returns refs for the overlay, top row and centre instruments; reports the padding whenever it changes.
export function useFlightAreaPadding(onPaddingChange: (padding: CameraPadding) => void) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const onPaddingChangeRef = useRef(onPaddingChange);
  useEffect(() => {
    onPaddingChangeRef.current = onPaddingChange;
  }, [onPaddingChange]);
  useEffect(() => {
    const overlay = overlayRef.current;
    const topRow = topRowRef.current;
    const bottomBar = bottomBarRef.current;
    if (overlay === null || topRow === null || bottomBar === null) {
      return undefined;
    }
    let lastKey = '';
    const handleResize = () => {
      const padding = computeFlightAreaPadding(
        overlay.getBoundingClientRect(),
        topRow.getBoundingClientRect(),
        bottomBar.getBoundingClientRect(),
      );
      const key = `${String(padding.topPx)}:${String(padding.bottomPx)}`;
      if (key !== lastKey) {
        lastKey = key;
        onPaddingChangeRef.current(padding);
      }
    };
    const observer = new ResizeObserver(handleResize);
    for (const element of [overlay, topRow, bottomBar]) {
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
    };
  }, []);
  return { overlayRef, topRowRef, bottomBarRef };
}
