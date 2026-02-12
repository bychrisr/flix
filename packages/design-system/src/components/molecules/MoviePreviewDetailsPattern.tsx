import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';

type MoviePreviewDetailsPatternProps = {
  ratingIconName?: 'ratingTvMa' | 'ratingTv14' | 'ratingTvPg' | 'ratingTvG';
  yearLabel?: string;
  onAddClick?: () => void;
  style?: CSSProperties;
};

const wrapperStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-2)',
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

export const MoviePreviewDetailsPattern = ({
  ratingIconName = 'ratingTvMa',
  yearLabel = '2021',
  onAddClick,
  style,
}: MoviePreviewDetailsPatternProps): ReactNode => (
  <div style={{ ...wrapperStyle, ...style }}>
    <Icon name={ratingIconName} size="var(--fx-size-pattern-video-rating-icon-width)" />
    <Icon name="videoQualityHd" size="var(--fx-size-pattern-video-quality-icon-width)" />
    <Text as="span" variant="medium-headline2" tone="secondary">
      {yearLabel}
    </Text>
    <button type="button" onClick={onAddClick} style={iconButtonStyle} aria-label="Add to my list">
      <Icon name="moviePreviewAddDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
  </div>
);
