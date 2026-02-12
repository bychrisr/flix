import { describe, expect, it, beforeEach } from 'vitest';
import { clearSession, getStoredSession, isSessionExpired, saveSession } from './session.js';

const futureToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjQ3MDAwMDAwMDB9.signature';

const pastToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDAwMDAwMDB9.signature';

describe('session helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('saves and restores session', () => {
    saveSession({ accessToken: futureToken, tokenType: 'Bearer', user: { username: 'admin' } });
    expect(getStoredSession()).toEqual(
      expect.objectContaining({ tokenType: 'Bearer', user: { username: 'admin' } }),
    );
  });

  it('detects expired session from jwt exp', () => {
    expect(isSessionExpired({ accessToken: pastToken })).toBe(true);
    expect(isSessionExpired({ accessToken: futureToken })).toBe(false);
  });

  it('clears session', () => {
    saveSession({ accessToken: futureToken, tokenType: 'Bearer' });
    clearSession();
    expect(getStoredSession()).toBeNull();
  });
});
