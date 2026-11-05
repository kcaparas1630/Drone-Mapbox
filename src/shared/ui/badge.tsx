// The shadcn/ui badge adapted to Tailwind v4: a small pill that always carries text, never colour alone.
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { badgeVariants } from './badge-variants';
import { cn } from './cn';

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

// Renders a status pill with the requested tone.
export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
