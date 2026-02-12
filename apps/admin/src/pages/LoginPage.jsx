import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await login({ username, password });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const from = location.state?.from;
    navigate(from && from !== '/login' ? from : '/dashboard', { replace: true });
  };

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-label="Admin login">
        <h1>Flix Admin</h1>
        <p>Sign in to manage events, lessons, and operations.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
};
