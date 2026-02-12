import { describe, expect, it } from 'vitest';
import {
  createSqliteApp,
  createTempSqliteContext,
  loginAsAdmin,
} from './helpers/sqlite-runtime.js';

describe('API contract regression (sqlite)', () => {
  it('preserves accepted response contracts after persistence switch', async () => {
    const ctx = createTempSqliteContext();

    try {
      const app = await createSqliteApp({ databaseUrl: ctx.databaseUrl });
      const token = await loginAsAdmin(app);

      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/admin/login',
        payload: { username: 'admin', password: 'admin123' },
      });
      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.json()).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          tokenType: 'Bearer',
          user: expect.objectContaining({
            id: expect.any(String),
            username: 'admin',
          }),
        }),
      );

      const eventCreated = await app.inject({
        method: 'POST',
        url: '/api/events',
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: 'Contrato API',
          slug: 'contrato-api',
          visibility: 'public',
          isActive: true,
        },
      });
      expect(eventCreated.statusCode).toBe(201);
      expect(eventCreated.json().item).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          slug: 'contrato-api',
          visibility: 'public',
          hero: expect.any(Object),
          visualStyle: expect.any(Object),
        }),
      );

      const eventId = eventCreated.json().item.id;
      const lessonCreated = await app.inject({
        method: 'POST',
        url: `/api/events/${eventId}/lessons`,
        headers: { authorization: `Bearer ${token}` },
        payload: {
          title: 'Aula Contrato',
          slug: 'aula-contrato',
          releaseAt: '2026-01-01T00:00:00.000Z',
        },
      });
      expect(lessonCreated.statusCode).toBe(201);

      const catalog = await app.inject({
        method: 'POST',
        url: '/api/public/events/contrato-api/catalog',
        payload: {},
      });
      expect(catalog.statusCode).toBe(200);
      expect(catalog.json()).toEqual(
        expect.objectContaining({
          event: expect.objectContaining({
            id: eventId,
            slug: 'contrato-api',
          }),
          catalog: expect.objectContaining({
            items: expect.any(Array),
            isEmpty: expect.any(Boolean),
          }),
          serverTime: expect.any(String),
        }),
      );

      const snapshot = await app.inject({
        method: 'GET',
        url: '/api/admin/dashboard/operational-snapshot',
        headers: { authorization: `Bearer ${token}` },
      });
      expect(snapshot.statusCode).toBe(200);
      expect(snapshot.json()).toEqual(
        expect.objectContaining({
          totals: expect.objectContaining({
            events: expect.any(Number),
            lessons: expect.any(Number),
          }),
          lessonReleaseStatus: expect.objectContaining({
            upcoming: expect.any(Number),
            available: expect.any(Number),
            expired: expect.any(Number),
          }),
        }),
      );

      await app.close();
    } finally {
      ctx.cleanup();
    }
  });
});
