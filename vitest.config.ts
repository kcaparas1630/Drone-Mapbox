// Vitest configuration: node tests for pure modules, jsdom tests for components, coverage thresholds.
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const PURE_MODULE_GLOBS = ['src/entities/*/{lib,model}/**/*.ts', 'src/shared/lib/**/*.ts'];

const COMMON_EXCLUDE = ['e2e/**', '.claude/**', 'dist/**', 'dev-dist/**', 'node_modules/**'];

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      passWithNoTests: true,
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.test.ts', 'eslint/**/*.test.ts', 'scripts/**/*.test.ts'],
            exclude: COMMON_EXCLUDE,
          },
        },
        {
          extends: true,
          test: {
            name: 'component',
            environment: 'jsdom',
            include: ['src/**/*.test.tsx'],
            exclude: COMMON_EXCLUDE,
            setupFiles: ['./vitest.setup.ts'],
          },
        },
      ],
      coverage: {
        provider: 'v8',
        include: PURE_MODULE_GLOBS,
        exclude: ['**/*.test.ts', '**/*.d.ts', '**/index.ts'],
        reporter: ['text', 'html'],
        thresholds: {
          lines: 90,
          branches: 85,
        },
      },
    },
  }),
);
