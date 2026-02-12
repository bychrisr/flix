const requiredMethods = {
  eventRepository: ['list', 'findById', 'findBySlug', 'insert', 'update', 'deleteById', 'count'],
  lessonRepository: [
    'listByEvent',
    'listAll',
    'findById',
    'findByEventAndSlug',
    'insert',
    'update',
    'deleteById',
    'count',
  ],
  materialRepository: ['listByLesson', 'insertMany'],
  quizRepository: ['findById', 'findByLessonId', 'insert', 'update', 'deleteById'],
};

const assertRepository = (name, repository) => {
  if (!repository || typeof repository !== 'object') {
    throw new Error(`Missing repository implementation: ${name}`);
  }

  for (const method of requiredMethods[name]) {
    if (typeof repository[method] !== 'function') {
      throw new Error(`Repository contract violation in ${name}: missing method ${method}`);
    }
  }
};

export const assertRepositoryContracts = (repositories) => {
  for (const name of Object.keys(requiredMethods)) {
    assertRepository(name, repositories[name]);
  }

  return repositories;
};
