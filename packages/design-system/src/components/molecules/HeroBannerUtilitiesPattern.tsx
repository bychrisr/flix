import type { CSSProperties, ReactNode } from 'react';
import { HeroBannerControlButton } from '../atoms/HeroBannerControlButton';
import { Text } from '../atoms/Text';

type HeroBannerUtilitiesPatternProps = {
  ratingLabel: string;
  muteControlLabel: string;
  audioDescriptionControlLabel: string;
  replayControlLabel: string;
  onMuteToggle?: () => void;
  onAudioDescriptionToggle?: () => void;
  onReplayToggle?: () => void;
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-4)',
  flexWrap: 'wrap',
};

const controlsStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--fx-space-2)',
};

const ratingStyle: CSSProperties = {
  minWidth: 'var(--fx-size-pattern-hero-rating-width)',
  minHeight: 'var(--fx-size-pattern-hero-rating-height)',
  padding: '0 var(--fx-space-4)',
  borderLeft: 'var(--fx-size-border-default) solid var(--fx-color-text-primary)',
  background: 'var(--fx-color-hero-rating-background)',
  display: 'inline-flex',
  alignItems: 'center',
};

export const HeroBannerUtilitiesPattern = ({
  ratingLabel,
  muteControlLabel,
  audioDescriptionControlLabel,
  replayControlLabel,
  onMuteToggle,
  onAudioDescriptionToggle,
  onReplayToggle,
  style,
}: HeroBannerUtilitiesPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <div style={controlsStyle}>
      <HeroBannerControlButton iconSet="mute" label={muteControlLabel} onClick={onMuteToggle} />
      <HeroBannerControlButton iconSet="sound" label={audioDescriptionControlLabel} onClick={onAudioDescriptionToggle} />
      <HeroBannerControlButton iconSet="repeatArrow" label={replayControlLabel} onClick={onReplayToggle} />
    </div>
    <div style={ratingStyle}>
      <Text as="span" variant="medium-headline2">
        {ratingLabel}
      </Text>
    </div>
  </div>
);
