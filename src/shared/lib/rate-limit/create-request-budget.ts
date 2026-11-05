// A request budget for one API: a one-minute sliding window in memory, a daily cap shared via localStorage (ADR 025).
import { z } from 'zod';

import { readVersionedItem, writeVersionedItem } from '../storage';
import type { RequestBudget, RequestBudgetLimits } from './request-budget.types';
import { toLocalDayKey } from './to-local-day-key';

const WINDOW_MS = 60_000;

const dailyCountSchema = z.object({
  v: z.literal(1),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count: z.number().int().nonnegative(),
});

export type CreateRequestBudgetOptions = RequestBudgetLimits & {
  name: string;
  readNowMs?: () => number;
  storage?: Storage | null;
};

// Returns a budget whose reserve() answers before each call and counts the requests it lets through.
export function createRequestBudget(options: CreateRequestBudgetOptions): RequestBudget {
  const { name, perMinute, perDay, readNowMs = Date.now, storage } = options;
  const storageKey = `fireflybc.quota.${name}.v1`;
  const recentRequestTimesMs: number[] = [];
  let memoryCount = { day: '', count: 0 };
  // Returns today's count: the stored one, or the in-memory one if storage lost or never had it.
  const readUsedToday = (day: string): number => {
    const stored = readVersionedItem(storageKey, dailyCountSchema, storage);
    const storedCount = stored.isOk && stored.value?.day === day ? stored.value.count : 0;
    return Math.max(storedCount, memoryCount.day === day ? memoryCount.count : 0);
  };
  return {
    reserve(count = 1) {
      const nowMs = readNowMs();
      while (
        recentRequestTimesMs.length > 0 &&
        (recentRequestTimesMs[0] ?? 0) <= nowMs - WINDOW_MS
      ) {
        recentRequestTimesMs.shift();
      }
      if (recentRequestTimesMs.length + count > perMinute) {
        return { isAllowed: false, exceededWindow: 'minute' };
      }
      const day = toLocalDayKey(nowMs);
      const usedToday = readUsedToday(day);
      if (usedToday + count > perDay) {
        return { isAllowed: false, exceededWindow: 'day' };
      }
      memoryCount = { day, count: usedToday + count };
      writeVersionedItem(storageKey, dailyCountSchema, { v: 1, ...memoryCount }, storage);
      for (let i = 0; i < count; i += 1) {
        recentRequestTimesMs.push(nowMs);
      }
      return { isAllowed: true };
    },
  };
}
