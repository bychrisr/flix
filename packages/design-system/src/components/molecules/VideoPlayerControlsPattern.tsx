import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';

type VideoPlayerControlsPatternProps = {
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
  onPlayClick,
  onBackClick,
  onForwardClick,
  onSoundClick,
  style,
}: VideoPlayerControlsPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <button type="button" onClick={onPlayClick} style={iconButtonStyle} aria-label="Play">
      <Icon name="videoPlayerPlayDefault" size="var(--fx-size-pattern-video-icon-play)" />
    </button>
    <button type="button" onClick={onBackClick} style={iconButtonStyle} aria-label="Back 10 seconds">
      <Icon name="videoPlayer10secBackDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onForwardClick} style={iconButtonStyle} aria-label="Forward 10 seconds">
      <Icon name="videoPlayer10secForwardDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onSoundClick} style={iconButtonStyle} aria-label="Sound">
      <Icon name="videoPlayerSoundDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
  </div>
);
