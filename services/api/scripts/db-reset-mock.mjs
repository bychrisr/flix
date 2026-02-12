import { runMigrations } from '../src/db/migrate.js';
import { runMockSeed } from '../src/db/seed-mock.js';

const migrationResult = runMigrations();
const seedResult = await runMockSeed();

console.log('Database mock reset complete');
console.log('Database:', migrationResult.dbPath);
console.log(
  'Applied migrations:',
  migrationResult.applied.length ? migrationResult.applied.join(', ') : '(none)',
);
console.log('Mock seed counts:', seedResult.counts);
