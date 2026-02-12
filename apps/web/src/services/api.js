const trimTrailingSlash = (value) => value.replace(/\/$/, '');

export const getApiBaseUrl = () =>
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001');

export const requestJson = async ({ method, path, payload }) => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: payload ? { 'content-type': 'application/json' } : {},
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body?.message ?? 'Request failed');
    error.status = response.status;
    error.code = body?.error;
    error.details = body?.details;
    error.payload = body;
    throw error;
  }

  return body;
};

export const fetchCatalog = (eventSlug, eventAccessKey) =>
  requestJson({
    method: 'POST',
    path: `/api/public/events/${eventSlug}/catalog`,
    payload: eventAccessKey ? { eventAccessKey } : {},
  });

export const checkAccess = (eventSlug, lessonSlug, eventAccessKey) =>
  requestJson({
    method: 'POST',
    path: `/api/public/events/${eventSlug}/lessons/${lessonSlug}/access-check`,
    payload: eventAccessKey ? { eventAccessKey } : {},
  });

export const fetchPlayback = (eventSlug, lessonSlug, eventAccessKey) =>
  requestJson({
    method: 'POST',
    path: `/api/public/events/${eventSlug}/lessons/${lessonSlug}/playback`,
    payload: eventAccessKey ? { eventAccessKey } : {},
  });
