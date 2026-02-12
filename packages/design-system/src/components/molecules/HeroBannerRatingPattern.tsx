import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';

type HeroBannerRatingPatternProps = {
  ratingLabel?: string;
  style?: CSSProperties;
};

const wrapperStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-2)',
};

const ratingBoxStyle: CSSProperties = {
  minWidth: 'var(--fx-size-pattern-video-rating-width)',
  minHeight: 'var(--fx-size-pattern-video-rating-height)',
  background: 'var(--fx-color-bg-hover)',
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0 var(--fx-space-4)',
  borderLeft: 'var(--fx-size-border-default) solid var(--fx-color-text-primary)',
};

export const HeroBannerRatingPattern = ({
  ratingLabel = 'TV-14',
  style,
}: HeroBannerRatingPatternProps): ReactNode => (
  <div style={{ ...wrapperStyle, ...style }}>
    <Icon name="heroBannerPreviewRepeatArrowDefault" size="var(--fx-size-pattern-video-icon-control)" />
    <div style={ratingBoxStyle}>
      <Text as="span" variant="medium-headline2">
        {ratingLabel}
      </Text>
    </div>
  </div>
);
