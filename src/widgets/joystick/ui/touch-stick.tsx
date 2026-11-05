// A round (move) or tall (climb) touch stick with a knob that follows the finger and springs back.
import { cn } from '@/shared/ui';

import type { StickVector } from '../lib/compute-stick-vector';
import { useStickDrag } from '../model/use-stick-drag';

export type TouchStickProps = {
  label: string;
  shape: 'round' | 'tall';
  onChange: (vector: StickVector) => void;
  isCompact?: boolean;
};

// Renders the stick pad and knob; all input goes through pointer events, so mouse and pen work too.
export function TouchStick({ label, shape, onChange, isCompact = false }: TouchStickProps) {
  const { padRef, knobRef, handlers } = useStickDrag(onChange);
  return (
    <div
      ref={padRef}
      role="application"
      aria-label={label}
      className={cn(
        'pointer-events-auto relative flex touch-none items-center justify-center rounded-full border-2 border-panel-border bg-panel/70 backdrop-blur-md select-none',
        shape === 'round' && (isCompact ? 'size-28' : 'size-32'),
        shape === 'tall' && (isCompact ? 'h-32 w-14' : 'h-40 w-16'),
      )}
      {...handlers}
    >
      <div
        ref={knobRef}
        className={cn(
          'pointer-events-none rounded-full bg-foreground/80 shadow-lg',
          isCompact ? 'size-10' : 'size-12',
        )}
      />
    </div>
  );
}
