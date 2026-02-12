const mapQuizBase = (row) => ({
  id: row.id,
  eventId: row.event_id,
  lessonId: row.lesson_id,
  title: row.title,
  passPercentage: row.pass_percentage,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createSqliteQuizRepository = ({ db }) => {
  const findQuizByIdStmt = db.prepare('SELECT * FROM quizzes WHERE id = ? LIMIT 1');
  const findQuizByLessonStmt = db.prepare('SELECT * FROM quizzes WHERE lesson_id = ? LIMIT 1');
  const listQuestionsStmt = db.prepare(
    'SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY display_order ASC',
  );
  const listOptionsStmt = db.prepare('SELECT * FROM quiz_options WHERE question_id = ?');

  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes (
      id, event_id, lesson_id, title, pass_percentage, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertQuestionStmt = db.prepare(`
    INSERT INTO quiz_questions (
      id, quiz_id, prompt, display_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertOptionStmt = db.prepare(`
    INSERT INTO quiz_options (
      id, question_id, text, is_correct, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const updateQuizStmt = db.prepare(
    'UPDATE quizzes SET title = ?, pass_percentage = ?, updated_at = ? WHERE id = ?',
  );
  const deleteQuestionsByQuizStmt = db.prepare('DELETE FROM quiz_questions WHERE quiz_id = ?');
  const deleteQuizStmt = db.prepare('DELETE FROM quizzes WHERE id = ?');

  const hydrateQuiz = (quizRow) => {
    if (!quizRow) {
      return null;
    }

    const questions = listQuestionsStmt.all(quizRow.id).map((questionRow) => ({
      id: questionRow.id,
      prompt: questionRow.prompt,
      order: questionRow.display_order,
      options: listOptionsStmt.all(questionRow.id).map((optionRow) => ({
        id: optionRow.id,
        text: optionRow.text,
        isCorrect: Boolean(optionRow.is_correct),
      })),
    }));

    return {
      ...mapQuizBase(quizRow),
      questions,
    };
  };

  const persistQuestionsAndOptions = (quiz) => {
    for (const question of quiz.questions) {
      insertQuestionStmt.run(
        question.id,
        quiz.id,
        question.prompt,
        question.order,
        quiz.createdAt,
        quiz.updatedAt,
      );

      for (const option of question.options) {
        insertOptionStmt.run(
          option.id,
          question.id,
          option.text,
          option.isCorrect ? 1 : 0,
          quiz.createdAt,
          quiz.updatedAt,
        );
      }
    }
  };

  return {
    findById: (quizId) => hydrateQuiz(findQuizByIdStmt.get(quizId)),

    findByLessonId: (lessonId) => hydrateQuiz(findQuizByLessonStmt.get(lessonId)),

    insert: (quiz) => {
      db.exec('BEGIN');
      try {
        insertQuizStmt.run(
          quiz.id,
          quiz.eventId,
          quiz.lessonId,
          quiz.title,
          quiz.passPercentage,
          quiz.createdAt,
          quiz.updatedAt,
        );
        persistQuestionsAndOptions(quiz);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }

      return {
        ...quiz,
        questions: quiz.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => ({ ...option })),
        })),
      };
    },

    update: (quizId, quiz) => {
      db.exec('BEGIN');
      try {
        updateQuizStmt.run(quiz.title, quiz.passPercentage, quiz.updatedAt, quizId);
        deleteQuestionsByQuizStmt.run(quizId);
        persistQuestionsAndOptions(quiz);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }

      return {
        ...quiz,
        questions: quiz.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => ({ ...option })),
        })),
      };
    },

    deleteById: (quizId) => deleteQuizStmt.run(quizId).changes > 0,
  };
};
