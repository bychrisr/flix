import { describe, expect, it } from 'vitest';
import { openSqliteDatabase } from '../../src/db/client.js';
import {
  createSqliteApp,
  createTempSqliteContext,
  loginAsAdmin,
} from './helpers/sqlite-runtime.js';

describe('Data integrity guardrails (sqlite)', () => {
  it('enforces relationships and cascade behavior for runtime data', async () => {
    const ctx = createTempSqliteContext();

    try {
      const app = await createSqliteApp({ databaseUrl: ctx.databaseUrl });
      const token = await loginAsAdmin(app);

      const eventRes = await app.inject({
        method: 'POST',
        url: '/api/events',
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: 'Evento Integridade',
          slug: 'evento-integridade',
          visibility: 'public',
          isActive: true,
        },
      });
      const eventId = eventRes.json().item.id;

      const lessonRes = await app.inject({
        method: 'POST',
        url: `/api/events/${eventId}/lessons`,
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: 'Aula Integridade',
          slug: 'aula-integridade',
          releaseAt: '2026-01-01T00:00:00.000Z',
        },
      });
      const lessonId = lessonRes.json().item.id;

      await app.inject({
        method: 'POST',
        url: `/api/events/${eventId}/lessons/${lessonId}/materials`,
        headers: { authorization: `Bearer ${token}` },
        payload: {
          files: [
            {
              fileName: 'material.pdf',
              mimeType: 'application/pdf',
              sizeBytes: 1200,
              downloadUrl: 'https://cdn.flix.local/material.pdf',
            },
          ],
        },
      });

      const quizRes = await app.inject({
        method: 'POST',
        url: '/api/quizzes',
        headers: { authorization: `Bearer ${token}` },
        payload: {
          eventId,
          lessonId,
          title: 'Quiz Integridade',
          questions: [
            {
              prompt: 'Qual e o objetivo?',
              options: [
                { text: 'Validar', isCorrect: true },
                { text: 'Ignorar', isCorrect: false },
              ],
            },
          ],
        },
      });
      expect(quizRes.statusCode).toBe(201);

      const { db } = openSqliteDatabase(ctx.databaseUrl);
      expect(() =>
        db
          .prepare(
            'INSERT INTO lessons (id, event_id, title, slug, video_provider, video_id, release_at, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          )
          .run(
            crypto.randomUUID(),
            'missing-event-id',
            'Invalida',
            'invalida',
            'youtube',
            'abc',
            '2026-01-01T00:00:00.000Z',
            null,
            '2026-01-01T00:00:00.000Z',
            '2026-01-01T00:00:00.000Z',
          ),
      ).toThrow();
      db.close();

      const deleted = await app.inject({
        method: 'DELETE',
        url: `/api/events/${eventId}`,
        headers: { authorization: `Bearer ${token}` },
      });
      expect(deleted.statusCode).toBe(204);

      const { db: dbAfterDelete } = openSqliteDatabase(ctx.databaseUrl);
      const countForEvent = (table) =>
        dbAfterDelete
          .prepare(`SELECT COUNT(*) AS value FROM ${table} WHERE event_id = ?`)
          .get(eventId).value;

      expect(countForEvent('lessons')).toBe(0);
      expect(countForEvent('materials')).toBe(0);
      expect(countForEvent('quizzes')).toBe(0);
      dbAfterDelete.close();

      await app.close();
    } finally {
      ctx.cleanup();
    }
  });
});
