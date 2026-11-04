// The single place that writes to the console, so a monitoring SDK can be added later (ADR 017).

export type ReportErrorSeverity = 'warn' | 'error';

// Logs a problem with its context; warnings use console.warn, errors console.error.
export function reportError(
  problem: unknown,
  context: string,
  severity: ReportErrorSeverity = 'error',
): void {
  const message = problem instanceof Error ? problem.message : String(problem);
  if (severity === 'warn') {
    console.warn(`[FireflyBC] ${context}: ${message}`);
    return;
  }
  console.error(`[FireflyBC] ${context}: ${message}`, problem);
}
