import { runMockSeed } from '../src/db/seed-mock.js';

const result = await runMockSeed();

console.log('Database:', result.dbPath);
console.log('Mock seed counts:', result.counts);
