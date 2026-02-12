import { useAuth } from '../auth/AuthContext.jsx';

export const DashboardPage = () => {
  const { session, logout } = useAuth();

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Authenticated shell connected to the API runtime.</p>
        </div>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <article>
          <h2>Session</h2>
          <p>
            Signed in as <strong>{session?.user?.username ?? 'admin'}</strong>
          </p>
        </article>

        <article>
          <h2>Runtime Config</h2>
          <p>
            API base URL: <code>{import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'}</code>
          </p>
        </article>
      </section>
    </main>
  );
};
