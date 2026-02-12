import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerIconButton } from '../atoms/VideoPlayerIconButton';

type VideoPlayerUtilitiesPatternProps = {
  labels: {
    nextEpisode: string;
    listOfEpisodes: string;
    subtitles: string;
    speed: string;
    fullScreen: string;
  };
  iconState?: 'default' | 'hover';
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
  labels,
  iconState = 'default',
  onNextEpisodeClick,
  onListOfEpisodesClick,
  onSubtitlesClick,
  onSpeedClick,
  onFullScreenClick,
  style,
}: VideoPlayerUtilitiesPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <VideoPlayerIconButton
      icon="nextEpisode"
      state={iconState}
      ariaLabel={labels.nextEpisode}
      onClick={onNextEpisodeClick}
      style={iconButtonStyle}
    />
    <VideoPlayerIconButton
      icon="listOfEpisodes"
      state={iconState}
      ariaLabel={labels.listOfEpisodes}
      onClick={onListOfEpisodesClick}
      style={iconButtonStyle}
    />
    <VideoPlayerIconButton
      icon="subtitles"
      state={iconState}
      ariaLabel={labels.subtitles}
      onClick={onSubtitlesClick}
      style={iconButtonStyle}
    />
    <VideoPlayerIconButton icon="speed" state={iconState} ariaLabel={labels.speed} onClick={onSpeedClick} style={iconButtonStyle} />
    <VideoPlayerIconButton
      icon="fullScreen"
      state={iconState}
      ariaLabel={labels.fullScreen}
      onClick={onFullScreenClick}
      style={iconButtonStyle}
    />
  </div>
);
