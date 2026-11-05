// The fire panel's header: "Active fires (N)" as the button that opens and collapses the panel (§7.1).
import { ChevronDown, Flame } from 'lucide-react';

import { cn } from '@/shared/ui';

export type FirePanelHeaderProps = { fireCount: number; isOpen: boolean; onToggle: () => void };

// Renders the toggle with the fire count and a chevron that flips with the open state.
export function FirePanelHeader({ fireCount, isOpen, onToggle }: FirePanelHeaderProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls="fire-panel-body"
      onClick={onToggle}
      className="flex min-h-11 items-center gap-2 px-3 py-2 text-left"
    >
      <Flame aria-hidden="true" className="size-4 text-primary" />
      <span className="flex-1 text-sm font-semibold">
        Active fires <span className="text-muted-foreground">({fireCount})</span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className={cn('size-4 transition-transform', isOpen ? 'rotate-180' : '')}
      />
    </button>
  );
}
