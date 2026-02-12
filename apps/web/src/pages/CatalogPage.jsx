import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, LearnerCatalogPage, Text } from '@flix/design-system/components';
import { fetchCatalog } from '../services/api.js';

const eventKey = (eventSlug) => `flix.web.eventKey.${eventSlug}`;

const getLessonThumbnail = (lesson) => {
  if (lesson?.videoProvider === 'youtube' && lesson?.videoId) {
    return `https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg`;
  }
  if (lesson?.videoProvider === 'vimeo' && lesson?.videoId) {
    return `https://vumbnail.com/${lesson.videoId}.jpg`;
  }
  return '';
};

export const CatalogPage = () => {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState(null);
  const [accessKey, setAccessKey] = useState(() =>
    eventSlug ? window.localStorage.getItem(eventKey(eventSlug)) ?? '' : '',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleWatchFirstLesson = async () => {
    if (!eventSlug) return;

    const navigateToFirstLesson = (items = []) => {
      const firstLesson = items.find((lesson) => lesson?.slug);
      if (!firstLesson?.slug) return false;
      navigate(`/events/${eventSlug}/lessons/${firstLesson.slug}`);
      return true;
    };

    if (navigateToFirstLesson(catalog?.catalog?.items ?? [])) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const body = await fetchCatalog(eventSlug, accessKey || undefined);
      setCatalog(body);
      if (accessKey) {
        window.localStorage.setItem(eventKey(eventSlug), accessKey);
      }

      if (!navigateToFirstLesson(body?.catalog?.items ?? [])) {
        setError('Nenhuma aula disponível para este evento.');
      }
    } catch (caughtError) {
      setCatalog(null);
      setError(caughtError?.message ?? 'Catalog request failed');
    } finally {
      setLoading(false);
    }
  };

  const releasedItems = releasedLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    status: lesson.status,
    imageUrl: getLessonThumbnail(lesson),
    presetIconName: 'presetRecentlyAdded',
    action: <Link to={`/events/${eventSlug}/lessons/${lesson.slug}`}>Open lesson</Link>,
  }));

  const gatedItems = gatedLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    status: lesson.status,
    imageUrl: getLessonThumbnail(lesson),
    presetIconName: lesson.status === 'locked' ? 'presetTop10' : 'presetLeavingSoon',
    action: <Link to={`/events/${eventSlug}/lessons/${lesson.slug}`}>Details</Link>,
  }));

  return (
    <>
      {error ? (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: 'var(--fx-space-6)' }}>
          <Card>
            <Text as="p" variant="regular-body" tone="error" style={{ margin: 0 }}>
              {error}
            </Text>
          </Card>
        </main>
      ) : null}

      <LearnerCatalogPage
        eventSlug={eventSlug ?? ''}
        accessKey={accessKey}
        onAccessKeyChange={setAccessKey}
        onLoad={handleWatchFirstLesson}
        loading={loading}
        eventVisibility={catalog?.event?.visibility}
        eventTitle={catalog?.event?.title ?? ''}
        eventDescription={catalog?.event?.description ?? ''}
        highlightVideoUrl={catalog?.event?.highlightVideoUrl ?? ''}
        heroTitle={catalog?.event?.hero?.title ?? catalog?.event?.title ?? 'Flix'}
        heroDescription={catalog?.event?.hero?.subtitle ?? catalog?.event?.description ?? ''}
        heroCtaLabel={catalog?.event?.hero?.ctaText ?? 'Load catalog'}
        releasedItems={releasedItems}
        gatedItems={gatedItems}
      />
    </>
  );
};
