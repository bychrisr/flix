import type { ReactNode } from 'react';
import { AccessKeyForm } from '../molecules/AccessKeyForm';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { HeroBanner } from '../organisms/HeroBanner';
import { HomePageHeader } from '../organisms/HomePageHeader';
import { LessonRail } from '../organisms/LessonRail';

type LessonItem = {
  id: string;
  title: string;
  status: 'released' | 'locked' | 'expired';
  action?: ReactNode;
};

type LearnerCatalogTemplateProps = {
  eventSlug: string;
  accessKey: string;
  onAccessKeyChange: (next: string) => void;
  onLoad: () => void;
  loading?: boolean;
  eventVisibility?: 'public' | 'private';
  eventTitle?: string;
  eventDescription?: string;
  heroTitle: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  releasedItems: LessonItem[];
  gatedItems: LessonItem[];
};

const defaultHeroBackground =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23131313'/%3E%3Cstop offset='55%25' stop-color='%230f1e2f'/%3E%3Cstop offset='100%25' stop-color='%23131313'/%3E%3C/linearGradient%3E%3CradialGradient id='glow' cx='0.2' cy='0.15' r='0.6'%3E%3Cstop offset='0%25' stop-color='%23e50914' stop-opacity='0.45'/%3E%3Cstop offset='100%25' stop-color='%23e50914' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23bg)'/%3E%3Crect width='1600' height='900' fill='url(%23glow)'/%3E%3C/svg%3E";
const defaultHeroVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export const LearnerCatalogTemplate = ({
  eventSlug,
  accessKey,
  onAccessKeyChange,
  onLoad,
  loading,
  eventVisibility = 'public',
  eventTitle = '',
  eventDescription = '',
  heroTitle,
  heroDescription,
  heroCtaLabel = 'Load catalog',
  releasedItems,
  gatedItems,
}: LearnerCatalogTemplateProps) => (
  <main style={{ width: '100%', display: 'grid', gap: 'var(--fx-space-6)' }}>
    <section
      style={{
        width: '100%',
        position: 'relative',
        minHeight: 680,
        overflow: 'hidden',
        background: 'var(--fx-color-bg-primary)',
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={defaultHeroBackground}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src={defaultHeroVideoUrl} type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgb(0 0 0 / 40%) 0%, rgb(0 0 0 / 20%) 24%, rgb(0 0 0 / 75%) 100%), linear-gradient(90deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 15%) 55%, rgb(0 0 0 / 60%) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <HomePageHeader
          items={[
            { label: 'Início', href: `/events/${eventSlug}`, active: true },
            { label: 'Comentários', href: '#comentarios' },
            { label: 'Materiais de Apoio', href: '#materiais' },
            { label: 'Quiz', href: '#quiz' },
          ]}
          brandLabel="Netflix"
          searchControlLabel="Search"
          notificationsControlLabel="Notifications"
          profileControlLabel="Open profile menu"
          style={{ maxWidth: 1320, margin: '0 auto', width: '100%' }}
        />

        <div
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: 'var(--fx-space-8) var(--fx-space-6)',
            minHeight: 560,
            display: 'flex',
            alignItems: 'flex-end',
            boxSizing: 'border-box',
          }}
        >
          <HeroBanner
            mode="overlay"
            size="large"
            badgeLabel={eventVisibility === 'private' ? 'Private event' : 'Public event'}
            eyebrow={eventTitle || eventSlug}
            title={heroTitle}
            description={heroDescription}
            supportingText={eventDescription}
            actions={{
              primaryLabel: heroCtaLabel,
              secondaryLabel: 'More Info',
              onPrimaryClick: onLoad,
            }}
            utilities={{
              ratingLabel: 'TV-14',
              muteControlLabel: 'Mute',
              audioDescriptionControlLabel: 'Audio description',
              replayControlLabel: 'Replay',
            }}
            style={{ width: 620, maxWidth: '100%' }}
          />
        </div>
      </div>
    </section>

    <section
      style={{
        maxWidth: 1320,
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gap: 'var(--fx-space-6)',
        padding: '0 var(--fx-space-6) var(--fx-space-8)',
        boxSizing: 'border-box',
      }}
    >
      <Card id="materiais">
        <Text as="h1" variant="display-large">Flix</Text>
        <Text variant="regular-body" style={{ marginTop: 'var(--fx-space-2)' }}>
          Event: <code>{eventSlug}</code>
        </Text>
        <Text as="h2" variant="medium-title2" style={{ marginTop: 'var(--fx-space-4)' }}>
          Catalog Access
        </Text>
        <AccessKeyForm
          value={accessKey}
          onChange={onAccessKeyChange}
          onSubmit={onLoad}
          loading={loading}
          submitLabel="Load catalog"
        />
      </Card>
      <section id="comentarios">
        <LessonRail title="Continue learning" items={releasedItems} />
      </section>
      <section id="quiz">
        <LessonRail title="Scheduled or restricted" items={gatedItems} />
      </section>
    </section>
  </main>
);
