import type { ReactNode } from 'react';
import { AccessKeyForm } from '../molecules/AccessKeyForm';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { HomeHero } from '../organisms/HomeHero';
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
  heroTitle: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  releasedItems: LessonItem[];
  gatedItems: LessonItem[];
};

const defaultHeroBackground =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23131313'/%3E%3Cstop offset='55%25' stop-color='%230f1e2f'/%3E%3Cstop offset='100%25' stop-color='%23131313'/%3E%3C/linearGradient%3E%3CradialGradient id='glow' cx='0.2' cy='0.15' r='0.6'%3E%3Cstop offset='0%25' stop-color='%23e50914' stop-opacity='0.45'/%3E%3Cstop offset='100%25' stop-color='%23e50914' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23bg)'/%3E%3Crect width='1600' height='900' fill='url(%23glow)'/%3E%3C/svg%3E";

export const LearnerCatalogTemplate = ({
  eventSlug,
  accessKey,
  onAccessKeyChange,
  onLoad,
  loading,
  eventVisibility = 'public',
  heroTitle,
  heroDescription,
  heroCtaLabel = 'Load catalog',
  releasedItems,
  gatedItems,
}: LearnerCatalogTemplateProps) => (
  <main style={{ width: '100%', display: 'grid', gap: 'var(--fx-space-6)' }}>
    <HomeHero
      backgroundImageUrl={defaultHeroBackground}
      backgroundImageAlt={heroTitle}
      headerItems={[
        { label: 'Home', href: `/events/${eventSlug}`, active: true },
        { label: 'TV Shows', href: '#' },
        { label: 'Movies', href: '#' },
        { label: 'New & Popular', href: '#' },
        { label: 'My List', href: '#' },
      ]}
      brandLabel="Netflix"
      title={heroTitle}
      eyebrow={eventVisibility === 'private' ? 'Private event' : 'Public event'}
      description={heroDescription}
      actions={{
        primaryLabel: heroCtaLabel,
        secondaryLabel: 'More Info',
        onPrimaryClick: onLoad,
      }}
      searchControlLabel="Search"
      notificationsControlLabel="Notifications"
      profileControlLabel="Open profile menu"
    />

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
      <Card>
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
      <LessonRail title="Continue learning" items={releasedItems} />
      <LessonRail title="Scheduled or restricted" items={gatedItems} />
    </section>
  </main>
);
