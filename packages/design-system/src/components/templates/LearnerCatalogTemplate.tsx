import type { ReactNode } from 'react';
import { AccessKeyForm } from '../molecules/AccessKeyForm';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { HeroBanner } from '../organisms/HeroBanner';
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
  heroTitle: string;
  heroDescription?: string;
  releasedItems: LessonItem[];
  gatedItems: LessonItem[];
};

export const LearnerCatalogTemplate = ({
  eventSlug,
  accessKey,
  onAccessKeyChange,
  onLoad,
  loading,
  heroTitle,
  heroDescription,
  releasedItems,
  gatedItems,
}: LearnerCatalogTemplateProps) => (
  <main style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 'var(--fx-space-4)', padding: 'var(--fx-space-6)' }}>
    <Card>
      <Text as="h1" variant="display-large">Flix</Text>
      <Text variant="regular-body" style={{ marginTop: 'var(--fx-space-2)' }}>
        Event: <code>{eventSlug}</code>
      </Text>
      <Text as="h2" variant="medium-title2" style={{ marginTop: 'var(--fx-space-4)' }}>
        Catalog Access
      </Text>
      <AccessKeyForm value={accessKey} onChange={onAccessKeyChange} onSubmit={onLoad} loading={loading} />
    </Card>
    <HeroBanner eyebrow="Featured event" title={heroTitle} description={heroDescription} />
    <LessonRail title="Continue learning" items={releasedItems} />
    <LessonRail title="Scheduled or restricted" items={gatedItems} />
  </main>
);
