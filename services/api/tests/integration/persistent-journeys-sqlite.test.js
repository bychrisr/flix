import { describe, expect, it } from 'vitest';
import {
  createSqliteApp,
  createTempSqliteContext,
  loginAsAdmin,
} from './helpers/sqlite-runtime.js';

describe('Persistent journeys (sqlite)', () => {
  it('covers critical admin and learner journeys with persistent storage', async () => {
    const ctx = createTempSqliteContext();

    try {
      const appA = await createSqliteApp({ databaseUrl: ctx.databaseUrl });
      const token = await loginAsAdmin(appA);

      const createdEvent = await appA.inject({
        method: 'POST',
        url: '/api/events',
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: 'Evento Persistente',
          slug: 'evento-persistente',
          description: 'Fluxo completo persistente',
          isActive: true,
          visibility: 'private',
          accessKey: 'segredo123',
        },
      });
      expect(createdEvent.statusCode).toBe(201);
      const event = createdEvent.json().item;

      const createdLesson = await appA.inject({
        method: 'POST',
        url: `/api/events/${event.id}/lessons`,
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: 'Aula Persistente',
          slug: 'aula-persistente',
          videoProvider: 'youtube',
          videoId: 'dQw4w9WgXcQ',
          releaseAt: '2026-01-01T00:00:00.000Z',
        },
      });
      expect(createdLesson.statusCode).toBe(201);
      const lesson = createdLesson.json().item;

      const uploaded = await appA.inject({
        method: 'POST',
        url: `/api/events/${event.id}/lessons/${lesson.id}/materials`,
        headers: { authorization: `Bearer ${token}` },
        payload: {
          files: [
            {
              fileName: 'guia.pdf',
              mimeType: 'application/pdf',
              sizeBytes: 1024,
              downloadUrl: 'https://cdn.flix.local/guia.pdf',
            },
          ],
        },
      });
      expect(uploaded.statusCode).toBe(201);

      const createdQuiz = await appA.inject({
        method: 'POST',
        url: '/api/quizzes',
        headers: { authorization: `Bearer ${token}` },
        payload: {
          eventId: event.id,
          lessonId: lesson.id,
          title: 'Quiz Persistente',
          questions: [
            {
              prompt: 'Pergunta 1',
              options: [
                { text: 'Correta', isCorrect: true },
                { text: 'Errada', isCorrect: false },
              ],
            },
          ],
        },
      });
      expect(createdQuiz.statusCode).toBe(201);

      await appA.close();

      const appB = await createSqliteApp({ databaseUrl: ctx.databaseUrl });

      const catalogDenied = await appB.inject({
        method: 'POST',
        url: '/api/public/events/evento-persistente/catalog',
        payload: {},
      });
      expect(catalogDenied.statusCode).toBe(403);

      const catalogOk = await appB.inject({
        method: 'POST',
        url: '/api/public/events/evento-persistente/catalog',
        payload: { eventAccessKey: 'segredo123' },
      });
      expect(catalogOk.statusCode).toBe(200);
      expect(catalogOk.json().catalog.items.some((item) => item.slug === 'aula-persistente')).toBe(true);

      const materials = await appB.inject({
        method: 'POST',
        url: '/api/public/events/evento-persistente/lessons/aula-persistente/materials',
        payload: { eventAccessKey: 'segredo123' },
      });
      expect(materials.statusCode).toBe(200);
      expect(materials.json().items).toHaveLength(1);

      const quizLoad = await appB.inject({
        method: 'POST',
        url: '/api/public/events/evento-persistente/lessons/aula-persistente/quiz',
        payload: { eventAccessKey: 'segredo123' },
      });
      expect(quizLoad.statusCode).toBe(200);
      expect(quizLoad.json().item.questions).toHaveLength(1);

      const question = quizLoad.json().item.questions[0];
      const submit = await appB.inject({
        method: 'POST',
        url: '/api/public/events/evento-persistente/lessons/aula-persistente/quiz/submit',
        payload: {
          eventAccessKey: 'segredo123',
          answers: [{ questionId: question.id, optionId: question.options[0].id }],
        },
      });
      expect(submit.statusCode).toBe(200);
      expect(submit.json().result.passed).toBe(true);

      await appB.close();
    } finally {
      ctx.cleanup();
    }
  });
});
