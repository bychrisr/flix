import type { CSSProperties, ReactNode } from 'react';
import { VideoEpisodesPreview, type VideoEpisodePreviewItem } from '../molecules/VideoEpisodesPreview';
import { VideoPlayerPattern } from './VideoPlayerPattern';

type VideoPlayerEpisodesPreviewPatternProps = {
  playerProps: Omit<Parameters<typeof VideoPlayerPattern>[0], 'overlayContent'>;
  title: ReactNode;
  episodes: VideoEpisodePreviewItem[];
  style?: CSSProperties;
};

export const VideoPlayerEpisodesPreviewPattern = ({
  playerProps,
  title,
  episodes,
  style,
}: VideoPlayerEpisodesPreviewPatternProps): ReactNode => (
  <section style={{ display: 'grid', gap: 'var(--fx-space-4)', ...style }}>
    <VideoPlayerPattern {...playerProps} />

    <div style={{ display: 'grid', gap: 'var(--fx-space-3)' }}>
      <span style={{ fontFamily: 'var(--fx-font-sans)', fontSize: 'var(--fx-typo-medium-headline2-size)' }}>{title}</span>
      <VideoEpisodesPreview items={episodes} />
    </div>
  </section>
);
