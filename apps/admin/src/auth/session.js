const SESSION_KEY = 'flix.admin.session';

const decodeJwtPayload = (token) => {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getStoredSession = () => {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.accessToken) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const saveSession = (session) => {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  window.sessionStorage.removeItem(SESSION_KEY);
};

export const isSessionExpired = (session) => {
  if (!session?.accessToken) {
    return true;
  }

  const payload = decodeJwtPayload(session.accessToken);
  if (!payload?.exp) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
};
