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
  await app.inject({
    method: 'POST',
    url: `/api/events/${eventId}/lessons`,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
};

describe('Public event catalog', () => {
  it('returns hero and lesson catalog with status mapping', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Catalogo',
      slug: 'evento-catalogo',
      visibility: 'public',
      hero: { title: 'Hero', subtitle: 'Sub', ctaText: 'Entrar' },
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

    const catalog = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-catalogo/catalog',
    });

    expect(catalog.statusCode).toBe(200);
    expect(catalog.json().event.hero.title).toBe('Hero');
    expect(catalog.json().catalog.items).toHaveLength(3);
    expect(catalog.json().catalog.items.map((item) => item.status).sort()).toEqual([
      'expired',
      'locked',
      'released',
    ]);

    await app.close();
  });

  it('returns empty catalog state', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    await createEvent(app, token, {
      title: 'Evento Vazio',
      slug: 'evento-vazio',
      visibility: 'public',
    });

    const catalog = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-vazio/catalog',
    });

    expect(catalog.statusCode).toBe(200);
    expect(catalog.json().catalog.isEmpty).toBe(true);
    expect(catalog.json().catalog.items).toHaveLength(0);

    await app.close();
  });

  it('enforces private-event access before returning catalog', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Privado Catalogo',
      slug: 'evento-privado-catalogo',
      visibility: 'private',
      accessKey: 'catalog123',
    });
    await createLesson(app, token, event.id, {
      title: 'Aula Privada',
      slug: 'aula-privada',
      releaseAt: '2025-01-01T00:00:00.000Z',
    });

    const denied = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-privado-catalogo/catalog',
    });
    expect(denied.statusCode).toBe(403);
    expect(denied.json().status).toBe('blocked_private');

    const granted = await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-privado-catalogo/catalog',
      payload: { eventAccessKey: 'catalog123' },
    });
    expect(granted.statusCode).toBe(200);
    expect(granted.json().catalog.items).toHaveLength(1);

    await app.close();
  });
});
