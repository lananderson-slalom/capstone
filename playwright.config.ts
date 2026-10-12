import { defineConfig } from '@playwright/test';

const port = Number(process.env.E2E_PORT || 3100);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('E2E_PORT must be an integer between 1 and 65535.');
}
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npm run build && npm run preview --workspace packages/frontend',
    env: { PORT: String(port) },
    url: baseURL,
    reuseExistingServer: false,
  },
});
