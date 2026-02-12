import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';

type MovieBlockCardSize = 'small' | 'standard' | 'medium';
type MovieBlockCardPresetPosition = 'top-left' | 'bottom-left';

type MovieBlockCardProps = {
  imageUrl: string;
  imageAlt?: string;
  size?: MovieBlockCardSize;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
  presetPosition?: MovieBlockCardPresetPosition;
  titleOverlay?: string;
  titleLines?: 1 | 2;
  onClick?: () => void;
  style?: CSSProperties;
};

const sizeStyles: Record<MovieBlockCardSize, CSSProperties> = {
  small: {
    width: 'var(--fx-size-pattern-movie-card-small-width)',
    height: 'var(--fx-size-pattern-movie-card-small-height)',
  },
  standard: {
    width: 'var(--fx-size-pattern-movie-card-standard-width)',
    height: 'var(--fx-size-pattern-movie-card-standard-height)',
  },
  medium: {
    width: 'var(--fx-size-pattern-movie-card-medium-width)',
    height: 'var(--fx-size-pattern-movie-card-medium-height)',
  },
};

const cardBaseStyle: CSSProperties = {
  border: 0,
  margin: 0,
  padding: 0,
  borderRadius: 'var(--fx-radius-sm)',
  overflow: 'hidden',
  position: 'relative',
  background: 'var(--fx-color-bg-hover)',
  cursor: 'pointer',
  display: 'inline-flex',
};

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

export const MovieBlockCard = ({
  imageUrl,
  imageAlt = '',
  size = 'standard',
  presetIconName,
  presetPosition = 'top-left',
  titleOverlay,
  titleLines = 2,
  onClick,
  style,
}: MovieBlockCardProps): ReactNode => {
  const hasTitleOverlay = Boolean(titleOverlay?.trim());

  return (
    <button type="button" className="fx-movie-block-card" style={{ ...cardBaseStyle, ...sizeStyles[size], ...style }} onClick={onClick}>
      <style>
        {`
          .fx-movie-block-card {
            transition: transform 180ms ease, box-shadow 180ms ease;
          }

          .fx-movie-block-card:hover {
            transform: scale(1.02);
            box-shadow: 0 16px 28px rgb(0 0 0 / 35%);
          }

          .fx-movie-block-card:focus-visible {
            outline: 2px solid var(--fx-color-text-primary);
            outline-offset: 2px;
          }
        `}
      </style>
      <img src={imageUrl} alt={imageAlt} style={imageStyle} />

      {hasTitleOverlay ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgb(0 0 0 / 0%) 28%, rgb(0 0 0 / 80%) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              padding: '0 var(--fx-space-2) var(--fx-space-2)',
              color: 'var(--fx-color-text-primary)',
              fontFamily: 'var(--fx-font-sans)',
              fontSize: 'clamp(14px, 1.45vw, 21px)',
              lineHeight: '1',
              fontWeight: 'var(--fx-font-weight-bold)',
              letterSpacing: '-0.02em',
              textAlign: 'left',
              display: '-webkit-box',
              WebkitLineClamp: titleLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 1px 8px rgb(0 0 0 / 80%)',
            }}
          >
            {titleOverlay}
          </span>
        </div>
      ) : null}

      {presetIconName ? (
        <Icon
          name={presetIconName}
          size="var(--fx-size-pattern-movie-card-preset-width)"
          style={{
            position: 'absolute',
            left: 'var(--fx-space-2)',
            ...(presetPosition === 'bottom-left' ? { bottom: 'var(--fx-space-2)' } : { top: 'var(--fx-space-2)' }),
            width: 'var(--fx-size-pattern-movie-card-preset-width)',
            height: 'var(--fx-size-pattern-movie-card-preset-height)',
          }}
        />
      ) : null}
    </button>
  );
};
