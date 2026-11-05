// Puts zod in jitless mode before any schema runs, so it never probes eval under the CSP (security §3).
import { z } from 'zod';

z.config({ jitless: true });
