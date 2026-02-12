import { useState, type CSSProperties, type ReactNode } from 'react';
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
}: HeroBannerActionsPatternProps): ReactNode => {
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);

  return (
    <div style={{ ...rowStyle, ...style }}>
      <Button
        type="button"
        variant="play"
        size="sm"
        onClick={onPrimaryClick}
        onMouseEnter={() => setIsPrimaryHovered(true)}
        onMouseLeave={() => setIsPrimaryHovered(false)}
        onFocus={() => setIsPrimaryHovered(true)}
        onBlur={() => setIsPrimaryHovered(false)}
        style={{
          width: 'fit-content',
          minWidth: 'var(--fx-size-pattern-video-play-button-width)',
          minHeight: 'var(--fx-size-pattern-hero-action-height)',
          paddingInline: 'var(--fx-size-button-padding-x-sm)',
          background: isPrimaryHovered ? '#E5E5E5' : '#FFFFFF',
          borderColor: 'transparent',
          color: '#141414',
        }}
        leadingIcon={
          <Icon
            name={primaryLeadingIconName}
            size="var(--fx-size-pattern-video-button-icon)"
            style={{ filter: 'brightness(0)' }}
          />
        }
      >
        {primaryLabel}
      </Button>
      <Button
        type="button"
        variant="moreInfo"
        size="sm"
        onClick={onSecondaryClick}
        onMouseEnter={() => setIsSecondaryHovered(true)}
        onMouseLeave={() => setIsSecondaryHovered(false)}
        onFocus={() => setIsSecondaryHovered(true)}
        onBlur={() => setIsSecondaryHovered(false)}
        style={{
          width: 'fit-content',
          minWidth: 'var(--fx-size-pattern-video-more-info-button-width)',
          minHeight: 'var(--fx-size-pattern-hero-action-height)',
          paddingInline: 'var(--fx-size-button-padding-x-sm)',
          background: isSecondaryHovered ? 'rgb(109 109 110 / 40%)' : 'rgb(109 109 110 / 70%)',
        }}
        leadingIcon={<Icon name={secondaryLeadingIconName} size="var(--fx-size-pattern-video-button-icon)" />}
      >
        {secondaryLabel}
      </Button>
    </div>
  );
};
