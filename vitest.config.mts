import { fileURLToPath, URL } from 'node:url';

import env from 'vite-plugin-env-compatible';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/*.pw.test.ts'],
    env: { SKIP_ENV_VALIDATION: '1' },
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './__tests__/coverage',
    },
  },
  plugins: [env()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});
