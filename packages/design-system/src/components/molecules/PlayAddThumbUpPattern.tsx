import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

type PlayAddThumbUpPatternProps = {
  playLabel: string;
  playControlLabel: string;
  addControlLabel: string;
  thumbUpControlLabel: string;
  onPlayClick?: () => void;
  onAddClick?: () => void;
  onThumbUpClick?: () => void;
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
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

export const PlayAddThumbUpPattern = ({
  playLabel,
  playControlLabel,
  addControlLabel,
  thumbUpControlLabel,
  onPlayClick,
  onAddClick,
  onThumbUpClick,
  style,
}: PlayAddThumbUpPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <Button
      type="button"
      variant="play"
      size="sm"
      onClick={onPlayClick}
      aria-label={playControlLabel}
      style={{ width: 'var(--fx-size-pattern-video-play-button-width)' }}
      leadingIcon={<Icon name="videoPlayerPlayDefault" size="var(--fx-size-pattern-video-button-icon)" />}
    >
      {playLabel}
    </Button>
    <button type="button" onClick={onAddClick} style={iconButtonStyle} aria-label={addControlLabel}>
      <Icon name="moviePreviewAddDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
    <button type="button" onClick={onThumbUpClick} style={iconButtonStyle} aria-label={thumbUpControlLabel}>
      <Icon name="moviePreviewThumbUpDefault" size="var(--fx-size-pattern-video-icon-control)" />
    </button>
  </div>
);
