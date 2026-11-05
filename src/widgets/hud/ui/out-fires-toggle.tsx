// HUD switch "Show fires that are out": re-queries the fire feed with or without Out fires (behaviour §7).
import { outFiresVisibilityChanged, selectIsOutIncluded } from '@/entities/fire';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

// Renders a labelled checkbox bound to the fire filter.
export function OutFiresToggle() {
  const dispatch = useAppDispatch();
  const isOutIncluded = useAppSelector(selectIsOutIncluded);
  return (
    <label className="flex min-h-8 cursor-pointer items-center gap-2 rounded-panel border border-panel-border bg-panel px-3 text-xs text-foreground shadow-lg backdrop-blur-md">
      <input
        type="checkbox"
        className="size-4 accent-primary"
        checked={isOutIncluded}
        onChange={(event) => {
          dispatch(outFiresVisibilityChanged(event.target.checked));
        }}
      />
      Show fires that are out
    </label>
  );
}
