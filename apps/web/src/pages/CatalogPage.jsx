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
  const releasedLessons = useMemo(
    () => catalog?.catalog?.items?.filter((lesson) => lesson.status === 'released') ?? [],
    [catalog],
  );
  const gatedLessons = useMemo(
    () => catalog?.catalog?.items?.filter((lesson) => lesson.status !== 'released') ?? [],
    [catalog],
  );

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
        <h1>Flix</h1>
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
        <>
          <section className="hero-panel">
            <p className="hero-eyebrow">Featured event</p>
            <h2>{catalog.event.title}</h2>
            <p>{catalog.event.description || 'No description'}</p>
            {releasedLessons[0] ? (
              <div className="inline-actions">
                <Link to={`/events/${eventSlug}/lessons/${releasedLessons[0].slug}`}>Play now</Link>
              </div>
            ) : null}
          </section>

          <section className="panel">
            <h3>Continue learning</h3>
            {releasedLessons.length === 0 ? (
              <p className="muted">No released lessons yet.</p>
            ) : (
              <ul className="lesson-rail">
                {releasedLessons.map((lesson) => (
                  <li key={lesson.id} className="lesson-tile">
                    <div>
                      <strong>{lesson.title}</strong>
                      <p>
                        <span className={`badge ${lesson.status}`}>{statusLabel[lesson.status]}</span>
                      </p>
                    </div>
                    <Link to={`/events/${eventSlug}/lessons/${lesson.slug}`}>Open lesson</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <h3>Scheduled or restricted</h3>
            {gatedLessons.length === 0 ? (
              <p className="muted">No gated lessons.</p>
            ) : (
              <ul className="lesson-rail">
                {gatedLessons.map((lesson) => (
                  <li key={lesson.id} className="lesson-tile">
                    <div>
                      <strong>{lesson.title}</strong>
                      <p>
                        <span className={`badge ${lesson.status}`}>{statusLabel[lesson.status]}</span>
                      </p>
                    </div>
                    <Link to={`/events/${eventSlug}/lessons/${lesson.slug}`}>Details</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
};
