import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { PlaybackPanel } from '../organisms/PlaybackPanel';

type LearnerPlaybackTemplateProps = {
  title: string;
  embedUrl: string;
  provider: string;
  materials: ReactNode;
  quiz: ReactNode;
};

export const LearnerPlaybackTemplate = ({ title, embedUrl, provider, materials, quiz }: LearnerPlaybackTemplateProps) => (
  <main style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 'var(--fx-space-4)', padding: 'var(--fx-space-6)' }}>
    <PlaybackPanel title={title} embedUrl={embedUrl} provider={provider} />
    <Card>
      <h3 style={{ marginTop: 0 }}>Lesson Materials</h3>
      {materials}
    </Card>
    <Card>
      <h3 style={{ marginTop: 0 }}>Lesson Quiz</h3>
      {quiz}
    </Card>
  </main>
);
