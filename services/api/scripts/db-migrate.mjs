import { runMigrations } from '../src/db/migrate.js';

const result = runMigrations();

console.log('Database:', result.dbPath);
console.log('Applied migrations:', result.applied.length ? result.applied.join(', ') : '(none)');
console.log('Skipped migrations:', result.skipped.length ? result.skipped.join(', ') : '(none)');
