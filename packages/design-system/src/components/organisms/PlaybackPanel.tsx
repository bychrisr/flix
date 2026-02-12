import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

type PlaybackPanelProps = {
  title: string;
  embedUrl: string;
  provider: string;
};

export const PlaybackPanel = ({ title, embedUrl, provider }: PlaybackPanelProps): ReactNode => (
  <Card>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: 'var(--fx-radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--fx-color-border-default)',
        background: 'var(--fx-color-bg-secondary)',
      }}
    >
      <iframe title={`${title} player`} src={embedUrl} allowFullScreen style={{ width: '100%', height: '100%', border: 0 }} />
    </div>
    <Text tone="secondary" style={{ marginTop: 'var(--fx-space-3)' }}>
      Provider: {provider}
    </Text>
  </Card>
);
