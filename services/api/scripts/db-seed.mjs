import { runSeed } from '../src/db/seed.js';

const result = await runSeed();

console.log('Database:', result.dbPath);
console.log('Seed counts:', result.counts);
