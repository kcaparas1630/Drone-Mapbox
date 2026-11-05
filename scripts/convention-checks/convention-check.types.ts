// Shared shapes for the convention check scripts: source files, marker rules and their counts.

export type SourceFile = { path: string; content: string };

export type MarkerRule = {
  marker: RegExp;
  isAlwaysForbidden?: (line: string) => boolean;
  isWellFormed: (line: string) => boolean;
  fixHint: string;
};

export type MarkedLineCount = { count: number; problems: string[] };

export type HookConfigSources = {
  settingsJson: string;
  conventionDoc: string;
  localRuleFiles: string[];
  registrySource: string;
  eslintConfigSource: string;
  packageJson: string;
};
