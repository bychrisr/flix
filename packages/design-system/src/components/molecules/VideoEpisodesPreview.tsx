import type { CSSProperties, ReactNode } from 'react';
import { VideoNextEpisodeCard } from './VideoNextEpisodeCard';

export type VideoEpisodePreviewItem = {
  id: string;
  title: ReactNode;
  episodeLabel: ReactNode;
  description?: ReactNode;
  artworkUrl?: string;
  artworkAlt?: string;
  playLabel: string;
  onPlayClick?: () => void;
};

type VideoEpisodesPreviewProps = {
  items: VideoEpisodePreviewItem[];
  horizontal?: boolean;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--fx-space-4)',
};

export const VideoEpisodesPreview = ({ items, horizontal = false, style }: VideoEpisodesPreviewProps): ReactNode => (
  <section
    style={{
      ...rootStyle,
      ...(horizontal
        ? {
            display: 'flex',
            gap: 'var(--fx-space-4)',
            overflowX: 'auto',
            paddingBottom: 'var(--fx-space-2)',
          }
        : null),
      ...style,
    }}
  >
    {items.map((item) => (
      <VideoNextEpisodeCard
        key={item.id}
        title={item.title}
        episodeLabel={item.episodeLabel}
        description={item.description}
        artworkUrl={item.artworkUrl}
        artworkAlt={item.artworkAlt}
        playLabel={item.playLabel}
        onPlayClick={item.onPlayClick}
        style={horizontal ? { flex: '0 0 auto', width: 430 } : undefined}
      />
    ))}
  </section>
);
