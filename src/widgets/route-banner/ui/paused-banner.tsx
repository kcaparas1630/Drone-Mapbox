// Banner shown while an auto-route is paused by manual input: Resume re-plans, Cancel clears (§6.4).
import { cancelRoute, resumeRoute } from '@/features/pause-resume-route';
import { useAppDispatch } from '@/shared/lib/redux';
import { Button, Card } from '@/shared/ui';

export type PausedBannerProps = { destinationName: string };

// Renders the pause prompt with Resume and Cancel buttons.
export function PausedBanner({ destinationName }: PausedBannerProps) {
  const dispatch = useAppDispatch();
  return (
    <Card
      role="status"
      aria-live="polite"
      className="flex w-full max-w-md flex-wrap items-center gap-2 p-3"
    >
      <p className="min-w-0 flex-1 text-sm">
        Paused — Resume flight to <strong>{destinationName}</strong>?
      </p>
      <Button
        size="small"
        onClick={() => {
          dispatch(resumeRoute());
        }}
      >
        Resume
      </Button>
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
