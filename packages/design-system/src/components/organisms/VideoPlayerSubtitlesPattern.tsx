import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerPattern } from './VideoPlayerPattern';
import { VideoOptionMenu, type VideoOptionItem } from '../molecules/VideoOptionMenu';

type VideoPlayerSubtitlesPatternProps = {
  playerProps: Omit<Parameters<typeof VideoPlayerPattern>[0], 'overlayContent'>;
  title: ReactNode;
  options: VideoOptionItem[];
  style?: CSSProperties;
};

export const VideoPlayerSubtitlesPattern = ({ playerProps, title, options, style }: VideoPlayerSubtitlesPatternProps): ReactNode => (
  <VideoPlayerPattern
    {...playerProps}
    style={style}
    overlayContent={(
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <VideoOptionMenu title={title} options={options} style={{ width: 430, maxHeight: 420 }} />
      </div>
    )}
  />
);
