import { createInMemoryRepositories } from './in-memory/index.js';
import { createSqliteRepositories } from './sqlite/index.js';

const supportedProfiles = new Set(['local', 'managed']);

export const createRepositories = ({
  adapter = 'memory',
  databaseUrl,
  databaseProfile = 'local',
} = {}) => {
  if (!supportedProfiles.has(databaseProfile)) {
    throw new Error(`Unsupported DATABASE_PROFILE: ${databaseProfile}`);
  }

  if (adapter === 'sqlite') {
    if (databaseProfile === 'managed' && !databaseUrl) {
      throw new Error('DATABASE_URL is required when DATABASE_PROFILE=managed');
    }
    return createSqliteRepositories({ databaseUrl });
  }

  if (adapter === 'memory') {
    return createInMemoryRepositories();
  }

  throw new Error(`Unsupported persistence adapter: ${adapter}`);
};
