// Validates Search Box suggestions and retrieved features before they reach the UI or the drone (convention 008).
import { z } from 'zod';

export const searchSuggestionSchema = z.object({
  mapbox_id: z.string().min(1),
  name: z.string().min(1),
  place_formatted: z.string().optional(),
  full_address: z.string().optional(),
});

export const searchSuggestionResponseSchema = z.object({
  suggestions: z.array(z.unknown()),
});

export const searchRetrieveResponseSchema = z.object({
  features: z
    .array(
      z.object({
        geometry: z.object({
          type: z.literal('Point'),
          coordinates: z.tuple([z.number(), z.number()]),
        }),
        properties: z.object({ name: z.string().min(1), full_address: z.string().optional() }),
      }),
    )
    .min(1),
});

export type SearchSuggestion = z.infer<typeof searchSuggestionSchema>;

export type SearchOption = {
  id: string;
  name: string;
  detail: string;
  suggestion: unknown;
  place: { name: string; lng: number; lat: number } | null;
};
