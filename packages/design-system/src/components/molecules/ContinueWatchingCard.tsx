import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';

type ContinueWatchingCardProps = {
  imageUrl: string;
  imageAlt?: string;
  progress: number;
  progressLabel?: string;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
  onClick?: () => void;
  style?: CSSProperties;
};

const cardStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-movie-card-standard-width)',
  border: 0,
  padding: 0,
  background: 'transparent',
  cursor: 'pointer',
  display: 'grid',
  gap: 'var(--fx-space-2)',
  textAlign: 'left',
};

const imageWrapperStyle: CSSProperties = {
  position: 'relative',
  width: 'var(--fx-size-pattern-movie-card-standard-width)',
  height: 'var(--fx-size-pattern-movie-card-standard-height)',
  borderRadius: 'var(--fx-radius-sm)',
  overflow: 'hidden',
  background: 'var(--fx-color-bg-hover)',
};

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const progressTrackStyle: CSSProperties = {
  position: 'relative',
  width: 'var(--fx-size-pattern-movie-progress-track-width)',
  height: 'var(--fx-size-pattern-movie-progress-track-height)',
  background: 'var(--fx-color-movie-card-progress-track)',
  borderRadius: '9999px',
  overflow: 'hidden',
};

export const ContinueWatchingCard = ({
  imageUrl,
  imageAlt = '',
  progress,
  progressLabel,
  presetIconName,
  onClick,
  style,
}: ContinueWatchingCardProps): ReactNode => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <button type="button" style={{ ...cardStyle, ...style }} onClick={onClick} aria-label={progressLabel ?? imageAlt}>
      <div style={imageWrapperStyle}>
        <img src={imageUrl} alt={imageAlt} style={imageStyle} />
        {presetIconName ? (
          <Icon
            name={presetIconName}
            size="var(--fx-size-pattern-movie-card-preset-width)"
            style={{
              position: 'absolute',
              top: 'var(--fx-space-2)',
              left: 'var(--fx-space-2)',
              width: 'var(--fx-size-pattern-movie-card-preset-width)',
              height: 'var(--fx-size-pattern-movie-card-preset-height)',
            }}
          />
        ) : null}
      </div>

      <div style={progressTrackStyle}>
        <div
          aria-hidden="true"
          style={{
            width: `${safeProgress}%`,
            height: '100%',
            background: 'var(--fx-color-brand-primary-active)',
          }}
        />
      </div>
    </button>
  );
};
