import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { PlayAddThumbUpPattern } from '../molecules/PlayAddThumbUpPattern';

type HeroMobileProps = {
  backgroundImageUrl: string;
  backgroundImageAlt?: string;
  previewImageUrl?: string;
  previewImageAlt?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  titleAs?: 'h1' | 'h2' | 'h3';
  playLabel: string;
  playControlLabel: string;
  addControlLabel: string;
  thumbUpControlLabel: string;
  muteControlLabel: string;
  closeControlLabel: string;
  onPlayClick?: () => void;
  onAddClick?: () => void;
  onThumbUpClick?: () => void;
  onMuteClick?: () => void;
  onCloseClick?: () => void;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: 'var(--fx-size-pattern-hero-mobile-height)',
  overflow: 'hidden',
  background: 'var(--fx-color-bg-secondary)',
};

const backgroundImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: 'var(--fx-size-pattern-hero-mobile-height)',
  objectFit: 'cover',
  display: 'block',
};

const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'linear-gradient(180deg, rgb(24 24 24 / 0%) 48.5%, var(--fx-color-hero-mobile-overlay-bottom) 100%)',
};

const previewImageWrapperStyle: CSSProperties = {
  position: 'absolute',
  left: 'var(--fx-size-pattern-hero-mobile-content-left)',
  top: 'var(--fx-size-pattern-hero-mobile-preview-top)',
  width: 'var(--fx-size-pattern-hero-mobile-preview-width)',
  height: 'var(--fx-size-pattern-hero-mobile-preview-height)',
  overflow: 'hidden',
};

const previewImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const closeButtonStyle: CSSProperties = {
  position: 'absolute',
  top: 'var(--fx-size-pattern-hero-mobile-close-top)',
  right: 'var(--fx-size-pattern-hero-mobile-close-right)',
  width: 'var(--fx-size-pattern-hero-mobile-close-size)',
  height: 'var(--fx-size-pattern-hero-mobile-close-size)',
  border: 0,
  borderRadius: '9999px',
  background: 'var(--fx-color-hero-mobile-close-background)',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  lineHeight: 0,
  zIndex: 2,
};

const contentStyle: CSSProperties = {
  position: 'absolute',
  left: 'var(--fx-size-pattern-hero-mobile-content-left)',
  right: 'var(--fx-size-pattern-hero-mobile-content-right)',
  bottom: 'var(--fx-size-pattern-hero-mobile-content-bottom)',
  zIndex: 1,
  display: 'grid',
  gap: 'var(--fx-size-pattern-hero-mobile-content-gap)',
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 'var(--fx-size-pattern-hero-mobile-title-max-width)',
  fontSize: 'var(--fx-size-pattern-hero-mobile-title-size)',
  lineHeight: 'var(--fx-size-pattern-hero-mobile-title-line-height)',
  fontWeight: 'var(--fx-size-pattern-hero-mobile-title-weight)',
  letterSpacing: 'var(--fx-size-pattern-hero-mobile-title-letter-spacing)',
  textTransform: 'uppercase',
};

const actionsDockStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-4)',
};

const muteButtonStyle: CSSProperties = {
  border: 0,
  padding: 0,
  background: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  cursor: 'pointer',
  width: 'var(--fx-size-pattern-hero-mobile-mute-size)',
  height: 'var(--fx-size-pattern-hero-mobile-mute-size)',
  flexShrink: 0,
};

export const HeroMobile = ({
  backgroundImageUrl,
  backgroundImageAlt = '',
  previewImageUrl,
  previewImageAlt = '',
  eyebrow,
  title,
  titleAs = 'h1',
  playLabel,
  playControlLabel,
  addControlLabel,
  thumbUpControlLabel,
  muteControlLabel,
  closeControlLabel,
  onPlayClick,
  onAddClick,
  onThumbUpClick,
  onMuteClick,
  onCloseClick,
  style,
}: HeroMobileProps): ReactNode => (
  <section style={{ ...rootStyle, ...style }}>
    <img src={backgroundImageUrl} alt={backgroundImageAlt} style={backgroundImageStyle} />
    <div aria-hidden="true" style={overlayStyle} />

    {previewImageUrl ? (
      <div style={previewImageWrapperStyle}>
        <img src={previewImageUrl} alt={previewImageAlt} style={previewImageStyle} />
      </div>
    ) : null}

    <button type="button" aria-label={closeControlLabel} onClick={onCloseClick} style={closeButtonStyle}>
      <Icon name="cross" size="var(--fx-size-pattern-hero-mobile-close-icon-size)" />
    </button>

    <div style={contentStyle}>
      {eyebrow ? (
        <Text as="p" variant="medium-caption1" style={{ margin: 0, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
          {eyebrow}
        </Text>
      ) : null}

      <Text as={titleAs} variant="display-medium" style={titleStyle}>
        {title}
      </Text>

      <div style={actionsDockStyle}>
        <PlayAddThumbUpPattern
          playLabel={playLabel}
          playControlLabel={playControlLabel}
          addControlLabel={addControlLabel}
          thumbUpControlLabel={thumbUpControlLabel}
          onPlayClick={onPlayClick}
          onAddClick={onAddClick}
          onThumbUpClick={onThumbUpClick}
        />

        <button type="button" aria-label={muteControlLabel} onClick={onMuteClick} style={muteButtonStyle}>
          <Icon name="moviePreviewMuteDefault" size="var(--fx-size-pattern-hero-mobile-mute-size)" />
        </button>
      </div>
    </div>
  </section>
);
