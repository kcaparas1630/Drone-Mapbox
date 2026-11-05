// Finds committed Mapbox tokens and stray .env files without ever printing a secret (security §2).
import type { SourceFile } from './convention-check.types';

const TOKEN_PATTERN = /\b([ps]k)\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g;
const BINARY_EXTENSIONS = /\.(glb|png|jpe?g|webp|ico|woff2?|ttf|gif|zip)$/i;

// Returns true for .env files other than the committed .env.example template.
function isForbiddenEnvFile(path: string): boolean {
  const fileName = path.split('/').at(-1) ?? '';
  return fileName.startsWith('.env') && fileName !== '.env.example';
}

// Returns one problem per token-like string or forbidden env file, showing only a masked prefix.
export function findSecrets(files: readonly SourceFile[]): string[] {
  const problems: string[] = [];
  for (const file of files) {
    if (isForbiddenEnvFile(file.path)) {
      problems.push(
        `${file.path}: .env files must never be committed; only .env.example is allowed`,
      );
    }
    if (BINARY_EXTENSIONS.test(file.path) || file.content.includes('\0')) {
      continue;
    }
    for (const [index, line] of file.content.split('\n').entries()) {
      for (const match of line.matchAll(TOKEN_PATTERN)) {
        const kind = match[1] === 'sk' ? 'secret sk.' : 'public pk.';
        problems.push(
          `${file.path}:${String(index + 1)}: ${kind} Mapbox token (${match[0].slice(0, 6)}…); move it to .env.local`,
        );
      }
    }
  }
  return problems;
}
