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

describe('Events CRUD', () => {
  it('supports create, list, update, and delete for admin', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);

    const created = await app.inject({
      method: 'POST',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Lancamento Marco',
        slug: 'lancamento-marco',
        description: 'Primeira turma do ano',
        isActive: true,
        visibility: 'private',
      },
    });

    expect(created.statusCode).toBe(201);
    expect(created.json().item.slug).toBe('lancamento-marco');
    expect(created.json().item.isActive).toBe(true);
    expect(created.json().item.visibility).toBe('private');

    const eventId = created.json().item.id;

    const list = await app.inject({
      method: 'GET',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(list.statusCode).toBe(200);
    expect(list.json().items).toHaveLength(1);

    const updated = await app.inject({
      method: 'PUT',
      url: `/api/events/${eventId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { isActive: false, visibility: 'public', title: 'Lancamento Abril' },
    });

    expect(updated.statusCode).toBe(200);
    expect(updated.json().item.isActive).toBe(false);
    expect(updated.json().item.visibility).toBe('public');
    expect(updated.json().item.title).toBe('Lancamento Abril');

    const deleted = await app.inject({
      method: 'DELETE',
      url: `/api/events/${eventId}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(deleted.statusCode).toBe(204);

    const listAfterDelete = await app.inject({
      method: 'GET',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listAfterDelete.statusCode).toBe(200);
    expect(listAfterDelete.json().items).toHaveLength(0);

    await app.close();
  });

  it('enforces event slug uniqueness', async () => {
    const app = await createApp();
    const token = await getAdminToken(app);

    const first = await app.inject({
      method: 'POST',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Evento A', slug: 'evento-a', visibility: 'private' },
    });
    expect(first.statusCode).toBe(201);

    const duplicate = await app.inject({
      method: 'POST',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Evento B', slug: 'evento-a', visibility: 'public' },
    });

    expect(duplicate.statusCode).toBe(409);
    expect(duplicate.json().error).toBe('EVENT_SLUG_CONFLICT');

    await app.close();
  });
});
