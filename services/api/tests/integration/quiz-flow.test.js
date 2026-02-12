import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

const getAdminToken = async (app) => {
  const login = await app.inject({
    method: 'POST',
    url: '/api/admin/login',
    payload: { username: 'admin', password: 'admin123' },
  });
  return login.json().accessToken;
};

const createEvent = async (app, token, payload) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/events',
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
  return response.json().item;
};

const createLesson = async (app, token, eventId, payload) => {
  const response = await app.inject({
    method: 'POST',
    url: `/api/events/${eventId}/lessons`,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
  return response.json().item;
};

describe('Quiz authoring and learner submission', () => {
  it('supports admin quiz CRUD with nested questions/options', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);

    const event = await createEvent(app, token, {
      title: 'Evento Quiz Admin',
      slug: 'evento-quiz-admin',
      visibility: 'public',
    });

    const lesson = await createLesson(app, token, event.id, {
      title: 'Aula Quiz',
      slug: 'aula-quiz',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const createQuiz = await app.inject({
      method: 'POST',
      url: '/api/quizzes',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        eventId: event.id,
        lessonId: lesson.id,
        title: 'Quiz Aula 1',
        passPercentage: 60,
        questions: [
          {
            prompt: 'Qual a capital do Brasil?',
            options: [
              { text: 'Brasilia', isCorrect: true },
              { text: 'Rio de Janeiro', isCorrect: false },
            ],
          },
          {
            prompt: '2 + 2 = ?',
            options: [
              { text: '4', isCorrect: true },
              { text: '5', isCorrect: false },
            ],
          },
        ],
      },
    });

    expect(createQuiz.statusCode).toBe(201);
    const quiz = createQuiz.json().item;
    expect(quiz.questions).toHaveLength(2);

    const getQuiz = await app.inject({
      method: 'GET',
      url: `/api/quizzes/${quiz.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(getQuiz.statusCode).toBe(200);
    expect(getQuiz.json().item.questions[0].options[0]).toHaveProperty('isCorrect');

    const updateQuiz = await app.inject({
      method: 'PUT',
      url: `/api/quizzes/${quiz.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Quiz Aula 1 Atualizado',
        passPercentage: 80,
        questions: [
          {
            prompt: 'Qual a capital do Brasil?',
            options: [
              { text: 'Brasilia', isCorrect: true },
              { text: 'Sao Paulo', isCorrect: false },
            ],
          },
        ],
      },
    });
    expect(updateQuiz.statusCode).toBe(200);
    expect(updateQuiz.json().item.questions).toHaveLength(1);

    const deleteQuiz = await app.inject({
      method: 'DELETE',
      url: `/api/quizzes/${quiz.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deleteQuiz.statusCode).toBe(204);

    await app.close();
  });

  it('requires at least one correct option per question', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);

    const event = await createEvent(app, token, {
      title: 'Evento Quiz Validacao',
      slug: 'evento-quiz-validacao',
      visibility: 'public',
    });

    const lesson = await createLesson(app, token, event.id, {
      title: 'Aula Quiz Validacao',
      slug: 'aula-quiz-validacao',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const invalid = await app.inject({
      method: 'POST',
      url: '/api/quizzes',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        eventId: event.id,
        lessonId: lesson.id,
        title: 'Quiz Invalido',
        questions: [
          {
            prompt: 'Pergunta sem resposta correta',
            options: [
              { text: 'A', isCorrect: false },
              { text: 'B', isCorrect: false },
            ],
          },
        ],
      },
    });

    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().error).toBe('QUIZ_MISSING_CORRECT_OPTION');

    await app.close();
  });

  it('returns learner-safe quiz, computes score and pass/fail outcome', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);

    const event = await createEvent(app, token, {
      title: 'Evento Quiz Learner',
      slug: 'evento-quiz-learner',
      visibility: 'private',
      accessKey: 'quiz12345',
    });

    const lesson = await createLesson(app, token, event.id, {
      title: 'Aula Quiz Learner',
      slug: 'aula-quiz-learner',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const createdQuiz = await app.inject({
      method: 'POST',
      url: '/api/quizzes',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        eventId: event.id,
        lessonId: lesson.id,
        title: 'Quiz Final',
        passPercentage: 50,
        questions: [
          {
            prompt: 'Node.js e runtime?',
            options: [
              { text: 'Sim', isCorrect: true },
              { text: 'Nao', isCorrect: false },
            ],
          },
          {
            prompt: 'Fastify e framework web?',
            options: [
              { text: 'Sim', isCorrect: true },
              { text: 'Nao', isCorrect: false },
            ],
          },
        ],
      },
    });

    expect(createdQuiz.statusCode).toBe(201);
    const quiz = createdQuiz.json().item;

    const learnerQuizBlocked = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-quiz-learner/lessons/aula-quiz-learner/quiz',
    });
    expect(learnerQuizBlocked.statusCode).toBe(403);

    const learnerQuiz = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-quiz-learner/lessons/aula-quiz-learner/quiz',
      payload: { eventAccessKey: 'quiz12345' },
    });
    expect(learnerQuiz.statusCode).toBe(200);
    expect(learnerQuiz.json().item.questions[0].options[0]).not.toHaveProperty('isCorrect');

    const questionA = quiz.questions[0];
    const questionB = quiz.questions[1];

    const submit = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-quiz-learner/lessons/aula-quiz-learner/quiz/submit',
      payload: {
        eventAccessKey: 'quiz12345',
        answers: [
          { questionId: questionA.id, optionId: questionA.options[0].id },
          { questionId: questionB.id, optionId: questionB.options[1].id },
        ],
      },
    });

    expect(submit.statusCode).toBe(200);
    expect(submit.json().result.totalQuestions).toBe(2);
    expect(submit.json().result.correctAnswers).toBe(1);
    expect(submit.json().result.scorePercentage).toBe(50);
    expect(submit.json().result.status).toBe('passed');

    await app.close();
  });
});
