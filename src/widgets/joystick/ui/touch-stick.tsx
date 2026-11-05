// A round (move) or tall (climb) touch stick with a knob that follows the finger and springs back.
import { cn } from '@/shared/ui';

import type { StickVector } from '../lib/compute-stick-vector';
import { useStickDrag } from '../model/use-stick-drag';

export type TouchStickProps = {
  label: string;
  shape: 'round' | 'tall';
  onChange: (vector: StickVector) => void;
};

// Renders the stick pad and knob; all input goes through pointer events, so mouse and pen work too.
export function TouchStick({ label, shape, onChange }: TouchStickProps) {
  const { padRef, knobRef, handlers } = useStickDrag(onChange);
  return (
    <div
      ref={padRef}
      role="application"
      aria-label={label}
      className={cn(
        'relative flex touch-none items-center justify-center border-2 border-panel-border bg-panel/70 backdrop-blur-md select-none',
        shape === 'round' ? 'size-32 rounded-full' : 'h-40 w-16 rounded-full',
      )}
      {...handlers}
    >
      <div
        ref={knobRef}
        className="pointer-events-none size-12 rounded-full bg-foreground/80 shadow-lg"
      />
    </div>
  );
}
