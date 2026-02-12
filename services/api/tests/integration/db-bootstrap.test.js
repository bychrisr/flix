import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { runMigrations } from '../../src/db/migrate.js';
import { runSeed } from '../../src/db/seed.js';

const withTempDb = async (fn) => {
  const tempDir = mkdtempSync(join(tmpdir(), 'flix-db-'));
  const databaseUrl = `file:${join(tempDir, 'story-6-1.sqlite')}`;

  try {
    await fn(databaseUrl);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
};

describe('Database bootstrap', () => {
  it('applies migrations deterministically and seeds minimum runnable dataset', async () => {
    await withTempDb(async (databaseUrl) => {
      const firstMigration = runMigrations({ databaseUrl });
      const secondMigration = runMigrations({ databaseUrl });

      expect(firstMigration.applied.length).toBeGreaterThan(0);
      expect(secondMigration.applied).toHaveLength(0);
      expect(secondMigration.skipped.length).toBeGreaterThan(0);

      const firstSeed = await runSeed({ databaseUrl });
      const secondSeed = await runSeed({ databaseUrl });

      expect(firstSeed.counts.events).toBe(2);
      expect(firstSeed.counts.lessons).toBe(2);
      expect(firstSeed.counts.quizzes).toBe(1);
      expect(secondSeed.counts).toEqual(firstSeed.counts);

      const dbPath = databaseUrl.slice('file:'.length);
      const db = new DatabaseSync(dbPath);
      const count = (table) => db.prepare(`SELECT COUNT(*) AS value FROM ${table}`).get().value;

      expect(count('admins')).toBe(1);
      expect(count('events')).toBe(2);
      expect(count('lessons')).toBe(2);
      expect(count('materials')).toBe(1);
      expect(count('quizzes')).toBe(1);
      expect(count('quiz_questions')).toBe(2);
      expect(count('quiz_options')).toBe(4);

      const privateEvent = db
        .prepare('SELECT visibility, access_key AS accessKey FROM events WHERE id = ?')
        .get('event-private-1');
      expect(privateEvent).toEqual({ visibility: 'private', accessKey: 'growth2026' });

      db.close();
    });
  });
});
