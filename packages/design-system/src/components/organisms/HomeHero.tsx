import type { CSSProperties, ReactNode } from 'react';
import { HomePageHeader, type HomeNavItem } from './HomePageHeader';
import { HeroBannerActionsPattern } from '../molecules/HeroBannerActionsPattern';
import { HeroBannerRatingPattern } from '../molecules/HeroBannerRatingPattern';
import { Text } from '../atoms/Text';
import type { IconName } from '../../assets/icons';

type HomeHeroActions = {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

type HomeHeroRating = {
  label: string;
  repeatControlIconName?: 'heroBannerPreviewRepeatArrowDefault' | 'heroBannerPreviewRepeatArrowHover';
};

type HomeHeroProps = {
  backgroundImageUrl: string;
  backgroundImageAlt?: string;
  headerItems: HomeNavItem[];
  brandLabel: string;
  title: ReactNode;
  titleAs?: 'h1' | 'h2';
  titleWidth?: CSSProperties['maxWidth'];
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: HomeHeroActions;
  rating?: HomeHeroRating;
  profileIconName?: IconName;
  searchControlLabel: string;
  notificationsControlLabel: string;
  profileControlLabel: string;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: 'var(--fx-size-pattern-home-hero-height)',
  overflow: 'hidden',
  background: 'var(--fx-color-bg-secondary)',
};

const backgroundMediaStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
};

const backgroundImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const overlaysStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: [
    'linear-gradient(180deg, var(--fx-color-home-hero-overlay-top) 0%, rgb(0 0 0 / 0%) 22%)',
    'linear-gradient(90deg, var(--fx-color-home-hero-overlay-left) 0%, rgb(0 0 0 / 0%) 58%)',
    'linear-gradient(180deg, rgb(20 20 20 / 0%) 58%, var(--fx-color-home-hero-overlay-bottom) 100%)',
  ].join(', '),
};

const contentLayerStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  minHeight: 'var(--fx-size-pattern-home-hero-height)',
};

const contentStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--fx-space-4)',
  paddingTop: 'var(--fx-size-pattern-home-hero-content-top)',
  paddingLeft: 'var(--fx-size-pattern-home-hero-content-left)',
  maxWidth: 'var(--fx-size-pattern-home-hero-content-max-width)',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--fx-size-pattern-home-hero-title-size)',
  lineHeight: 'var(--fx-size-pattern-home-hero-title-line-height)',
  maxWidth: 'var(--fx-size-pattern-home-hero-content-max-width)',
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--fx-size-pattern-home-hero-description-size)',
  lineHeight: 'var(--fx-size-pattern-home-hero-description-line-height)',
  maxWidth: 'var(--fx-size-pattern-home-hero-description-max-width)',
};

const ratingDockStyle: CSSProperties = {
  position: 'absolute',
  right: 'var(--fx-size-pattern-home-hero-rating-dock-right)',
  bottom: 'var(--fx-size-pattern-home-hero-rating-dock-bottom)',
  height: 'var(--fx-size-pattern-home-hero-rating-dock-height)',
  paddingLeft: 'var(--fx-space-2)',
  background: 'var(--fx-color-home-hero-utility-background)',
  display: 'inline-flex',
  alignItems: 'center',
};

export const HomeHero = ({
  backgroundImageUrl,
  backgroundImageAlt = '',
  headerItems,
  brandLabel,
  title,
  titleAs = 'h1',
  titleWidth,
  eyebrow,
  description,
  actions,
  rating,
  profileIconName,
  searchControlLabel,
  notificationsControlLabel,
  profileControlLabel,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  style,
}: HomeHeroProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    <div style={backgroundMediaStyle}>
      <img src={backgroundImageUrl} alt={backgroundImageAlt} style={backgroundImageStyle} />
      <div aria-hidden="true" style={overlaysStyle} />
    </div>

    <div style={contentLayerStyle}>
      <HomePageHeader
        items={headerItems}
        brandLabel={brandLabel}
        profileIconName={profileIconName}
        searchControlLabel={searchControlLabel}
        notificationsControlLabel={notificationsControlLabel}
        profileControlLabel={profileControlLabel}
        onSearchClick={onSearchClick}
        onNotificationsClick={onNotificationsClick}
        onProfileClick={onProfileClick}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}
      />

      <div style={contentStyle}>
        {eyebrow ? (
          <Text as="p" variant="medium-headline1" style={{ margin: 0 }}>
            {eyebrow}
          </Text>
        ) : null}

        <Text as={titleAs} variant="bold-title1" style={{ ...titleStyle, ...(titleWidth ? { maxWidth: titleWidth } : null) }}>
          {title}
        </Text>

        {description ? (
          <Text as="p" variant="medium-headline2" style={descriptionStyle}>
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
      </div>

      {rating ? (
        <div style={ratingDockStyle}>
          <HeroBannerRatingPattern ratingLabel={rating.label} leadingIconName={rating.repeatControlIconName} />
        </div>
      ) : null}
    </div>
  </section>
);
