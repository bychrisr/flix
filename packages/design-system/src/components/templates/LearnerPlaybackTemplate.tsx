import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
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
      <Text as="h3" variant="medium-title3" style={{ marginTop: 0 }}>
        Lesson Materials
      </Text>
      {materials}
    </Card>
    <Card>
      <Text as="h3" variant="medium-title3" style={{ marginTop: 0 }}>
        Lesson Quiz
      </Text>
      {quiz}
    </Card>
  </main>
);
