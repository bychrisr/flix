const trimTrailingSlash = (value) => value.replace(/\/$/, '');

export const getApiBaseUrl = () =>
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001');

const parseBody = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const requestJson = async ({ method, path, payload, token }) => {
  const url = `${getApiBaseUrl()}${path}`;
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        ...(payload ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
  } catch {
    const error = new Error(
      `API unavailable at ${getApiBaseUrl()}. Start @flix/api or set VITE_API_BASE_URL.`,
    );
    error.code = 'API_UNAVAILABLE';
    error.status = 0;
    throw error;
  }

  const body = await parseBody(response);

  if (!response.ok) {
    const error = new Error(body?.message ?? 'Request failed');
    error.status = response.status;
    error.code = body?.error;
    error.details = body?.details;
    throw error;
  }

  return body;
};

export const postJson = (path, payload, token) =>
  requestJson({ method: 'POST', path, payload, token });
