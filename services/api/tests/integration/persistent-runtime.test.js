import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

const makeTempDbUrl = () => {
  const dir = mkdtempSync(join(tmpdir(), 'flix-persist-'));
  return {
    dir,
    databaseUrl: `file:${join(dir, 'runtime.sqlite')}`,
  };
};

const login = async (app) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/admin/login',
    payload: { username: 'admin', password: 'admin123' },
  });

  return response.json().accessToken;
};

describe('Persistent runtime adapter', () => {
  it('persists writes across app restarts when using sqlite adapter', async () => {
    const { dir, databaseUrl } = makeTempDbUrl();

    try {
      const appA = await createApp({ logger: false, persistenceAdapter: 'sqlite', databaseUrl });
      const tokenA = await login(appA);

      const createdEvent = await appA.inject({
        method: 'POST',
        url: '/api/events',
        headers: { authorization: `Bearer ${tokenA}` },
        payload: {
          title: 'Persisted Event',
          slug: 'persisted-event',
          description: 'Should survive restarts',
          isActive: true,
          visibility: 'public',
        },
      });

      expect(createdEvent.statusCode).toBe(201);
      const eventId = createdEvent.json().item.id;

      const createdLesson = await appA.inject({
        method: 'POST',
        url: `/api/events/${eventId}/lessons`,
        headers: { authorization: `Bearer ${tokenA}` },
        payload: {
          title: 'Persisted Lesson',
          slug: 'persisted-lesson',
          releaseAt: '2026-01-01T10:00:00.000Z',
        },
      });

      expect(createdLesson.statusCode).toBe(201);
      await appA.close();

      const appB = await createApp({ logger: false, persistenceAdapter: 'sqlite', databaseUrl });
      const tokenB = await login(appB);

      const eventsList = await appB.inject({
        method: 'GET',
        url: '/api/events',
        headers: { authorization: `Bearer ${tokenB}` },
      });
      expect(eventsList.statusCode).toBe(200);
      expect(eventsList.json().items.some((event) => event.slug === 'persisted-event')).toBe(true);

      const lessonsList = await appB.inject({
        method: 'GET',
        url: `/api/events/${eventId}/lessons`,
        headers: { authorization: `Bearer ${tokenB}` },
      });
      expect(lessonsList.statusCode).toBe(200);
      expect(lessonsList.json().items.some((lesson) => lesson.slug === 'persisted-lesson')).toBe(true);

      await appB.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
