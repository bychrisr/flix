import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { MovieBlockCard } from '../molecules/MovieBlockCard';

export type MovieBlockCardEntry = {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
  onClick?: () => void;
};

export type MovieBlockSection = {
  id: string;
  title: string;
  items: MovieBlockCardEntry[];
};

type MovieBlocksPatternProps = {
  sections: MovieBlockSection[];
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-movie-blocks-width)',
  maxWidth: '100%',
  minHeight: 'var(--fx-size-pattern-movie-blocks-height)',
  borderRadius: 'var(--fx-radius-lg)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-6)',
};

const railStyle: CSSProperties = {
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: 'var(--fx-size-pattern-movie-card-standard-width)',
  gap: 'var(--fx-space-2)',
  overflowX: 'auto',
};

export const MovieBlocksPattern = ({ sections, style }: MovieBlocksPatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    {sections.map((section) => (
      <div key={section.id} style={{ display: 'grid', gap: 'var(--fx-space-3)' }}>
        <Text as="h3" variant="medium-headline2">{section.title}</Text>
        <div style={railStyle}>
          {section.items.map((item) => (
            <MovieBlockCard
              key={item.id}
              imageUrl={item.imageUrl}
              imageAlt={item.imageAlt}
              presetIconName={item.presetIconName}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    ))}
  </section>
);
