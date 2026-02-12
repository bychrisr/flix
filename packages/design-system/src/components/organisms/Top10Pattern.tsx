import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { Top10EntryCard } from '../molecules/Top10EntryCard';

export type Top10Item = {
  id: string;
  rank: number;
  ariaLabel?: string;
  imageUrl: string;
  imageAlt?: string;
  onClick?: () => void;
};

type Top10PatternProps = {
  title: string;
  items: Top10Item[];
  columns?: number;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-top10-width)',
  maxWidth: '100%',
  minHeight: 'var(--fx-size-pattern-top10-height)',
  borderRadius: 'var(--fx-radius-lg)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-5)',
};

export const Top10Pattern = ({ title, items, columns = 4, style }: Top10PatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    <Text as="h3" variant="medium-headline2">{title}</Text>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(var(--fx-size-pattern-top10-card-width), 1fr))`,
        gap: 'var(--fx-space-4)',
      }}
    >
      {items.map((item) => (
        <Top10EntryCard
          key={item.id}
          ariaLabel={item.ariaLabel}
          rank={item.rank}
          imageUrl={item.imageUrl}
          imageAlt={item.imageAlt}
          onClick={item.onClick}
        />
      ))}
    </div>
  </section>
);
