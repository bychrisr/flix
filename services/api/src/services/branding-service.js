import { createHash } from 'node:crypto';

const defaultVisualStyle = {
  backgroundColor: '#111111',
  textColor: '#f5f5f5',
  accentColor: '#e50914',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createError = (statusCode, error, message, details) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  err.details = details;
  return err;
};

const toHexColor = (value, fallback) =>
  /^#[0-9a-f]{6}$/i.test(value ?? '') ? value : fallback;

const normalizeGenerated = (generated, event) => ({
  logoUrl: generated?.logoUrl ?? null,
  hero: {
    title: generated?.hero?.title?.trim() || event.title,
    subtitle:
      generated?.hero?.subtitle?.trim() || event.description || 'Welcome to the learning experience.',
    ctaText: generated?.hero?.ctaText?.trim() || 'Join now',
  },
  visualStyle: {
    backgroundColor: toHexColor(generated?.visualStyle?.backgroundColor, defaultVisualStyle.backgroundColor),
    textColor: toHexColor(generated?.visualStyle?.textColor, defaultVisualStyle.textColor),
    accentColor: toHexColor(generated?.visualStyle?.accentColor, defaultVisualStyle.accentColor),
  },
});

const buildFallback = ({ event, prompt, styleHint }) => {
  const seed = `${event.slug}:${prompt}:${styleHint ?? ''}`;
  const digest = createHash('sha256').update(seed).digest('hex');
  const color = (offset) => `#${digest.slice(offset, offset + 6)}`;
  const promptSummary = prompt.trim().slice(0, 80);

  return {
    logoUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(event.slug)}`,
    hero: {
      title: event.title,
      subtitle: promptSummary || event.description || 'Crafted for your learners.',
      ctaText: 'Start now',
    },
    visualStyle: {
      backgroundColor: color(0),
      textColor: '#f8fafc',
      accentColor: color(6),
    },
  };
};

const withTimeoutSignal = async ({ timeoutMs, fn }) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('timeout')), timeoutMs);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

export const createBrandingService = ({
  eventService,
  providers,
  defaultProvider = 'gemini',
  promptVersion = 'v1',
  timeoutMs = 9_000,
  maxRetries = 2,
  retryBackoffMs = 250,
} = {}) => {
  const getProvider = (providerName) => {
    const adapter = providers?.[providerName];
    if (!adapter || typeof adapter.generateBranding !== 'function') {
      throw createError(400, 'BRANDING_PROVIDER_INVALID', 'Branding provider is not available');
    }
    return adapter;
  };

  const generateForEvent = async ({
    eventId,
    prompt,
    styleHint,
    provider = defaultProvider,
    fallbackOnError = true,
    requestId = 'n/a',
  }) => {
    const event = eventService.getEventById(eventId);
    if (!event) {
      throw createError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const adapter = getProvider(provider);
    const errors = [];
    let attempts = 0;
    const startedAt = Date.now();

    while (attempts <= maxRetries) {
      attempts += 1;
      try {
        const generated = await withTimeoutSignal({
          timeoutMs,
          fn: (signal) =>
            adapter.generateBranding({
              event,
              prompt,
              styleHint,
              requestId,
              signal,
            }),
        });
        const normalized = normalizeGenerated(generated, event);
        const updatedEvent = eventService.updateEvent(event.id, {
          hero: normalized.hero,
          visualStyle: normalized.visualStyle,
          logoUrl: normalized.logoUrl,
          brandingProvider: provider,
          brandingPromptVersion: promptVersion,
          brandingGeneratedAt: new Date().toISOString(),
        });

        return {
          eventId: updatedEvent.id,
          provider,
          strategy: 'provider',
          promptVersion,
          assets: normalized,
          event: updatedEvent,
          meta: {
            attempts,
            durationMs: Date.now() - startedAt,
          },
        };
      } catch (error) {
        errors.push({ message: error.message, error: error.error ?? 'BRANDING_PROVIDER_ERROR' });
        if (attempts > maxRetries) {
          break;
        }
        await sleep(retryBackoffMs * attempts);
      }
    }

    if (!fallbackOnError) {
      throw createError(502, 'BRANDING_PROVIDER_FAILED', 'Branding generation failed', { errors });
    }

    const fallback = buildFallback({ event, prompt, styleHint });
    const updatedEvent = eventService.updateEvent(event.id, {
      hero: fallback.hero,
      visualStyle: fallback.visualStyle,
      logoUrl: fallback.logoUrl,
      brandingProvider: 'fallback',
      brandingPromptVersion: promptVersion,
      brandingGeneratedAt: new Date().toISOString(),
    });

    return {
      eventId: updatedEvent.id,
      provider,
      strategy: 'fallback',
      promptVersion,
      assets: fallback,
      event: updatedEvent,
      meta: {
        attempts,
        durationMs: Date.now() - startedAt,
        fallbackReason: errors.at(-1)?.message ?? 'Provider unavailable',
      },
    };
  };

  return {
    generateForEvent,
  };
};

