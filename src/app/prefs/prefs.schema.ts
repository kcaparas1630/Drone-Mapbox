// Versioned shape of localStorage['fireflybc.prefs.v1']: recent places and the follow distance (behaviour §8).
import { z } from 'zod';

import { placeSchema } from '@/entities/route';

export const PREFS_STORAGE_KEY = 'fireflybc.prefs.v1';

export const prefsSchema = z.object({
  v: z.literal(1),
  recents: z.array(placeSchema).max(10),
  followDistanceM: z.number().min(30).max(400),
});

export type Prefs = z.infer<typeof prefsSchema>;
