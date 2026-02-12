import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { SignInCompletePattern } from '../../../../packages/design-system/src/components/molecules/SignInCompletePattern.tsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
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
        <form onSubmit={onSubmit} className="auth-form">
          <SignInCompletePattern
            emailValue={username}
            passwordValue={password}
            rememberMe={rememberMe}
            onEmailChange={setUsername}
            onPasswordChange={setPassword}
            onRememberMeChange={setRememberMe}
            onSubmit={submitLogin}
            title="Sign In"
            submitLabel={submitting ? 'Signing in...' : 'Sign In'}
            signUpPrefix="New to Flix?"
            signUpLabel="Sign up now."
            recaptchaCopy="This page is protected by Google reCAPTCHA to ensure you're not a bot."
            controlWidth="100%"
            submitting={submitting}
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
