import { spawnSync } from 'node:child_process';

const checks = [
  {
    name: 'Build web',
    command: 'npm',
    args: ['run', 'build', '--workspace', '@flix/web'],
  },
  {
    name: 'Build admin',
    command: 'npm',
    args: ['run', 'build', '--workspace', '@flix/admin'],
  },
  {
    name: 'API regression tests',
    command: 'npm',
    args: ['run', 'test', '--workspace', '@flix/api'],
  },
  {
    name: 'Browser smoke gate',
    command: 'npm',
    args: ['run', 'e2e:smoke:gate'],
  },
];

const runCheck = ({ name, command, args }) => {
  console.log(`\n[CI LOCAL] ${name}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`\n[CI LOCAL][FAIL] ${name}`);
    process.exit(result.status ?? 1);
  }

  console.log(`[CI LOCAL][PASS] ${name}`);
};

for (const check of checks) {
  runCheck(check);
}

console.log('\n[CI LOCAL] All checks passed.');

