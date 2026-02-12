import type { CSSProperties, ReactNode } from 'react';
import { HeroBannerActionsPattern } from '../molecules/HeroBannerActionsPattern';
import { HeroBannerUtilitiesPattern } from '../molecules/HeroBannerUtilitiesPattern';
import { Text } from '../atoms/Text';

export type HeroBannerSize = 'large' | 'medium' | 'small1' | 'small2' | 'small3';

type HeroBannerActionConfig = {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

type HeroBannerUtilityConfig = {
  ratingLabel: string;
  muteControlLabel: string;
  audioDescriptionControlLabel: string;
  replayControlLabel: string;
  onMuteToggle?: () => void;
  onAudioDescriptionToggle?: () => void;
  onReplayToggle?: () => void;
};

type HeroBannerProps = {
  size?: HeroBannerSize;
  mode?: 'default' | 'overlay';
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  supportingText?: string;
  badgeLabel?: string;
  actions?: HeroBannerActionConfig;
  utilities?: HeroBannerUtilityConfig;
  titleStyle?: CSSProperties;
  descriptionStyle?: CSSProperties;
  style?: CSSProperties;
};

const variantDimensions: Record<HeroBannerSize, CSSProperties> = {
  large: {
    width: 'var(--fx-size-pattern-hero-large-width)',
    minHeight: 'var(--fx-size-pattern-hero-large-height)',
  },
  medium: {
    width: 'var(--fx-size-pattern-hero-medium-width)',
    minHeight: 'var(--fx-size-pattern-hero-medium-height)',
  },
  small1: {
    width: 'var(--fx-size-pattern-hero-small1-width)',
    minHeight: 'var(--fx-size-pattern-hero-small1-height)',
  },
  small2: {
    width: 'var(--fx-size-pattern-hero-small2-width)',
    minHeight: 'var(--fx-size-pattern-hero-small2-height)',
  },
  small3: {
    width: 'var(--fx-size-pattern-hero-small3-width)',
    minHeight: 'var(--fx-size-pattern-hero-small3-height)',
  },
};

const variantTypography: Record<HeroBannerSize, { titleSize: string; descriptionSize: string; contentGap: string }> = {
  large: { titleSize: 'var(--fx-size-pattern-hero-title-size)', descriptionSize: 'var(--fx-size-pattern-hero-description-size)', contentGap: 'var(--fx-space-4)' },
  medium: { titleSize: '28px', descriptionSize: '16px', contentGap: 'var(--fx-space-3)' },
  small1: { titleSize: '24px', descriptionSize: '15px', contentGap: 'var(--fx-space-3)' },
  small2: { titleSize: 'var(--fx-size-pattern-hero-title-size)', descriptionSize: 'var(--fx-size-pattern-hero-description-size)', contentGap: 'var(--fx-space-4)' },
  small3: { titleSize: 'var(--fx-size-pattern-hero-title-size)', descriptionSize: 'var(--fx-size-pattern-hero-description-size)', contentGap: 'var(--fx-space-4)' },
};

const rootStyle: CSSProperties = {
  maxWidth: '100%',
  overflow: 'hidden',
  background: 'var(--fx-color-bg-elevated)',
};

const mediaStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: 'var(--fx-size-pattern-hero-media-height)',
  overflow: 'hidden',
  background: 'var(--fx-color-bg-secondary)',
};

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const mediaOverlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgb(0 0 0 / 0%) 0%, var(--fx-color-hero-media-overlay-bottom) 100%), linear-gradient(90deg, var(--fx-color-hero-media-overlay-left) 0%, rgb(0 0 0 / 0%) 65%)',
  pointerEvents: 'none',
};

const contentStyle: CSSProperties = {
  padding: 'var(--fx-space-4) var(--fx-size-pattern-hero-content-padding-x) var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-4)',
  background: 'var(--fx-color-bg-elevated)',
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'var(--fx-size-pattern-hero-badge-size)',
  minHeight: 'var(--fx-size-pattern-hero-badge-size)',
  padding: '0 var(--fx-space-2)',
  borderRadius: 'var(--fx-radius-input)',
  background: 'var(--fx-color-brand-primary-active)',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--fx-size-pattern-hero-title-size)',
  lineHeight: 'var(--fx-size-pattern-hero-title-line-height)',
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 'var(--fx-size-pattern-hero-description-max-width)',
  fontSize: 'var(--fx-size-pattern-hero-description-size)',
  lineHeight: 'var(--fx-size-pattern-hero-description-line-height)',
};

const supportingTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 'var(--fx-size-pattern-hero-supporting-max-width)',
  fontSize: 'var(--fx-size-pattern-hero-supporting-size)',
  lineHeight: 'var(--fx-size-pattern-hero-supporting-line-height)',
};

const imageOnlyVariants = new Set<HeroBannerSize>(['small2', 'small3']);

export const HeroBanner = ({
  size = 'large',
  mode = 'default',
  backgroundImageUrl,
  backgroundImageAlt = '',
  eyebrow,
  title,
  description,
  supportingText,
  badgeLabel,
  actions,
  utilities,
  titleStyle: customTitleStyle,
  descriptionStyle: customDescriptionStyle,
  style,
}: HeroBannerProps): ReactNode => {
  const showContent = !imageOnlyVariants.has(size);
  const isOverlayMode = mode === 'overlay';
  const typeScale = variantTypography[size];

  return (
    <section
      style={{
        ...rootStyle,
        ...variantDimensions[size],
        ...(showContent && !isOverlayMode ? { display: 'grid', gridTemplateRows: 'var(--fx-size-pattern-hero-media-height) auto' } : null),
        ...(isOverlayMode ? { background: 'transparent', minHeight: 'auto' } : null),
        ...style,
      }}
    >
      {!isOverlayMode ? (
        <div
          style={{
            ...mediaStyle,
            ...(size === 'small3' ? { height: 'var(--fx-size-pattern-hero-small3-height)' } : null),
          }}
        >
          {backgroundImageUrl ? <img src={backgroundImageUrl} alt={backgroundImageAlt} style={imageStyle} /> : null}
          {!imageOnlyVariants.has(size) ? <div aria-hidden="true" style={mediaOverlayStyle} /> : null}
        </div>
      ) : null}

      {showContent ? (
        <div
          style={{
            ...contentStyle,
            ...(isOverlayMode
              ? {
                  background: 'transparent',
                  padding: 0,
                  gap: 'var(--fx-space-3)',
                }
              : null),
            gap: isOverlayMode ? 'var(--fx-space-3)' : typeScale.contentGap,
          }}
        >
          {badgeLabel ? (
            <span style={badgeStyle}>
              <Text as="span" variant="medium-caption1">
                {badgeLabel}
              </Text>
            </span>
          ) : null}

          {eyebrow ? (
            <Text
              as="p"
              tone="secondary"
              variant="regular-caption1"
              style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              {eyebrow}
            </Text>
          ) : null}

          {title ? (
            <Text as="h2" variant="bold-title2" style={{ ...titleStyle, fontSize: typeScale.titleSize, ...customTitleStyle }}>
              {title}
            </Text>
          ) : null}

          {description ? (
            <Text as="p" variant="regular-title3" style={{ ...descriptionStyle, fontSize: typeScale.descriptionSize, ...customDescriptionStyle }}>
              {description}
            </Text>
          ) : null}

          {actions ? (
            <HeroBannerActionsPattern
              primaryLabel={actions.primaryLabel}
              secondaryLabel={actions.secondaryLabel}
              onPrimaryClick={actions.onPrimaryClick}
              onSecondaryClick={actions.onSecondaryClick}
            />
          ) : null}

          {utilities ? (
            <HeroBannerUtilitiesPattern
              ratingLabel={utilities.ratingLabel}
              muteControlLabel={utilities.muteControlLabel}
              audioDescriptionControlLabel={utilities.audioDescriptionControlLabel}
              replayControlLabel={utilities.replayControlLabel}
              onMuteToggle={utilities.onMuteToggle}
              onAudioDescriptionToggle={utilities.onAudioDescriptionToggle}
              onReplayToggle={utilities.onReplayToggle}
            />
          ) : null}

          {supportingText ? (
            <Text as="p" tone="secondary" variant="regular-headline2" style={supportingTextStyle}>
              {supportingText}
            </Text>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
