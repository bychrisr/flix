import { mkdirSync } from 'node:fs';
import { isAbsolute, dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const defaultDatabaseUrl = 'file:.data/flix.sqlite';

export const resolveSqlitePath = (databaseUrl = defaultDatabaseUrl) => {
  if (!databaseUrl || typeof databaseUrl !== 'string') {
    throw new Error('DATABASE_URL must be a non-empty string');
  }

  if (databaseUrl === ':memory:') {
    return ':memory:';
  }

  const withoutFileScheme = databaseUrl.startsWith('file:')
    ? databaseUrl.slice('file:'.length)
    : databaseUrl;

  if (!withoutFileScheme) {
    throw new Error('DATABASE_URL file path cannot be empty');
  }

  return isAbsolute(withoutFileScheme)
    ? withoutFileScheme
    : resolve(process.cwd(), withoutFileScheme);
};

export const openSqliteDatabase = (databaseUrl) => {
  const dbPath = resolveSqlitePath(databaseUrl);

  if (dbPath !== ':memory:') {
    mkdirSync(dirname(dbPath), { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec('PRAGMA foreign_keys = ON;');
  return { db, dbPath };
};
