import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

describe('POST /api/admin/login', () => {
  it('returns token for valid credentials', async () => {
    const app = await createApp();

    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/login',
      payload: { username: 'admin', password: 'admin123' },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.tokenType).toBe('Bearer');
    expect(typeof body.accessToken).toBe('string');
    expect(body.user.username).toBe('admin');

    await app.close();
  });

  it('returns 401 for invalid credentials', async () => {
    const app = await createApp();

    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/login',
      payload: { username: 'admin', password: 'wrongpass' },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json().error).toBe('INVALID_CREDENTIALS');

    await app.close();
  });
});
