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

describe('Branding flow', () => {
  it('validates payload and persists provider-generated branding into event metadata', async () => {
    const app = await createApp({
      logger: false,
      brandingProviderAdapters: {
        gemini: {
          generateBranding: async () => ({
            logoUrl: 'https://cdn.example.com/branding/logo-v1.svg',
            visualStyle: {
              backgroundColor: '#102030',
              textColor: '#fefefe',
              accentColor: '#ff3366',
            },
            hero: {
              title: 'Nova Marca Flix',
              subtitle: 'Posicione seu evento com clareza',
              ctaText: 'Quero participar',
            },
          }),
        },
      },
    });

    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Branding',
      slug: 'evento-branding',
      visibility: 'private',
    });

    const invalid = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/branding/generate`,
      headers: { authorization: `Bearer ${token}` },
      payload: { prompt: 'curto' },
    });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().error).toBe('VALIDATION_ERROR');

    const generated = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/branding/generate`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        prompt: 'Criar branding minimalista com alto contraste para evento premium',
        styleHint: 'minimal high contrast',
      },
    });

    expect(generated.statusCode).toBe(200);
    expect(generated.json().item.strategy).toBe('provider');
    expect(generated.json().item.assets.logoUrl).toContain('logo-v1.svg');
    expect(generated.json().item.event.brandingProvider).toBe('gemini');

    const list = await app.inject({
      method: 'GET',
      url: '/api/events',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(list.statusCode).toBe(200);
    expect(list.json().items[0].logoUrl).toBe('https://cdn.example.com/branding/logo-v1.svg');
    expect(list.json().items[0].visualStyle.accentColor).toBe('#ff3366');

    await app.close();
  });

  it('retries provider failures and falls back with standardized response', async () => {
    let calls = 0;
    const app = await createApp({
      logger: false,
      brandingProviderAdapters: {
        gemini: {
          generateBranding: async () => {
            calls += 1;
            throw Object.assign(new Error('provider timeout'), {
              statusCode: 504,
              error: 'PROVIDER_TIMEOUT',
            });
          },
        },
      },
    });

    const token = await getAdminToken(app);
    const event = await createEvent(app, token, {
      title: 'Evento Fallback',
      slug: 'evento-fallback',
      visibility: 'public',
    });

    const response = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/branding/generate`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        prompt: 'Gerar uma identidade criativa focada em performance e clareza visual',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().item.strategy).toBe('fallback');
    expect(response.json().item.provider).toBe('gemini');
    expect(response.json().item.event.brandingProvider).toBe('fallback');
    expect(response.json().item.assets.logoUrl).toContain('api.dicebear.com');
    expect(response.json().item.meta.attempts).toBe(3);
    expect(calls).toBe(3);

    const noFallback = await app.inject({
      method: 'POST',
      url: `/api/events/${event.id}/branding/generate`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        prompt: 'Gerar branding sem fallback para validar erro padronizado',
        fallbackOnError: false,
      },
    });
    expect(noFallback.statusCode).toBe(502);
    expect(noFallback.json().error).toBe('BRANDING_PROVIDER_FAILED');
    expect(noFallback.json().details.errors).toHaveLength(3);

    await app.close();
  });
});

