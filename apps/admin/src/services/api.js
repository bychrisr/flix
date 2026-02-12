const trimTrailingSlash = (value) => value.replace(/\/$/, '');

export const getApiBaseUrl = () =>
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001');

export const postJson = async (path, payload, headers = {}) => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  return { response, body };
};
