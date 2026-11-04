// Writes a schema-checked versioned value to localStorage; a quota error disables writes for the session.
import type { z } from 'zod';

import type { Result } from '../result';
import { getDefaultStorage } from './get-default-storage';

const disabledStorages = new WeakSet<Storage>();

// Validates and stores the value; returns an error when invalid, unavailable or over quota.
export function writeVersionedItem<Schema extends z.ZodType>(
  key: string,
  schema: Schema,
  value: z.input<Schema>,
  storage: Storage | null = getDefaultStorage(),
): Result<true, string> {
  if (storage === null || disabledStorages.has(storage)) {
    return { isOk: false, error: 'Persistence is unavailable for this session.' };
  }
  const validated = schema.safeParse(value);
  if (!validated.success) {
    return { isOk: false, error: `${key} was not saved because it failed validation.` };
  }
  try {
    storage.setItem(key, JSON.stringify(validated.data));
    return { isOk: true, value: true };
  } catch (error) {
    disabledStorages.add(storage);
    const reason = error instanceof Error ? error.message : String(error);
    return { isOk: false, error: `Persistence disabled for this session: ${reason}` };
  }
}
