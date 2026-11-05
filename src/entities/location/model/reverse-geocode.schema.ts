// Mapbox Geocoding v6 reverse response: only the text fields the location readout shows (ADR 021, 008).
import { z } from 'zod';

const contextNameSchema = z.object({ name: z.string().trim().min(1).max(200) }).optional();

export const reverseGeocodeFeatureSchema = z.object({
  properties: z.object({
    feature_type: z.string(),
    name: z.string().trim().min(1).max(200),
    context: z.object({ region: contextNameSchema }).optional(),
  }),
});

export const reverseGeocodeSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(reverseGeocodeFeatureSchema).max(20),
});

export type ReverseGeocodeResponse = z.infer<typeof reverseGeocodeSchema>;
