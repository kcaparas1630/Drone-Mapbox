// Shape of one fire panel status chip and the ids that select it (§7.1).
import type { FireStatus } from '@/entities/fire';

export type FireStatusFilterId = 'all' | 'outOfControl' | 'beingHeld' | 'underControl' | 'new';

export type FireStatusFilter = {
  id: FireStatusFilterId;
  label: string;
  statuses: readonly FireStatus[] | null;
};
