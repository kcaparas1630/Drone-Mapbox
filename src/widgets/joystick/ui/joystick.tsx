// Touch controls (coarse pointers only): left stick moves and turns, right stick climbs, boost button (§3.2).
import { useEffect, useRef } from 'react';

import { droneInputStarted } from '@/entities/drone';
import { setTouchDroneInput } from '@/features/control-drone';
import { useAppDispatch } from '@/shared/lib/redux';
import { Button } from '@/shared/ui';

import type { StickVector } from '../lib/compute-stick-vector';
import { TouchStick } from './touch-stick';

export type JoystickProps = { isCompact?: boolean };

// Renders the controls along the bottom edge; hidden on mouse/keyboard devices; only the controls take touches.
export function Joystick({ isCompact = false }: JoystickProps) {
  const dispatch = useAppDispatch();
  const isActiveRef = useRef({ move: false, climb: false });
  useEffect(
    () => () => {
      setTouchDroneInput({ forward: 0, yaw: 0, vertical: 0, isBoosting: false });
    },
    [],
  );
  const reportActivity = (stick: 'move' | 'climb', isActive: boolean) => {
    if (isActive && !isActiveRef.current[stick]) {
      dispatch(droneInputStarted());
    }
    isActiveRef.current[stick] = isActive;
  };
  const handleMove = ({ x, y }: StickVector) => {
    reportActivity('move', x !== 0 || y !== 0);
    setTouchDroneInput({ forward: y, yaw: x });
  };
  const handleClimb = ({ y }: StickVector) => {
    reportActivity('climb', y !== 0);
    setTouchDroneInput({ vertical: y });
  };
  return (
    <div className="hidden w-full items-end justify-between gap-4 pointer-coarse:flex">
      <TouchStick label="Move and turn" shape="round" isCompact={isCompact} onChange={handleMove} />
      <Button
        variant="secondary"
        className="pointer-events-auto mb-2 rounded-full select-none"
        aria-label="Boost (hold)"
        onPointerDown={() => {
          setTouchDroneInput({ isBoosting: true });
        }}
        onPointerUp={() => {
          setTouchDroneInput({ isBoosting: false });
        }}
        onPointerCancel={() => {
          setTouchDroneInput({ isBoosting: false });
        }}
        onPointerLeave={() => {
          setTouchDroneInput({ isBoosting: false });
        }}
      >
        Boost
      </Button>
      <TouchStick
        label="Climb and descend"
        shape="tall"
        isCompact={isCompact}
        onChange={handleClimb}
      />
    </div>
  );
}
