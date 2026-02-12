import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';

type HeroBannerRatingPatternProps = {
  ratingLabel: string;
  leadingIconName?:
    | 'heroBannerPreviewRepeatArrowDefault'
    | 'heroBannerPreviewRepeatArrowHover'
    | 'heroBannerPreviewMuteDefault'
    | 'heroBannerPreviewMuteHover'
    | 'heroBannerPreviewSoundDefault'
    | 'heroBannerPreviewSoundHover';
  onLeadingIconClick?: () => void;
  leadingControlLabel?: string;
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
  ratingLabel,
  leadingIconName = 'heroBannerPreviewRepeatArrowDefault',
  onLeadingIconClick,
  leadingControlLabel = 'Toggle audio',
  style,
}: HeroBannerRatingPatternProps): ReactNode => (
  <div style={{ ...wrapperStyle, ...style }}>
    {onLeadingIconClick ? (
      <button
        type="button"
        onClick={onLeadingIconClick}
        aria-label={leadingControlLabel}
        style={{
          border: 0,
          background: 'transparent',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          lineHeight: 0,
        }}
      >
        <Icon name={leadingIconName} size="var(--fx-size-pattern-video-icon-control)" />
      </button>
    ) : (
      <Icon name={leadingIconName} size="var(--fx-size-pattern-video-icon-control)" />
    )}
    <div style={ratingBoxStyle}>
      <Text as="span" variant="medium-headline2">
        {ratingLabel}
      </Text>
    </div>
  </div>
);
