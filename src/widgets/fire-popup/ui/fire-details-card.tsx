// Fire details card: number, name, status, size, ignition, location, cause, actions and the source disclaimer.
import { ExternalLink, X } from 'lucide-react';

import { type Fire, FireStatusBadge } from '@/entities/fire';
import { Button, Card } from '@/shared/ui';

import { formatFireSize } from '../lib/format-fire-size';
import { formatLocalDateTime } from '../lib/format-local-date-time';

export type FireDetailsCardProps = {
  fire: Fire;
  fetchedAtMs: number;
  onClose: () => void;
  onFlyHere: () => void;
};

// Renders one fire's details as text only; the BCWS link appears only when it passed the allowlist.
export function FireDetailsCard({ fire, fetchedAtMs, onClose, onFlyHere }: FireDetailsCardProps) {
  const rows: [string, string][] = [
    ['Size', formatFireSize(fire.sizeHa)],
    ['Discovered', formatLocalDateTime(fire.ignitionDateMs)],
    ['Location', fire.location ?? 'Not reported'],
    ['Cause', fire.cause ?? 'Not reported'],
  ];
  return (
    <Card aria-labelledby="fire-popup-title" className="flex w-full max-w-sm flex-col gap-3 p-4">
      <header className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Fire {fire.fireNumber}</p>
          <h2 id="fire-popup-title" className="truncate text-lg font-semibold">
            {fire.incidentName}
          </h2>
          <FireStatusBadge status={fire.status} rawStatus={fire.rawStatus} className="mt-1" />
        </div>
        <Button variant="ghost" size="icon" aria-label="Close fire details" onClick={onClose}>
          <X aria-hidden="true" className="size-4" />
        </Button>
      </header>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="min-w-0 break-words">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        <Button size="small" onClick={onFlyHere}>
          Fly here
        </Button>
        {fire.incidentUrl === null ? null : (
          <a
            href={fire.incidentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Open on BC Wildfire Service <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Informational only. Source: BC Wildfire Service open data, fetched{' '}
        {formatLocalDateTime(fetchedAtMs)}. For emergencies follow EmergencyInfoBC.
      </p>
    </Card>
  );
}
