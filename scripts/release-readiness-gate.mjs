import { execSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [];

const runCheck = (name, fn) => {
  try {
    const details = fn();
    checks.push({ name, status: 'PASS', details: details ?? '' });
  } catch (error) {
    checks.push({ name, status: 'FAIL', details: error.message });
  }
};

runCheck('Admin + learner smoke test suite', () => {
  execSync('npm run test --workspace @flix/api', { stdio: 'pipe' });
  return 'API integration suite passed';
});

runCheck('Security baseline in production profile', () => {
  const securityPlugin = fs.readFileSync('services/api/src/plugins/security.js', 'utf8');
  const hasHelmetProdGuard = securityPlugin.includes("if (env.nodeEnv === 'production')");
  const hasRateLimit = securityPlugin.includes('app.register(rateLimit');
  const hasCors = securityPlugin.includes('app.register(cors');

  if (!hasHelmetProdGuard || !hasRateLimit || !hasCors) {
    throw new Error('Missing one of required controls: helmet/cors/rate-limit');
  }

  return 'helmet, cors and rate-limit checks found in security plugin';
});

runCheck('Go/No-Go blockers documented', () => {
  const checklist = fs.readFileSync('docs/release-readiness.md', 'utf8');
  if (!checklist.includes('Go/No-Go Status')) {
    throw new Error('Missing Go/No-Go section in docs/release-readiness.md');
  }
  return 'Go/No-Go section present';
});

const failed = checks.filter((check) => check.status === 'FAIL');
const goNoGo = failed.length === 0 ? 'GO' : 'NO-GO';

console.log('Release Readiness Report');
for (const check of checks) {
  console.log(`- [${check.status}] ${check.name}${check.details ? `: ${check.details}` : ''}`);
}
console.log(`- Final Status: ${goNoGo}`);

if (goNoGo === 'NO-GO') {
  process.exit(1);
}
