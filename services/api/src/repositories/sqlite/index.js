import { assertRepositoryContracts } from '../contracts.js';
import { openSqliteDatabase } from '../../db/client.js';
import { runMigrations } from '../../db/migrate.js';
import { createSqliteEventRepository } from './event-repository.js';
import { createSqliteLessonRepository } from './lesson-repository.js';
import { createSqliteMaterialRepository } from './material-repository.js';
import { createSqliteQuizRepository } from './quiz-repository.js';

export const createSqliteRepositories = ({ databaseUrl }) => {
  runMigrations({ databaseUrl });
  const { db, dbPath } = openSqliteDatabase(databaseUrl);

  const repositories = assertRepositoryContracts({
    eventRepository: createSqliteEventRepository({ db }),
    lessonRepository: createSqliteLessonRepository({ db }),
    materialRepository: createSqliteMaterialRepository({ db }),
    quizRepository: createSqliteQuizRepository({ db }),
  });

  return {
    ...repositories,
    dbPath,
    close: () => db.close(),
  };
};
