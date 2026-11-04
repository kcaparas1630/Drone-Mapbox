// Joins conditional class names and resolves Tailwind conflicts, as shadcn/ui expects (convention 009).
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Returns one class string where later Tailwind utilities override earlier conflicting ones.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
