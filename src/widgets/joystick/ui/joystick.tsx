// Touch controls (coarse pointers only): left stick moves and turns, right stick climbs, boost button (§3.2).
import { type ReactNode, useEffect, useRef } from 'react';

import { droneInputStarted } from '@/entities/drone';
import { setTouchDroneInput } from '@/features/control-drone';
import { useAppDispatch } from '@/shared/lib/redux';
import { cn } from '@/shared/ui';

import type { StickVector } from '../lib/compute-stick-vector';
import { BoostButton } from './boost-button';
import { TouchStick } from './touch-stick';

// children: instruments shown between the sticks, with Boost moving next to the climb slider (§4.2).
export type JoystickProps = { isCompact?: boolean; children?: ReactNode };

// Renders the controls along the bottom edge; hidden on mouse/keyboard devices; only the controls take touches.
export function Joystick({ isCompact = false, children }: JoystickProps) {
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
  const climbStick = (
    <TouchStick
      label="Climb and descend"
      shape="tall"
      isCompact={isCompact}
      onChange={handleClimb}
    />
  );
  return (
    <div
      className={cn(
        'hidden w-full items-end justify-between pointer-coarse:flex',
        isCompact ? 'gap-2' : 'gap-4',
      )}
    >
      <TouchStick label="Move and turn" shape="round" isCompact={isCompact} onChange={handleMove} />
      {children === undefined ? (
        <BoostButton />
      ) : (
        <div className="flex min-w-0 flex-1 items-end justify-center">{children}</div>
      )}
      {children === undefined ? (
        climbStick
      ) : (
        <div className="flex shrink-0 items-end gap-2">
          <BoostButton />
          {climbStick}
        </div>
      )}
    </div>
  );
}
