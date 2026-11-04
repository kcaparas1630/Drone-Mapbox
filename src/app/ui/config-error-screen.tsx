// Developer-facing screen shown when the environment is invalid, instead of a blank map (behaviour §1.2).
import { Card } from '@/shared/ui';

export type ConfigErrorScreenProps = { message: string };

// Renders the configuration problem and how to fix it; never shows a token.
export function ConfigErrorScreen({ message }: ConfigErrorScreenProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card role="alert" className="max-w-md space-y-2 p-6">
        <h1 className="text-lg font-semibold">FireflyBC is not configured</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </Card>
    </main>
  );
}
