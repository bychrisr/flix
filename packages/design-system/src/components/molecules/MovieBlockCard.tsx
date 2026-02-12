import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';

type MovieBlockCardSize = 'small' | 'standard' | 'medium';

type MovieBlockCardProps = {
  imageUrl: string;
  imageAlt?: string;
  size?: MovieBlockCardSize;
  presetIconName?: 'presetTop10' | 'presetRecentlyAdded' | 'presetLeavingSoon' | 'presetNewSeason';
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
  onClick,
  style,
}: MovieBlockCardProps): ReactNode => (
  <button type="button" style={{ ...cardBaseStyle, ...sizeStyles[size], ...style }} onClick={onClick}>
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
  </button>
);
