import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCatalog } from '../services/api.js';

const eventKey = (eventSlug) => `flix.web.eventKey.${eventSlug}`;

const statusLabel = {
  released: 'Released',
  locked: 'Locked',
  expired: 'Expired',
};

export const CatalogPage = () => {
  const { eventSlug } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [accessKey, setAccessKey] = useState(() =>
    eventSlug ? window.localStorage.getItem(eventKey(eventSlug)) ?? '' : '',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isPrivateBlocked = useMemo(() => error.includes('Private event access is required'), [error]);

  const loadCatalog = async () => {
    setLoading(true);
    setError('');

    try {
      const body = await fetchCatalog(eventSlug, accessKey || undefined);
      setCatalog(body);
      if (accessKey) {
        window.localStorage.setItem(eventKey(eventSlug), accessKey);
      }
    } catch (caughtError) {
      setCatalog(null);
      setError(caughtError?.message ?? 'Catalog request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventSlug) return;
    loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug]);

  return (
    <main className="web-layout">
      <header className="web-header">
        <h1>Flix Learner</h1>
        <p>Event: <code>{eventSlug}</code></p>
      </header>

      <section className="panel">
        <h2>Catalog Access</h2>
        <div className="inline-fields">
          <input
            placeholder="Event access key (optional)"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
          />
          <button type="button" onClick={loadCatalog} disabled={loading}>
            {loading ? 'Loading...' : 'Load catalog'}
          </button>
        </div>
        {isPrivateBlocked ? <p className="status-warn">Private event key required.</p> : null}
        {error && !isPrivateBlocked ? <p className="status-error">{error}</p> : null}
      </section>

      {catalog ? (
        <section className="panel">
          <h2>{catalog.event.title}</h2>
          <p>{catalog.event.description || 'No description'}</p>
          <ul className="card-list">
            {catalog.catalog.items.map((lesson) => (
              <li key={lesson.id}>
                <div>
                  <strong>{lesson.title}</strong>
                  <p>
                    Status: <span className={`badge ${lesson.status}`}>{statusLabel[lesson.status]}</span>
                  </p>
                </div>
                <Link to={`/events/${eventSlug}/lessons/${lesson.slug}`}>Open lesson</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
};
