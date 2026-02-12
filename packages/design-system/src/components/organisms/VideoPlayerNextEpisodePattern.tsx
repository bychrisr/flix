import type { CSSProperties, ReactNode } from 'react';
import { VideoNextEpisodeCard } from '../molecules/VideoNextEpisodeCard';
import { VideoPlayerPattern } from './VideoPlayerPattern';

type VideoPlayerNextEpisodePatternProps = {
  playerProps: Omit<Parameters<typeof VideoPlayerPattern>[0], 'overlayContent'>;
  card: {
    title: ReactNode;
    episodeLabel: ReactNode;
    description?: ReactNode;
    artworkUrl?: string;
    artworkAlt?: string;
    playLabel: string;
    onPlayClick?: () => void;
  };
  style?: CSSProperties;
};

export const VideoPlayerNextEpisodePattern = ({ playerProps, card, style }: VideoPlayerNextEpisodePatternProps): ReactNode => (
  <section style={{ display: 'grid', gap: 'var(--fx-space-4)', ...style }}>
    <VideoPlayerPattern {...playerProps} />
    <VideoNextEpisodeCard
      title={card.title}
      episodeLabel={card.episodeLabel}
      description={card.description}
      artworkUrl={card.artworkUrl}
      artworkAlt={card.artworkAlt}
      playLabel={card.playLabel}
      onPlayClick={card.onPlayClick}
    />
  </section>
);
