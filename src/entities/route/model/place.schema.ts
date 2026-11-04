// A named destination the drone can fly to: from search, recents or a fire's "Fly here" (behaviour §5).
import { z } from 'zod';

export const placeSchema = z.object({
  name: z.string().trim().min(1).max(200),
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export type Place = z.infer<typeof placeSchema>;
