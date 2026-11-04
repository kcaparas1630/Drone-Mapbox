// Prints a convention check's outcome and sets the process exit code (0 pass, 1 fail).

// Prints the summary on success or every problem on failure, then sets process.exitCode.
export function reportCheckResult(
  checkName: string,
  problems: readonly string[],
  summary: string,
): void {
  if (problems.length === 0) {
    console.log(`✓ ${checkName}: ${summary}`);
    return;
  }
  console.error(`✗ ${checkName}: ${String(problems.length)} problem(s)`);
  for (const problem of problems) {
    console.error(`  ${problem}`);
  }
  process.exitCode = 1;
}
