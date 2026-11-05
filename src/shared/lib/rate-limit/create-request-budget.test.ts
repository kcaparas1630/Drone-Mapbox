// Tests the request budget: minute window, persisted daily cap, batches and the no-storage fallback.
import { describe, expect, it } from 'vitest';

import { createRequestBudget } from './create-request-budget';

const START_MS = new Date(2026, 10, 5, 12, 0).getTime();

// Returns an in-memory stand-in for localStorage with the three methods the budget uses.
function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();
  const storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = {
    getItem: (name) => entries.get(name) ?? null,
    setItem: (name, value) => {
      entries.set(name, value);
    },
    removeItem: (name) => {
      entries.delete(name);
    },
  };
  return storage as Storage;
}

// Builds a budget on a controllable clock and the given storage.
function buildBudget(storage: Storage | null, limits = { perMinute: 3, perDay: 5 }) {
  const clock = { nowMs: START_MS };
  const budget = createRequestBudget({
    name: 'test-api',
    ...limits,
    storage,
    readNowMs: () => clock.nowMs,
  });
  return { budget, clock };
}

describe('createRequestBudget', () => {
  it('allows requests up to the per-minute limit, then refuses with the minute window', () => {
    const { budget } = buildBudget(createMemoryStorage());
    expect(budget.reserve()).toEqual({ isAllowed: true });
    expect(budget.reserve()).toEqual({ isAllowed: true });
    expect(budget.reserve()).toEqual({ isAllowed: true });
    expect(budget.reserve()).toEqual({ isAllowed: false, exceededWindow: 'minute' });
  });

  it('frees room once the oldest request is a minute old', () => {
    const { budget, clock } = buildBudget(createMemoryStorage());
    budget.reserve(3);
    clock.nowMs += 59_999;
    expect(budget.reserve().isAllowed).toBe(false);
    clock.nowMs += 1;
    expect(budget.reserve().isAllowed).toBe(true);
  });

  it('refuses with the day window once the daily cap is spent', () => {
    const { budget, clock } = buildBudget(createMemoryStorage());
    budget.reserve(3);
    clock.nowMs += 60_000;
    budget.reserve(2);
    clock.nowMs += 60_000;
    expect(budget.reserve()).toEqual({ isAllowed: false, exceededWindow: 'day' });
  });

  it('shares the daily count through storage, so a reload does not reset it', () => {
    const storage = createMemoryStorage();
    buildBudget(storage).budget.reserve(3);
    const { budget: afterReload, clock } = buildBudget(storage);
    expect(afterReload.reserve(3)).toEqual({ isAllowed: false, exceededWindow: 'day' });
    clock.nowMs += 60_000;
    expect(afterReload.reserve(2)).toEqual({ isAllowed: true });
    expect(storage.getItem('fireflybc.quota.test-api.v1')).toBe(
      JSON.stringify({ v: 1, day: '2026-11-05', count: 5 }),
    );
  });

  it('starts a new daily count after local midnight', () => {
    const storage = createMemoryStorage();
    storage.setItem(
      'fireflybc.quota.test-api.v1',
      JSON.stringify({ v: 1, day: '2026-11-04', count: 5 }),
    );
    const { budget } = buildBudget(storage);
    expect(budget.reserve()).toEqual({ isAllowed: true });
  });

  it('refuses a batch that does not fit whole and spends nothing on it', () => {
    const { budget } = buildBudget(createMemoryStorage());
    budget.reserve(2);
    expect(budget.reserve(2)).toEqual({ isAllowed: false, exceededWindow: 'minute' });
    expect(budget.reserve(1)).toEqual({ isAllowed: true });
  });

  it('discards a corrupt stored count and keeps counting', () => {
    const storage = createMemoryStorage();
    storage.setItem('fireflybc.quota.test-api.v1', '{"v":1,"day":"bad"}');
    const { budget } = buildBudget(storage);
    expect(budget.reserve()).toEqual({ isAllowed: true });
  });

  it('keeps the daily cap in memory when storage is unavailable', () => {
    const { budget, clock } = buildBudget(null, { perMinute: 10, perDay: 2 });
    budget.reserve(2);
    clock.nowMs += 60_000;
    expect(budget.reserve()).toEqual({ isAllowed: false, exceededWindow: 'day' });
  });
});
