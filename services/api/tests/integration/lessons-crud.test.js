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

const createEvent = async (app, token) => {
  const created = await app.inject({
    method: 'POST',
    url: '/api/events',
    headers: { authorization: `Bearer ${token}` },
    payload: {
      title: 'Evento Base',
      slug: 'evento-base',
      visibility: 'private',
    },
  });
  return created.json().item;
};

describe('Lessons CRUD', () => {
  it('supports create, list, update, and delete linked to an event', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token);

    const created = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Aula 01',
        slug: 'aula-01',
        releaseAt: '2026-03-01T12:00:00.000Z',
      },
    });

    expect(created.statusCode).toBe(201);
    expect(created.json().item.expiresAt).toBe(null);

    const lessonId = created.json().item.id;

    const listed = await app.inject({
      method: 'GET',
      url: `/api/events/${event.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items).toHaveLength(1);

    const updated = await app.inject({
      method: 'PUT',
      url: `/api/events/${event.id}/lessons/${lessonId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        expiresAt: '2026-03-10T12:00:00.000Z',
      },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().item.expiresAt).toBe('2026-03-10T12:00:00.000Z');

    const deleted = await app.inject({
      method: 'DELETE',
      url: `/api/events/${event.id}/lessons/${lessonId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deleted.statusCode).toBe(204);

    const listedAfterDelete = await app.inject({
      method: 'GET',
      url: `/api/events/${event.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listedAfterDelete.statusCode).toBe(200);
    expect(listedAfterDelete.json().items).toHaveLength(0);

    await app.close();
  });

  it('rejects invalid release/expiration window', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token);

    const invalid = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Aula com janela invalida',
        slug: 'aula-janela-invalida',
        releaseAt: '2026-03-10T12:00:00.000Z',
        expiresAt: '2026-03-09T12:00:00.000Z',
      },
    });

    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().error).toBe('LESSON_INVALID_WINDOW');

    await app.close();
  });
});
