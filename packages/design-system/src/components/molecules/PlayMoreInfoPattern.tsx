import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

type PlayMoreInfoPatternProps = {
  onPlayClick?: () => void;
  onMoreInfoClick?: () => void;
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--fx-space-2)',
  flexWrap: 'wrap',
};

export const PlayMoreInfoPattern = ({ onPlayClick, onMoreInfoClick, style }: PlayMoreInfoPatternProps): ReactNode => (
  <div style={{ ...rowStyle, ...style }}>
    <Button
      type="button"
      variant="play"
      size="sm"
      onClick={onPlayClick}
      style={{ width: 'var(--fx-size-pattern-video-play-button-width)' }}
      leadingIcon={<Icon name="videoPlayerPlayDefault" size="var(--fx-size-pattern-video-button-icon)" />}
    >
      Play
    </Button>
    <Button
      type="button"
      variant="moreInfo"
      size="sm"
      onClick={onMoreInfoClick}
      style={{ width: 'var(--fx-size-pattern-video-more-info-button-width)' }}
      leadingIcon={<Icon name="info" size="var(--fx-size-pattern-video-button-icon)" />}
    >
      More Info
    </Button>
  </div>
);
