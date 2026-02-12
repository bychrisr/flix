import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

type HeroBannerActionsPatternProps = {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryLeadingIconName?: 'videoPlayerPlayDefault' | 'play';
  secondaryLeadingIconName?: 'info' | 'question';
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--fx-space-2)',
  flexWrap: 'wrap',
};

export const HeroBannerActionsPattern = ({
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  primaryLeadingIconName = 'videoPlayerPlayDefault',
  secondaryLeadingIconName = 'info',
  style,
}: HeroBannerActionsPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <Button
      type="button"
      variant="play"
      size="sm"
      onClick={onPrimaryClick}
      style={{
        width: 'var(--fx-size-pattern-video-play-button-width)',
        minHeight: 'var(--fx-size-pattern-hero-action-height)',
      }}
      leadingIcon={<Icon name={primaryLeadingIconName} size="var(--fx-size-pattern-video-button-icon)" />}
    >
      {primaryLabel}
    </Button>
    <Button
      type="button"
      variant="moreInfo"
      size="sm"
      onClick={onSecondaryClick}
      style={{
        width: 'var(--fx-size-pattern-video-more-info-button-width)',
        minHeight: 'var(--fx-size-pattern-hero-action-height)',
      }}
      leadingIcon={<Icon name={secondaryLeadingIconName} size="var(--fx-size-pattern-video-button-icon)" />}
    >
      {secondaryLabel}
    </Button>
  </div>
);
