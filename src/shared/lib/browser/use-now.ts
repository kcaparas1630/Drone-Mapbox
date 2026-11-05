// React hook returning the current time, refreshed on an interval (e.g. so "updated 4 min ago" ticks).
import { useEffect, useState } from 'react';

// Returns Date.now(), re-rendering every intervalMs.
export function useNow(intervalMs: number): number {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, intervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [intervalMs]);
  return nowMs;
}
