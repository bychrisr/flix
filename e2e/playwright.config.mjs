import { defineConfig, devices } from '@playwright/test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const isCi = Boolean(process.env.CI);
const configDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(configDir, '..');
const dbFilePath = `${repoRoot}/services/api/.data/flix.e2e.sqlite`;
const dbUrl = `file:${dbFilePath}`;
const e2eApiPort = 3901;
const e2eAdminPort = 4274;
const e2eWebPort = 4273;
const e2eApiUrl = `http://127.0.0.1:${e2eApiPort}`;
const e2eAdminUrl = `http://127.0.0.1:${e2eAdminPort}`;
const e2eWebUrl = `http://127.0.0.1:${e2eWebPort}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 1 : undefined,
  timeout: 45_000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: e2eWebUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command:
        `sh -c "cd .. && DATABASE_URL=${dbUrl} npm run db:reset --workspace @flix/api && DATABASE_URL=${dbUrl} API_PORT=${e2eApiPort} PERSISTENCE_ADAPTER=sqlite CORS_ORIGIN=${e2eWebUrl},${e2eAdminUrl},http://localhost:${e2eWebPort},http://localhost:${e2eAdminPort} node services/api/src/server.js"`,
      url: `${e2eApiUrl}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        `sh -c "cd .. && VITE_API_BASE_URL=${e2eApiUrl} npm run dev --workspace @flix/admin -- --host 127.0.0.1 --port ${e2eAdminPort}"`,
      url: `${e2eAdminUrl}/login`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        `sh -c "cd .. && VITE_API_BASE_URL=${e2eApiUrl} npm run dev --workspace @flix/web -- --host 127.0.0.1 --port ${e2eWebPort}"`,
      url: `${e2eWebUrl}/events/flix-mvp-launch-event`,
      reuseExistingServer: false,
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
