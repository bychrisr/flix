import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { ContinueWatchingCard } from '../molecules/ContinueWatchingCard';
import { MovieBlockCard } from '../molecules/MovieBlockCard';
import { Top10EntryCard } from '../molecules/Top10EntryCard';

type ContinueWatchingItem = {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  progress: number;
  progressLabel?: string;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
  onClick?: () => void;
};

type MovieBlockCardEntry = {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
  onClick?: () => void;
};

type Top10Item = {
  id: string;
  rank: number;
  ariaLabel?: string;
  imageUrl: string;
  imageAlt?: string;
  onClick?: () => void;
};

type MoviesCardsPatternProps = {
  title: string;
  standardCards: MovieBlockCardEntry[];
  mediumCards?: MovieBlockCardEntry[];
  smallCards?: MovieBlockCardEntry[];
  top10Cards?: Top10Item[];
  continueWatchingCards?: ContinueWatchingItem[];
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-movies-cards-width)',
  maxWidth: '100%',
  minHeight: 'var(--fx-size-pattern-movies-cards-height)',
  borderRadius: 'var(--fx-radius-lg)',
  background: 'var(--fx-color-bg-elevated)',
  padding: 'var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-6)',
};

const rowStyle: CSSProperties = {
  display: 'grid',
  gridAutoFlow: 'column',
  gap: 'var(--fx-space-3)',
  overflowX: 'auto',
  alignItems: 'start',
};

export const MoviesCardsPattern = ({
  title,
  standardCards,
  mediumCards,
  smallCards,
  top10Cards,
  continueWatchingCards,
  style,
}: MoviesCardsPatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    <Text as="h3" variant="medium-headline2">{title}</Text>

    <div style={rowStyle}>
      {standardCards.map((item) => (
        <MovieBlockCard
          key={item.id}
          size="standard"
          imageUrl={item.imageUrl}
          imageAlt={item.imageAlt}
          presetIconName={item.presetIconName}
          onClick={item.onClick}
        />
      ))}
    </div>

    {mediumCards?.length ? (
      <div style={rowStyle}>
        {mediumCards.map((item) => (
          <MovieBlockCard
            key={item.id}
            size="medium"
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
            presetIconName={item.presetIconName}
            onClick={item.onClick}
          />
        ))}
      </div>
    ) : null}

    {smallCards?.length ? (
      <div style={rowStyle}>
        {smallCards.map((item) => (
          <MovieBlockCard
            key={item.id}
            size="small"
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
            presetIconName={item.presetIconName}
            onClick={item.onClick}
          />
        ))}
      </div>
    ) : null}

    {top10Cards?.length ? (
      <div style={rowStyle}>
        {top10Cards.map((item) => (
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
    ) : null}

    {continueWatchingCards?.length ? (
      <div style={rowStyle}>
        {continueWatchingCards.map((item) => (
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
    ) : null}
  </section>
);
