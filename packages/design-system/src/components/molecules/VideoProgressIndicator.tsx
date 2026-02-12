import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';

type VideoProgressIndicatorProps = {
  elapsedLabel: string;
  remainingLabel: string;
  progressPercent: number;
  bufferPercent?: number;
  markerPercent?: number;
  dense?: boolean;
  style?: CSSProperties;
};

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

const rootStyle: CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 'var(--fx-space-2)',
};

const railStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  background: 'var(--fx-color-text-tertiary)',
  borderRadius: '9999px',
  overflow: 'hidden',
};

const labelsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-4)',
};

export const VideoProgressIndicator = ({
  elapsedLabel,
  remainingLabel,
  progressPercent,
  bufferPercent = 0,
  markerPercent,
  dense = false,
  style,
}: VideoProgressIndicatorProps): ReactNode => {
  const current = clamp(progressPercent);
  const buffered = clamp(bufferPercent);
  const marker = markerPercent === undefined ? undefined : clamp(markerPercent);

  const trackHeight = dense ? 'var(--fx-size-pattern-movie-progress-track-height)' : 'var(--fx-size-pattern-player-progress-track-height)';
  const thumbSize = dense ? 8 : 'var(--fx-size-pattern-player-progress-thumb-size)';

  return (
    <div style={{ ...rootStyle, ...style }}>
      <div style={{ ...railStyle, height: trackHeight }}>
        <span
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: `${buffered}%`, background: 'var(--fx-color-player-marker)' }}
        />
        <span
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: `${current}%`, background: 'var(--fx-color-brand-primary-active)' }}
        />
        {marker === undefined ? null : (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: `${marker}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: thumbSize,
              height: thumbSize,
              borderRadius: '9999px',
              background: 'var(--fx-color-brand-primary-active)',
            }}
          />
        )}
      </div>

      <div style={labelsStyle}>
        <Text as="span" variant="regular-caption1">{elapsedLabel}</Text>
        <Text as="span" variant="regular-caption1">{remainingLabel}</Text>
      </div>
    </div>
  );
};
