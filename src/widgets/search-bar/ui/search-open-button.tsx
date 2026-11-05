// The collapsed search bar on a phone in portrait: a search icon that opens the search box (§4.2).
import { Search } from 'lucide-react';

import { Button } from '@/shared/ui';

export type SearchOpenButtonProps = { onOpen: () => void };

// Renders a 44 × 44 icon button labelled like the search box it opens.
export function SearchOpenButton({ onOpen }: SearchOpenButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Search places in British Columbia"
      className="rounded-panel shadow-lg backdrop-blur-md"
      onClick={onOpen}
    >
      <Search aria-hidden="true" className="size-4" />
    </Button>
  );
}
