const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

const defaultPassPercentage = 70;

const cloneQuiz = (quiz, questions, optionsByQuestion) => ({
  ...quiz,
  questions: questions.map((question) => ({
    ...question,
    options: (optionsByQuestion.get(question.id) ?? []).map((option) => ({ ...option })),
  })),
});

export const createQuizService = ({ eventService, lessonService }) => {
  const quizzesById = new Map();
  const quizIdByLessonId = new Map();
  const questionsByQuizId = new Map();
  const optionsByQuestionId = new Map();

  const assertLessonContext = (eventId, lessonId) => {
    const event = eventService.getEventById(eventId);
    if (!event) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const lesson = lessonService.getLessonById(lessonId);
    if (!lesson || lesson.eventId !== eventId) {
      throw createError(404, 'LESSON_NOT_FOUND', 'Lesson not found');
    }

    return { event, lesson };
  };

  const assertQuizPayload = (payload) => {
    if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
      throw createError(400, 'QUIZ_INVALID_PAYLOAD', 'Quiz must contain at least one question');
    }

    payload.questions.forEach((question, questionIdx) => {
      if (!Array.isArray(question.options) || question.options.length < 2) {
        throw createError(
          400,
          'QUIZ_INVALID_PAYLOAD',
          `Question ${questionIdx + 1} must contain at least two options`,
        );
      }

      const correctCount = question.options.filter((option) => option.isCorrect).length;
      if (correctCount < 1) {
        throw createError(
          400,
          'QUIZ_MISSING_CORRECT_OPTION',
          `Question ${questionIdx + 1} must contain at least one correct option`,
        );
      }
    });
  };

  const createQuestionAndOptions = (quizId, payloadQuestions, now) => {
    const questions = payloadQuestions.map((question, questionIdx) => {
      const questionId = crypto.randomUUID();
      const normalizedQuestion = {
        id: questionId,
        quizId,
        prompt: question.prompt.trim(),
        order: question.order ?? questionIdx + 1,
        createdAt: now,
        updatedAt: now,
      };

      const options = question.options.map((option) => ({
        id: crypto.randomUUID(),
        questionId,
        text: option.text.trim(),
        isCorrect: Boolean(option.isCorrect),
        createdAt: now,
        updatedAt: now,
      }));

      optionsByQuestionId.set(questionId, options);
      return normalizedQuestion;
    });

    questionsByQuizId.set(quizId, questions);
  };

  const deleteQuestionGraph = (quizId) => {
    const questions = questionsByQuizId.get(quizId) ?? [];
    questions.forEach((question) => {
      optionsByQuestionId.delete(question.id);
    });
    questionsByQuizId.delete(quizId);
  };

  const getQuizForAdmin = (quizId) => {
    const quiz = quizzesById.get(quizId);
    if (!quiz) {
      throw createError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    }

    const questions = questionsByQuizId.get(quizId) ?? [];
    return cloneQuiz(quiz, questions, optionsByQuestionId);
  };

  const getQuizByLesson = (lessonId) => {
    const quizId = quizIdByLessonId.get(lessonId);
    if (!quizId) {
      return null;
    }
    return getQuizForAdmin(quizId);
  };

  const createQuiz = ({ eventId, lessonId, title, passPercentage, questions }) => {
    assertLessonContext(eventId, lessonId);
    assertQuizPayload({ questions });

    if (quizIdByLessonId.has(lessonId)) {
      throw createError(409, 'QUIZ_LESSON_CONFLICT', 'Lesson already has a quiz');
    }

    const now = new Date().toISOString();
    const quiz = {
      id: crypto.randomUUID(),
      eventId,
      lessonId,
      title: title.trim(),
      passPercentage: passPercentage ?? defaultPassPercentage,
      createdAt: now,
      updatedAt: now,
    };

    quizzesById.set(quiz.id, quiz);
    quizIdByLessonId.set(lessonId, quiz.id);
    createQuestionAndOptions(quiz.id, questions, now);
    return getQuizForAdmin(quiz.id);
  };

  const updateQuiz = (quizId, payload) => {
    const existing = quizzesById.get(quizId);
    if (!existing) {
      throw createError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    }

    assertLessonContext(existing.eventId, existing.lessonId);
    assertQuizPayload(payload);

    const next = {
      ...existing,
      title: payload.title.trim(),
      passPercentage: payload.passPercentage ?? existing.passPercentage,
      updatedAt: new Date().toISOString(),
    };

    quizzesById.set(quizId, next);
    deleteQuestionGraph(quizId);
    createQuestionAndOptions(quizId, payload.questions, next.updatedAt);
    return getQuizForAdmin(quizId);
  };

  const deleteQuiz = (quizId) => {
    const quiz = quizzesById.get(quizId);
    if (!quiz) {
      throw createError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    }

    quizzesById.delete(quizId);
    quizIdByLessonId.delete(quiz.lessonId);
    deleteQuestionGraph(quizId);
  };

  const getQuizForLearner = (quizId) => {
    const quiz = getQuizForAdmin(quizId);
    return {
      ...quiz,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        order: question.order,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
      })),
    };
  };

  const submitAttempt = (quizId, answers) => {
    const quiz = getQuizForAdmin(quizId);

    if (!Array.isArray(answers)) {
      throw createError(400, 'QUIZ_INVALID_ATTEMPT', 'Quiz answers payload must be an array');
    }

    const answersByQuestionId = new Map();
    answers.forEach((answer) => {
      if (answersByQuestionId.has(answer.questionId)) {
        throw createError(400, 'QUIZ_INVALID_ATTEMPT', 'Each question can be answered only once');
      }
      answersByQuestionId.set(answer.questionId, answer.optionId);
    });

    let correctAnswers = 0;
    const questions = quiz.questions
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((question) => {
        const submittedOptionId = answersByQuestionId.get(question.id) ?? null;
        const correctOption = question.options.find((option) => option.isCorrect);

        if (submittedOptionId !== null) {
          const submittedOption = question.options.find((option) => option.id === submittedOptionId);
          if (!submittedOption) {
            throw createError(
              400,
              'QUIZ_INVALID_ATTEMPT',
              `Submitted option does not belong to question ${question.id}`,
            );
          }
        }

        const isCorrect = submittedOptionId !== null && submittedOptionId === correctOption?.id;
        if (isCorrect) {
          correctAnswers += 1;
        }

        return {
          questionId: question.id,
          submittedOptionId,
          correctOptionId: correctOption?.id ?? null,
          isCorrect,
        };
      });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.passPercentage;

    return {
      quizId: quiz.id,
      totalQuestions,
      answeredQuestions: answers.length,
      correctAnswers,
      scorePercentage,
      passPercentage: quiz.passPercentage,
      status: passed ? 'passed' : 'failed',
      passed,
      answers: questions,
      submittedAt: new Date().toISOString(),
    };
  };

  return {
    createQuiz,
    getQuizForAdmin,
    getQuizByLesson,
    getQuizForLearner,
    updateQuiz,
    deleteQuiz,
    submitAttempt,
  };
};
