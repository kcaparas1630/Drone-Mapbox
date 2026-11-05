// Tests the fire badge states: loading, unavailable, fresh, amber after 30 min and red after 2 h.
import { describe, expect, it } from 'vitest';

import { readFireFreshness } from './read-fire-freshness';

const NOW_MS = 1_000_000_000;
const MINUTE_MS = 60_000;

describe('readFireFreshness', () => {
  it('shows loading before the first response and unavailable after a failure with no data', () => {
    expect(
      readFireFreshness({ fireCount: null, fetchedAtMs: null, nowMs: NOW_MS, isError: false }),
    ).toEqual({
      tone: 'neutral',
      label: 'Loading fires…',
      detail: null,
    });
    expect(
      readFireFreshness({ fireCount: null, fetchedAtMs: null, nowMs: NOW_MS, isError: true }).label,
    ).toBe('Fire data unavailable');
  });

  it('shows the count and age of fresh data', () => {
    const fresh = readFireFreshness({
      fireCount: 22,
      fetchedAtMs: NOW_MS - 4 * MINUTE_MS,
      nowMs: NOW_MS,
      isError: false,
    });
    expect(fresh).toEqual({
      tone: 'neutral',
      label: 'Fires: 22 · updated 4 min ago',
      detail: null,
    });
    expect(
      readFireFreshness({ fireCount: 1, fetchedAtMs: NOW_MS, nowMs: NOW_MS, isError: false }).label,
    ).toBe('Fires: 1 · updated just now');
  });

  it('turns amber after 30 minutes and red after 2 hours, keeping the last data', () => {
    const amber = readFireFreshness({
      fireCount: 5,
      fetchedAtMs: NOW_MS - 31 * MINUTE_MS,
      nowMs: NOW_MS,
      isError: true,
    });
    expect(amber).toMatchObject({ tone: 'warning', detail: 'Fire data may be stale' });
    const red = readFireFreshness({
      fireCount: 5,
      fetchedAtMs: NOW_MS - 121 * MINUTE_MS,
      nowMs: NOW_MS,
      isError: true,
    });
    expect(red).toMatchObject({ tone: 'danger', label: 'Fires: 5 · updated 2 h ago' });
  });
});
