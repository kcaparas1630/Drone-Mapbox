// Component test setup: Testing Library DOM matchers, and unmounting after each test (Vitest globals are off).
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
