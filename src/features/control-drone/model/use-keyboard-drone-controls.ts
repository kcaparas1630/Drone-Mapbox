// Window keyboard listeners for the drone: ignored while typing, released on blur, start or pause modes (§3.1).
import { useEffect } from 'react';

import { droneInputStarted } from '@/entities/drone';
import { DRONE_CONTROLS } from '@/shared/config';
import { useAppDispatch } from '@/shared/lib/redux';

import { isTypingTarget } from '../lib/is-typing-target';
import { droneInputSource } from './drone-input-source';
import { clearDroneInput } from './clear-drone-input';

const MOVEMENT_CODES: ReadonlySet<string> = new Set([
  ...DRONE_CONTROLS.FORWARD,
  ...DRONE_CONTROLS.BACKWARD,
  ...DRONE_CONTROLS.YAW_LEFT,
  ...DRONE_CONTROLS.YAW_RIGHT,
  ...DRONE_CONTROLS.CLIMB,
  ...DRONE_CONTROLS.DESCEND,
]);
const BOOST_CODES: ReadonlySet<string> = new Set(DRONE_CONTROLS.BOOST);
const RESET_ORBIT_CODES: ReadonlySet<string> = new Set(DRONE_CONTROLS.RESET_ORBIT);

// Returns true when the key event belongs to someone else: typing, or a browser/app shortcut like Ctrl+K.
function isForeignKeyEvent(event: KeyboardEvent): boolean {
  const isDroneCode = BOOST_CODES.has(event.code) || MOVEMENT_CODES.has(event.code);
  const isModifiedShortcut = event.metaKey || event.altKey || (event.ctrlKey && !isDroneCode);
  return (
    isModifiedShortcut || isTypingTarget(event.target) || isTypingTarget(document.activeElement)
  );
}

// Registers the drone's keyboard handling on window for the component's lifetime.
export function useKeyboardDroneControls(): void {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isForeignKeyEvent(event)) {
        return;
      }
      if (RESET_ORBIT_CODES.has(event.code)) {
        droneInputSource.isCameraResetRequested = true;
        return;
      }
      const isMovement = MOVEMENT_CODES.has(event.code);
      if (!isMovement && !BOOST_CODES.has(event.code)) {
        return;
      }
      event.preventDefault();
      if (isMovement && !event.repeat && !droneInputSource.pressedCodes.has(event.code)) {
        dispatch(droneInputStarted());
      }
      droneInputSource.pressedCodes.add(event.code);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      droneInputSource.pressedCodes.delete(event.code);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearDroneInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearDroneInput);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearDroneInput);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearDroneInput();
    };
  }, [dispatch]);
}
