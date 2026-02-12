import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openSqliteDatabase } from './client.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const defaultMigrationsDir = resolve(moduleDir, '../../db/migrations');

const ensureMigrationsTable = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
};

const listMigrationFiles = (migrationsDir) =>
  readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export const runMigrations = ({
  databaseUrl = process.env.DATABASE_URL,
  migrationsDir = defaultMigrationsDir,
} = {}) => {
  const { db, dbPath } = openSqliteDatabase(databaseUrl);
  ensureMigrationsTable(db);

  const applied = db.prepare('SELECT id, checksum FROM schema_migrations').all();
  const appliedById = new Map(applied.map((row) => [row.id, row.checksum]));
  const files = listMigrationFiles(migrationsDir);
  const now = new Date().toISOString();

  const result = { dbPath, applied: [], skipped: [] };

  for (const file of files) {
    const sql = readFileSync(resolve(migrationsDir, file), 'utf8');
    const checksum = sha256(sql);
    const knownChecksum = appliedById.get(file);

    if (knownChecksum) {
      if (knownChecksum !== checksum) {
        throw new Error(`Migration checksum mismatch for ${file}`);
      }
      result.skipped.push(file);
      continue;
    }

    db.exec('BEGIN');
    try {
      db.exec(sql);
      db.prepare(
        'INSERT INTO schema_migrations (id, checksum, applied_at) VALUES (?, ?, ?)',
      ).run(file, checksum, now);
      db.exec('COMMIT');
      result.applied.push(file);
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }

  db.close();
  return result;
};
