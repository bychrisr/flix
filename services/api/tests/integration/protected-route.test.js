import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

describe('GET /api/events protected route', () => {
  it('returns 401 when token is missing', async () => {
    const app = await createApp();

    const response = await app.inject({ method: 'GET', url: '/api/events' });
    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it('returns 200 when token is valid', async () => {
    const app = await createApp();

    const login = await app.inject({
      method: 'POST',
      url: '/api/admin/login',
      payload: { username: 'admin', password: 'admin123' },
    });

    const token = login.json().accessToken;

    const response = await app.inject({
      method: 'GET',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ items: [] });

    await app.close();
  });
});
