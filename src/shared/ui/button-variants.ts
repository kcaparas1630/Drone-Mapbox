// Visual variants of the shadcn/ui button; touch targets are at least 44 × 44 px (convention 009).
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-muted',
        outline: 'border border-panel-border bg-panel text-foreground hover:bg-muted',
      },
      size: {
        default: 'px-4 py-2',
        small: 'px-3 py-1.5 text-xs',
        icon: 'p-2',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);
