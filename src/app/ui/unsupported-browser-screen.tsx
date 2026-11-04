// Static message for browsers without WebGL2, which Mapbox GL JS v3 requires (behaviour §1.1).
import { Card } from '@/shared/ui';

// Renders the unsupported-browser message with the browsers known to work.
export function UnsupportedBrowserScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card role="alert" className="max-w-md space-y-3 p-6">
        <h1 className="text-lg font-semibold">This browser can’t render 3D maps</h1>
        <p className="text-sm text-muted-foreground">
          FireflyBC needs WebGL2. Try a current version of one of these, with hardware acceleration
          turned on:
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li>Google Chrome or Microsoft Edge</li>
          <li>Mozilla Firefox</li>
          <li>Safari 15 or newer</li>
        </ul>
      </Card>
    </main>
  );
}
