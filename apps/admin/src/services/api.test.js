import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestJson } from './api.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('requestJson', () => {
  it('sends bearer token and returns parsed json', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const result = await requestJson({ method: 'GET', path: '/api/events', token: 'abc' });
    expect(result).toEqual({ items: [] });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.authorization).toBe('Bearer abc');
  });

  it('throws rich error for non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'VALIDATION_ERROR', message: 'Invalid payload' }),
    });

    await expect(
      requestJson({ method: 'POST', path: '/api/events', payload: { title: '' }, token: 'abc' }),
    ).rejects.toMatchObject({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid payload',
    });
  });

  it('throws API_UNAVAILABLE when backend is offline', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fetch failed'));

    await expect(requestJson({ method: 'GET', path: '/api/events', token: 'abc' })).rejects.toMatchObject({
      status: 0,
      code: 'API_UNAVAILABLE',
    });
  });
});
