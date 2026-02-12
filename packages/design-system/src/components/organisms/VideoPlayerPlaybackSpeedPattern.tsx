import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerPattern } from './VideoPlayerPattern';
import { VideoOptionMenu, type VideoOptionItem } from '../molecules/VideoOptionMenu';

type VideoPlayerPlaybackSpeedPatternProps = {
  playerProps: Omit<Parameters<typeof VideoPlayerPattern>[0], 'overlayContent'>;
  title: ReactNode;
  speeds: VideoOptionItem[];
  style?: CSSProperties;
};

export const VideoPlayerPlaybackSpeedPattern = ({ playerProps, title, speeds, style }: VideoPlayerPlaybackSpeedPatternProps): ReactNode => (
  <VideoPlayerPattern
    {...playerProps}
    style={style}
    overlayContent={(
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <VideoOptionMenu title={title} options={speeds} style={{ width: 420, maxHeight: 380 }} />
      </div>
    )}
  />
);
