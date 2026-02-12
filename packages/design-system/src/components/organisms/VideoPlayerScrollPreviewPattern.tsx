import type { CSSProperties, ReactNode } from 'react';
import { VideoEpisodesPreview, type VideoEpisodePreviewItem } from '../molecules/VideoEpisodesPreview';
import { VideoPlayerPattern } from './VideoPlayerPattern';

type VideoPlayerScrollPreviewPatternProps = {
  playerProps: Omit<Parameters<typeof VideoPlayerPattern>[0], 'overlayContent'>;
  items: VideoEpisodePreviewItem[];
  style?: CSSProperties;
};

export const VideoPlayerScrollPreviewPattern = ({ playerProps, items, style }: VideoPlayerScrollPreviewPatternProps): ReactNode => (
  <section style={{ display: 'grid', gap: 'var(--fx-space-4)', ...style }}>
    <VideoPlayerPattern {...playerProps} />
    <VideoEpisodesPreview items={items} horizontal />
  </section>
);
