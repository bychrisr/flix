import { createInMemoryQuizRepository } from '../repositories/in-memory/quiz-repository.js';

const createError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

const defaultPassPercentage = 70;

export const createQuizService = ({
  eventService,
  lessonService,
  quizRepository = createInMemoryQuizRepository(),
}) => {
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

  const toQuizAggregate = ({
    quizId = crypto.randomUUID(),
    eventId,
    lessonId,
    title,
    passPercentage,
    questions,
    createdAt,
    updatedAt,
  }) => ({
    id: quizId,
    eventId,
    lessonId,
    title: title.trim(),
    passPercentage: passPercentage ?? defaultPassPercentage,
    createdAt,
    updatedAt,
    questions: questions.map((question, questionIdx) => {
      const questionId = question.id ?? crypto.randomUUID();
      return {
        id: questionId,
        prompt: question.prompt.trim(),
        order: question.order ?? questionIdx + 1,
        options: question.options.map((option) => ({
          id: option.id ?? crypto.randomUUID(),
          text: option.text.trim(),
          isCorrect: Boolean(option.isCorrect),
        })),
      };
    }),
  });

  const getQuizForAdmin = (quizId) => {
    const quiz = quizRepository.findById(quizId);
    if (!quiz) {
      throw createError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    }
    return quiz;
  };

  const getQuizByLesson = (lessonId) => quizRepository.findByLessonId(lessonId);

  const createQuiz = ({ eventId, lessonId, title, passPercentage, questions }) => {
    assertLessonContext(eventId, lessonId);
    assertQuizPayload({ questions });

    if (quizRepository.findByLessonId(lessonId)) {
      throw createError(409, 'QUIZ_LESSON_CONFLICT', 'Lesson already has a quiz');
    }

    const now = new Date().toISOString();
    const quiz = toQuizAggregate({
      eventId,
      lessonId,
      title,
      passPercentage,
      questions,
      createdAt: now,
      updatedAt: now,
    });

    return quizRepository.insert(quiz);
  };

  const updateQuiz = (quizId, payload) => {
    const existing = quizRepository.findById(quizId);
    if (!existing) {
      throw createError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    }

    assertLessonContext(existing.eventId, existing.lessonId);
    assertQuizPayload(payload);

    const updatedAt = new Date().toISOString();
    const next = toQuizAggregate({
      quizId: existing.id,
      eventId: existing.eventId,
      lessonId: existing.lessonId,
      title: payload.title,
      passPercentage: payload.passPercentage ?? existing.passPercentage,
      questions: payload.questions,
      createdAt: existing.createdAt,
      updatedAt,
    });

    return quizRepository.update(quizId, next);
  };

  const deleteQuiz = (quizId) => {
    const deleted = quizRepository.deleteById(quizId);
    if (!deleted) {
      throw createError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    }
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
    const questionResults = quiz.questions
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
      answers: questionResults,
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
