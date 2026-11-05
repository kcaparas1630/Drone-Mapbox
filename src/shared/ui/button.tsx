// The shadcn/ui button adapted to Tailwind v4 and React 19 (convention 009).
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { buttonVariants } from './button-variants';
import { cn } from './cn';

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

// Renders a native button with the shared variants; type defaults to "button" so forms never submit.
export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
