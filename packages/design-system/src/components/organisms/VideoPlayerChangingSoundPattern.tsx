import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerPattern } from './VideoPlayerPattern';
import { VideoVolumeSlider } from '../molecules/VideoVolumeSlider';

type VideoPlayerChangingSoundPatternProps = {
  playerProps: Omit<Parameters<typeof VideoPlayerPattern>[0], 'overlayContent'>;
  volumePercent: number;
  muted?: boolean;
  volumeLabel: string;
  onVolumeIconClick?: () => void;
  onVolumeChange?: (next: number) => void;
  style?: CSSProperties;
};

export const VideoPlayerChangingSoundPattern = ({
  playerProps,
  volumePercent,
  muted = false,
  volumeLabel,
  onVolumeIconClick,
  onVolumeChange,
  style,
}: VideoPlayerChangingSoundPatternProps): ReactNode => (
  <VideoPlayerPattern
    {...playerProps}
    style={style}
    overlayContent={(
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <VideoVolumeSlider
          volumePercent={volumePercent}
          muted={muted}
          iconLabel={volumeLabel}
          onIconClick={onVolumeIconClick}
          onChange={onVolumeChange}
        />
      </div>
    )}
  />
);
