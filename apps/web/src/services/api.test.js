import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchMaterials, fetchQuiz, requestJson, submitQuiz } from './api.js';

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

  it('sends access key for materials and quiz endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    await fetchMaterials('demo', 'lesson-1', 'private123');
    await fetchQuiz('demo', 'lesson-1', 'private123');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3001/api/public/events/demo/lessons/lesson-1/materials',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ eventAccessKey: 'private123' }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/api/public/events/demo/lessons/lesson-1/quiz',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ eventAccessKey: 'private123' }),
      }),
    );
  });

  it('submits quiz answers payload', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: { status: 'passed' } }),
    });

    await submitQuiz({
      eventSlug: 'demo',
      lessonSlug: 'lesson-1',
      eventAccessKey: 'private123',
      answers: [{ questionId: 'q1', optionId: 'o1' }],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/public/events/demo/lessons/lesson-1/quiz/submit',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          eventAccessKey: 'private123',
          answers: [{ questionId: 'q1', optionId: 'o1' }],
        }),
      }),
    );
  });

  it('throws API_UNAVAILABLE when backend is offline', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fetch failed'));

    await expect(requestJson({ method: 'POST', path: '/api/public/events/demo/catalog' })).rejects.toMatchObject({
      status: 0,
      code: 'API_UNAVAILABLE',
    });
  });
});
