import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { checkAccess, fetchPlayback } from '../services/api.js';

const eventKey = (eventSlug) => `flix.web.eventKey.${eventSlug}`;

const statusInfo = {
  blocked_private: 'Private event access key required.',
  locked: 'This lesson is not released yet.',
  expired: 'This lesson has expired.',
};

export const PlaybackPage = () => {
  const { eventSlug, lessonSlug } = useParams();
  const [accessKey, setAccessKey] = useState(() =>
    eventSlug ? window.localStorage.getItem(eventKey(eventSlug)) ?? '' : '',
  );
  const [access, setAccess] = useState(null);
  const [playback, setPlayback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusText = useMemo(() => {
    if (!access?.status) return '';
    return statusInfo[access.status] ?? access.message ?? access.status;
  }, [access]);

  const loadPlayback = async () => {
    setLoading(true);
    setError('');

    try {
      const accessResult = await checkAccess(eventSlug, lessonSlug, accessKey || undefined);
      setAccess(accessResult);

      if (!accessResult.authorized) {
        setPlayback(null);
        return;
      }

      const playbackResult = await fetchPlayback(eventSlug, lessonSlug, accessKey || undefined);
      setPlayback(playbackResult);
      if (accessKey) {
        window.localStorage.setItem(eventKey(eventSlug), accessKey);
      }
    } catch (caughtError) {
      setPlayback(null);
      setAccess(null);
      setError(caughtError?.message ?? 'Playback request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventSlug || !lessonSlug) return;
    loadPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug, lessonSlug]);

  return (
    <main className="web-layout">
      <header className="web-header">
        <h1>Lesson Playback</h1>
        <p>
          <Link to={`/events/${eventSlug}`}>Back to catalog</Link>
        </p>
      </header>

      <section className="panel">
        <div className="inline-fields">
          <input
            placeholder="Event access key (optional)"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
          />
          <button type="button" onClick={loadPlayback} disabled={loading}>
            {loading ? 'Checking...' : 'Refresh access'}
          </button>
        </div>

        {error ? <p className="status-error">{error}</p> : null}
        {statusText ? <p className="status-warn">{statusText}</p> : null}

        {access?.timing ? (
          <p>
            Release at: <code>{access.timing.releaseAt}</code>
          </p>
        ) : null}
      </section>

      {playback ? (
        <section className="panel">
          <h2>{playback.lesson.title}</h2>
          <p>
            Provider: <code>{playback.player.provider}</code>
          </p>
          <p>
            Embed URL: <a href={playback.player.embedUrl}>{playback.player.embedUrl}</a>
          </p>

          <div className="inline-actions">
            {playback.navigation.previous ? (
              <Link to={`/events/${eventSlug}/lessons/${playback.navigation.previous.slug}`}>Previous</Link>
            ) : (
              <span className="muted">No previous lesson</span>
            )}

            {playback.navigation.next ? (
              <Link to={`/events/${eventSlug}/lessons/${playback.navigation.next.slug}`}>Next</Link>
            ) : (
              <span className="muted">No next lesson</span>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
};
