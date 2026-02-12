import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';

type VideoPlayerUtilitiesPatternProps = {
  onNextEpisodeClick?: () => void;
  onListOfEpisodesClick?: () => void;
  onSubtitlesClick?: () => void;
  onSpeedClick?: () => void;
  onFullScreenClick?: () => void;
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

export const VideoPlayerUtilitiesPattern = ({
  onNextEpisodeClick,
  onListOfEpisodesClick,
  onSubtitlesClick,
  onSpeedClick,
  onFullScreenClick,
  style,
}: VideoPlayerUtilitiesPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <button type="button" onClick={onNextEpisodeClick} style={iconButtonStyle} aria-label="Next episode">
      <Icon name="videoPlayerNextEpisodeDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onListOfEpisodesClick} style={iconButtonStyle} aria-label="List of episodes">
      <Icon name="videoPlayerListOfEpisodesDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onSubtitlesClick} style={iconButtonStyle} aria-label="Subtitles">
      <Icon name="videoPlayerSubtitlesDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onSpeedClick} style={iconButtonStyle} aria-label="Playback speed">
      <Icon name="videoPlayerSpeedDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onFullScreenClick} style={iconButtonStyle} aria-label="Fullscreen">
      <Icon name="videoPlayerFullScreenDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
  </div>
);
