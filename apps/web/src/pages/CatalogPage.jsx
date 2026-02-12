import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, LearnerCatalogPage, Text } from '@flix/design-system/components';
import { fetchCatalog } from '../services/api.js';

const eventKey = (eventSlug) => `flix.web.eventKey.${eventSlug}`;

export const CatalogPage = () => {
  const { eventSlug } = useParams();
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

  const releasedItems = releasedLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    status: lesson.status,
    action: <Link to={`/events/${eventSlug}/lessons/${lesson.slug}`}>Open lesson</Link>,
  }));

  const gatedItems = gatedLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    status: lesson.status,
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
        onLoad={loadCatalog}
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
