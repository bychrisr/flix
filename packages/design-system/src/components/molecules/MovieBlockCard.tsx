import { type CSSProperties, type ReactNode } from 'react';
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
  descriptionOverlay?: string;
  titleLines?: 1 | 2;
  descriptionLines?: 1 | 2;
  showCenteredPlayIcon?: boolean;
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
  flexDirection: 'column',
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
  descriptionOverlay,
  titleLines = 2,
  descriptionLines = 2,
  showCenteredPlayIcon = false,
  onClick,
  style,
}: MovieBlockCardProps): ReactNode => {
  const hasTitleOverlay = Boolean(titleOverlay?.trim());
  const hasDescriptionOverlay = Boolean(descriptionOverlay?.trim());
  const resolvedCardSizeStyle: CSSProperties = hasTitleOverlay
    ? { width: sizeStyles[size].width, height: 'auto' }
    : sizeStyles[size];
  const presetStyle: CSSProperties = {
    position: 'absolute',
    left: 'var(--fx-space-2)',
    ...(presetPosition === 'bottom-left' ? { bottom: 'var(--fx-space-2)' } : { top: 'var(--fx-space-2)' }),
    width: 'var(--fx-size-pattern-movie-card-preset-width)',
    height: 'var(--fx-size-pattern-movie-card-preset-height)',
  };

  return (
    <button
      type="button"
      className="fx-movie-block-card"
      style={{ ...cardBaseStyle, ...resolvedCardSizeStyle, ...style }}
      onClick={onClick}
    >
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
      <div
        style={{
          width: '100%',
          ...(hasTitleOverlay ? { aspectRatio: '16 / 9', height: 'auto' } : { height: '100%' }),
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <img src={imageUrl} alt={imageAlt} style={{ ...imageStyle, opacity: showCenteredPlayIcon ? 0.8 : 1 }} />
        {showCenteredPlayIcon ? (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 66,
              height: 66,
              borderRadius: '999px',
              border: '2px solid rgb(255 255 255 / 88%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgb(0 0 0 / 20%)',
              boxShadow: '0 8px 22px rgb(0 0 0 / 40%)',
            }}
          >
            <Icon name="videoPlayerPlayDefault" size={22} />
          </span>
        ) : null}
        {presetIconName && !hasTitleOverlay ? (
          <Icon name={presetIconName} size="var(--fx-size-pattern-movie-card-preset-width)" style={presetStyle} />
        ) : null}
      </div>

      {hasTitleOverlay ? (
        <div
          style={{
            width: '100%',
            minHeight: 'clamp(72px, 7vw, 120px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 'var(--fx-space-3) var(--fx-space-3) var(--fx-space-3)',
            background: 'rgb(20 20 20 / 92%)',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', display: 'grid', gap: '6px' }}>
            <span
              style={{
                width: '100%',
                color: 'var(--fx-color-text-primary)',
                fontFamily: 'var(--fx-font-sans)',
                fontSize: 'clamp(13px, 1.15vw, 18px)',
                lineHeight: '1.15',
                fontWeight: 'var(--fx-font-weight-bold)',
                letterSpacing: '-0.02em',
                textAlign: 'left',
                display: '-webkit-box',
                WebkitLineClamp: titleLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {titleOverlay}
            </span>

            {hasDescriptionOverlay ? (
              <span
                style={{
                  width: '100%',
                  color: 'rgb(255 255 255 / 74%)',
                  fontFamily: 'var(--fx-font-sans)',
                  fontSize: 'clamp(12px, 1.05vw, 15px)',
                  lineHeight: '1.3',
                  fontWeight: 'var(--fx-font-weight-regular)',
                  textAlign: 'left',
                  display: '-webkit-box',
                  WebkitLineClamp: descriptionLines,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {descriptionOverlay}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

    </button>
  );
};
