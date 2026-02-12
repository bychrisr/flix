import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestJson } from './api.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('learner requestJson', () => {
  it('returns parsed body when response is ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ catalog: { items: [] } }),
    });

    const result = await requestJson({ method: 'POST', path: '/api/public/events/demo/catalog' });
    expect(result.catalog.items).toEqual([]);
  });

  it('throws enriched error when response fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: 'EVENT_ACCESS_DENIED', message: 'Private event access is required' }),
    });

    await expect(
      requestJson({ method: 'POST', path: '/api/public/events/demo/catalog' }),
    ).rejects.toMatchObject({ status: 403, code: 'EVENT_ACCESS_DENIED' });
  });
});
