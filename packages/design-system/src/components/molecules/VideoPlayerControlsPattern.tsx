import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerIconButton } from '../atoms/VideoPlayerIconButton';

type VideoPlayerControlsPatternProps = {
  labels: {
    play: string;
    back10: string;
    forward10: string;
    sound: string;
  };
  iconState?: 'default' | 'hover';
  onPlayClick?: () => void;
  onBackClick?: () => void;
  onForwardClick?: () => void;
  onSoundClick?: () => void;
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--fx-space-4)',
  flexWrap: 'wrap',
};

const iconButtonStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
};

export const VideoPlayerControlsPattern = ({
  labels,
  iconState = 'default',
  onPlayClick,
  onBackClick,
  onForwardClick,
  onSoundClick,
  style,
}: VideoPlayerControlsPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <VideoPlayerIconButton
      icon="play"
      state={iconState}
      size="var(--fx-size-pattern-video-icon-play)"
      ariaLabel={labels.play}
      onClick={onPlayClick}
      style={iconButtonStyle}
    />
    <VideoPlayerIconButton icon="back10" state={iconState} ariaLabel={labels.back10} onClick={onBackClick} style={iconButtonStyle} />
    <VideoPlayerIconButton icon="forward10" state={iconState} ariaLabel={labels.forward10} onClick={onForwardClick} style={iconButtonStyle} />
    <VideoPlayerIconButton icon="sound" state={iconState} ariaLabel={labels.sound} onClick={onSoundClick} style={iconButtonStyle} />
  </div>
);
