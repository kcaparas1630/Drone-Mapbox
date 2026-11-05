// Visual variants of the shadcn/ui badge used for modes, freshness and statuses.
import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-transparent bg-secondary text-secondary-foreground',
        info: 'border-transparent bg-secondary text-secondary-foreground',
        success: 'border-transparent bg-success text-primary-foreground',
        warning: 'border-transparent bg-warning text-primary-foreground',
        danger: 'border-transparent bg-destructive text-foreground',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);
