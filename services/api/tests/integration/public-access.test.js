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

describe('Public access enforcement', () => {
  it('returns released/locked/expired statuses with consistent messaging', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Publico',
      slug: 'evento-publico',
      visibility: 'public',
    });

    await createLesson(app, token, event.id, {
      title: 'Aula Liberada',
      slug: 'aula-liberada',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });
    await createLesson(app, token, event.id, {
      title: 'Aula Futura',
      slug: 'aula-futura',
      releaseAt: '2099-01-01T00:00:00.000Z',
    });
    await createLesson(app, token, event.id, {
      title: 'Aula Expirada',
      slug: 'aula-expirada',
      releaseAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2025-01-02T00:00:00.000Z',
    });

    const released = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-publico/lessons/aula-liberada/access-check',
    });
    expect(released.statusCode).toBe(200);
    expect(released.json().authorized).toBe(true);
    expect(released.json().status).toBe('released');

    const locked = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-publico/lessons/aula-futura/access-check',
    });
    expect(locked.statusCode).toBe(200);
    expect(locked.json().authorized).toBe(false);
    expect(locked.json().status).toBe('locked');
    expect(locked.json().message).toBe('Lesson is not released yet');

    const expired = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-publico/lessons/aula-expirada/access-check',
    });
    expect(expired.statusCode).toBe(200);
    expect(expired.json().authorized).toBe(false);
    expect(expired.json().status).toBe('expired');

    await app.close();
  });

  it('blocks playback access for locked and expired lessons', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Playback',
      slug: 'evento-playback',
      visibility: 'public',
    });

    await createLesson(app, token, event.id, {
      title: 'Aula Futura',
      slug: 'aula-futura',
      releaseAt: '2099-01-01T00:00:00.000Z',
    });
    await createLesson(app, token, event.id, {
      title: 'Aula Expirada',
      slug: 'aula-expirada',
      releaseAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2025-01-02T00:00:00.000Z',
    });

    const lockedPlayback = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-playback/lessons/aula-futura/playback',
    });
    expect(lockedPlayback.statusCode).toBe(403);
    expect(lockedPlayback.json().status).toBe('locked');

    const expiredPlayback = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-playback/lessons/aula-expirada/playback',
    });
    expect(expiredPlayback.statusCode).toBe(403);
    expect(expiredPlayback.json().status).toBe('expired');

    await app.close();
  });

  it('validates private-event access key together with release-window checks', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Privado',
      slug: 'evento-privado',
      visibility: 'private',
      accessKey: 'private123',
    });

    await createLesson(app, token, event.id, {
      title: 'Aula Privada',
      slug: 'aula-privada',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const blockedByPrivacy = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-privado/lessons/aula-privada/access-check',
    });
    expect(blockedByPrivacy.statusCode).toBe(200);
    expect(blockedByPrivacy.json().status).toBe('blocked_private');
    expect(blockedByPrivacy.json().authorized).toBe(false);

    const granted = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-privado/lessons/aula-privada/access-check',
      payload: { eventAccessKey: 'private123' },
    });
    expect(granted.statusCode).toBe(200);
    expect(granted.json().status).toBe('released');
    expect(granted.json().authorized).toBe(true);

    await app.close();
  });
});
