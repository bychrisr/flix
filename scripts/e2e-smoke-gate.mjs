import { spawnSync } from 'node:child_process';

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

const result = run('npx', ['playwright', 'test', '--config', 'e2e/playwright.config.mjs']);

if (result.status !== 0) {
  console.error('\nE2E smoke gate failed.');
  console.error('Diagnostics:');
  console.error('- HTML report: playwright-report/index.html');
  console.error('- Traces/screenshots/videos: test-results/');
  console.error('- Re-run locally: npm run e2e:smoke');
  process.exit(result.status ?? 1);
}

console.log('\nE2E smoke gate passed.');

