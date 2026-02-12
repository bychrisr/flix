import type { CSSProperties, ReactNode } from 'react';
import { VideoPlayerIconButton } from '../atoms/VideoPlayerIconButton';

type VideoVolumeSliderProps = {
  volumePercent: number;
  muted?: boolean;
  iconLabel: string;
  onIconClick?: () => void;
  onChange?: (next: number) => void;
  style?: CSSProperties;
};

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

const rootStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'flex-end',
  gap: 'var(--fx-space-3)',
};

const railShellStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-player-volume-rail-width)',
  height: 'var(--fx-size-pattern-player-volume-rail-height)',
  borderRadius: 'var(--fx-radius-sm)',
  background: 'var(--fx-color-player-surface)',
  display: 'grid',
  placeItems: 'center',
};

const railStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-player-volume-bar-width)',
  height: '98px',
  background: 'var(--fx-color-text-tertiary)',
  position: 'relative',
};

export const VideoVolumeSlider = ({ volumePercent, muted = false, iconLabel, onIconClick, onChange, style }: VideoVolumeSliderProps): ReactNode => {
  const effective = muted ? 0 : clamp(volumePercent);

  return (
    <div style={{ ...rootStyle, ...style }}>
      <div style={railShellStyle}>
        <button
          type="button"
          aria-label="Volume"
          onClick={() => onChange?.(effective)}
          style={{ ...railStyle, border: 0, padding: 0, cursor: 'pointer' }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${effective}%`,
              background: 'var(--fx-color-brand-primary-active)',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: `${effective}%`,
              transform: 'translate(-50%, 50%)',
              width: 24,
              height: 24,
              borderRadius: '9999px',
              background: 'var(--fx-color-brand-primary-active)',
            }}
          />
        </button>
      </div>

      <VideoPlayerIconButton
        icon={muted ? 'mute' : 'sound'}
        ariaLabel={iconLabel}
        onClick={onIconClick}
      />
    </div>
  );
};
