// Mouse/touch camera input on the map: drag orbits, wheel and pinch set the follow distance (behaviour §3.1, §3.2).
import { applyOrbitDrag, followDistanceChanged, type OrbitState } from '@/entities/map-camera';
import { CAMERA_TUNING } from '@/shared/config';

const DRAG_THRESHOLD_PX = 4;

type PointerPosition = { x: number; y: number };

// Returns the distance between the first two active pointers, or 0 when fewer are down.
function readPinchDistance(pointers: Map<number, PointerPosition>): number {
  const [first, second] = [...pointers.values()];
  return first === undefined || second === undefined
    ? 0
    : Math.hypot(first.x - second.x, first.y - second.y);
}

// Listens on the element and returns a function that removes every listener.
export function registerCameraInput(
  element: HTMLElement,
  orbit: OrbitState,
  store: AppStore,
): () => void {
  const pointers = new Map<number, PointerPosition>();
  let travelledPx = 0;
  let pinchStartPx = 0;
  let pinchStartDistanceM = 0;
  const handlePointerDown = (event: PointerEvent) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    travelledPx = 0;
    pinchStartPx = readPinchDistance(pointers);
    pinchStartDistanceM = store.getState().cameraPrefs.followDistanceM;
  };
  const handlePointerMove = (event: PointerEvent) => {
    const previous = pointers.get(event.pointerId);
    if (previous === undefined) {
      return;
    }
    const deltaX = event.clientX - previous.x;
    const deltaY = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2 && pinchStartPx > 0) {
      const scale = pinchStartPx / Math.max(1, readPinchDistance(pointers));
      store.dispatch(followDistanceChanged(pinchStartDistanceM * scale));
      return;
    }
    travelledPx += Math.abs(deltaX) + Math.abs(deltaY);
    if (travelledPx > DRAG_THRESHOLD_PX) {
      orbit.isDragging = true;
      applyOrbitDrag(orbit, deltaX, deltaY);
    }
  };
  const handlePointerEnd = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (pointers.size === 0) {
      orbit.isDragging = false;
    }
  };
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const currentM = store.getState().cameraPrefs.followDistanceM;
    const step =
      event.deltaY > 0 ? CAMERA_TUNING.WHEEL_ZOOM_STEP : 1 / CAMERA_TUNING.WHEEL_ZOOM_STEP;
    store.dispatch(followDistanceChanged(currentM * step));
  };
  element.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerEnd);
  window.addEventListener('pointercancel', handlePointerEnd);
  element.addEventListener('wheel', handleWheel, { passive: false });
  return () => {
    element.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerEnd);
    window.removeEventListener('pointercancel', handlePointerEnd);
    element.removeEventListener('wheel', handleWheel);
  };
}
