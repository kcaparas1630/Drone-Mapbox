// Banner shown during an auto-route: "Flying to {name}" with a Cancel button (behaviour §2).
import { cancelRoute } from '@/features/pause-resume-route';
import { useAppDispatch } from '@/shared/lib/redux';
import { Button, Card } from '@/shared/ui';

export type FlyingBannerProps = { destinationName: string };

// Renders the destination being flown to and a way to cancel.
export function FlyingBanner({ destinationName }: FlyingBannerProps) {
  const dispatch = useAppDispatch();
  return (
    <Card role="status" aria-live="polite" className="flex w-full max-w-md items-center gap-2 p-3">
      <p className="min-w-0 flex-1 truncate text-sm">
        Flying to <strong>{destinationName}</strong>
      </p>
      <Button
        size="small"
        variant="ghost"
        onClick={() => {
          dispatch(cancelRoute());
        }}
      >
        Cancel
      </Button>
    </Card>
  );
}
