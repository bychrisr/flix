import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../../../src/app.js';

export const createTempSqliteContext = () => {
  const dir = mkdtempSync(join(tmpdir(), 'flix-sqlite-guardrails-'));
  const databaseUrl = `file:${join(dir, 'guardrails.sqlite')}`;

  return {
    dir,
    databaseUrl,
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
  };
};

export const createSqliteApp = ({ databaseUrl }) =>
  createApp({ logger: false, persistenceAdapter: 'sqlite', databaseUrl });

export const loginAsAdmin = async (app) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/admin/login',
    payload: { username: 'admin', password: 'admin123' },
  });

  return response.json().accessToken;
};
