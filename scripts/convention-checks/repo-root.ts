// Absolute path of the repository root, derived from this file's location rather than the cwd.
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));
