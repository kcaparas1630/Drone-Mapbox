// Keeps an incident link only when it is https on the allow-listed BCWS host (security §4, behaviour §10).
import { FIRE_FEED } from '@/shared/config';

// Returns the normalised URL when it parses and its host is allowed, otherwise null.
export function parseIncidentUrl(rawUrl: string | null | undefined): string | null {
  if (rawUrl === null || rawUrl === undefined || rawUrl.trim() === '') {
    return null;
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  const isAllowed =
    parsedUrl.protocol === 'https:' &&
    parsedUrl.hostname === FIRE_FEED.INCIDENT_HOST &&
    parsedUrl.username === '' &&
    parsedUrl.password === '';
  return isAllowed ? parsedUrl.href : null;
}
