const cloneQuiz = (quiz) => ({
  ...quiz,
  questions: quiz.questions.map((question) => ({
    ...question,
    options: question.options.map((option) => ({ ...option })),
  })),
});

export const createInMemoryQuizRepository = () => {
  const quizzesById = new Map();
  const quizIdByLessonId = new Map();

  return {
    findById: (quizId) => {
      const quiz = quizzesById.get(quizId);
      return quiz ? cloneQuiz(quiz) : null;
    },

    findByLessonId: (lessonId) => {
      const quizId = quizIdByLessonId.get(lessonId);
      if (!quizId) {
        return null;
      }
      const quiz = quizzesById.get(quizId);
      return quiz ? cloneQuiz(quiz) : null;
    },

    insert: (quiz) => {
      quizzesById.set(quiz.id, cloneQuiz(quiz));
      quizIdByLessonId.set(quiz.lessonId, quiz.id);
      return cloneQuiz(quiz);
    },

    update: (quizId, quiz) => {
      quizzesById.set(quizId, cloneQuiz(quiz));
      quizIdByLessonId.set(quiz.lessonId, quizId);
      return cloneQuiz(quiz);
    },

    deleteById: (quizId) => {
      const quiz = quizzesById.get(quizId);
      if (!quiz) {
        return false;
      }
      quizzesById.delete(quizId);
      quizIdByLessonId.delete(quiz.lessonId);
      return true;
    },
  };
};
