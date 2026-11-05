// BCWS perimeter GeoJSON: Polygon or MultiPolygon per fire number; an ArcGIS {error} body fails (ADR 023, 008).
import { z } from 'zod';

const positionSchema = z.array(z.number()).min(2);
const ringSchema = z.array(positionSchema);

const geometrySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Polygon'), coordinates: z.array(ringSchema) }),
  z.object({ type: z.literal('MultiPolygon'), coordinates: z.array(z.array(ringSchema)) }),
]);

export const firePerimeterFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: geometrySchema.nullable(),
  properties: z.object({
    FIRE_NUMBER: z.string().min(1),
    FIRE_SIZE_HECTARES: z.number().nullable().optional(),
  }),
});

export const firePerimeterPageSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(firePerimeterFeatureSchema),
});

export type FirePerimeterFeature = z.infer<typeof firePerimeterFeatureSchema>;
