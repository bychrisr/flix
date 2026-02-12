import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const target = process.argv[2];
if (!target) {
  console.error('Usage: node scripts/verify-token-usage.mjs <dir>');
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, '..');
const absoluteTarget = path.join(workspaceRoot, target);

const collectFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }
    if (fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
};

const files = collectFiles(absoluteTarget);
if (files.length === 0) {
  console.error(`No css/html files found in ${target}`);
  process.exit(1);
}

let hasMediaQuery = false;
const violations = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('@media')) {
    hasMediaQuery = true;
  }

  const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  if (hexMatches.length > 0) {
    violations.push({ file, issue: `Found hardcoded hex colors: ${hexMatches.join(', ')}` });
  }

  if (file.endsWith('styles.css') && !content.includes('theme.css')) {
    violations.push({ file, issue: 'Missing canonical token import (theme.css)' });
  }
}

if (!hasMediaQuery) {
  violations.push({ file: target, issue: 'No responsive media query found' });
}

if (violations.length > 0) {
  for (const violation of violations) {
    console.error(`${path.relative(workspaceRoot, violation.file)}: ${violation.issue}`);
  }
  process.exit(1);
}

console.log(`Token usage and responsiveness checks passed for ${target}`);
