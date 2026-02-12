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

const createEvent = async (app, token, title, slug) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/events',
    headers: { authorization: `Bearer ${token}` },
    payload: { title, slug, visibility: 'private' },
  });
  return response.json().item;
};

describe('Admin dashboard operational snapshot', () => {
  it('rejects unauthenticated request', async () => {
    const app = await createApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/dashboard/operational-snapshot',
    });

    expect(response.statusCode).toBe(401);
    await app.close();
  });

  it('returns totals and lesson release status distribution', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const eventA = await createEvent(app, token, 'Evento A', 'evento-a-dashboard');
    await createEvent(app, token, 'Evento B', 'evento-b-dashboard');

    await app.inject({
      method: 'POST',
      url: `/api/events/${eventA.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Aula liberada',
        slug: 'aula-liberada',
        releaseAt: '2025-01-01T10:00:00.000Z',
      },
    });

    await app.inject({
      method: 'POST',
      url: `/api/events/${eventA.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Aula futura',
        slug: 'aula-futura',
        releaseAt: '2099-01-01T10:00:00.000Z',
      },
    });

    await app.inject({
      method: 'POST',
      url: `/api/events/${eventA.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Aula expirada',
        slug: 'aula-expirada',
        releaseAt: '2025-01-01T10:00:00.000Z',
        expiresAt: '2025-01-02T10:00:00.000Z',
      },
    });

    const snapshot = await app.inject({
      method: 'GET',
      url: '/api/admin/dashboard/operational-snapshot',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(snapshot.statusCode).toBe(200);
    expect(snapshot.json()).toEqual({
      totals: {
        events: 2,
        lessons: 3,
      },
      lessonReleaseStatus: {
        upcoming: 1,
        available: 1,
        expired: 1,
      },
    });

    await app.close();
  });
});
