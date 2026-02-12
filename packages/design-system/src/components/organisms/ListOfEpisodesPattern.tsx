import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { EpisodeListItem } from '../molecules/EpisodeListItem';

export type EpisodeListEntry = {
  id: string;
  itemAriaLabel?: string;
  episodeNumber: number;
  title: string;
  durationLabel: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  active?: boolean;
  onClick?: () => void;
};

type ListOfEpisodesPatternProps = {
  title: string;
  items: EpisodeListEntry[];
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-list-of-episodes-width)',
  maxWidth: '100%',
  minHeight: 'var(--fx-size-pattern-list-of-episodes-height)',
  borderRadius: 'var(--fx-radius-lg)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-4)',
};

const rowDividerStyle: CSSProperties = {
  height: 'var(--fx-size-border-default)',
  width: '100%',
  background: 'var(--fx-color-border-default)',
};

export const ListOfEpisodesPattern = ({ title, items, style }: ListOfEpisodesPatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    <Text as="h3" variant="medium-headline2">{title}</Text>

    <div style={{ display: 'grid', gap: 'var(--fx-space-2)' }}>
      {items.map((item, index) => (
        <div key={item.id} style={{ display: 'grid', gap: 'var(--fx-space-2)' }}>
          <EpisodeListItem
            itemAriaLabel={item.itemAriaLabel}
            episodeNumber={item.episodeNumber}
            title={item.title}
            durationLabel={item.durationLabel}
            description={item.description}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
            active={item.active}
            onClick={item.onClick}
          />
          {index < items.length - 1 ? <div aria-hidden="true" style={rowDividerStyle} /> : null}
        </div>
      ))}
    </div>
  </section>
);
