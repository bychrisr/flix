import type { ReactNode } from 'react';
import { AccessKeyForm } from '../molecules/AccessKeyForm';
import { Card } from '../atoms/Card';
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
      <h1 style={{ margin: 0, fontFamily: 'var(--fx-font-display)', fontSize: 'var(--fx-text-display)' }}>Flix</h1>
      <p style={{ marginTop: 'var(--fx-space-2)' }}>Event: <code>{eventSlug}</code></p>
      <AccessKeyForm value={accessKey} onChange={onAccessKeyChange} onSubmit={onLoad} loading={loading} />
    </Card>
    <HeroBanner eyebrow="Featured event" title={heroTitle} description={heroDescription} />
    <LessonRail title="Continue learning" items={releasedItems} />
    <LessonRail title="Scheduled or restricted" items={gatedItems} />
  </main>
);
