import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';

type Top10EntryCardProps = {
  ariaLabel?: string;
  rank: number;
  imageUrl: string;
  imageAlt?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  position: 'relative',
  width: 'var(--fx-size-pattern-top10-card-width)',
  height: 'var(--fx-size-pattern-top10-card-height)',
  border: 0,
  padding: 0,
  margin: 0,
  background: 'transparent',
  cursor: 'pointer',
  display: 'block',
};

const rankStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  zIndex: 0,
  fontSize: 'var(--fx-size-pattern-top10-rank-size)',
  lineHeight: 0.9,
  color: 'var(--fx-color-text-primary)',
  opacity: 0.28,
  fontWeight: 'var(--fx-font-weight-bold)',
};

const posterStyle: CSSProperties = {
  position: 'absolute',
  left: 'var(--fx-size-pattern-top10-poster-left)',
  top: 0,
  width: 'var(--fx-size-pattern-top10-poster-width)',
  height: 'var(--fx-size-pattern-top10-poster-height)',
  borderRadius: 'var(--fx-radius-sm)',
  objectFit: 'cover',
  zIndex: 1,
  background: 'var(--fx-color-bg-hover)',
};

export const Top10EntryCard = ({ ariaLabel, rank, imageUrl, imageAlt = '', onClick, style }: Top10EntryCardProps): ReactNode => (
  <button type="button" onClick={onClick} style={{ ...rootStyle, ...style }} aria-label={ariaLabel}>
    <Text as="span" variant="bold-title1" style={rankStyle}>{rank}</Text>
    <img src={imageUrl} alt={imageAlt} style={posterStyle} />
    <Icon
      name="presetTop10"
      size="var(--fx-size-pattern-top10-badge-width)"
      style={{
        position: 'absolute',
        zIndex: 2,
        left: 'calc(var(--fx-size-pattern-top10-poster-left) + var(--fx-space-2))',
        top: 'var(--fx-space-2)',
        width: 'var(--fx-size-pattern-top10-badge-width)',
        height: 'var(--fx-size-pattern-top10-badge-height)',
      }}
    />
  </button>
);
