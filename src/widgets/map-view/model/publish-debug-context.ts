// Development-only diagnostics: exposes the frame-loop context as window.fireflybcDebug for tests and profiling.
import type { FrameLoopContext } from './frame-loop-context';

type DebugWindow = Window & { fireflybcDebug?: FrameLoopContext | undefined };

// Publishes the context on window, or removes it when given null; only called in development builds.
export function publishDebugContext(context: FrameLoopContext | null): void {
  const debugWindow = window as DebugWindow;
  if (context === null) {
    delete debugWindow.fireflybcDebug;
    return;
  }
  debugWindow.fireflybcDebug = context;
}
