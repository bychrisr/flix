import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateEventBranding } from './admin-api.js';

vi.mock('./api.js', () => ({
  requestJson: vi.fn(),
}));

const { requestJson } = await import('./api.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('admin-api branding', () => {
  it('calls branding generation endpoint with request payload', async () => {
    requestJson.mockResolvedValue({ item: { strategy: 'provider' } });

    await generateEventBranding('token-abc', 'event-123', {
      prompt: 'Generate premium black and gold brand identity',
      styleHint: 'luxury',
      provider: 'gemini',
      fallbackOnError: true,
    });

    expect(requestJson).toHaveBeenCalledWith({
      method: 'POST',
      path: '/api/events/event-123/branding/generate',
      token: 'token-abc',
      payload: {
        prompt: 'Generate premium black and gold brand identity',
        styleHint: 'luxury',
        provider: 'gemini',
        fallbackOnError: true,
      },
    });
  });
});

