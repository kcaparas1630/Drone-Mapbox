// Versioned shape of localStorage['fireflybc.drone.v1'] (behaviour §8); anything else is discarded.
import { z } from 'zod';

export const savedDroneStateSchema = z.object({
  v: z.literal(1),
  lng: z.number(),
  lat: z.number(),
  altMsl: z.number(),
  headingRad: z.number(),
  savedAt: z.number(),
});

export type SavedDroneState = z.infer<typeof savedDroneStateSchema>;
