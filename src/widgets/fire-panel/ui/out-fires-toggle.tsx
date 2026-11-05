// Fire panel switch "Show fires that are out": re-queries the fire feed with or without Out fires (§7.1).
import { outFiresVisibilityChanged, selectIsOutIncluded } from '@/entities/fire';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

// Renders a labelled checkbox bound to the fire filter.
export function OutFiresToggle() {
  const dispatch = useAppDispatch();
  const isOutIncluded = useAppSelector(selectIsOutIncluded);
  return (
    <label className="flex min-h-8 cursor-pointer items-center gap-2 border-t border-panel-border pt-2 text-xs text-muted-foreground hover:text-foreground">
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
