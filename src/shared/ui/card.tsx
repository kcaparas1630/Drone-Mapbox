// The shadcn/ui card surface for HUD panels, popups and banners floating over the map.
import type { ComponentProps } from 'react';

import { cn } from './cn';

export type CardProps = ComponentProps<'section'>;

// Renders a translucent, bordered panel that stays readable over any map style.
export function Card({ className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-panel border border-panel-border bg-panel text-foreground shadow-lg backdrop-blur-md',
        className,
      )}
      {...props}
    />
  );
}
