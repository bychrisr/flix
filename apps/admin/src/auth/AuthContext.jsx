import { createContext, useContext, useMemo, useState } from 'react';
import { postJson } from '../services/api.js';
import { clearSession, getStoredSession, isSessionExpired, saveSession } from './session.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const stored = getStoredSession();
    if (!stored || isSessionExpired(stored)) {
      clearSession();
      return null;
    }
    return stored;
  });

  const login = async ({ username, password }) => {
    let body;
    try {
      body = await postJson('/api/admin/login', { username, password });
    } catch (error) {
      return { ok: false, error: error.message ?? 'Invalid credentials' };
    }

    const nextSession = {
      accessToken: body.accessToken,
      tokenType: body.tokenType,
      user: body.user,
    };

    saveSession(nextSession);
    setSession(nextSession);
    return { ok: true };
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session && !isSessionExpired(session)),
      login,
      logout,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
