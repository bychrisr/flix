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

describe('Materials upload and access', () => {
  it('allows admin upload/list and learner access only for released lessons', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);

    const event = await createEvent(app, token, {
      title: 'Evento Materiais',
      slug: 'evento-materiais',
      visibility: 'public',
    });

    const releasedLesson = await createLesson(app, token, event.id, {
      title: 'Aula Liberada',
      slug: 'aula-liberada-material',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const lockedLesson = await createLesson(app, token, event.id, {
      title: 'Aula Bloqueada',
      slug: 'aula-bloqueada-material',
      releaseAt: '2099-01-01T00:00:00.000Z',
    });

    const upload = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons/${releasedLesson.id}/materials`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        files: [
          {
            fileName: 'slides-aula.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 1024,
            downloadUrl: 'https://cdn.example.com/slides-aula.pdf',
          },
          {
            fileName: 'checklist.txt',
            mimeType: 'text/plain',
            sizeBytes: 512,
            downloadUrl: 'https://cdn.example.com/checklist.txt',
          },
        ],
      },
    });

    expect(upload.statusCode).toBe(201);
    expect(upload.json().items).toHaveLength(2);

    const adminList = await app.inject({
      method: 'GET',
      url: `/api/events/${event.id}/lessons/${releasedLesson.id}/materials`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(adminList.statusCode).toBe(200);
    expect(adminList.json().items[0].downloadUrl).toContain('https://');

    const publicReleased = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-materiais/lessons/aula-liberada-material/materials',
    });
    expect(publicReleased.statusCode).toBe(200);
    expect(publicReleased.json().items).toHaveLength(2);

    const publicLocked = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-materiais/lessons/aula-bloqueada-material/materials',
    });
    expect(publicLocked.statusCode).toBe(403);
    expect(publicLocked.json().status).toBe('locked');

    const lockedUpload = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons/${lockedLesson.id}/materials`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        files: [
          {
            fileName: 'material-locked.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 1200,
            downloadUrl: 'https://cdn.example.com/material-locked.pdf',
          },
        ],
      },
    });

    expect(lockedUpload.statusCode).toBe(201);

    await app.close();
  });

  it('enforces type/size/url validation on upload', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Validacao Material',
      slug: 'evento-validacao-material',
      visibility: 'public',
    });
    const lesson = await createLesson(app, token, event.id, {
      title: 'Aula Material',
      slug: 'aula-material-validacao',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const invalidType = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons/${lesson.id}/materials`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        files: [
          {
            fileName: 'script.js',
            mimeType: 'application/javascript',
            sizeBytes: 100,
            downloadUrl: 'https://cdn.example.com/script.js',
          },
        ],
      },
    });
    expect(invalidType.statusCode).toBe(400);

    const invalidSize = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons/${lesson.id}/materials`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        files: [
          {
            fileName: 'large.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 30 * 1024 * 1024,
            downloadUrl: 'https://cdn.example.com/large.pdf',
          },
        ],
      },
    });
    expect(invalidSize.statusCode).toBe(400);

    const invalidUrl = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/lessons/${lesson.id}/materials`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        files: [
          {
            fileName: 'slides.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 100,
            downloadUrl: 'ftp://cdn.example.com/slides.pdf',
          },
        ],
      },
    });
    expect(invalidUrl.statusCode).toBe(400);

    await app.close();
  });
});
