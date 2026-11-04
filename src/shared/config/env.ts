// The only reader of import.meta.env: validates the public Mapbox token and fails fast (ADR 016, 008).
import { z } from 'zod';

import type { Result } from '../lib/result';

const MISSING_TOKEN_MESSAGE =
  'VITE_MAPBOX_TOKEN is missing; copy .env.example to .env.local and add a public token.';

const envSchema = z.object({
  VITE_MAPBOX_TOKEN: z
    .string({ error: MISSING_TOKEN_MESSAGE })
    .regex(/^pk\./, 'VITE_MAPBOX_TOKEN must be a public "pk." token, never a secret "sk." token.'),
});

export type EnvConfig = { mapboxToken: string };

// Validates the environment and returns the typed config or a developer-facing message.
export function readEnv(
  source: Record<string, unknown> = import.meta.env,
): Result<EnvConfig, string> {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    return { isOk: false, error: parsed.error.issues.map((issue) => issue.message).join(' ') };
  }
  return { isOk: true, value: { mapboxToken: parsed.data.VITE_MAPBOX_TOKEN } };
}
