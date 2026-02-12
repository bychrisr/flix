import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { SignInEmailPasswordPattern } from '../../../../packages/design-system/src/components/molecules/SignInEmailPasswordPattern.tsx';

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

  const submitLogin = async () => {
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

  const onSubmit = async (event) => {
    event.preventDefault();
    await submitLogin();
  };

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-label="Admin login">
        <h1>Flix Admin</h1>
        <p>Sign in to manage events, lessons, and operations.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <SignInEmailPasswordPattern
            emailValue={username}
            passwordValue={password}
            onEmailChange={setUsername}
            onPasswordChange={setPassword}
            onSubmit={submitLogin}
            emailPlaceholder="Username"
            buttonLabel={submitting ? 'Signing in...' : 'Sign In'}
            disabled={submitting}
            controlWidth="100%"
          />
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1}>
            Sign in
          </button>

          {error ? <p className="auth-error">{error}</p> : null}
        </form>
      </section>
    </main>
  );
};
