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

describe('Observability and request-context tracing', () => {
  it('emits structured events and KPI hooks for critical flows', async () => {
    const events = [];
    const hooks = [];

    const app = await createApp({
      observabilityOverrides: {
        onEvent: (payload) => events.push(payload),
        onKpiHook: (payload) => hooks.push(payload),
      },
    });

    const token = await getAdminToken(app);

    const event = await app.inject({
      method: 'POST',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Evento Observability',
        slug: 'evento-observability',
        visibility: 'public',
      },
    });

    const createdEvent = event.json().item;

    await app.inject({
      method: 'POST',
      url: `/api/events/${createdEvent.id}/lessons`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'Aula Observability',
        slug: 'aula-observability',
        releaseAt: '2025-01-01T00:00:00.000Z',
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/public/events/evento-observability/lessons/aula-observability/access-check',
    });

    expect(events.some((item) => item.eventName === 'admin_auth_succeeded')).toBe(true);
    expect(events.some((item) => item.eventName === 'lesson_access_evaluated')).toBe(true);
    expect(hooks.some((item) => item.hookName === 'kpi_auth_login')).toBe(true);
    expect(hooks.some((item) => item.hookName === 'kpi_lesson_access_check')).toBe(true);

    await app.close();
  });

  it('returns requestId on handled errors', async () => {
    const app = await createApp();

    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/login',
      payload: {
        username: 'ad',
        password: '123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe('VALIDATION_ERROR');
    expect(response.json()).toHaveProperty('requestId');

    await app.close();
  });
});
