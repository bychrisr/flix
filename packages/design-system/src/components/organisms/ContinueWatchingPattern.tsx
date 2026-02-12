import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { ContinueWatchingCard } from '../molecules/ContinueWatchingCard';

export type ContinueWatchingItem = {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  progress: number;
  progressLabel?: string;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
  onClick?: () => void;
};

type ContinueWatchingPatternProps = {
  title: string;
  items: ContinueWatchingItem[];
  style?: CSSProperties;
};

const panelStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-continue-watching-width)',
  maxWidth: '100%',
  minHeight: 'var(--fx-size-pattern-continue-watching-height)',
  borderRadius: 'var(--fx-radius-lg)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-5)',
};

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--fx-space-5)',
};

export const ContinueWatchingPattern = ({ title, items, style }: ContinueWatchingPatternProps): ReactNode => (
  <section style={{ ...panelStyle, ...style }}>
    <Text as="h3" variant="medium-headline2">{title}</Text>
    <div style={listStyle}>
      {items.map((item) => (
        <ContinueWatchingCard
          key={item.id}
          imageUrl={item.imageUrl}
          imageAlt={item.imageAlt}
          progress={item.progress}
          progressLabel={item.progressLabel}
          presetIconName={item.presetIconName}
          onClick={item.onClick}
        />
      ))}
    </div>
  </section>
);
