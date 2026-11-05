// Reads a versioned JSON value from localStorage through a zod schema; invalid values are discarded (008).
import type { z } from 'zod';

import type { Result } from '../result';
import { getDefaultStorage } from './get-default-storage';

// Returns the parsed value, null when absent, or an error after removing an invalid stored value.
export function readVersionedItem<Schema extends z.ZodType>(
  key: string,
  schema: Schema,
  storage: Storage | null = getDefaultStorage(),
): Result<z.output<Schema> | null, string> {
  if (storage === null) {
    return { isOk: true, value: null };
  }
  const stored = storage.getItem(key);
  if (stored === null) {
    return { isOk: true, value: null };
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stored);
  } catch {
    storage.removeItem(key);
    return { isOk: false, error: `${key} was not valid JSON and was discarded.` };
  }
  const validated = schema.safeParse(parsedJson);
  if (!validated.success) {
    storage.removeItem(key);
    return { isOk: false, error: `${key} failed validation and was discarded.` };
  }
  return { isOk: true, value: validated.data };
}
