// Tests the shared button: safe default type, variants and click handling.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('defaults to type="button" and forwards clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Resume</Button>);
    const button = screen.getByRole('button', { name: 'Resume' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges custom classes over the variant classes', () => {
    render(
      <Button variant="ghost" className="px-8">
        Cancel
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('px-8');
  });
});
