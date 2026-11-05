// One page of the BCWS ArcGIS feed as GeoJSON; an ArcGIS {error} body or a missing field fails (ADR 003, 008).
import { z } from 'zod';

const optionalText = z.string().nullable().optional();

export const firePropertiesSchema = z.object({
  FIRE_NUMBER: z.string().min(1),
  INCIDENT_NAME: optionalText,
  FIRE_STATUS: z.string().nullable(),
  CURRENT_SIZE: z.number().nullable().optional(),
  IGNITION_DATE: z.number().nullable().optional(),
  GEOGRAPHIC_DESCRIPTION: optionalText,
  FIRE_URL: optionalText,
  FIRE_OF_NOTE_IND: optionalText,
  FIRE_CAUSE: optionalText,
  FIRE_CENTRE: z.union([z.number(), z.string()]).nullable().optional(),
});

export const fireFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.object({ type: z.string(), coordinates: z.array(z.number()) }).nullable(),
  properties: firePropertiesSchema,
});

export const fireFeedPageSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(fireFeatureSchema),
  properties: z.object({ exceededTransferLimit: z.boolean().optional() }).optional(),
});

export type FireFeature = z.infer<typeof fireFeatureSchema>;

export type FireFeedPage = z.infer<typeof fireFeedPageSchema>;
