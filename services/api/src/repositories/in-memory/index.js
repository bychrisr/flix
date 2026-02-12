import { assertRepositoryContracts } from '../contracts.js';
import { createInMemoryEventRepository } from './event-repository.js';
import { createInMemoryLessonRepository } from './lesson-repository.js';
import { createInMemoryMaterialRepository } from './material-repository.js';
import { createInMemoryQuizRepository } from './quiz-repository.js';

export const createInMemoryRepositories = () =>
  assertRepositoryContracts({
    eventRepository: createInMemoryEventRepository(),
    lessonRepository: createInMemoryLessonRepository(),
    materialRepository: createInMemoryMaterialRepository(),
    quizRepository: createInMemoryQuizRepository(),
  });
