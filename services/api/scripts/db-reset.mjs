import { runMigrations } from '../src/db/migrate.js';
import { runSeed } from '../src/db/seed.js';

const migrationResult = runMigrations();
const seedResult = await runSeed();

console.log('Database reset complete');
console.log('Database:', migrationResult.dbPath);
console.log('Applied migrations:', migrationResult.applied.length ? migrationResult.applied.join(', ') : '(none)');
console.log('Seed counts:', seedResult.counts);
