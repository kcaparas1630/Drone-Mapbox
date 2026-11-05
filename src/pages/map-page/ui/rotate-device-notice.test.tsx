// Tests that the rotate notice explains landscape and hands its dismissal to the page.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RotateDeviceNotice } from './rotate-device-notice';

describe('RotateDeviceNotice', () => {
  it('asks the user to turn the phone sideways', () => {
    render(<RotateDeviceNotice onDismiss={vi.fn()} />);
    expect(screen.getByRole('status', { name: 'Turn your phone sideways' })).toBeInTheDocument();
    expect(screen.getByText(/works best in landscape/)).toBeInTheDocument();
  });

  it('calls onDismiss when the user continues in portrait', async () => {
    const onDismiss = vi.fn();
    render(<RotateDeviceNotice onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue in portrait' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
