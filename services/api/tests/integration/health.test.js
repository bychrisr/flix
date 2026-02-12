import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

describe('GET /health', () => {
  it('returns deterministic health payload', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('@flix/api');
    expect(typeof body.timestamp).toBe('string');

    await app.close();
  });
});
