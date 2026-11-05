// Clicking a flame selects its fire (never flies); hovering one shows the pointer cursor (behaviour §7, ADR 023).
import type { Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';

import { selectFire } from '@/features/select-fire';

import { findFlameAtPoint } from '../lib/find-flame-at-point';
import type { FrameLoopContext } from './frame-loop-context';

// Returns the fire index under the event's point, or -1.
function findFireIndex(map: MapboxMap, context: FrameLoopContext, event: MapMouseEvent): number {
  const canvas = map.getCanvas();
  return findFlameAtPoint(
    context.flamePicks,
    event.point.x,
    event.point.y,
    canvas.clientWidth,
    canvas.clientHeight,
  );
}

// Listens for clicks and hovers on the map and returns a function that removes both listeners.
export function registerFlamePicking(map: MapboxMap, context: FrameLoopContext): () => void {
  let isPointerSet = false;
  const handleClick = (event: MapMouseEvent) => {
    const fire = context.fireFeed.fires[findFireIndex(map, context, event)];
    if (fire !== undefined) {
      context.store.dispatch(selectFire(fire.fireNumber));
    }
  };
  const handleMove = (event: MapMouseEvent) => {
    const isOverFlame = findFireIndex(map, context, event) >= 0;
    if (isOverFlame !== isPointerSet) {
      map.getCanvas().style.cursor = isOverFlame ? 'pointer' : '';
      isPointerSet = isOverFlame;
    }
  };
  map.on('click', handleClick);
  map.on('mousemove', handleMove);
  return () => {
    map.off('click', handleClick);
    map.off('mousemove', handleMove);
  };
}
