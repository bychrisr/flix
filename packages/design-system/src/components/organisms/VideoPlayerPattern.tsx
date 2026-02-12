import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerControlsPattern } from '../molecules/VideoPlayerControlsPattern';
import { VideoPlayerUtilitiesPattern } from '../molecules/VideoPlayerUtilitiesPattern';
import { VideoProgressIndicator } from '../molecules/VideoProgressIndicator';

type VideoPlayerPatternProps = {
  backdropImageUrl?: string;
  backdropImageAlt?: string;
  progress: {
    elapsedLabel: string;
    remainingLabel: string;
    progressPercent: number;
    bufferPercent?: number;
    markerPercent?: number;
  };
  controlLabels: {
    play: string;
    back10: string;
    forward10: string;
    sound: string;
    nextEpisode: string;
    listOfEpisodes: string;
    subtitles: string;
    speed: string;
    fullScreen: string;
  };
  controlsState?: 'default' | 'hover';
  onPlayClick?: () => void;
  onBackClick?: () => void;
  onForwardClick?: () => void;
  onSoundClick?: () => void;
  onNextEpisodeClick?: () => void;
  onListOfEpisodesClick?: () => void;
  onSubtitlesClick?: () => void;
  onSpeedClick?: () => void;
  onFullScreenClick?: () => void;
  overlayContent?: ReactNode;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '320px',
  background: 'var(--fx-color-bg-secondary)',
  overflow: 'hidden',
};

const overlayStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, rgb(20 20 20 / 0%) 0%, rgb(20 20 20 / 92%) 44%)',
  padding: 'var(--fx-space-4) var(--fx-space-8) var(--fx-space-4)',
  display: 'grid',
  gap: 'var(--fx-space-3)',
};

const controlsRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-4)',
  flexWrap: 'wrap',
};

export const VideoPlayerPattern = ({
  backdropImageUrl,
  backdropImageAlt = '',
  progress,
  controlLabels,
  controlsState = 'default',
  onPlayClick,
  onBackClick,
  onForwardClick,
  onSoundClick,
  onNextEpisodeClick,
  onListOfEpisodesClick,
  onSubtitlesClick,
  onSpeedClick,
  onFullScreenClick,
  overlayContent,
  style,
}: VideoPlayerPatternProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    {backdropImageUrl ? (
      <img src={backdropImageUrl} alt={backdropImageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    ) : null}

    <div style={overlayStyle}>
      {overlayContent}

      <VideoProgressIndicator
        elapsedLabel={progress.elapsedLabel}
        remainingLabel={progress.remainingLabel}
        progressPercent={progress.progressPercent}
        bufferPercent={progress.bufferPercent}
        markerPercent={progress.markerPercent}
      />

      <div style={controlsRowStyle}>
        <VideoPlayerControlsPattern
          labels={{
            play: controlLabels.play,
            back10: controlLabels.back10,
            forward10: controlLabels.forward10,
            sound: controlLabels.sound,
          }}
          iconState={controlsState}
          onPlayClick={onPlayClick}
          onBackClick={onBackClick}
          onForwardClick={onForwardClick}
          onSoundClick={onSoundClick}
        />

        <VideoPlayerUtilitiesPattern
          labels={{
            nextEpisode: controlLabels.nextEpisode,
            listOfEpisodes: controlLabels.listOfEpisodes,
            subtitles: controlLabels.subtitles,
            speed: controlLabels.speed,
            fullScreen: controlLabels.fullScreen,
          }}
          iconState={controlsState}
          onNextEpisodeClick={onNextEpisodeClick}
          onListOfEpisodesClick={onListOfEpisodesClick}
          onSubtitlesClick={onSubtitlesClick}
          onSpeedClick={onSpeedClick}
          onFullScreenClick={onFullScreenClick}
        />
      </div>
    </div>
  </section>
);
