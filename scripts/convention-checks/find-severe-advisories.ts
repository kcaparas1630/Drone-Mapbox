// Extracts high and critical advisories from `bun audit --json` output (security §5).
import { z } from 'zod';

const auditReportSchema = z.record(
  z.string(),
  z.array(z.object({ severity: z.string(), title: z.string(), url: z.string() })),
);

const FAILING_SEVERITIES: ReadonlySet<string> = new Set(['high', 'critical']);

// Returns one line per high/critical advisory, or a parse problem when the report is not valid JSON.
export function findSevereAdvisories(auditJson: string): string[] {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(auditJson === '' ? '{}' : auditJson);
  } catch (error) {
    return [`bun audit output is not JSON: ${String(error)}`];
  }
  const report = auditReportSchema.safeParse(parsedJson);
  if (!report.success) {
    return [`bun audit output has an unexpected shape: ${report.error.message}`];
  }
  return Object.entries(report.data).flatMap(([packageName, advisories]) =>
    advisories
      .filter((advisory) => FAILING_SEVERITIES.has(advisory.severity))
      .map(
        (advisory) => `${advisory.severity}: ${packageName} — ${advisory.title} (${advisory.url})`,
      ),
  );
}
