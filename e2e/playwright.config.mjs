import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 1 : undefined,
  timeout: 45_000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command:
        'sh -c "cd .. && DATABASE_URL=file:services/api/.data/flix.e2e.sqlite npm run db:reset --workspace @flix/api && DATABASE_URL=file:services/api/.data/flix.e2e.sqlite API_PORT=3001 PERSISTENCE_ADAPTER=sqlite CORS_ORIGIN=http://127.0.0.1:4173,http://127.0.0.1:4174,http://localhost:4173,http://localhost:4174 node services/api/src/server.js"',
      url: 'http://127.0.0.1:3001/health',
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
    {
      command:
        'sh -c "cd .. && VITE_API_BASE_URL=http://127.0.0.1:3001 npm run dev --workspace @flix/admin -- --host 127.0.0.1 --port 4174"',
      url: 'http://127.0.0.1:4174/login',
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
    {
      command:
        'sh -c "cd .. && VITE_API_BASE_URL=http://127.0.0.1:3001 npm run dev --workspace @flix/web -- --host 127.0.0.1 --port 4173"',
      url: 'http://127.0.0.1:4173/events/flix-mvp-launch-event',
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
