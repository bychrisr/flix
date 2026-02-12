import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';
import { VideoPlayerIconButton } from '../atoms/VideoPlayerIconButton';

type VideoNextEpisodeCardProps = {
  title: ReactNode;
  episodeLabel: ReactNode;
  description?: ReactNode;
  artworkUrl?: string;
  artworkAlt?: string;
  playLabel: string;
  onPlayClick?: () => void;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'min(100%, var(--fx-size-pattern-player-next-episode-card-width))',
  minHeight: 'var(--fx-size-pattern-player-next-episode-card-height)',
  borderRadius: 'var(--fx-radius-sm)',
  overflow: 'hidden',
  background: 'var(--fx-color-player-surface)',
  display: 'grid',
  gridTemplateRows: '200px auto',
};

export const VideoNextEpisodeCard = ({
  title,
  episodeLabel,
  description,
  artworkUrl,
  artworkAlt = '',
  playLabel,
  onPlayClick,
  style,
}: VideoNextEpisodeCardProps): ReactNode => (
  <article style={{ ...rootStyle, ...style }}>
    {artworkUrl ? (
      <img src={artworkUrl} alt={artworkAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    ) : (
      <div style={{ background: 'var(--fx-color-bg-secondary)' }} />
    )}

    <div style={{ padding: 'var(--fx-space-4)', display: 'grid', gap: 'var(--fx-space-2)' }}>
      <Text as="p" variant="regular-caption1" tone="secondary" style={{ margin: 0 }}>{episodeLabel}</Text>
      <Text as="h4" variant="medium-title3" style={{ margin: 0 }}>{title}</Text>
      {description ? <Text as="p" variant="regular-small-body-normal" tone="secondary" style={{ margin: 0 }}>{description}</Text> : null}
      <VideoPlayerIconButton
        icon="play"
        size="var(--fx-size-pattern-video-icon-play)"
        ariaLabel={playLabel}
        onClick={onPlayClick}
        style={{ justifySelf: 'start' }}
      />
    </div>
  </article>
);
