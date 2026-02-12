const createProviderError = (statusCode, error, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.error = error;
  return err;
};

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizePalette = (palette) => ({
  backgroundColor: palette?.backgroundColor ?? '#111111',
  textColor: palette?.textColor ?? '#f5f5f5',
  accentColor: palette?.accentColor ?? '#e50914',
});

const normalizeHero = (hero, eventTitle) => ({
  title: hero?.title ?? eventTitle,
  subtitle: hero?.subtitle ?? 'Experience tailored for your audience.',
  ctaText: hero?.ctaText ?? 'Join now',
});

export const createGeminiBrandingAdapter = ({
  apiKey,
  model = 'gemini-2.0-flash',
  apiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta',
} = {}) => ({
  providerName: 'gemini',
  async generateBranding({ event, prompt, styleHint, signal, requestId }) {
    if (!apiKey) {
      throw createProviderError(
        503,
        'PROVIDER_NOT_CONFIGURED',
        'Gemini API key is not configured',
      );
    }

    const promptText = [
      'You are generating event branding metadata for a web learning platform.',
      'Return ONLY JSON with this shape:',
      '{"logoUrl":"https://...","palette":{"backgroundColor":"#RRGGBB","textColor":"#RRGGBB","accentColor":"#RRGGBB"},"hero":{"title":"...","subtitle":"...","ctaText":"..."}}',
      'All colors must be 6-digit hex.',
      `Event title: ${event.title}`,
      `Event description: ${event.description || '(none)'}`,
      `Branding prompt: ${prompt}`,
      `Style hint: ${styleHint || '(none)'}`,
      `Request id: ${requestId}`,
    ].join('\n');

    const response = await fetch(
      `${apiBaseUrl}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: 'application/json',
          },
        }),
      },
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw createProviderError(
        response.status || 502,
        'PROVIDER_UPSTREAM_FAILED',
        payload?.error?.message ?? 'Gemini branding request failed',
      );
    }

    const modelText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = typeof modelText === 'string' ? safeJsonParse(modelText) : null;
    if (!parsed) {
      throw createProviderError(
        502,
        'PROVIDER_INVALID_RESPONSE',
        'Gemini response could not be parsed as branding JSON',
      );
    }

    return {
      logoUrl: parsed.logoUrl ?? null,
      visualStyle: normalizePalette(parsed.palette),
      hero: normalizeHero(parsed.hero, event.title),
    };
  },
});

